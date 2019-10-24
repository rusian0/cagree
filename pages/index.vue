<template>
  <div class="container">
    <div>
      <h1 class="title">PulScreen</h1>
      <nuxt-link tag="button" class="btn btn-success" :to="{path: '/room?id='+roomId}">Let's Join Room!</nuxt-link>

    </div>
  </div>
</template>

<script>
import Logo from '~/components/Logo.vue'

export default {

  computed: {
    roomId: function(){
      return new Date().getTime().toString(16)  + Math.floor(1000*Math.random())
      // return 'testroomid'
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