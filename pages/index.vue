<template>
  <div class="container">
    <div>
      <h1 class="title">PulScreen</h1>
      <button @click="initRoomAndProfile" class="btn btn-success">Let's Join Room!</button>
    </div>
  </div>
</template>

  <script>
import { uuid } from 'vue-uuid';
import firebase from "~/plugins/firebase.js"
const auth = firebase.auth()
const functions = firebase.functions()


export default {
  mounted: function()  {
    this.initRoomAndProfile()
  },
  methods: {
    async initRoomAndProfile(){

      await auth.signInAnonymously()

      const joinRoomRun = functions.httpsCallable('joinRoom')
      const response = await joinRoomRun()

      if(response.data === null) return

      this.$router.push('/screen?id=' + response.data.roomId)
    },
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