<!-- 实现音乐同步播放的代码 -->
<!-- 本质上是通过获取当前时间戳，获取当前房间播放的音乐的进度，然后同步各用户的音乐播放进度 -->
<template>
	<div class="music">
		<audio v-if="music_src" ref="music" :src="music_src" autoplay @timeupdate="updateTime"></audio>
	</div>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
  data() {
    return {
      time: null,
      isPlay: false,
    };
  },
  computed: {
    ...mapState(["music_src", "music_start_time"]),
  },
  watch: {
    music_start_time(n) {
      this.time = n;
      this.specifiedTime(n);
    },
  },
  mounted() {
    document.addEventListener("touchstart", this.handlerTouchPlay, false);
  },
  methods: {
    ...mapMutations(["setCurrenMusicTime"]),
    play() {
      this.$refs.music.play();
    },
    pause() {
      this.$refs.music.pause();
    },
    specifiedTime(currentTime) {
      this.$nextTick(() => {
        if (this.$refs.music?.fastSeek) {
          this.$refs.music.fastSeek(currentTime);
        } else {
          this.$refs.music.currentTime = currentTime;
          this.$refs.music.play();
        }
      });
    },
    /* 拿到当前时间，取出当前歌词 */
    updateTime(e) {
      this.setCurrenMusicTime(e.target.currentTime);
    },

    /* 部分设备不支持自动播放，让其他点击屏幕到加载了歌曲播放为止 */
    handlerTouchPlay() {
      if (!this.isPlay && this.time && this.$refs.music) {
        this.$refs.music.currentTime = this.time;
        this.$refs.music.play();
        this.isPlay = true;
        document.removeEventListener("touchstart", this.handlerTouchPlay);
      }
    },
  },
};
</script>
