<style scoped>

html,body {
    height: 100%;
}

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

    .room_body {
        overflow: hidden;
        margin: 50px 0 0 20px;
        min-width: 600px;
    }

    .main {
        float: left;
        min-width: 300px;
        width: 60%;
    }

    .side {
        float: left;
        min-width: 200px;
        width: 40%;
        padding: 0 30px;
    }

    @media screen and (max-width:768px){
        .room_body {
            margin: 20px 0 0 0px;
            min-width: initial;
        }

        .main {
            width: 100%;
            min-width: initial;
        }

        .side {
            width: 100%;
            min-width: initial;
            padding: 5px;
        }
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
        /* padding: 3%; */
    }
</style>


<template>
    <div>
        <div class="room_body">
        <!-- <h1>room_component</h1> -->
        <!-- <button @click="join('2')">ルーム2</button>
        <button @click="join('3')">ルーム3</button> -->
        <!-- <button @click="$test()">plugin</button> -->
    
            <div class="main">
                <youtubeplayer :room="room" :roomId="roomId" :yt_key="yt_key" ref="youtubeplayer"/>
                <!-- <youtubeplayer :room="room" :roomId="roomId" :yt_key="yt_key" ref="youtubeplayer"/> -->
            </div>

            <div class="side">
                <youtubesearch :room="room" ref="youtubesearch"/>
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
    </div>
    
</template>
<script>
import Peer from 'skyway-js';

import youtubeplayer from '~/components/player.vue'
import youtubesearch from '~/components/youtubesearch.vue'

export default {
    components: {
        youtubeplayer,
        youtubesearch
    },
    
    mounted: function (){
        this.peer = new Peer({key: process.env.SKYWAY_APIKEY,debug: 3});

        this.$store.commit('room/setRoomId', this.roomId)

        this.$refs.youtubeplayer.getQueue()

        this.peer.on('open', ()=>{
            this.join();
        })

    },

    state: {
        chats: []
    },

    data: function(){
        return {
            msg: '',
            send_msg: '',
            chats: [],
            room: '',
            yt_key: process.env.YOUTUBEDATA_APIKEY,
        }
    },

    computed: {
        roomId: function(){
            if(this.$nuxt.$route.query.id){
                return this.$nuxt.$route.query.id
            }
            else {
                return 'testroomid'
            }

        }
    },

    methods: {

        join: async function(){

            //仮想ルームへの入室処理
            // this.roomId = "ルーム";
            
            this.room = this.peer.joinRoom(this.roomId, {mode: 'sfu'});
            this.$store.commit('room/setRoomInfo', this.room)

            console.info(this.room.name +" に入室完了")
            //チャットログの初期化
            this.chats.length = 0;
            this.chats.push(this.roomId + 'に入室しました')

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

            this.room.on('peerJoin', (data) => {
                this.$refs.youtubeplayer.tellPlayerStatus()
            })



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
