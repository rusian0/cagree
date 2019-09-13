<style scoped>
img {
}
p {
    display: inline-block;
    vertical-align: top;
    font-size: 20px;
    width: 300px;
}
</style>
<template>
    <div>
        <input type="text" v-model="keyword" v-on:keydown.enter="search_video">
        <button @click="search_video">検索</button>
        <ul>
            <li v-for="item in result" style="list-style:none">

                <img :src="item.snippet.thumbnails.medium.url">
                <p>{{ item.snippet.title }}</p>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    props: {
        'room': {
            type: Object,
            default: ''
        },
    },
    data: function(){
        return {
            result:[],
            keyword:'',
            apiKey: process.env.YOUTUBEDATA_APIKEY

        }
    },
    mounted: function (){
        this.room.on('peerJoin', (data) => {
        })
    },
    computed: {
    },
    methods: {
        search_video: function(query){

            var params = {
                part: 'snippet',
                key: this.apiKey,
                q: this.keyword,
                type: 'video',
                maxResults: 3
            }

            this.$axios.get('https://www.googleapis.com/youtube/v3/search', {params})
            .then(result => {
                this.result = result.data.items
            })

            this.keyword = ''
        }
    },

}
</script>