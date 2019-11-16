import draggable from 'vuedraggable'

export default {
    components: { draggable },
    props: [
        'roomId',
        'room'
    ],
    data: () => ({
        is_send: true,
        firstPlay: 'before',
        firstLoad: true,
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
        loading: false
    }),
    mounted: function (){

        this.$nuxt.$on('id_play', videoId => {
            this.url_play('', videoId)
        })
        this.$nuxt.$on('unshift_id_play', videoId => {
            this.url_play('force', videoId)
        })

    },
    computed: {
        player() { return this.$refs.youtube.player },
    },
    methods: {
        deleteQueue(queueIndex){
            this.queue_ids.splice(queueIndex, 1);
            this.room.send({event:'playerCtrl', action: 'rmQueue', datas:{position: queueIndex}})
            this.$store.dispatch('room/modifyQueue', {newVideoIds: this.queue_ids})
            // this.$store.dispatch('room/modifyQueue', {newVideoId: this.queue_ids, position: queueIndex, action:'rm'})
        },
        queueDragEnd(event){
            // this.$store.dispatch('room/modifyQueue', {newVideoId: this.queue_ids, action:'allUpdate'})
            this.$store.dispatch('room/modifyQueue', {newVideoIds: this.queue_ids})
            this.allUpdateQueue()
        },
        getSampleQueue(){
            this.queue_ids = this.sample_ids
            // this.$store.dispatch('room/modifyQueue', {newVideoId: this.queue_ids, action:'allUpdate'})
            this.$store.dispatch('room/modifyQueue', {newVideoIds: this.queue_ids})
            this.allUpdateQueue()
        },
        allUpdateQueue(){
            this.room.send({event:'playerCtrl', action: 'allUpdateQueue', datas:{newIds: this.queue_ids}})
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
        syncSeconds(target){

            const currentTime = target.getCurrentTime();

            // console.info(this.previousTime)
            // console.info(currentTime)
            const diffSeconds = Math.abs(this.previousTime - currentTime)
            // console.info(diffSeconds)
            if( diffSeconds > 1) {
                this.room.send({event: 'playerCtrl', action: 'seekTo', datas:{currentTime}})
            }

            this.previousTime = currentTime;
            // this.previousAction = data
        },
        testplay: function(){
            this.player.playVideo()

            // console.info(this.$el.div)
        },
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

            if(this.queue_ids[0] == newVideoId && !this.firstLoad) return

            this.firstLoad = false;

            if(priority == 'force' || this.videoId == ''){
                this.queue_ids.unshift(newVideoId)
                this.videoId = newVideoId
                
                // this.$store.dispatch('room/modifyQueue', {newVideoId, position: 'first', action:'add'})
                this.$store.dispatch('room/modifyQueue', {newVideoIds: this.queue_ids})

                this.room.send({event:'playerCtrl', action: 'playById', datas:{videoId: this.videoId}})
                this.room.send({event:'playerCtrl', action: 'unshiftQueue', datas:{videoId: newVideoId}})

            }
            else
            {
                this.queue_ids.push(newVideoId)
                // this.addQueue(newVideoId)
                // this.$store.dispatch('room/modifyQueue', {newVideoId, position: 'last', action:'add'})
                this.$store.dispatch('room/modifyQueue', {newVideoIds: this.queue_ids})
                this.room.send({event:'playerCtrl', action: 'addQueue', datas:{videoId: newVideoId}})

            }


        },
        id_play(video_id){
            this.videoId = video_id;
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
            this.state = 'playing';

            if(this.firstPlay == 'done'){
                this.firstPlay == 'not'
            }

            if(this.firstPlay == 'before'){
                this.player.setPlaybackRate(this.currentRate)
                this.player.seekTo(this.currentTime)

                this.firstPlay = 'done';
                return;
            }


            if(!this.firstPlay == 'not'){
                console.log('not')
                return
            }

            if(this.is_send){
                console.log('playing')

                this.syncSeconds(target)
                this.room.send({event: 'playerCtrl', action: 'playing'})

            } else {
                console.log('take playing')
                this.is_send = true
            }

        },
        paused(target){
            this.state = 'pause'
            if(this.is_send){
                console.log('pause')

                this.room.send({event: 'playerCtrl', action: 'paused'})
                this.syncSeconds(target)

                
            } else {
                console.log('take pause')
                this.is_send = true;
            }
        },
        error: function(){this.state = 'error' },
        cued: function(){this.state = 'cued' },
        playbackRateChange: function(event){
            if(this.is_send){
                this.room.send({event: 'playerCtrl', action: 'changeRate', datas: {rate: event.target.getPlaybackRate()}})
                console.log('rateChange')
            } else {
                console.log('take rateChange')
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
            let newVideoId = this.queue_ids[1]
            this.queue_ids.splice(0, 1);
            this.videoId = newVideoId

            // this.$store.dispatch('room/modifyQueue', {newVideoId, position: 0, action:'rm'})
            this.$store.dispatch('room/modifyQueue', {newVideoIds: this.queue_ids})


            this.$nuxt.$emit('getRelatedVideo', newVideoId)

            this.room.send({event:'playerCtrl', action: 'playById', datas:{videoId: newVideoId}})
            this.room.send({event:'playerCtrl', action: 'rmQueue', datas:{position: 0}})

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

        playerCtrl: function(action, data){
            this.is_send = false;
            
            switch (action) {
                case 'playing':
                    this.player.playVideo()
                    break;
                case 'playById':
                    this.player.loadVideoById(data.videoId)
                    // this.videoId = data.videoId
                    break;
                case 'addQueue':
                    // this.player.loadVideoById(data.videoId)
                    this.queue_ids.push(data.videoId)
                    break;
                case 'unshiftQueue':
                    this.queue_ids.unshift(data.videoId)
                    this.videoId = data.videoId
                    break;
                case 'rmQueue':
                    this.queue_ids.splice(data.position, 1)
                    break
                case 'allUpdateQueue':
                    this.queue_ids = data.newIds
                    break;
                case 'paused':
                    this.player.pauseVideo()
                    break;
                case 'seekTo':
                    this.player.seekTo(data.currentTime)
                    console.info('take seek')
                    break;
                case 'changeRate':
                    this.player.setPlaybackRate(data.rate)
                    console.log('take changeRate')
                    break;
                case 'tellPlayerStatus':
                    this.catchPlayingData(data.videoId, data.currentRate, data.currentTime, data.queue_ids)
                    break;
                case 'addRelated':
                    this.updateRelated(data.relatedItems)
                default:
                    break;
            }
        },
    },

}
