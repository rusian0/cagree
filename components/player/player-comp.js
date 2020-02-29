import draggable from 'vuedraggable'

import firebase from "~/plugins/firebase.js"
const db = firebase.firestore();

export default {
    components: { draggable },
    props: [
        'roomId',
        'room'
    ],
    data: () => ({
        dontSnapshot: true,
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
        sampleRoomId: 'testroomid',
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
        queueChanger: false
    }),
    mounted: function (){

        this.$nuxt.$on('id_play', videoId => {
            this.url_play('', videoId)
        })
        this.$nuxt.$on('unshift_id_play', videoId => {
            this.url_play('force', videoId)
        })

        this.roomRef.onSnapshot(async doc => {
            
            if(this.dontSnapshot) return

            const room = doc.data()

            const roomQueue = JSON.stringify(room.video_queue)
            const myQueue = JSON.stringify(this.queue_ids)

            let queueDiff = false

            if(roomQueue != myQueue){
                // console.log('キューに差分がありました')
                queueDiff = true
                this.queue_ids = room.video_queue
            }

            const playerState = room.playerState
            const myPlayerTime = await this.player.getCurrentTime()
            const diffTime = Math.abs(room.currentTime - myPlayerTime)

            if(!this.queueChanger){
                if(diffTime > 0.5 && !queueDiff){
                    this.player.seekTo(room.currentTime)
                    console.log('diff take seek');
                    
                    this.seeking = true
                }
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
                this.player.setPlaybackRate(room.currentRate)
            }

            
        })


    },
    computed: {
        player() { return this.$refs.youtube.player },
        roomRef (){ 
            if(!this.$nuxt.$route.query.id){
                return db.collection('room').doc('testroomid')
            }
            return db.collection('room').doc(this.$nuxt.$route.query.id)
        }
    },
    methods: {
        deleteQueue(queueIndex){
            this.queue_ids.splice(queueIndex, 1);
            this.roomRef.update({ video_queue: this.queue_ids })

            this.queueChanger = true
        },
        selectQueue(queue_index){
            const limited_queue_id = this.queue_ids[queue_index];
            this.queue_ids.splice(queue_index, 1);
            this.queue_ids.unshift(limited_queue_id);
            this.queueChanger = true

            this.roomRef.update({ video_queue: this.queue_ids })
        },
        queueDragEnd(event){
            this.queueChanger = true
            this.roomRef.update({ video_queue: this.queue_ids })
        },
        onPlayerStateChange({target, data}){
            
            // const currentTime = target.getCurrentTime();

            // // console.info(this.previousTime)
            // // console.info(currentTime)
            // if(Math.abs(this.previousTime - currentTime) > 1) {
            //     // this.room.send({event: 'playerCtrl', action: 'seekTo', datas:{currentTime: currentTime}})
            // }

            // this.previousTime = currentTime;
            // this.previousAction = data
        },
        // syncSeconds(target){

        //     const currentTime = target.getCurrentTime();

        //     // console.info(this.previousTime)
        //     // console.info(currentTime)
        //     const diffSeconds = Math.abs(this.previousTime - currentTime)
        //     // console.info(diffSeconds)
        //     if( diffSeconds > 1) {
        //         this.room.send({event: 'playerCtrl', action: 'seekTo', datas:{currentTime}})
        //     }

        //     this.previousTime = currentTime;
        //     // this.previousAction = data
        // },
        // addQueue: function(){
        //     console.log(this.roomId)
        //     this.$store.dispatch('room/addQueue', this.roomId)

        // },
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

            if(priority == 'force' || this.videoId == ''){
                this.queue_ids.unshift(newVideoId)
            }
            else
            {
                this.queue_ids.push(newVideoId)
            }

            this.queueChanger = true
            this.roomRef.update({ video_queue: this.queue_ids })

        },
        ready(target) {
            this.getQueue();
            console.log('ready')
            this.state = 'ready';
            this.videoId = this.queue_ids[0]
            this.$nuxt.$emit('getRelatedVideo', this.videoId)


            // if(this.firstPlay == 'before'){
            //     this.requestPlayingData()
            // }
            this.player.on('playbackRateChange', this.playbackRateChange)
            this.player.on('stateChange', this.onPlayerStateChange)

        },
        playing(target) {
            this.dontSnapshot = false
            this.state = 'playing';

            this.timeInsepctionStop()

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
        playbackRateChange({data}){
            this.currentRate = data

            if(this.is_send){
                console.log('rateChange')
                this.roomRef.update({ currentRate:  data})
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
            this.queue_ids.splice(0, 1);
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
        tellPlayerStatus: function(){

            let _this = this;

            _this.player.getPlaybackRate()
                .then((rate) => {
                    _this.currentRate = rate

                    return _this.player.getCurrentTime()
                })
                .then((time) => {
                    _this.currentTime = time

                    this.room.send(
                        {
                            event: 'playerCtrl',
                            action: 'tellPlayerStatus',
                            datas:{
                                videoId: _this.videoId,
                                currentTime: _this.currentTime,
                                currentRate: _this.currentRate,
                                queue_ids: _this.queue_ids,
                            }
                        }
                    )
                    console.log('response')
                })
        },

        updateRelated: function(items){
            this.$nuxt.$emit('updateRelated', items)
        },

        async getQueue() {

            let videoQueue = await this.$store.dispatch('room/getQueue')

            if(videoQueue) {
                this.queue_ids = videoQueue
                this.videoId = videoQueue[0]
            }
            else {
                this.queue_ids = this.sample_ids
            }
        },

    },

}
