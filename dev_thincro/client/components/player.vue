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
        {{ videoId }}
        <input type="text" v-model="video_url" v-on:keydown.enter="url_play" placeholder="YouTube動画URL">
        <button @click="url_play">送信</button>
        <br>
    <div class="youtube-movie">
        <youtube
            ref="youtube"
            :video-id="videoId"
            :player-vars="playerVars"
            @ready="ready"
            @paused="paused"
            @playing="playing"
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
            videoId: 'QkPAQfTwnL0',
            video_url: '',
            playerVars: {
                autoplay: 1,
                playsinline: 1
            }
        }
    },
    computed: {
        player() {
            return this.$refs.youtube.player
        }
    },
    methods: {
        url_play(){
            this.videoId = this.$youtube.getIdFromUrl(this.video_url)
            this.room.send({event:'playerCtrl', action: 'playById', datas:{videoId: this.videoId}})
            this.video_url = ''
        },
        id_play(video_id){
            this.videoId = video_id;
        },
        ready() {
            console.log('ready')
            this.player.on('playbackRateChange', this.playbackRateChange)
        },
        playing() {
            if(this.is_send){
                console.log('playing')
                this.player.getCurrentTime()
                    .then((currentTime) => {
                        this.room.send({event: 'playerCtrl', action: 'seekTo', datas:{currentTime: currentTime}})
                        this.room.send({event: 'playerCtrl', action: 'playing'})
                    })

            } else {
                console.log('take playing')
                this.is_send = true;
            }
        },
        paused(){
            if(this.is_send){
                console.log('pause')
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

        playerCtrl: function(action, data){
            this.is_send = false;
            
            switch (action) {
                case 'playing':
                    this.player.playVideo()
                    break;
                case 'playById':
                    this.player.loadVideoById(data.videoId)
                    break;
                case 'paused':
                    this.player.pauseVideo()
                    break;
                case 'seekTo':
                    this.player.seekTo(data.currentTime)
                    console.log('take seek')
                    break;
                case 'changeRate':
                    this.player.setPlaybackRate(data.rate)
                    // console.log('catch change rate')
                    break;
            
                default:
                    break;
            }
        },
    },

}
</script>