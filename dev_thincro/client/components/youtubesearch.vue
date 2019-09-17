<style scoped>
img {
}
p {
    display: inline-block;
    vertical-align: top;
    font-size: 20px;
    width: 300px;
}

.search {
    border: 1px solid #000000;
}
.search_result {
    height: 300px;
    overflow-y: scroll;
    border-top: 1px solid rgb(10, 10, 10);
}

.search_result ul{
    padding: 10px 0;
}

.search_result li {
    margin: 10px 0;
    border-bottom: 1px solid #636363;
}

.search_result img{
    width: 40%;
}

.search_result li p{
    font-size: 14px;
    width: 50%;
}

.search_result button {
    display: inline-block;
    width: 19.5%;
    margin: 0 0 10px;
}

</style>
<template>
    <div>
        <div class="search">
            <input type="text" v-model="keyword" v-on:keydown.enter="search_video" placeholder="Video Search Keyword">
            <button @click="search_video">Search</button>
            Search Result
            <div class="search_result" @scroll="onScroll">
                <ul>
                    <li v-for="search_item in search_items" style="list-style:none">
                        <img :src="search_item.snippet.thumbnails.medium.url">
                        <p>{{ search_item.snippet.title }}</p>
                        <button @click="addId(search_item.id.videoId)">Send</button>
                        <button @click="unshiftId(search_item.id.videoId)">Interrupt</button>
                    </li>
                </ul>
            </div>
        </div>
        <div class="search">
            <h2>Related Video</h2>
            <div class="search_result" @scroll="onScroll">
                <ul>
                    <li v-for="related_item in related_items" style="list-style:none">
                        <img :src="related_item.snippet.thumbnails.medium.url">
                        <p>{{ related_item.snippet.title }}</p>
                        <button @click="addId(related_item.id.videoId)">Send</button>
                        <button @click="unshiftId(related_item.id.videoId)">Interrupt</button>

                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
import searchresult from '~/assets/youtube-search-result.json'

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
            // search_items:[],
            // related_items:[],
            search_items:searchresult.items,
            related_items:searchresult.items,
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

        this.$nuxt.$on('getRelatedVideo', videoId => {
            this.getRelatedVideo(videoId)
        })
        this.$nuxt.$on('updateRelated', items => {
            this.related_items = items
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
                    this.search_items = this.search_items.concat(result.data.items)
                }
                else {
                    this.search_items = result.data.items
                }
            })

            // this.keyword = ''
        },

        onScroll: function(e){
            // if ((e.target.scrollTop + e.target.offsetHeight) >= e.target.scrollHeight) {
            //     this.search_video('next')
            // }
        },

        addId: function(videoId){
            this.$nuxt.$emit('id_play', videoId)
        },
        unshiftId: function(videoId){
            this.$nuxt.$emit('unshift_id_play', videoId)
        },
        getRelatedVideo: function(videoId){
            var params = this.searchParam;

            delete params.q

            params.relatedToVideoId = videoId

            this.$axios.get('https://www.googleapis.com/youtube/v3/search', {params:params})
            .then(result => {
                // this.searchParam.nextPageToken = result.data.nextPageToken
                this.related_items = result.data.items
                this.room.send({event:'playerCtrl', action: 'addRelated', datas:{relatedItems:this.related_items}})

            })

        },

    },

}
</script>