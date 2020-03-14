<style scoped>
.main {
    width: 100%;
    /* padding-right: 10px;
    padding-left: 10px; */
}

.member_count {
    position: fixed;
    left: 0%;
    bottom: 0%;
    color: #ffffff;
    background-color: #dc7390;
    border-top-right-radius: 20%;
    font-size: 13px;
    padding: 4px 13px;
    opacity: .8;
}

.member_count .count{
    font-size: 14px;
    margin-left: -2px;
}

.member_count .icon{
    font-size: 15px;
}


@media screen and (max-width: 576px) {
    .member_count {
        font-size : 13px;
        padding: 3px 9px;
    }

    .member_count .count{
        font-size: 10px;
        margin-left: -4px;
    }

    .member_count .icon{
        font-size: 10px;
    }

}


</style>

<template>
    <div>
        <loadingComponent :loading="!enteredRoom" :loadTxt="'入室中...'" ></loadingComponent>
        <headerComponent></headerComponent>
        <div class="container-fluid px-0 main">
            <youtubeplayer v-if="enteredRoom" :room="room" :roomId="roomId" :room_member="room_member" :yt_key="yt_key" ref="youtubeplayer"/>
        </div>
        <div class="row">
            <div class="col-7">
            </div>
            <div class="member_count">
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
const functions = firebase.functions();
const auth = firebase.auth()
const itemRef = db.collection('room')


import youtubeplayer from '~/components/player/player-comp.vue'
import youtubesearch from '~/components/youtubesearch.vue'
import headerComponent from '~/components/header.vue'
import loadingComponent from '~/components/loading.vue'

export default {
    components: {
        youtubeplayer,
        youtubesearch,
        headerComponent,
        loadingComponent
    },
    mounted: async function (){
        await auth.signInAnonymously()

        const enteredRoomRun = functions.httpsCallable('enteredRoom')
        const response = await enteredRoomRun({ roomId: this.roomId })
        console.log(response);
        
        this.enteredRoom = true

        this.peer = new Peer({key: process.env.SKYWAY_APIKEY,debug: 3});

        this.$store.commit('room/setRoomId', this.roomId)
        // this.$store.dispatch('room/clearMember')

        this.peer.on('open', peerId => {
            this.join();
        })

        auth.onAuthStateChanged((user) => {
            if(!user) return
            console.log(user);
        })

    },

    data: function(){
        return {
            msg: '',
            send_msg: '',
            room: '',
            yt_key: process.env.YOUTUBEDATA_APIKEY,
            room_member: [],
            enteredRoom: false,
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
