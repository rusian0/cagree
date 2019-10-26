<style scoped>

.search {
    border: 1px solid #000000;
    margin: 30px 0;
}

.search_result {
    height: 400px;
    overflow-y: scroll;
    border-top: 1px solid rgb(10, 10, 10);
}

.search_result ul{
    padding: 10px 0;
}

.search_result .result_contents {
    margin: 30px 0;
    position: relative;
    display: flex;
    padding: 3px 5px;
}

.search_result .video_title {
    padding: 2px 5px;
    flex: 1;
}

.search_result .video_title p{ 
    font-size: 16px;
    margin: 0;
    /* padding: 5px; */
}

.search_result .result_thumb {
    flex: 1.5;
}

.search_result .result_thumb img{
    width: 100%;
}

.search_result .btn-group {
}

@media screen and (max-width: 1100px) {
    .search_result .result_contents { 
        flex-wrap: wrap;
    }

    .search_result .result_thumb {
        flex: initial;
    }

    .search_result .video_title {
        flex: initial;
    }
}


</style>
<template>
    <div>                  
        <div class="search">
            <div class="input-group">
                <input class="form-control" type="text" v-model="keyword" v-on:keydown.enter="search_video" placeholder="Video Search Keyword">
                <div class="input-group-append">
                    <button class="btn btn-info" @click="search_video"><font-awesome-icon icon="search" /></button>
                </div>
            </div>

            Search Result         
            <div class="search_result" @scroll="onScroll">
                <ul>
                    <li v-for="search_item in search_items" style="list-style:none">
                        <div class="result_contents">
                            <div class="result_thumb">
                                <img :src="search_item.snippet.thumbnails.medium.url">
                            </div>
                            <div class="video_title">
                                <p>{{ search_item.snippet.title }}</p>
                                <button class="btn btn-outline-success btn-sm" @click="addId(search_item.id.videoId)"><font-awesome-icon icon="plus" /></button>
                                <button class="btn btn-outline-primary btn-sm" @click="unshiftId(search_item.id.videoId)"><font-awesome-icon icon="play" /></button>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <div class="search">
            <h2>Related Video</h2>
            <div class="search_result" @scroll="onScroll">
                <ul>
                    <li v-for="related_item in related_items" style="list-style:none">
                        <div class="result_contents">
                            <div class="result_thumb">
                                <img :src="related_item.snippet.thumbnails.medium.url">
                            </div>
                            <div class="video_title">
                                <p>{{ related_item.snippet.title }}</p>
                                <button class="btn btn-outline-success btn-sm" @click="addId(related_item.id.videoId)"><font-awesome-icon icon="plus" /></button>
                                <button class="btn btn-outline-primary btn-sm" @click="unshiftId(related_item.id.videoId)"><font-awesome-icon icon="play" /></button>
                            </div>
                        </div>
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
            search_items:[],
            related_items:[],
            // search_items:searchresult.items,
            // related_items:searchresult.items,
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
            if ((e.target.scrollTop + e.target.offsetHeight) >= e.target.scrollHeight) {
                this.search_video('next')
            }
        },

        addId: function(videoId){
            this.$nuxt.$emit('id_play', videoId)
        },
        unshiftId: function(videoId){
            this.$nuxt.$emit('unshift_id_play', videoId)
            this.getRelatedVideo(videoId)
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
                delete params.relatedToVideoId


            })

        },

    },

}
</script>