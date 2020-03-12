<template>
<div>
   <header class="header">
      <nuxt-link tag="h2" to=/>
         <a><img src="/images/logo.png" alt="" width="160"></a>
      </nuxt-link>
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
      background: linear-gradient(-135deg, #c3207c, #d06426) fixed;
      padding: 5vh 5vw 4vh 5vw;
      top: 0;
      box-shadow: 0 3px 6px rgba(0,0,0,0.2);     
      text-align: center;
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
      width: 37%;
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

