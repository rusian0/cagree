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
        <div class="container-fluid main">
            <youtubeplayer :room="room" :roomId="roomId" :room_member="room_member" :yt_key="yt_key" ref="youtubeplayer"/>
        </div>
        <div class="row">
            <div class="col-7">
            </div>
            <div class="col-2 member_count">
                <span class="input-group">
                    <font-awesome-icon class="icon mt-1 mr-1" icon="user" />
                    <div class="count" v-if="room_member.length">{{ room_member.length }}</div>
                </span>
            </div>
            <div class="col-3">
            </div>
        </div>
    </div>
</template>

<script>
import Peer from 'skyway-js';

import firebase from "~/plugins/firebase.js"
const db = firebase.firestore();
const auth = firebase.auth()
const itemRef = db.collection('room')

import youtubeplayer from '~/components/player/player-comp.vue'
import youtubesearch from '~/components/youtubesearch.vue'

export default {
    components: {
        youtubeplayer,
        youtubesearch
    },
    middleware ({ store, redirect, query }) {
        if (!query.id) {
            return redirect('/')
        }
    },
    mounted: function (){
        this.peer = new Peer({key: process.env.SKYWAY_APIKEY,debug: 3});

        this.$store.commit('room/setRoomId', this.roomId)
        // this.$store.dispatch('room/clearMember')

        this.peer.on('open', peerId => {
            this.join();
        })

        auth.signInAnonymously().catch( (error) => {
            console.log(error)
        })

        auth.onAuthStateChanged((user) => {
            if(!user) return
            

        })

    },

    data: function(){
        return {
            msg: '',
            send_msg: '',
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
                return null
            }

        }
    },

    methods: {

        join: async function(){

            //仮想ルームへの入室処理
            // this.roomId = "ルーム";
            
            this.room = this.peer.joinRoom(this.roomId, {mode: 'sfu'});
            // this.$store.commit('room/setRoomInfo', this.room)

            console.info(this.room.name +" に入室完了")

            this.room.on('log', (room_log) => {
                this.initMember(room_log)
            })

            // this.room.on('peerJoin', (data) => {
            //     // this.$store.dispatch('room/modifyMember', {memberId: this.peer.id, action: 'join'})
            // })

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
    }
}
</script>
