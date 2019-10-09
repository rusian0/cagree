<style scoped>

    input {
        display: block;
        margin-bottom: 20px;
    }
</style>


<template>
    <div>
        <h1>Mypage</h1>

    </div>
</template>
<script>
export default {

    middleware: 'auth',

    data: function(){
        return {
            email: '',
            password: '',
            remember: ''
        }
    },

    computed: {

    },
    methods: {

        
    }

}
</script>
