<style>
.video {
    width: 100%;
}
.youtube-movie {
    position: relative;
    max-width: 1920px;
    max-height: 1080px;
    height: 0;
    padding-bottom: 56.25%;
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


input[type=text] {
    border: 2px solid black;
    padding: 5px 10px;
    width: 65%;
    font-size: 13px;
}

button {
    border: 1px solid #797979;
    background: rgb(87, 87, 87);
    color: #ffffff;
    font-size: 12px;
    padding: 4px 8px;
    margin-bottom: 30px;
    cursor: pointer;
}

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

ul.cue-list {
    padding: 15px 0;
    /* text-align: center; */

}

ul.cue-list li{
    list-style: none;
    display: inline;
}

ul.cue-list li img {
    width: 31%;
    border: 2px solid #ffffff;

}

ul.cue-list li:first-child img {
    width: 70%;
    border: 3px solid yellow;
}
</style>
<template>
    <div class="video">
        <!-- {{ videoId }} <br> -->
        <br>
        <input type="text" v-model="video_url" v-on:keydown.enter="url_play" placeholder="YouTube Video URL">
        <button @click="url_play">Send</button>
        <button @click="url_play('force')">Interrupt</button>
        <br>

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
            width="1920"
            height="1080"
        />
    </div>
    <button @click="skip">Next</button>

    <div class="state">
        <ul>
            <li>{{ state }}</li>
            <li>{{ currentTime }}</li>
            <li>{{ currentRate }}</li>
        </ul>
    </div>
    <div style="background-color:black;padding:20px;">
        <h3 style="color:white">Video Cue</h3>
        <ul class="cue-list">
            <li v-for="(cue_id, index) in cue_ids">
                <img :src="imgUrl + cue_id + '/mqdefault.jpg'" alt="">
            </li>
        </ul>
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
            cue_ids:[
                'WJzSBLCaKc8',
                'hfWa5dnHuEY',
                'Nh9VKYk_TlI',
                '07Qtivl6jII',
                'rJ_EuCXKx6U',
                'LrxsE-tbR48',

            ],
            playerVars: {
                autoplay: 1,
                playsinline: 1
            },
            currentTime:'',
            currentRate:'',
            imgUrl: 'https://img.youtube.com/vi/',
        }
    },
    mounted: function (){
        this.room.on('peerJoin', (data) => {
        })

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
        url_play(priority='', videoId=''){
            var new_videoId = ''

            if(videoId !== ''){
                new_videoId = videoId
            }
            else {
                new_videoId = this.$youtube.getIdFromUrl(this.video_url)
            }

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
                        this.videoId = this.cue_ids[0]

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


            if(!this.firstPlay == 'not'){
                console.log('not')
                return
            }

            if(this.is_send){
            console.log('playing')

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
            this.state = 'pause'

            if(this.is_send){
                console.log('pause')

                this.player.getCurrentTime()
                    .then((currentTime) => {
                        this.room.send({event: 'playerCtrl', action: 'paused'})
                        this.room.send({event: 'playerCtrl', action: 'seekTo', datas:{currentTime: currentTime}})
                    })

                
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

                this.$nuxt.$emit('getRelatedVideo', new_videoId)

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

            this.$nuxt.$emit('getRelatedVideo', new_videoId)

            this.room.send({event:'playerCtrl', action: 'playById', datas:{videoId: new_videoId}})
            this.room.send({event:'playerCtrl', action: 'rmVideoId'})

        },

        updateRelated: function(items){
            this.$nuxt.$emit('updateRelated', items)
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
                    this.cue_ids.push(data.videoId)
                    break;
                case 'unshiftVideoId':
                    this.cue_ids.unshift(data.videoId)
                    this.videoId = data.videoId
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
                case 'addRelated':
                    this.updateRelated(data.relatedItems)
                default:
                    break;
            }
        },
    },

}
</script>