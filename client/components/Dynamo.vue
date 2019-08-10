<template>
  <div>
    <form @submit.prevent="login">
        <input v-model=params.TableName>

        <button type="submit">取得</button>

        <p>{{ tableData }}</p>

    </form>
  </div>
</template>

<script>
    import axios from 'axios';

    export default {
        data: function(){
            return {
                params :{
                    TableName: '',
                },

                tableData: ''
            }
        },

        methods: {
            async login () {
                const response = await axios.get('/api/get_table', {params: this.params})
                // const response = await axios.get('/api/get_table', {name: this.tableName})
                // context.commit('setUser', response.data)
                // await this.$store.dispatch('auth/login', this.formData)

                // this.$router.push('/mypage')
                this.tableData = response.data
                console.log(response.data);
            }
        }
    }
</script>

