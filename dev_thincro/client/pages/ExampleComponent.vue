<template>
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card">
                    <div class="card-header">ExampleComponent</div>

                    <div class="card-body">
                        <p>親</p>
                        <p>カウント：{{ count }}</p>
                        <p></p>
                        <input type="text" v-model="input_text" >

                        <onclick-count v-on:count_click="count_up" :input_text="input_text" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import OnclickCount from './OnclickCount'

    export default {

        components: { OnclickCount },

        data() {
            return {
                count: 0,
                input_text: 'test'
            }
        },

        methods:{
            count_up:function (){
                this.count++;
            }
        },

    }

</script>
