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

.ham-menu {
    background-color: #ee5b85;
    border-radius: 50%;
    position: fixed;
    width: 50px;
    height: 50px;
    bottom: 3%;
    left: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 1.5px 1.5px 10px #4e4e4e;
    cursor: pointer;
    transition: background-color .3s;
    transform: translate(-50%, -0);
    z-index: 9;
}

.ham-menu:hover {
    background-color: #d62255;
}

.ham-menu .ham-icon {
    color: #ffffff;
    font-size: 18px;
}

.menu-box {
    position: fixed;
    width: 100%;
    height: 100%;
    background-color:#fffffff6;
    z-index: 8;
    bottom: 0;
    right: 0;
    transition: .35s;
    display: flex;
    justify-content: center;
    align-items: center;
}

.menu-box .cross-icon {
    position: fixed;
    color: #818181;
    top: 10%;
    right: 10%;
    font-size: 30px;
    transition: .3s;
    cursor: pointer;
}

.menu-box .cross-icon:hover {
    color: #000000;
}
.menu-box ul {
    list-style: none;
    text-align: center;
    margin: 0;
    padding: 0;
}

.menu-box ul li {
    border-bottom: 1px solid #bdbdbd;
    margin: 30px 0;
    background-color: #e785a0;
    padding: 10px 20px;
    color: #ffffff;
    position: relative;
    height: 43px;
    border-radius: 25px;
}
.menu-box ul li a{
    color: #ffffff;
}


.under-menu-enter {
    transform: translateY(100%);
}
.under-menu-leave-to {
    transform: translateY(100%);   
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
        <div class='ham-menu' v-on:click="moveMenu">
            <font-awesome-icon class="ham-icon" icon="bars" />
        </div>
        <transition name="under-menu">
            <div class="menu-box" v-if="openMenu">
                <font-awesome-icon v-on:click="moveMenu" class="cross-icon" icon="times" />

                <ul>
                    <li><a href="https://forms.gle/quzht66eqsAjzmfR8" target="_blank">お問い合わせ・要望</a></li>
                    <!-- <li>
                        <a href="https://forms.gle/quzht66eqsAjzmfR8" target="_blank">オーナーモード</a>
                        <div class="switch3">
                            <label class="switch3__label">
                                <input type="checkbox" class="switch3__input"/>
                                <span class="switch3__content"></span>
                                <span class="switch3__circle"></span>
                            </label>
                        </div>
                    </li> -->
                </ul>
            </div>
        </transition>
    </div>
</template>

<script>
import Peer from 'skyway-js';

import firebase from "~/plugins/firebase.js"
const db = firebase.firestore();
const functions = firebase.app().functions('asia-northeast1')
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
            openMenu: false
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

        moveMenu(){
            if(this.openMenu){
                this.openMenu = false
                document.removeEventListener('touchmove', handleTouchMove, { passive: false });
                preventScroll.disable()
            }
            else {
                this.openMenu = true
                document.addEventListener('touchmove', handleTouchMove, { passive: false });
                preventScroll.enable()
            }
        }
    }
}

const preventScroll= {
	x:0,
	y:0,
	setPos(x=window.pageXOffset,y=window.pageYOffset){
		this.x=x;
		this.y=y;
	},
	handleEvent(){
		window.scrollTo(this.x,this.y);
	},
	enable(){
		this.setPos();
		window.addEventListener("scroll",this);
	},
	disable(){
		window.removeEventListener("scroll",this);
	}
}

function handleTouchMove(event) {
    event.preventDefault();
}
</script>

<style scoped>
.switch3__label {
    width: 37px;
    position: relative;
    display: inline-block;
    padding-top: 3px;
}
.switch3__content {
    display: block;
cursor: pointer;
position: relative;
border-radius: 7px;
height: 14px;
background-color: rgba(34,31,31,.26);
-webkit-transition: all .1s .4s;
    -moz-transition: all .1s .4s;
        -ms-transition: all .1s .4s;
        -o-transition: all .1s .4s;
            transition: all .1s .4s;
    overflow: hidden;
}

.switch3__content:after {
    content: "";
    display: block;
    position: absolute;
    
    width: 0;
    height: 100%;
    top: 0;
    left: 0;
    
    border-radius: 7px;
    -webkit-transition: all .5s;
    -moz-transition: all .5s;
        -ms-transition: all .5s;
        -o-transition: all .5s;
            transition: all .5s;
}
.switch3__input {
    display: none;
}
.switch3__circle {
    display: block;
    top: 0px;
    left: 0px;
    position: absolute;
    width: 20px;
    height: 20px;
    -webkit-border-radius: 10px;
            border-radius: 10px;
    background-color: #F1F1F1;
    -webkit-transition: all .5s;
    -moz-transition: all .5s;
        -ms-transition: all .5s;
        -o-transition: all .5s;
            transition: all .5s;
    -webkit-box-shadow: 0 2px 2px #ccc;
            box-shadow: 0 2px 2px #ccc;
}
.switch3__input:checked ~ .switch3__circle {
    left: 18px;
    background-color: #009688;
}
.switch3__input:checked ~ .switch3__content {

    border-color: transparent;
    -webkit-transition: all 0s;
    -moz-transition: all 0s;
        -ms-transition: all 0s;
        -o-transition: all 0s;
            transition: all 0s;
}

.switch3__input:checked ~ .switch3__content:after {
    background-color: rgba(0,150,136,.5);
    width: 100%;
}
</style>