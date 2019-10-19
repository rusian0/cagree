<style scoped>
.video {
    width: 100%;
}
.youtube-movie {
    position: relative;
    max-width: 1624px;
    max-height: 1026px;
    /* max-height: 1080px; */
    height: 100%;
    width: auto;
    /* padding-bottom: 56.25%; */
    overflow: hidden;
}
.youtube-movie iframe {
    max-width: 100%;
    max-height: 100%;
    position: absolute;
    top: 0;
    left: 0;
}

p {
    font-size: 12px;
    margin: 0;
}


/* input[type=text] {
    border: 2px solid black;
    padding: 5px 10px;
    width: 50%;
    font-size: 13px;
} */


.state { 
    float: right;
}

.state ul {
    margin: 0;
}

.state ul li {
        border: 1px solid #797979;
        background: rgb(209, 209, 209);
        color: #181818;
        font-size: 12px;
        padding: 4px 8px;
        display: inline;
        list-style: none;
        float: left;

}

ul.queue-list {
    padding: 15px 0;
    /* text-align: center; */

}

ul.queue-list li{
    list-style: none;
    display: inline;
}

ul.queue-list li img {
    width: 31%;
    border: 10px solid #ffffff;

}

ul.queue-list li:first-child img {
    /* width: 70%; */
    border-color:#ff0000;
}
</style>
<template>
    <div class="video">
        <!-- {{ videoId }} <br> -->
        
        <div class="input-group">
            <input class="form-control" type="text" v-model="video_url" v-on:keydown.enter="url_play" placeholder="YouTube Video URL">
            <div class="input-group-append">
                <button class="btn btn-success" @click="url_play">Send</button>
            </div>
            <div class="input-group-append">
                <button class="btn btn-primary" @click="url_play('force')">Interrupt</button>
            </div>
            <!-- <button @click="addQueue">addQueue</button> -->
        </div>

    <div class="youtube-movie">
        <vue-plyr>
            <div class="plyr__video-embed">
                <youtube
                    ref="youtube"
                    :video-id="videoId"
                    :player-vars="playerVars"
                    @ready="ready"
                    @paused="paused"
                    @playing="playing"
                    @buffering="buffering"
                    @ended="ended"
                    width="1920"
                    height="1080"
                />
            </div>
        </vue-plyr>


        <!-- <vue-plyr>
            <div class="plyr__video-embed">
                <iframe width="690" data-plyr-config='{ "ads": true}' height="388" src="https://www.youtube.com/embed/hfWa5dnHuEY" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            </div>
        </vue-plyr> -->
    <!-- <div class="youtube_area">
    <iframe id="ytPlayer" allowfullscreen="1" allow="autoplay; encrypted-media" title="YouTube video player" src="https://youtu.be/ZCQ3IIFSn1s" width="640" height="390" frameborder="0"></iframe>
    <ul class="poster_list">
        <li class="current">
        <img src="[キャプチャ]" class="transition_scale" oncontextmenu="return false">
        <div class="playicon"></div>
        </li>
    </ul>
    </div> -->
        
    </div>
    <button class="btn btn-info" @click="testplay">Play</button>
    <button class="btn btn-info" @click="nextQueue">Next</button>
    <button class="btn btn-info" @click="getQueue">getQueue</button>


    <div class="state">
        <ul>
            <li>{{ state }}</li>
            <li>{{ currentTime }}</li>
            <li>{{ currentRate }}</li>
        </ul>
    </div>
    <div style="background-color:black;padding:20px;margin:30px">
        <h3 style="color:white">Video queue</h3>
        <ul class="queue-list">
            <li v-for="(queue_id, index) in queue_ids">
                <img :src="imgUrl + queue_id + '/mqdefault.jpg'" alt="">
            </li>
        </ul>
    </div>
    

    <br>

    </div>
</template>

<script>


export default {
    props: [
        'roomId',
        'room'
    ],
    data: function(){
        return {
            is_send: true,
            firstPlay: 'before',
            firstLoad: true,
            videoId: '',
            state: '',
            video_url: '',
            sample_ids:[
                'WJzSBLCaKc8',
            ],
            queue_ids:[
                // 'WJzSBLCaKc8',
                // '8rRhLmhIFDI',
                // 's9JnNUFqXJA'
            ],
            sampleRoomId: 'testroomid',
            playerVars: {
                autoplay: 1,
                playsinline: 1
            },
            currentTime:'',
            currentRate:'',
            imgUrl: 'https://img.youtube.com/vi/',
            previousAction: null,
            previousTime: null
        }
    },
    mounted: function (){

        this.$nuxt.$on('id_play', videoId => {
            this.url_play('', videoId)
        })
        this.$nuxt.$on('unshift_id_play', videoId => {
            this.url_play('force', videoId)
        })

    },
    computed: {
        player() {
            return this.$refs.youtube.player
        },
    },
    methods: {
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

            console.info(this.$el.div)
        },
        // addQueue: function(){
        //     console.log(this.roomId)
        //     this.$store.dispatch('room/addQueue', this.roomId)

        // },
        url_play(priority='', videoId=''){
            var newVideoId = ''

            if(videoId !== ''){
                newVideoId = videoId
            }
            else {
                newVideoId = this.$youtube.getIdFromUrl(this.video_url)
            }

            this.video_url = ''

            if(this.queue_ids[0] == newVideoId && !this.firstLoad) return

            this.firstLoad = false;

            if(priority == 'force' || this.videoId == ''){
                this.queue_ids.unshift(newVideoId)
                this.videoId = newVideoId
                
                this.$store.dispatch('room/modifyQueue', {newVideoId, position: 'first', action:'add'})

                this.room.send({event:'playerCtrl', action: 'playById', datas:{videoId: this.videoId}})
                this.room.send({event:'playerCtrl', action: 'unshiftQueue', datas:{videoId: newVideoId}})

            }
            else
            {
                this.queue_ids.push(newVideoId)
                // this.addQueue(newVideoId)
                this.$store.dispatch('room/modifyQueue', {newVideoId, position: 'last', action:'add'})
                this.room.send({event:'playerCtrl', action: 'addQueue', datas:{videoId: newVideoId}})

            }


        },
        id_play(video_id){
            this.videoId = video_id;
        },
        ready() {
            this.getQueue();
            console.log('ready')
            this.state = 'ready';
                        this.videoId = this.queue_ids[0]

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
        playbackRateChange: function(){
            if(this.is_send){
                this.player.getPlaybackRate()
                .then((rate) => {
                    this.room.send({event: 'playerCtrl', action: 'changeRate', datas: {rate:rate}})
                })
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
        catchPlayingData: function(id, rate, time, queue_ids){
            this.videoId = id
            this.queue_ids = queue_ids
            this.currentRate = rate
            this.currentTime = time
        },

        nextQueue: function(){
            var newVideoId = this.queue_ids[1]
            this.queue_ids.splice(0, 1);
            this.videoId = newVideoId

            this.$store.dispatch('room/modifyQueue', {newVideoId, position: 0, action:'rm'})

            this.$nuxt.$emit('getRelatedVideo', newVideoId)

            this.room.send({event:'playerCtrl', action: 'playById', datas:{videoId: newVideoId}})
            this.room.send({event:'playerCtrl', action: 'rmQueue'})

        },

        tellPlayerStatus: function(){

            var _this = this;

            _this.player.getPlaybackRate()
                .then(function(rate){
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
                                queue_ids: _this.queue_ids
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

            var videoQueue = await this.$store.dispatch('room/getQueue')

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
                    this.queue_ids.splice(0, 1)
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
</script>