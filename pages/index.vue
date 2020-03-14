<template>
  <div>
      <loading-component :loadTxt="'あなたの部屋を探しています...'"></loading-component>
  </div>
</template>

  <script>
import { uuid } from 'vue-uuid';
import firebase from "~/plugins/firebase.js"
import loadinComponent from "~/components/loading"
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
  },
  components: {
    'loading-component': loadinComponent
  }
}
</script>

<style>
html {
  font-size: 100%;
}
/* 
.top-loading {
  top: 0;
  position: fixed;
  width: 100%;
  height: 100%;
  background: linear-gradient(-135deg, #d06426 -90%, #c3207c 70%,#D06626 210%) fixed;
  color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
}

.top-loading .txt {
  margin-top: 40px;
}

.load-animate {
  position: relative;
  top: 0;
  left: 0;
  z-index: 1;
}

.icon-image {
  position: absolute;
  width: 32px;
  top: 24%;
  left: 44%;
  z-index: 2;
}

.heartbeat-loader {
  position: absolute;
} */

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