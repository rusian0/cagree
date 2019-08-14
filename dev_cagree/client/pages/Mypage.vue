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

        login () {
            this.$store.dispatch('login',
                {
                    email: this.email,
                    password: this.password,
                    remember: this.remember,
                }
            )
        }
    }

}
</script>
