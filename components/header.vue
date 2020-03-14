<template>
<div>
   <header class="header">
      <nuxt-link tag="h2" to=/>
         <a><img class="logo" src="/images/logo.png" alt="" width="160"></a>
      </nuxt-link>
      <button @click="inviteMember" class="btn-invite" >
         <font-awesome-icon class="user" icon="user" />
         <font-awesome-icon class="plus" icon="plus" />
      </button>
   </header>
   <transition name="modal">
      <div v-if="inviteModal" class="invite_modal">
         この部屋のURLをクリップボードにコピーしました<br>
         一緒に動画を見たい方に共有してください！
      </div>
   </transition>
   <Nuxt />
</div>
</template>



<script>

export default {
data () {
      return {
         inviteModal: false
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

      },

      inviteMember(){
         var copyFrom = document.createElement("textarea");
         copyFrom.textContent = location.href;

         var bodyElm = document.getElementsByTagName("body")[0];
         bodyElm.appendChild(copyFrom);

         copyFrom.select();
         var retVal = document.execCommand('copy');
         bodyElm.removeChild(copyFrom);

         this.inviteModal = true
         setTimeout(() => {
            this.inviteModal = false
         }, 4000);
         return retVal;
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
      background: linear-gradient(-135deg, #d06426 -19%, #c3207c 50%,#d06426 80%) fixed;
      padding: 5vh 5vw 4vh 5vw;
      top: 0;
      box-shadow: 0 3px 6px rgba(0,0,0,0.2);     
      text-align: center;
      position: relative;
   }

   header.header img.logo {
      width: 130px;
   }

   .btn-invite {
      position: absolute;
      right: 2%;
      bottom: 8%;
      /* background-color: #dc7390; */
      background: none;
      border-radius: 20%;
      border: none;
      color: #ffffff;
      box-shadow: 0px 0px 26px -1px #ffadad;
      transition: background-color .3s;
   }

   .btn-invite:hover {
      background-color: #ff4848;
   }

   .btn-invite .plus {
      font-size: 14px;
      margin-left: -2px;
   }

   .invite_modal {
      position: fixed;
      background: #dc7391dc;
      /* width: 500px;
      height: 300px; */
      color: #ffffff;
      padding: 15px 20px;
      right: 0;
      top: 15%;
      z-index: 1;
      width: auto;
      transition: all .7s ease;
      max-width: 100%;
   }

   .modal-enter {
      transform: translateX(100%);
   }

   .modal-leave-to {
      transform: translateX(100%);   
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

   @media screen and (max-width: 576px) {
      header.header img.logo {
         width: 90px;
      }

      .btn-invite {
         font-size: 13px;
      }

      .btn-invite .plus {
         font-size: 10px;
      }

      .invite_modal {
         font-size: 14px;
         top: 18%;
      }
   }
</style>

