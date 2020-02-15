<style scoped>
.main {
    width: 100%;
    /* padding-right: 10px;
    padding-left: 10px; */
}

/* .member_count {
    position: relative;
    width: 20px;
    height: 20px;
}

.member_count .count{
    position: absolute;
    top: -5px;
    left: 16px;
    font-size: 0.8em;
}

.member_count .icon{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
} */

</style>

<template>
    <div>
        <!-- <div class="member_count">
            <div class="count" v-if="room_member.length">{{ room_member.length }}</div>
            <font-awesome-icon class="icon" icon="user" />
        </div> -->
        <div class="container-fluid main">
            <youtubeplayer :room="room" :roomId="roomId" :yt_key="yt_key" ref="youtubeplayer"/>
        </div>
    </div>
</template>

<script>
import Peer from 'skyway-js';

import firebase from "~/plugins/firebase.js"
const db = firebase.firestore();
const itemRef = db.collection('room')

import youtubeplayer from '~/components/player/player-comp.vue'
import youtubesearch from '~/components/youtubesearch.vue'

export default {
    middleware: 'room_auth',
    components: {
        youtubeplayer,
        youtubesearch
    },
    mounted: function (){
        this.peer = new Peer({key: process.env.SKYWAY_APIKEY,debug: 3});

        this.$store.commit('room/setRoomId', this.roomId)
        // this.$store.dispatch('room/clearMember')

        this.$refs.youtubeplayer.getQueue()

        this.peer.on('open', peerId => {
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
            room_member: []
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

            this.room.on('log', (room_log) => {
                this.initMember(room_log)
            })

            this.room.on('peerJoin', (data) => {
                this.$refs.youtubeplayer.tellPlayerStatus()
                // this.$store.dispatch('room/modifyMember', {memberId: this.peer.id, action: 'join'})
            })

            this.room.on('peerLeave', (peer_id) => {
                this.$store.dispatch('room/modifyMember', {memberId: peer_id, action: 'leave'})
            })

            this.room.on('open', ()=>{
                this.room.getLog()

                this.$store.dispatch('room/modifyMember', {memberId: this.peer.id, action: 'join'})

                 itemRef.doc(this.roomId)
                    .onSnapshot((doc) => {
                        this.room_member = doc.data().room_member
                    })
            })

        },

        initMember: async function (room_log){
            const first_log = JSON.parse(room_log[0])

            if(this.peer.id == first_log.message.src){
                await this.$store.dispatch('room/clearMember')
                this.$store.dispatch('room/modifyMember', {memberId: this.peer.id, action: 'join'})
            }
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
