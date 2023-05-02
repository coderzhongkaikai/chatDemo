<template>
    <div class="queue">
        <div v-if="!on_line_user_list.length" class="empty">
            <icon name="choose-music-empty" scale="16" class="icon" />
            <span class="tips">暂时没有发现和你相似的人</span>
        </div>
        <div v-else class="queue-content">
            <div class="online">
		<div v-for="(item, index) in on_line_user_list" :key="index" :class="['online-item', { current: mine(item.id) }]">
			<img class="online-item-avatar" :src="item && item.user_avatar" />
			<div class="online-item-info">
				<div class="online-item-info-name">
					<span>{{ item.user_nick }}</span>
					<span
						v-if="item.id === room_admin_id || item.user_role === 'admin'"
						class="role"
						:style="{
              backgroundColor: roleBgColor(item.user_role === 'admin' ? 2 : 1),
            }"
					>
						{{ item.user_role === "admin" ? "超级管理员" : "房主" }}
					</span>
				</div>
        <div class="online-item-info-desc s-1-line">
					{{ item.user_sign }}
				</div>
				<div class="online-item-info-desc s-1-line">
          <el-tag style="margin-left:10px" v-for="item in tag_items" :key="item.index" :type="item.type" size="mini"
            @click="tagClick(item.index, 'singer')" :effect="item.effect == 0 ? 'plain' : 'dark'">
            {{ item.label }}
          </el-tag>
				</div>
			</div>
		</div>
        
	</div>
        </div>
    </div>
</template>

<script>
import { collectList, removeCollect } from "@/api/music";
import { mapGetters } from "vuex";
export default {
    data() {
        return {
            musicList: ['11'],
            tag_items: [
          { type: '', label: '标签一',index:0,effect:0 },
          { type: 'success', label: '标签二',index:1 ,effect:0},
          { type: 'info', label: '标签三' ,index:2,effect:0},
          { type: 'danger', label: '标签四' ,index:3,effect:0},
          { type: 'warning', label: '标签五',index:4 ,effect:0}
        ]
        };
    },
    computed: {
        //computed里面全是
        ...mapGetters(["room_admin_id", "on_line_user_list", "mine_id"]),
        roleBgColor() {
        return (type) => {
            const map = { 1: "#701ec9", 2: "#000" };
            return map[type];
        };
        },
        mine() {
        return (id) => this.mine_id === id;
        },
    },
    watch: {},
    created() {
        this.queryCollectMusic();
    },
    mounted() { },
    methods: {
        async queryCollectMusic() {
            const res = await collectList();
            this.musicList = res.data;
        },
        chooseMusic(val) {
            this.$socket.client.emit("chooseMusic", val);
        },
        async removeMusic(item) {
            const { music_mid } = item;
            if (!music_mid) return;
            await removeCollect({ music_mid });
            this.$message.success("移除收藏音乐成功...");
            this.queryCollectMusic();
        },
        tips() {
            this.$toast.info("正在加班加点开发ing");
        },
    },
};
</script>
<style lang="less" scoped>
.queue {
    padding: 10px 15px;
    .empty {
        margin-top: 30px;
        padding: 25px 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .icon {
            margin-bottom: 20px;
        }
        .tips {
            user-select: none;
            color: @message-main-text-color;
        }
    }

    &-content {
        height: 338px;
        overflow: hidden;
        overflow-y: auto;

        .music {
            display: flex;
            align-items: center;
            border-top: 1px solid @message-border-color;
            padding: 10px 0;

            &-pic {
                width: 40px;
                height: 40px;
                border-radius: 10px;
            }

            &-info {
                display: flex;
                flex-direction: column;
                justify-content: flex-start;
                margin-left: 8px;
                flex: 1;
                width: 0;

                &-name {
                    font-size: 14px;
                    color: @message-main-text-color;
                }

                &-desc {
                    font-size: 12px;
                }
            }

            &-btn {
                user-select: none;
                padding: 5px 10px;
                margin: 0 2px;
                border-radius: 5px;
                cursor: pointer;
                color: @message-main-text-color;

                .icon {
                    margin-right: 3px;
                }

                &:hover {
                    background: message-hover-bg-color;
                }

                &:active {
                    filter: brightness(1.2);
                    color: #000;
                }
            }
        }
    }
}
.online {
  display: flex;
  flex-direction: column;
  height: 440px;
  overflow: hidden;
  overflow-y: auto;
  &-item {
    cursor: pointer;
    padding: 10px;
    display: flex;
    align-items: center;
    border-top: 1px solid @message-border-color;
    transition: all 0.3s;
    border-left: 3px solid transparent;
    border-right: 3px solid transparent;
    padding-left: 8px;
    position: relative;
    &:hover {
      border-left: 3px solid #1295dd;
    }
    &-avatar {
      width: 50px;
      height: 50px;
      border-radius: 5px;
      margin-right: 10px;
    }
    &-info {
      display: flex;
      flex-direction: column;
      flex: 1;
      width: 0;
      &-name {
        font-size: 14px;
        color: @message-main-text-color;
        font-weight: 500;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .role {
          background-color: #ccc;
          font-size: 12px;
          color: #fff;
          padding: 1px 3px;
          margin-right: 3px;
          border-radius: 3px;
        }
      }
      &-desc {
        font-size: 12px;
        margin-top: 8px;
        color: #aaa;
        text-align: left;
      }
    }
  }
}
.current {
  border-right-color: #521cd373;
}
</style>
