<template>
    <div>
        <loadingComponent :loading="!functionsEnd" :loadTxt="'入室中...'" ></loadingComponent>
        <div class="row border justify-content-center url-body">
            <!-- <div class="col-2">
            </div> -->
            <div class="col-11 col-lg-7 col-xl-5">
                <div class="input-group url-play">
                    <input class="form-control url-input" type="text" v-model="video_url" v-on:keydown.enter="url_play" placeholder="ここにYoutube動画のURLを貼り付けて右のボタンを押してください">
                    <div>
                        <button class="btn btn-url-primary play" @click="url_play('force')"><font-awesome-icon icon="play" /></button>
                    </div>
                    <div>
                        <button class="btn btn-url-primary plus" @click="url_play"><font-awesome-icon icon="plus" /></button>
                    </div>
                </div>
            </div>
            <!-- <div class="col-2">
            </div> -->
        </div>
        <div class="row player-body no-gutters" >
            <div class="col-12 col-sm-12 col-md-12 col-lg-8">
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
                        </div>
                    </vue-plyr> 
                </div>
            </div>
            <div class="col-12 col-sm-12 col-md-12 col-lg-4">
                <div class="queue-body text-center">
                    <p class="queue_desc">サムネイル画像を掴んで移動させたり<br>クリックすると再生の順番を変更できます</p>
                    <draggable class="row queue_imgs" element="div" :options="options" v-model="queue_ids" @end="queueDragEnd">
                        <div class="col-3 col-sm-2 col-md-2 col-lg-4 text-center" v-for="(queue_id, index) in queue_ids">
                            <button @click="deleteQueue(index)" class="queue_delete"><font-awesome-icon icon="times-circle" /></button>
                            <img :src="imgUrl + queue_id + '/mqdefault.jpg'" @click="selectQueue(index)" alt="">
                        </div>
                    </draggable> 
                </div>
            </div>
        </div>
        <transition name="muteModal">
            <div v-if="mute" class="mute-modal" @click="player.unMute();">
                <font-awesome-icon class="mute" icon="volume-mute" />
                <p>ミュート解除</p>
            </div>
        </transition>
    </div>
</template>

<style src="./player-comp.css" scoped></style>
<script src="./player-comp.js"></script>