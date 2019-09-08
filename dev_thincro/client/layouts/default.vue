<template>
<div>
   <header>
      <h2>PlaybackLink</h2>
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

   body {
      margin: 0;
   }

</style>
<style scoped>



   header {
      background-color: #920000;
      padding: 5px 30px;
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
   }
</style>

