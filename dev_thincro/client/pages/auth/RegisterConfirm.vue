<style scoped>

    input {
        display: block;
        margin-bottom: 20px;
    }
</style>


<template>
    <div>
        <h1>Register Confirm</h1>
        <form @submit.prevent="register_confirm">
            <!-- <label>名前</label>
            <input v-model="formData.name" name="username" type="email"/> -->
            <label>メールアドレス</label>
            <input v-model="formData.email" type="email"/>
            <label>認証コード</label>
            <input v-model="formData.code" name="code"/>


            <!-- <label>パスワード(確認)</label> -->
            <!-- <input v-model="formData.password_confirmation" name="password-confirm" type="password"/> -->
            <!-- <button @click="login()" :disabled="!password || password !== password_confirm">登録</button> -->
            <input type="submit" value="本登録">
        </form>
    </div>
</template>
<script>
export default {

    data: function(){
        return {
            formData: {
                email: this.$store.getters['auth/username'],
                code: '',
                errors: ''
            }
        }
    },

    computed: {

    },
    methods: {

        register_confirm () {
            this.$store.dispatch('auth/register_confirm',this.formData)
        }
    }

}
</script>
