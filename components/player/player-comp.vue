<template>
    <div class="video">
        <div class="input-group url_play">
            <input class="form-control" type="text" v-model="video_url" v-on:keydown.enter="url_play" placeholder="Video URL">
            <div class="input-group-append">
                <button class="btn btn-success" @click="url_play"><font-awesome-icon icon="plus" /></button>
            </div>
            <div class="input-group-append">
                <button class="btn btn-primary" @click="url_play('force')"><font-awesome-icon icon="play" /></button>
            </div>
            <!-- <button @click="addQueue">addQueue</button> -->
        </div>
        <div class="youtube-movie">
            <vue-plyr>
                <div class="plyr__video-embed">
                    <!-- <transition name="loading">
                        <div v-if="state == 'buffering' || loading" class="loading-wrapper">
                            <div class="loading-txt">読込中....</div>
                        </div>
                    </transition> -->
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
        <!-- <button class="btn btn-info" @click="testplay">Play</button> -->
        <button class="btn btn-info" @click="nextQueue"><font-awesome-icon icon="step-forward" /></button>
        <button class="btn btn-outline-info" @click="getQueue">getQueue</button>
        <button class="btn btn-outline-info" @click="getSampleQueue">getSampleQueue</button>


        <div class="state">
            <ul>
                <li>{{ state }}</li>
                <li>{{ currentTime }}</li>
                <li>{{ currentRate }}</li>
            </ul>
        </div>
        <div style="background-color:black;padding:20px;margin:30px 0">
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
</template>

<style src="./player-comp.css" scoped></style>
<script src="./player-comp.js"></script>