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
            <div class="video-body col-12 col-sm-12 col-md-9 col-lg-9 table-cell">
                <div class="row">
                    <div class="col-12">
                        <div class="youtube-movie">
                            <vue-plyr>
                                <div class="plyr__video-embed">
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
                                    <font-awesome-icon class="forward" icon="forward"/>
                                </div>
                            </vue-plyr> 
                        </div>
                    </div>
                    <div class="col-12">
                        <div class="icon py-2 float-right pr-1">
                            {{ 100000 }} <font-awesome-icon class="icon" icon="user" />
                        </div>
                    </div>
                </div>
            </div>
            <div class="comment-body col-0 col-sm-0 col-md-3 col-lg-3 table-cell">
                <div class="row">
                    <div class="col-12 comment-titile text-center pt-1" style="background-color: #920000; color: #FFFFFF;">
                        <h5>chat</h5>
                    </div>
                    <div class="comment-text col-12">
                        <div v-for="(n, i) in 100">
                            guest_test{{ i }}: text{{ i }}<br>
                        </div>
                    </div>
                    <div class="col-12 comment-input input-group">
                        <input type="text" maxlength="300" class="form-control" v-model="comments">
                        <span class="input-group-append">
                            <button type="button" class="btn">
                                <font-awesome-icon class="mb-1" :class="{'icon-primary': comments }" icon="paper-plane"/>
                            </button>
                        </span>
                    </div>
                </div>
            </div>
        </div>
        <div class="row queue-body">
            <div class="col-12">
                <div style="background-color:black;padding:20px;">
                    <h3 style="color:white">Video queue</h3>
                    <ul class="queue-list">
                        <draggable :options="options" v-model="queue_ids" @end="queueDragEnd">
                            <li v-for="(queue_id, index) in queue_ids">
                                <button @click="deleteQueue(index)" class="btn btn-danger queue_delete">✗</button>
                                <img :src="imgUrl + queue_id + '/mqdefault.jpg'" @click="selectQueue(index)" alt="">
                            </li>    
                        </draggable> 
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<style src="./player-comp.css" scoped></style>
<script src="./player-comp.js"></script>