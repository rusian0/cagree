<template>
   <header>
      <Nuxt />
      <nav>
         <ul>
            <router-link tag="li" to=/><a>Top</a></router-link>
            <router-link tag="li" to=/all><a>All</a></router-link>
            <router-link tag="li" to=/publicroom><a>Room</a></router-link>
            <router-link tag="li" to=/category><a>Category</a></router-link>
         </ul>
         <div class="auth">

            <div v-if="isLogin">
               <router-link to=/mypage>Mypage</router-link>
               <a @click="logout" href="#" v-if="isLogin">Logout</a>
            </div>

            <div v-else>
               <router-link to=/register>Register</router-link>
               <router-link to=/login  >Login</router-link>
            </div>

         <div>

            </div>
         </div>
      </nav>
   </header>
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

