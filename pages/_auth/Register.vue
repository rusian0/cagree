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
            <!-- <label>名前</label>
            <input v-model="formData.name" name="username" type="email"/> -->
            <label>メールアドレス</label>
            <input v-model="formData.username" name="username" type="email"/>
            <label>パスワード</label>
            <input v-model="formData.password" name="password" type="password"/>


            <!-- <label>パスワード(確認)</label> -->
            <!-- <input v-model="formData.password_confirmation" name="password-confirm" type="password"/> -->
            <!-- <button @click="login()" :disabled="!password || password !== password_confirm">登録</button> -->
            <input type="submit" value="仮登録">
        </form>
    </div>
</template>
<script>
export default {

    data: function(){
        return {
            formData: {
                username: '',
                password: '',
            }
        }
    },

    computed: {

    },
    methods: {

        register () {
            this.$store.dispatch('auth/register',this.formData)
        }
    }

}
</script>
