<template>
<div>
   <header class="header">
      <nuxt-link tag="h2" to=/><a>PulScreen</a></nuxt-link>
   </header>
   <Nuxt />
</div>
</template>



<script>

export default {
data () {
      return {
      }
   },

   computed: {
      isLogin () {
      },
      username () {
      }
   },


   methods: {
      async logout () {

      }
}
}
</script>

<style>

   html, body {
      height: 100%;
      background-color: #f8f8f8;
   }

</style>
<style scoped>



   header.header{
      background-color: #920000;
      padding: 30px 50px;
      top: 0;
      /* position: fixed;
      z-index: 9999;
      width: 100%; */
   }

   ul {
      list-style: none;
      display: inline;
   }

   ul li {
      display: inline-block;
      font-size: 20px;
      margin: 0 30px;
      font-weight: bold;
   }

   ul li a {
      color: #fbfbfb;
      text-decoration: none;
   }

   a {
      text-decoration: none;
      color: #ffffff;
   }

   .auth {
      display: inline-block;
      position: absolute;
      right: 100px;
   }

   .auth a  {
      /* float: right; */
      cursor: pointer;
      border: 2px solid #fff;
      border-radius: 5px;
      padding: 10px;
      color: white;
      text-decoration: none;
   }

   h2 {
      color: #ffffff;
      letter-spacing: 2px;

      font-family:"游ゴシック Medium",YuGothic,YuGothicM,"Hiragino Kaku Gothic ProN","Hiragino Kaku Gothic Pro",メイリオ,Meiryo,sans-serif;
   }
</style>

