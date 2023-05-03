<template>
    <div class="queue">
        <div v-if="!relationUserList.length" class="empty">
            <icon name="choose-music-empty" scale="16" class="icon" />
            <span class="tips">暂时没有发现和你相似的人</span>
        </div>
        <div v-else class="queue-content">
            <el-dialog title="更改房间提醒" :visible.sync="showJoinModal" width="320px" top="35vh" append-to-body>
			<span>是否退出当前房间并加入新的房间？</span>
			<span slot="footer" class="dialog-footer">
				<el-button size="mini" @click="showJoinModal = false">我再想想</el-button>
				<el-button type="primary" size="mini" @click="handlerConfirm">确认加入</el-button>
			</span>
		</el-dialog>
            <div class="online">
		<div v-for="(item, index) in relationUserList" :key="index" :class="['online-item', { current: mine(item.id) }]"	@click="handlerJoinRoom(item.user_room_id)">
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
                    <el-tag style="margin-left:10px" v-for="(item,idx) in item.user_tags" :key="idx"  size="mini"
            @click="tagClick(item, 'singer')" :effect="0 == 0 ? 'plain' : 'dark'">
            {{ idx }}
          </el-tag>
				</div>
			</div>
		</div>
        
	</div>
        </div>
    </div>
</template>
<script>
import { getRelationUser } from "@/api/user";
import { mapGetters, mapMutations } from "vuex";
export default {
    data() {
        return {
            relationUserList: [],
            showJoinModal: false,
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
        ...mapGetters(["room_admin_id", "on_line_user_list", "mine_id","room_list", "room_id", "mine_room_id"]),
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
        // this.queryCollectMusic();
    },
    mounted() {
        console.log('relation create')
        this.getRelationList()
     },
  methods: {
    ...mapMutations(["setRoomId"]),
    async getRelationList() {
        console.log(this.mine_id)
        const res = await getRelationUser({user_id:this.mine_id});
        console.log(res)
        this.relationUserList=res.data.data
    },
    handlerJoinRoom(room_id) {
    //   const { room_id, room_need_password } = room;
    console.log(room_id)
    if(!room_id){
        return this.$message.warning("该用户还没有创建房间");
    }
      if (Number(room_id) === Number(this.room_id)) {
        return this.$message.warning("已经在当前房间了");
      }
    //   if (room_need_password === 2) {
    //     return this.$message.warning("当前房间已加密，禁止加入房间！");
    //     // TODO 密码房间输入密码进入
    //     // this.showJoinModal = false
    //     // this.showPasswordModal = true
    //   }
      this.activeRoomId = Number(room_id);
      this.showJoinModal = true;
    //   this.handlerConfirm()
    },

    /* 确定加入其他房间 */
    handlerConfirm() {
      this.$message.info("房间跳转稍等！");
      this.setRoomId(Number(this.activeRoomId));
      this.$emit("close");
    },

    /* 加入密码房间 */
    handlerJoinPasswordRoom() {},

    /* 没有房间的时候运行创建一个房间 */
    async createRoom(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (!valid) return;
        const { success } = await createRoom(this.ruleform);
        success && this.$emit("create-success");
      });
    },

    handleAvatarSuccess(res, file) {
      this.ruleform.room_logo = res.data[0].url;
      this.preImage = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 1;
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 1MB!");
      }
      return isLt2M;
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
