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

    .main {
        float: left;
        width: 95%;
        /* width: 50%; */
        padding: 20px;
    }

    .side {
        float: right;
        width: 40%;
        padding: 20px;
    }

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

    .room {
        padding: 3%;
    }
</style>


<template>
    <div>
        <!-- <h1>room_component</h1> -->

    <br>
        <!-- <button @click="join('2')">ルーム2</button>
        <button @click="join('3')">ルーム3</button> -->
        <!-- <button @click="$test()">plugin</button> -->
    
        <div v-if="room != ''" class="room">
            <div class="main">
                <youtubeplayer :room="room" :yt_key="yt_key" ref="youtubeplayer"/>
            </div>

            <div class="side">
                <!-- <youtubesearch :room="room" ref="youtubesearch"/> -->
            </div>

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
import youtubesearch from '~/components/youtubesearch.vue'

export default {
    components: {
        youtubeplayer,
        youtubesearch
    },
    mounted: async function (){
        this.peer = new Peer({key: process.env.SKYWAY_APIKEY,debug: 3});
        this.peer.on('open', ()=>{
            this.join('1');
        })
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
            yt_key: process.env.YOUTUBEDATA_APIKEY,
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

            //dataイベント受信
            this.room.on('data', ({data}) => {
                switch (data.event) {
                    case 'chat':
                        this.chats.push(data.msg);
                        break;

                    case 'playerCtrl':
                        this.$refs.youtubeplayer.playerCtrl(data.action, data.datas)
                
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
