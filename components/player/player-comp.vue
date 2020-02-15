<template>
    <div>
        <div class="row border url-body">
            <div class="col-2">
            </div>
            <div class="col-8">
                <div class="input-group url-play">
                    <input class="form-control url-input" type="text" v-model="video_url" v-on:keydown.enter="url_play" placeholder="Video URL">
                    <div class="input-group-append">
                        <button class="btn btn-url-primary" @click="url_play"><font-awesome-icon icon="plus" /></button>
                    </div>
                    <div class="input-group-append">
                        <button class="btn btn-url-primary" @click="url_play('force')"><font-awesome-icon icon="play" /></button>
                    </div>
                </div>
            </div>
            <div class="col-2">
            </div>
        </div>
        <div class="row player-body">
            <div class="col-1">
            </div>
            <div class="col-12 col-sm-12 col-md-8 col-lg-7">
                <div class="youtube-movie">
                    <vue-plyr>
                        <div class="plyr__video-embed" style="height: 34.8vw;">
                            <youtube
                                ref="youtube"
                                :video-id="queue_ids[0]"
                                :player-vars="playerVars"
                                @ready="ready"
                                @paused="paused"
                                @playing="playing"
                                @buffering="buffering"
                                @ended="ended"
                                @cued="cued"
                                @error="error"
                                width="1920"
                                height="1080"
                            />
                        </div>
                    </vue-plyr> 
                </div>
            </div>
            <div class="col-12 col-sm-12 col-md-4 col-lg-3 queue-body">
                <draggable class="row" element="div" :options="options" v-model="queue_ids" @end="queueDragEnd">
                    <div class="col-4 text-center" v-for="(queue_id, index) in queue_ids">
                        <button @click="deleteQueue(index)" class="btn btn-danger queue_delete">✗</button>
                        <img :src="imgUrl + queue_id + '/mqdefault.jpg'" @click="selectQueue(index)" alt="">
                    </div>
                </draggable> 
            </div>
            <div class="col-1">
            </div>
        </div>
    </div>
</template>

<style src="./player-comp.css" scoped></style>
<script src="./player-comp.js"></script>