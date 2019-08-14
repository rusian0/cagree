<style scoped>
    div {
        text-align:center;
        font-size: 50px;
    }
</style>


<template>
    <div>
        <h1>Skill Component</h1>
        <button v-on:click="increment">＋</button>
        {{ count }}
        <button v-on:click="decrement">ー</button>
        {{ count_three_minus }}

        <br>

        <input v-model="sum_num">
        <button v-on:click="num_increment(Number(sum_num))">sum</button>

    </div>
</template>
<script>
export default {

    data: function(){
        return {
            sum_num: ''
        }
    },

    computed: {
        count () {
            return this.$store.state.count
        },
        count_three_minus (){
            return this.$store.getters.count_three_minus;
        },
    },
    methods: {
        increment () {
            this.$store.commit('increment')
        },

        decrement () {
            this.$store.commit('decrement')
        },

        num_increment (num) {
            this.$store.dispatch('num_increment', num)
            console.log('tet')
            // this.sum_num = '';
        }
    }

}
</script>
