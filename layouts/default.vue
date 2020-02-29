<template>
<div>
   <header class="header">
      <nuxt-link tag="h2" to=/>
         <a><img src="/images/logo.png" alt="" width="280"></a>
      </nuxt-link>

      <!-- <nav>

         <ul>
            <nuxt-link tag="li" to=/><a>Top</a></nuxt-link>
            <nuxt-link tag="li" to=/room><a>Room</a></nuxt-link>
         </ul>

         <div class="auth">

            <div v-if="isLogin">
               <nuxt-link to=/mypage>Mypage</nuxt-link>
               <a @click="logout">Logout</a>
            </div>

            <div v-else>
               <nuxt-link to=/auth/register>Register</nuxt-link>
               <nuxt-link to=/auth/login>Login</nuxt-link>
            </div>

         <div>

            </div>
         </div>
      </nav> -->

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
         return this.$store.getters['auth/check']
      },
      username () {
         return this.$store.getters['auth/username']
      }
   },


   methods: {
      async logout () {
         await this.$store.dispatch('auth/logout')

         // this.$router.push('/auth/login')
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
      padding: 20px 50px 10px 50px;
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

