<style scoped>

    input {
        display: block;
        margin-bottom: 20px;
    }
</style>


<template>
    <div>
        <h1>Login</h1>
        <form @submit.prevent="login">
            <label>メールアドレス</label>
            <input v-model="formData.email" type="email" name="email"/>
            <label>パスワード</label>
            <input v-model="formData.password" name="password" type="password"/>
            <!-- <input v-model="formData.password" name="password" type="password" required/> -->
            <label>ログイン状態を保存</label>
            <input type='checkbox' v-model="formData.remember"/>
            <!-- <button @click="login()">ログイン</button> -->
            <!-- <button @click="login()" :disabled="!email || !password">ログイン</button> -->
            <button type="submit">ログイン</button>
        </form>
    <router-link to=/register>会員登録はこちら</router-link>
    </div>
</template>
<script>
export default {

    // layout: 'header',

    data: function(){
        return {
            formData:{
                email: '',
                password: '',
                remember: ''
            }
        }
    },

    methods: {

        async login () {
            await this.$store.dispatch('auth/login', this.formData)

            this.$router.push('/mypage')
            // console.log('ok');
        },
    }

}
</script>
