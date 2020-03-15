<template>
  <transition name="load">
    <div v-if="loading">
      <div class="top-loading">
        <div>
          <div class="load-animate">
            <div class="heartbeat-loader">
              <img class="icon-image" src="/images/icon.svg" width="50" alt="">
            </div>
          </div>
        </div>
        <div class="txt">{{ loadTxt }}</div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    loadTxt: String,
    loading: Boolean
  }
}
</script>

<style scoped>

.top-loading {
  top: 0;
  left: 0;
  position: fixed;
  width: 100%;
  height: 100%;
  background: linear-gradient(-135deg, #d06426 -90%, #c3207c 70%,#D06626 210%) fixed;
  color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
  flex-direction: column;
  flex-wrap: wrap;
}

.top-loading .txt {
  margin: 30px;
}

.top-loading .txt p{
  position: absolute;
  width: 100rem;
}

.load-animate {
  position: relative;
  top: 0;
  left: 0;
  display: block;
  z-index: 1;
  width: 100%;
  height: 100%;
}

.icon-image {
    position: absolute;
    width: 27px;
    top: 40%;
    left: 44%;
    z-index: 2;
    transform: rotate(-45deg);
}

.load-enter, .load-leave-to {
    transition: all .4s ease-in-out;
}

.load-enter {
  /* transform: translateX(100%); */
  /* height:  100%; */
  opacity: 1;
}

.load-leave-to {
  /* transform: translateX(100%);  */
  opacity: 0;
  /* height: 50%; */
}
</style>