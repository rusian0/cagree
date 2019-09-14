<style>
.video {
    width: 100%;
}
.youtube-movie {
    position: relative;
    max-width: 640px;
    max-height: 360px;
    height: 0;
    padding-bottom: 56.25%;
    overflow: hidden;
    margin: 0 auto;
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


input[type=text] {
    border: 2px solid black;
    padding: 5px 10px;
    width: 200px;
    margin-left: 10px;
    font-size: 13px;
}

button {
        border: 1px solid #797979;
        background: rgb(87, 87, 87);
        color: #ffffff;
        font-size: 12px;
        padding: 4px 8px;
        margin-bottom: 30px;

}
</style>
<template>
    <div class="video">
        <!-- {{ videoId }} <br> -->
        <br>
        <input type="text" v-model="video_url" v-on:keydown.enter="url_play" placeholder="YouTube動画URL">
        <button @click="url_play">送信</button>
        <button @click="url_play('force')">割り込み</button>
        <br>
        <p style="margin-left: 50px">{{ state }}</h2>
        <p style="margin-left: 50px">{{ currentTime }}</h2>
        <p style="margin-left: 50px">{{ currentRate }}</h2>
        <p style="margin-left: 50px">{{ cue_ids }}</h2>
        
        <br>
        <button @click="skip">スキップ</button>

    <div class="youtube-movie">
        <youtube
            ref="youtube"
            :video-id="videoId"
            :player-vars="playerVars"
            @ready="ready"
            @paused="paused"
            @playing="playing"
            @buffering="buffering"
            @ended="ended"
        />
    </div>
    <br>

    </div>
</template>

<script>
export default {
    props: {
        'room': {
            type: Object,
            default: ''
        },
    },
    data: function(){
        return {
            is_send: true,
            firstPlay: 'before',
            firstLoad: true,
            videoId: '',
            state: '',
            video_url: '',
            cue_ids:[],
            playerVars: {
                autoplay: 1,
                playsinline: 1
            },
            currentTime:'',
            currentRate:''
        }
    },
    mounted: function (){
        this.room.on('peerJoin', (data) => {
        })
    },
    computed: {
        player() {
            return this.$refs.youtube.player
        }
    },
    methods: {
        url_play(priority=''){
            var new_videoId = this.$youtube.getIdFromUrl(this.video_url)

            this.video_url = ''

            if(this.cue_ids[0] == new_videoId && !this.firstLoad) return

            this.firstLoad = false;



            if(priority == 'force' || this.videoId == ''){
                this.cue_ids.unshift(new_videoId)
                this.videoId = new_videoId
                this.room.send({event:'playerCtrl', action: 'playById', datas:{videoId: this.videoId}})
                this.room.send({event:'playerCtrl', action: 'unshiftVideoId', datas:{videoId: new_videoId}})

            }
            else
            {
                this.cue_ids.push(new_videoId)
                this.room.send({event:'playerCtrl', action: 'addVideoId', datas:{videoId: new_videoId}})

            }


        },
        id_play(video_id){
            this.videoId = video_id;
        },
        ready() {
            console.log('ready')
            this.state = 'ready';
            if(this.firstPlay == 'before'){
                this.requestPlayingData()
            }
            this.player.on('playbackRateChange', this.playbackRateChange)
        },
        playing() {
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

            console.log('playing')

            if(!this.firstPlay == 'not'){
                console.log('not')
                return
            }

            if(this.is_send){

                this.player.getCurrentTime()
                    .then((currentTime) => {
                        this.room.send({event: 'playerCtrl', action: 'seekTo', datas:{currentTime: currentTime}})
                        this.room.send({event: 'playerCtrl', action: 'playing'})
                    })

            } else {
                console.log('take playing')
                this.is_send = true
            }

    
        },
        paused(){
            console.log('pause')
            this.state = 'pause'

            if(this.is_send){

                this.room.send({event: 'playerCtrl', action: 'paused'})
                
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

            if(this.cue_ids[1]){
                var new_videoId = this.cue_ids[1]
                this.cue_ids.splice(0, 1);
                this.videoId = new_videoId
                this.room.send({event:'playerCtrl', action: 'playById', datas:{videoId: new_videoId}})
                this.room.send({event:'playerCtrl', action: 'rmVideoId'})
            }

        },
        requestPlayingData: function(){
            this.room.send({event: 'playerCtrl', action: 'requestPlayingData'})
            console.log('request')
        },

        responsePlayingData: function(){

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
                            action: 'responsePlayingData',
                            datas:{
                                videoId: _this.videoId,
                                currentTime: _this.currentTime,
                                currentRate: _this.currentRate,
                                cue_ids: _this.cue_ids
                            }
                        }
                    )
                    console.log('response')
                })
        },

        catchPlayingData: function(id, rate, time, cue_ids){
            this.videoId = id
            this.cue_ids = cue_ids
            this.currentRate = rate
            this.currentTime = time
        },

        skip: function(){
            var new_videoId = this.cue_ids[1]
            this.cue_ids.splice(0, 1);
            this.videoId = new_videoId
            this.room.send({event:'playerCtrl', action: 'playById', datas:{videoId: new_videoId}})
            this.room.send({event:'playerCtrl', action: 'rmVideoId'})

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
                case 'addVideoId':
                    // this.player.loadVideoById(data.videoId)
                    console.log('taketuika')
                    this.cue_ids.push(data.videoId)
                    break;
                case 'unshiftVideoId':
                    this.cueids.unshift(data.videoId)
                    break;
                case 'rmVideoId':
                    this.cue_ids.splice(0, 1)
                case 'paused':
                    this.player.pauseVideo()
                    break;
                case 'seekTo':
                    this.player.seekTo(data.currentTime)
                    console.log('take seek')
                    break;
                case 'changeRate':
                    this.player.setPlaybackRate(data.rate)
                    console.log('take changeRate')
                    break;
                case 'requestPlayingData':
                    this.responsePlayingData()
                    break;
                case 'responsePlayingData':
                    this.catchPlayingData(data.videoId, data.currentRate, data.currentTime, data.cue_ids)
                    break;
                default:
                    break;
            }
        },
    },

}
</script>