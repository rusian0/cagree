<template>
<div>
   <header :class="headerClass">
      <!-- <nuxt-link tag="h2" to=/> -->
         <a href="/">
            <img class="logo" src="/images/logo.png" alt="" width="160">
         </a>
      <!-- </nuxt-link> -->
      <div @click="inviteMember" class="btn-invite" >
         <font-awesome-icon class="user" icon="user" />
         <font-awesome-icon class="plus" icon="plus" />
      </div>
      <!-- <div class="contact">
         <a href="https://forms.gle/quzht66eqsAjzmfR8" target="_blank">
            <font-awesome-icon class="mail" icon="envelope" />
            <font-awesome-icon class="question" icon="question" />
         </a>
      </div> -->
   </header>
   <div class="dummy-header" v-if="dummyOn"></div>
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
created() {
   window.addEventListener('scroll', this.headerScroll)
},
data () {
      return {
         inviteModal: false,
         headerClass: 'header',
         dummyOn: false
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
      },

      headerScroll(event) {
         if(window.scrollY > 200){
            this.headerClass = 'header min-header'
            this.dummyOn = true
         }
         else {
            this.headerClass = 'header'
            this.dummyOn = false
         }
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
      padding: 20px 5vw 20px 5vw;
      top: 0;
      box-shadow: 0 3px 6px rgba(0,0,0,0.2);     
      text-align: center;
      position: relative;
      transition: .4s;
   }

   header.header img.logo {
      width: 130px;
   }

   header.min-header {
      position: fixed;
      z-index: 10;
      width: 100%;
      height: 44px;
      padding: 0;
   }

   header.min-header img.logo {
      width: 100px;
      margin-top: 5px;
   }

   .dummy-header {
      margin-top: 85px;
   }

   .btn-invite, .contact {
      position: absolute;
      right: 2%;
      bottom: 22%;
      /* background-color: #dc7390; */
      background: none;
      border-radius: 20%;
      border: none;
      padding: 3px 9px;
      color: #ffffff;
      cursor: pointer;
      box-shadow: 0px 0px 26px -1px #e0a4a4;
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
      z-index: 11;
      width: auto;
      transition: all .7s ease;
      max-width: 100%;
      box-shadow: 2px 1px 6px #dcdcdc;
   }

   .modal-enter {
      transform: translateX(100%);
   }

   .modal-leave-to {
      transform: translateX(100%);   
   }

   .contact {
      left: 3%;
      right: initial;
      border-radius: 5%;
      /* font-size:  */
   }

   .contact .question {
      font-size: 13px;
      margin-bottom: 2px;
      margin-left: -3px;
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

   header.min-header .btn-invite {
      bottom: 15%;
   }
   header.min-header .contact {
      bottom: 15%;
   }

   @media screen and (max-width: 576px) {
      header.header img.logo {
         width: 100px;
      }
      header.min-header img.logo {
         width: 80px;
         margin-top: 10px;
      }
      
      .dummy-header {
         margin-top: 71px;
      }

      .btn-invite, .contact {
         font-size: 13px;
         padding: 3px 10px;
         box-shadow: 0px 0px 26px -1px #e08383;
      }

      .btn-invite .user {
         font-size: 12px;
      }

      .btn-invite .plus {
         font-size: 9px;
      }

      .invite_modal {
         font-size: 12px;
         top: 18%;
      }

      .contact .question {
         font-size: 10px;
         margin-left: -3px;
         margin-bottom: 3px;
      }
   }
</style>

