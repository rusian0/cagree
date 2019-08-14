<style scoped>

    input {
        display: block;
        margin-bottom: 20px;
    }
</style>


<template>
    <div>
        <h1>Register</h1>
        <form @submit.prevent="register">
            <label>名前</label>
            <input v-model="formData.name" name="name"/>
            <label>メールアドレス</label>
            <input v-model="formData.email" name="email"/>
            <label>パスワード</label>
            <input v-model="formData.password" name="password" type="password"/>
            <label>パスワード(確認)</label>
            <input v-model="formData.password_confirmation" name="password-confirm" type="password"/>
            <!-- <button @click="login()" :disabled="!password || password !== password_confirm">登録</button> -->
            <button type="submit">登録</button>
        </form>
    </div>
</template>
<script>
export default {

    data: function(){
        return {
            formData: {
                name: '',
                email: '',
                password: '',
                password_confirmation: '',
                remember: ''
            }
        }
    },

    computed: {

    },
    methods: {

        register () {
            this.$store.dispatch('auth/register',this.formData)

            this.$router.push('/')
        }
    }

}
</script>
