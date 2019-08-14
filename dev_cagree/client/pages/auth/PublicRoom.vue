<style scoped>

    input {
        display: block;
        margin-bottom: 20px;
    }

    .notice {
        height: 100px;
    }

    .chat {
        /* margin: 50px 0; */
        border: solid 1px orange;
        height: 300px;
        width: auto;
        overflow: scroll;
        position: relative;
    }

    .chat h3{
        border-bottom: solid 1px black;
    }

    /* .chat input{
        position: absolute;
        bottom: 0;
    } */

    input {
        margin: 30px;
        padding: 5px;
        display: inline-block;
    }
</style>


<template>
    <div>
        <h1>public room component</h1>
        <button @click="join('1')">ルーム1</button>
        <button @click="join('2')">ルーム2</button>
        <button @click="join('3')">ルーム3</button>
        <div v-if="room != ''">
            <!-- <input type="hidden" v-on="room"> -->
            <!-- <div class='notice'>
                <h3>お知らせ</h3>
                <p>{{ msg }}</p>
            </div> -->
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
</template>
<script>
export default {

    mounted: async function (){
        this.peer = new Peer({key: 'acb9a4f1-4053-4fac-967e-82d3d77f1b30',debug: 3});
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
            room: ''
        }
    },

    mutation: {

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

            //チャット送信イベントのリスニング
            this.room.on('data', function(data){
                _this.chats.push(data.data);
                // this.chats.push(data.data);

            });
        },

        //チャット送信処理
        send: function(event){
            // console.log(this.send_msg)
            if(this.room == ''){
                this.msg = 'ルームへ入室してください';
                return;
            }
            this.room.send(this.send_msg)
            this.chats.push(this.send_msg);
            this.send_msg = '';
        },

    }
}
</script>
