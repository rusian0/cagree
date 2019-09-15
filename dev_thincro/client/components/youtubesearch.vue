<style scoped>
img {
}
p {
    display: inline-block;
    vertical-align: top;
    font-size: 20px;
    width: 300px;
}

.search_result {
    height: 300px;
    overflow-y: scroll;
    border: 1px solid rgb(10, 10, 10);
}
</style>
<template>
    <div>
        <div class="search">
            <input type="text" v-model="keyword" v-on:keydown.enter="search_video" placeholder="動画検索キーワード">
            <button @click="search_video">検索</button>
            <div class="search_result" @scroll="onScroll">
                <ul>
                    <li v-for="item in items" style="list-style:none">
                        <img :src="item.snippet.thumbnails.medium.url">
                        <p>{{ item.snippet.title }}</p>
                    </li>
                </ul>
            </div>
        </div>
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
            keyword:'',
            items:[],
            searchParam: {
                key: process.env.YOUTUBEDATA_APIKEY,
                part:'snippet',
                q: '',
                type:'video',
                maxResults: 10,
            }
        }
    },
    mounted: function (){
        this.room.on('peerJoin', (data) => {
        })
    },
    computed: {
    },
    methods: {
        search_video: function(event){

            if(event !== 'next'){
                this.searchParam.q = this.keyword
                delete this.searchParam.nextPageToken
            }

            this.$axios.get('https://www.googleapis.com/youtube/v3/search', {params:this.searchParam})
            .then(result => {
                this.searchParam.nextPageToken = result.data.nextPageToken

                if(event == 'next'){
                    this.items = this.items.concat(result.data.items)
                }
                else {
                    this.items = result.data.items
                }
            })

            // this.keyword = ''
        },

        onScroll: function(e){
            if ((e.target.scrollTop + e.target.offsetHeight) >= e.target.scrollHeight) {
                this.search_video('next')
            }
        }
    },

}
</script>