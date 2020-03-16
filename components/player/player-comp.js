import draggable from 'vuedraggable'

import firebase from "~/plugins/firebase.js"
const db = firebase.firestore();
const auth = firebase.auth()
const functions = firebase.functions('asia-northeast1');
import loadingComponent from '~/components/loading.vue'


export default {
    components: { draggable,loadingComponent },
    props: [
        'roomId',
        'room',
        'room_member',
    ],
    data: () => ({
        startedSnapshot: false,
        firstSeeked: false,
        is_send: true,
        seeking: false,
        videoId: '',
        state: '',
        video_url: '',
        sample_ids:[
            'WJzSBLCaKc8',
            '8rRhLmhIFDI',
            's9JnNUFqXJA',
            'kX5FkzCjNrk',
            'FTrSmDKT0sM',
            'e9mKp1npBhY',
            '1E2y6834kYM'
        ],
        queue_ids:[],
        tmp_queue_ids: [],
        playerVars: {
            autoplay: 1,
            playsinline: 1,
            wmode: 'transparent'
        },
        currentTime:'',
        currentRate:'',
        imgUrl: 'https://img.youtube.com/vi/',
        options: {
            animation: 300,
        },
        loading: false,
        comments: '',
        timeInsepction: null,
        timeInsepctionEnable: false,
        queueChanger: false,
        firstQueueChange: false,
        tmpRoomData: null,
        mute: false,
        functionsEnd: false
    }),
    computed: {
        player() { return this.$refs.youtube.player },
        roomRef (){ 
            return db.collection('room').doc(this.$nuxt.$route.query.id)
        }
    },
    watch: {
        queue_ids: function(newQueues, oldQueues){
            if(newQueues[0] != oldQueues[0]){
                if(this.state == 'playing'){
                    this.is_send = false
                }

                this.timeInsepctionStop()
                this.firstQueueChange = true
            }
        },
        room_member:async function (newMembers, oldMembers) {
            const host = newMembers.length > oldMembers.length && newMembers[0] == this.room._peerId

            if(host){
                const currentTime = await this.player.getCurrentTime()
                this.roomRef.update({ currentTime })
                
            }　
        }
    },
    mounted: async function (){
        if(!this.$ua.isFromPc() || this.$ua.browser() == 'Safari') this.player.mute()

        await auth.signInAnonymously()

        const enteredRoomRun = functions.httpsCallable('getVideoQueue')
        const response = await enteredRoomRun({ roomId: this.roomId })
        // console.log(response)

        this.queue_ids = response.data.video_queue
        this.functionsEnd = true

        this.$nuxt.$on('id_play', videoId => {
            this.url_play('', videoId)
        })
        this.$nuxt.$on('unshift_id_play', videoId => {
            this.url_play('force', videoId)
        })

        setInterval(async () => {
            this.mute = await this.player.isMuted()
        }, 250);

    },
    methods: {
        url_play(priority, videoId){
            
            let newVideoId

            if(videoId){
                newVideoId = videoId
            }
            else if(this.video_url) {
                newVideoId = this.$youtube.getIdFromUrl(this.video_url)
            }
            else {
                return
            }

            if(!newVideoId){
                alert('無効なURLが入力されました。')
                this.video_url = ''
                return
            }

            this.video_url = ''

            this.tmp_queue_ids = this.queue_ids.filter(queue => queue)

            if(priority == 'force' || this.videoId == ''){
                this.tmp_queue_ids.unshift(newVideoId)
            }
            else
            {
                this.tmp_queue_ids.push(newVideoId)
            }

            this.queue_ids = this.tmp_queue_ids

            this.queueChanger = true
            this.roomRef.update({ video_queue: this.queue_ids })

        },
        ready(target) {
            console.log('ready')
            this.state = 'ready';
            this.videoId = this.queue_ids[0]
            this.player.on('playbackRateChange', this.playbackRateChange)

        },
        playing(target) {
            this.state = 'playing';
            this.timeInsepctionStop()

            if(!this.startedSnapshot){
                this.roomSnapshotStart()
                this.startedSnapshot = true
                return
            }
            
            if(this.seeking){
                this.seeking = false
                return
            }
            
            if(this.is_send){
                console.log('playing')
                
                this.roomRef.update({ 
                    playerState: 'playing',
                    currentTime: target.getCurrentTime()
                })
                
            } else {
                this.is_send = true
            }

        },
        paused(target){
            this.state = 'paused'

            this.timeInsepctionStart(target)

            if(this.seeking) return

            if(this.is_send){
                console.log('paused')

                this.roomRef.update({ 
                    playerState: 'paused',
                    currentTime: target.getCurrentTime()
                })
                
            } else {
                this.is_send = true;
            }
        },
        error: function(){this.state = 'error' },
        cued: function(){this.state = 'cued' },
        playbackRateChange({target, data}){
            this.currentRate = data

            if(this.is_send){
                console.log('rateChange')
                this.roomRef.update({ 
                    currentRate:  data,
                    // currentTime: target.getCurrentTime()
                })
            } else {
                this.is_send = true;
            }
        },
        buffering: function(){
            this.state = 'buffering'
        },

        ended: function(){
            console.log('ended')
            this.state = 'ended'

            if(this.queue_ids[1]){
                this.nextQueue()
            }

        },
        catchPlayingData: function(id, rate, time, queue_ids, members){
            console.log('take response')
            this.videoId = id
            this.queue_ids = queue_ids
            this.currentRate = rate
            this.currentTime = time
        },

        nextQueue: function(){
            this.tmp_queue_ids = this.queue_ids.filter(queue => queue)
            this.tmp_queue_ids.splice(0, 1);
            this.queue_ids = this.tmp_queue_ids
            this.roomRef.update({ video_queue: this.queue_ids })
        },
        deleteQueue(queueIndex){
            this.tmp_queue_ids = this.queue_ids.filter(queue => queue)
            this.tmp_queue_ids.splice(queueIndex, 1);

            this.queue_ids = this.tmp_queue_ids
            this.roomRef.update({ video_queue: this.queue_ids })

            this.queueChanger = true
        },
        selectQueue(queue_index){
            this.tmp_queue_ids = this.queue_ids.filter(queue => queue)
            const limited_queue_id = this.queue_ids[queue_index];

            this.tmp_queue_ids.splice(queue_index, 1);
            this.tmp_queue_ids.unshift(limited_queue_id);
            this.queueChanger = true

            this.queue_ids = this.tmp_queue_ids
            this.roomRef.update({ video_queue: this.queue_ids })
        },
        queueDragEnd(event){
            this.queueChanger = true
            this.roomRef.update({ video_queue: this.queue_ids })
        },
        timeInsepctionStart(target){
            clearInterval(this.timeInsepction)

            this.timeInsepctionEnable = true

            this.currentTime = target.getCurrentTime()

            this.timeInsepction = setInterval(() => {
                if(!this.timeInsepctionEnable) return

                const playerCurrentTime = target.getCurrentTime() 

                if(this.currentTime ==  playerCurrentTime) return

                console.log('send pauseSeek')
                this.roomRef.update({ currentTime: playerCurrentTime })

                this.currentTime = playerCurrentTime

            }, 300);
        },
        timeInsepctionStop(){
            this.timeInsepctionEnable = false
            clearInterval(this.timeInsepction)
        },
        roomSnapshotStart: function() {
            this.roomRef.onSnapshot(async doc => {
    
                const room = doc.data()

                if(this.tmpRoomData == null){
                    this.tmpRoomData = room
                }
    
                const roomQueue = JSON.stringify(room.video_queue)
                const myQueue = JSON.stringify(this.queue_ids)
    
                let queueDiff = false
    
                if(roomQueue != myQueue){
                    queueDiff = true
                    this.queue_ids = room.video_queue
                }
    
                const playerState = room.playerState
                const myPlayerTime = await this.player.getCurrentTime()
                const diffTime = Math.abs(room.currentTime - myPlayerTime)
                
                if((!this.queueChanger && this.tmpRoomData.currentTime != room.currentTime) || !this.firstSeeked){

                    if(diffTime > 0.5 && !queueDiff){
                        this.player.seekTo(room.currentTime)
                        console.log('diff take seek');
                        
                        if(this.firstSeeked){
                            this.seeking = true
                        }
                    }

                    this.firstSeeked = true
                }
                else {
                    this.queueChanger = false
                }
    
                if(this.state != room.playerState){
    
                    this.is_send = false
                    
                    if(playerState == 'playing'){
                        this.player.playVideo()
                        console.log('take playing')
                    }
                    else if(playerState == 'paused'){
                        this.player.pauseVideo()
                        console.log('take paused')
                    }
                }
    
                if(this.currentRate != room.currentRate){
                    this.currentRate = room.currentRate
                    this.player.setPlaybackRate(room.currentRate)
                }
    
                this.tmpRoomData = room
            })
        }
    },
    beforeDestroy: function ()  {
        // this.player.removeEventListener("onStateChange");
    }
}
