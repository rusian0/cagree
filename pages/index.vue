<template>
  <div class="container">
    <div>
      <h1 class="title">PulScreen</h1>
      <!-- <nuxt-link tag="button" @click="createRoom" class="btn btn-success" :to="{path: '/room?id='+roomId}">Let's Join Room!</nuxt-link> -->
      <!-- <button @click="initAuth" class="btn btn-success">Let's Join Room!</button> -->
      <button @click="createRoom" class="btn btn-success">Let's Join Room!</button>
  
    </div>
  </div>
</template>

  <script>
import Logo from '~/components/Logo.vue'
import { uuid } from 'vue-uuid';
import firebase from "~/plugins/firebase.js"
const auth = firebase.auth()
const functions = firebase.functions()


export default {
  mounted: function()  {
    this.initAuth()
  },
  methods: {
    async initAuth(){

      await auth.signInAnonymously()

      const createProfileRun = functions.httpsCallable('createProfile')
      const response = await createProfileRun()

      console.log(response.data);

      auth.onAuthStateChanged(async (user) => {
        if(!user) return
        console.log(user);
        
      })
    },
    async createRoom(){
      // const roomId = await this.$store.dispatch('room/createRoom')
      // this.$router.push({ path: `screen?id=${roomId}`})
      const createRoomRun = functions.httpsCallable('createRoom')
      const response = await createRoomRun()

      const resData = response.data

      console.log(resData)

    }
  }
}
</script>

<style>
html {
  font-size: 100%;
}

.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 4rem;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>

<style scoped>

</style>