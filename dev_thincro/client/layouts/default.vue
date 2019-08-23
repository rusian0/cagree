<template>
<div>
   <header>
      <nav>
         <ul>
            <nuxt-link tag="li" to=/><a>Top</a></nuxt-link>
            <nuxt-link tag="li" to=/all><a>All</a></nuxt-link>
            <nuxt-link tag="li" to=/publicroom><a>Room</a></nuxt-link>
            <nuxt-link tag="li" to=/category><a>Category</a></nuxt-link>
         </ul>
         <div class="auth">

            <!-- <div> -->
            <div v-if="isLogin">
               <nuxt-link to=/mypage>Mypage</nuxt-link>
               <a style="cursor:pointer" @click="logout">Logout</a>
            </div>

            <!-- <div> -->
            <div v-else>
               <nuxt-link to=/auth/register>Register</nuxt-link>
               <nuxt-link to=/auth/login>Login</nuxt-link>
            </div>

         <div>

            </div>
         </div>
      </nav>

   </header>
   <Nuxt />
</div>
</template>

<style>
body {
   margin: 0;
}
</style>

<script>

export default {
data () {
      return {
      }
   },

   computed: {
      isLogin () {
         this.$store.dispatch('auth/check')

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



<style scoped>

   header {
      background-color: #920000;
      padding: 30px;
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
      border: 2px solid #fff;
      border-radius: 5px;
      padding: 10px;
      color: white;
      text-decoration: none;
   }
</style>

