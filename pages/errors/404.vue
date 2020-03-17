<style scoped>
</style>

<template>
    <div>
        <loadingComponent :loading="true" :loadTxt="`お探しのページが見つかりませんでした。ご自身で指定したURLに誤りがないか確認してください。<br>${count} 秒後にあなたのお部屋へ案内します`" ></loadingComponent>
    </div>
</template>

<script>
import loadingComponent from '~/components/loading.vue'

export default {
    components: {
        loadingComponent,
    },
    data: function(){
        return {
            count: 10
        }
    },
    watch: {
        count: function(before, after){

            if(before == 0){
                this.$router.push('/')
            }
        }
    },
    mounted: function(){
        setTimeout(() => {
            setInterval( () => {
                this.count--
            }, 1000)
        }, 500);
    }

}
</script>
