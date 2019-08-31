<style scoped>

    li {
        list-style: none;
    }

    input {
        display: block;
        margin-bottom: 20px;
    }

    .notice {
        height: 100px;
    }

    .video {
        float:left;
    }

    .chat {
        /* margin: 50px 0; */
        border: solid 1px orange;
        height: 300px;
        width: 400px;;
        overflow: scroll;
        position: relative;
        margin-top: 30px;
    }

    .chat h3{
        border-bottom: solid 1px black;
    }

    /* .chat input{
        position: absolute;
        bottom: 0;
    } */

    input {
        margin: 10px;
        padding: 5px 10px;
        width: 300px;
        display: inline-block;
    }
</style>


<template>
    <div>
        <h1>room_component</h1>

    <br>
        <button @click="join('1')">ルーム1</button>
        <button @click="join('2')">ルーム2</button>
        <button @click="join('3')">ルーム3</button>

        <div v-if="room != ''">
            <div class="video">
                Youtube動画URL：<input type="text" v-model="video_url" v-on:keydown.enter="url_play">
                <button @click="url_play">送信</button>
                <br>
                <youtube
                    ref="youtube"
                    :video-id="videoId"
                    :player-vars="{autoplay:1}"
                    @ready="ready"
                    @ended="ended"
                    @paused="paused"
                    @playing="playing"
                />
                <br>
                <!-- <button @click="playVideo">play</button>
                <button @click="pauseVideo">pause</button> -->
                <!-- <button @click="stopVideo">stop</button> -->
            </div>
            <br>

            <div class="chatbox">
                <div class="chat">
                    <h3>チャットログ</h3>
                    <ul>
                        <li v-for="chat in chats">{{ chat }}</li>
                    </ul>
                </div>
                チャット：<input v-model="send_msg" @keydown.enter="send">
                <button @click="send">送信</button>
            </div>
        </div>
        {{ videoId }}
    </div>
    
</template>
<script>
export default {
    

    mounted: async function (){
        this.peer = new Peer({key: process.env.SKYWAY_APIKEY,debug: 3});
    },

    state: {
        chats: []
    },

    data: function(){
        return {
            roomName: '',
            msg: '',
            send_msg: '',
            chats: [],
            room: '',
            videoId: '',
            video_url: '',
        }
    },

    computed: {
        player() {
            return this.$refs.youtube.player
        }
    },

    methods: {

        url_play(){
            this.videoId = this.video_url.split('v=')[1]
            this.room.send({event:'id_play', videoId: this.videoId})
            this.video_url = ''
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
        stopVideo() {
            this.player.stopVideo()
        },
        ready() {
            console.log('ready')
        },
        ended() {
            console.log('ended')
        },
        playing() {
            console.log('playing')
            this.room.send({event: 'videoCtrl', action: 'playing'})
            // this.room.send({event: 'videoCtrl', action: 'toSeek', seconds: this.player.getCurrentTime()})
        },
        paused(){
            console.log('paused')

            var _this = this;
            this.player.getCurrentTime().then((time) => {
                _this.room.send({event: 'videoCtrl', action: 'toSeek', seconds: time})
                _this.room.send({event: 'videoCtrl', action: 'paused'})
            })
        },

        join: function(num){

            //仮想ルームへの入室処理
            this.roomName = "ルーム" + num;
            this.room = this.peer.joinRoom(this.roomName, {mode: 'sfu'});
            //チャットログの初期化
            this.chats.length = 0;
            this.chats.push(this.roomName + 'に入室しました')

            let _this;
            _this = this

            //dataイベント受信
            this.room.on('data', ({data}) => {
                switch (data.event) {
                    case 'chat':
                        _this.chats.push(data.msg);
                        break;

                    case 'id_play':
                        _this.id_play(data.videoId)
                        break;

                    case 'videoCtrl':
                        _this.videoCtrl(data.action, data.seconds)
                        break;
                
                    default:
                        break;
                }

            });

        },

        //チャット送信処理
        send: function(){
            // console.log(this.send_msg)
            if(this.room == ''){
                this.msg = 'ルームへ入室してください';
                return;
            }
            // console.log(this.send_msg)
            this.room.send({event: 'chat', msg: this.send_msg})
            this.chats.push(this.send_msg);
            this.send_msg = '';
        },

        videoCtrl: function(action, data){
            switch (action) {
                case 'playing':
                    this.player.playVideo()
                    break;
                case 'paused':
                    this.player.pauseVideo()
                    break;
                case 'toSeek':
                    this.player.seekTo(data)
                    // console.log('seek')
                    break;
            
                default:
                    break;
            }
        },
    },

}
</script>
