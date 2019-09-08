<template>
    <div class="video">
        {{ videoId }}
        Youtube動画URL：<input type="text" v-model="video_url" v-on:keydown.enter="url_play">
        <button @click="url_play">送信</button>
        <br>
        <youtube
            ref="youtube"
            :video-id="videoId"
            :player-vars="playerVars"
            @ready="ready"
            @paused="paused"
            @playing="playing"
        />
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
            videoId: 'ZbZSe6N_BXs',
            video_url: '',
            playerVars: {
                autoplay: 1,
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
            this.player.playing.stopPropagation();
        },
        id_play(video_id){
            this.videoId = video_id;
        },
        playVideo() {
            this.player.playVideo()
        },
        pauseVideo() {
            this.player.pauseVideo()
        },
        ready() {console.log('ready')},
        playing(event) {
            console.log('playing')
            this.player.removeEventListener('playing', 'playing')
            this.room.send({event: 'playerCtrl', action: 'playing'})
        },
        paused(){
            console.log('pause')
            this.room.send({event: 'playerCtrl', action: 'paused'})
        },
        buffering(){
            console.log('buffering')
            // var _this = this;
            // this.player.getCurrentTime()
            // .then((time) => {
            //     _this.room.send({event: 'playerCtrl', action: 'toSeek', seconds: time})
            // })
        },
        eventfunc: function(){
            console.log('custome iven')
        },
        playbackRateChange: function(){
            // var _this = this;
            // this.player.getPlaybackRate()
            // .then((rate) => {
            //     _this.room.send({event: 'playerCtrl', action: 'changeRate', datas: {rate:rate}})
            //     // console.log(rate)
            // })
            // this.player.removeEventListener('playbackRateChange')
            // this.player.removeEventListener('playbackRateChange', function(){return})
            // this.player.addEventListener('', 'playbackRateChange')
            console.log('rate controll')
            

        },
        playbackRateChanges: function(){
            console.log('event update')   

        },
        playerStateChange: function(){
            console.log('statechange')

        },

        playerCtrl: function(action, data){
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
                case 'toSeek':
                    this.player.seekTo(data)
                    console.log('seek')
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