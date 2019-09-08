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

    button {
        border: 2px solid #797979;
        background: rgb(87, 87, 87);
        color: #ffffff;
        font-size: 20px;
        padding: 5px 50px;
        margin: 20px;
    }
</style>


<template>
    <div>
        <!-- <h1>room_component</h1> -->

    <br>
        <!-- <button @click="join('2')">ルーム2</button>
        <button @click="join('3')">ルーム3</button> -->
        <!-- <button @click="$test()">plugin</button> -->
    
        <div v-if="room != ''">
            <br>
            <youtubeplayer :room="room" ref="youtubeplayer"/>
            <br>

            <!-- <div class="chatbox">
                <div class="chat">
                    <h3>チャットログ</h3>
                    <ul>
                        <li v-for="chat in chats">{{ chat }}</li>
                    </ul>
                </div>
                チャット：<input v-model="send_msg" @keydown.enter="msg_send">
                <button @click="msg_send">送信</button>
            </div> -->
        </div>
        <div v-else>
            <button @click="join('1')">入室</button>

        </div>

    </div>
    
</template>
<script>
import youtubeplayer from '~/components/player.vue'

export default {
    components: {
        youtubeplayer
    },
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
        }
    },

    methods: {

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

                    case 'playerCtrl':
                        _this.$refs.youtubeplayer.playerCtrl(data.action, data.datas)
                
                    default:
                        break;
                }

            });

        },

        //チャット送信処理
        msg_send: function(){
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
    }
}
</script>
