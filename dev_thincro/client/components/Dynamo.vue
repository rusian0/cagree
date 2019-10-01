<template>
  <div>
    <form @submit.prevent="getCue">
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
            async getCue () {
                this.tableData = await this.$store.dispatch('room/getCue')
            }
        }
    }
</script>

