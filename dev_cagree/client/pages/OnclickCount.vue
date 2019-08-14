
<template>
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card">
                    <div class="card-header">OnlickCount</div>
                    <div class="card-body">
                        <p>子</p>
                        <button @click="$emit('count_click')">カウントアップボタン</button>

                        <p>入力テキスト：{{ input_text }}</p>

                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    // data() {


    props:{ 'input_text': String }

}
</script>

