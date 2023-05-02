<template>
  <div class="login">
    <div class="login-container">
      <div class="logo">
        <img src="../assets/logo.gif" />
        <span class="logo-name">在线音乐聊天室</span>
      </div>

      <div class="form">
        <el-form ref="registerForm" :model="form" :rules="rules">
          <el-form-item prop="user_name">
            <el-input v-model="form.user_name" clearable placeholder="您的账号" size="medium"></el-input>
          </el-form-item>
          <el-form-item prop="user_nick">
            <el-input v-model="form.user_nick" clearable placeholder="您的昵称" size="medium"></el-input>
          </el-form-item>
          <el-form-item prop="user_email">
            <el-input v-model="form.user_email" clearable placeholder="您的邮箱" size="medium"></el-input>
          </el-form-item>
          <el-form-item prop="user_password">
            <el-input v-model="form.user_password" clearable show-password placeholder="您的账户密码" size="medium"
              @keyup.native.enter="register"></el-input>
          </el-form-item>
        </el-form>
        <div class="tag-group" style="margin:10px">
          <!-- <span class="tag-group__title">Plain</span> -->
          <el-tag style="margin-left:10px" v-for="item in singer_items" :key="item.index" :type="item.type" size="mini"
            @click="tagClick(item.index, 'singer')" :effect="item.effect == 0 ? 'plain' : 'dark'">
            {{ item.label }}
          </el-tag>

          <el-tag style="margin-left:10px" v-for="item in music_items" :key="item.index+20" :type="item.type" size="mini"
            @click="tagClick(item.index, 'music')" :effect="item.effect == 0 ? 'plain' : 'dark'">
            {{ item.label }}
          </el-tag>
        </div>

      </div>

      <el-button style="width: 100%" type="primary" size="medium" @click="register">注册并登录聊天室</el-button>
      <div class="links">
        <a @click="$router.push('/login')">已有账号去登录</a>
      </div>
    </div>
  </div>
</template>

<script>
import { register, login } from "@/api/user";
const singers = ['周杰伦', '孙燕姿', '许嵩', '林俊杰', '华晨宇', '薛之谦', '蔡健雅', '林宥嘉', '林俊杰', 'beyonce', '莫扎特', '周深', '蔡依林', '张学友', 'eason', '张惠妹', '蔡依林', '朴树', '潘玮柏', '邓丽君', '张学友', '刘德华', '黎明', '郭富城', '梅艳芳', '陈慧娴', '林忆莲', '陈奕迅', '杨丞琳', '金海心', '庾澄庆', '林子祥', '罗大佑', '张宇'];
const musics = ["华语流行", "流行歌曲", "摇滚", "经典老歌", "民谣", "电子舞曲", "古典音乐", "爵士乐", "交响音乐", "古筝", "rap", "钢琴曲", "古典音乐", "爵士乐", "电子音乐", "欧美音乐", "摇滚乐", "民谣", "纯音乐", "r&b"];
const randomsinger = [];
const randomusic = [];
// 随机选择八个内容
for (let i = 0; i < 10; i++) {
  const index = Math.floor(Math.random() * singers.length);
  const singer = singers.splice(index, 1)[0];
  randomsinger.push(singer);

  const music_index = Math.floor(Math.random() * musics.length);
  const music = musics.splice(music_index, 1)[0];
  randomusic.push(music);

}
const tag_type = ['', 'info', 'success', 'danger', 'warning']
let singer_items = []
let music_items = []
// [
//           { type: '', label: '标签一',index:0,effect:0 },
//           { type: 'success', label: '标签二',index:1 ,effect:0},
//           { type: 'info', label: '标签三' ,index:2,effect:0},
//           { type: 'danger', label: '标签四' ,index:3,effect:0},
//           { type: 'warning', label: '标签五',index:4 ,effect:0}
//         ],
//每个内容有10个


export default {
  components: {},
  data() {
    return {
      singer_items: [],
      music_items: [],
      form: {
        user_name: null,
        user_nick: null,
        user_email: null,
        user_password: null,
        user_password2: null,
      },
      rules: {
        user_name: [
          { required: true, message: "请输入您的账号", trigger: "blur" },
          { min: 1, max: 8, message: "长度在1至10个字符", trigger: "blur" },
        ],
        user_nick: [
          { required: true, message: "请输入您的昵称", trigger: "blur" },
          { min: 1, max: 8, message: "长度在1到8个字符", trigger: "blur" },
        ],
        user_email: [
          { required: true, message: "请输入您的邮箱", trigger: "blur" },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"],
          },
        ],
        user_password: [
          { required: true, message: "请输入您的账户密码", trigger: "blur" },
          { min: 6, max: 32, message: "长度在6到32个字符", trigger: "blur" },
        ],
      },
    };
  },
  computed: {},
  watch: {},
  created() { },
  mounted() {
    for (let i = 0; i < 10; i++) {
      let tag_index = i % 5
      const obj = {};
      obj.type = tag_type[tag_index];
      obj.label = randomusic[i];
      obj.index = i;
      obj.effect = 0;
      music_items.push(obj)

      const obj2 = {};
      obj2.type = tag_type[tag_index];
      obj2.label = randomsinger[i];
      obj2.index = i;
      obj2.effect = 0;
      singer_items.push(obj2)
      // console.log(obj)
    }
    console.log('mounted')
    console.log(singer_items)
    this.music_items = music_items
    this.singer_items = singer_items
  },
  methods: {
    register() {
      this.$refs.registerForm.validate(async (valid) => {
        if (!valid) return;
        const userTags=[]
        for(let i=0;i<10;i++){
          if(this.music_items[i]['effect']){
            userTags.push(this.music_items[i]['label'])
          }
          if(this.singer_items[i]['effect']){
            userTags.push(this.singer_items[i]['label'])
          }
        }
        // console.log(userTags)
        const user_tags={}
        for(let i=0;i<userTags.length;i++){
          user_tags[userTags[i]]=0
        }
        console.log(user_tags)
        this.form.user_tags=user_tags
        await register(this.form);
        this.$message.success("注册成功，即将登录！");
        setTimeout(async () => {
          const { user_name, user_password } = this.form;
          const { data } = await login({ user_name, user_password });
          const { token } = data;
          localStorage.chat_token = token;
          this.$router.push("/");
          this.$message.success("登录成功!");
        }, 1000);
      });
    },
    //tag标签的逻辑。
    tagClick(index, type) {
      // console.log(index, type)
      if (type == 'music') {
        this.music_items = this.music_items.map((item, idx) => {
          // console.log(idx, index)
          const obj = {};
          obj.type = item.type;
          obj.label = item.label;
          obj.index = item.index;
          if (idx == index) {
            obj.effect = item.effect ? 0 : 1;
          } else {
            obj.effect = item.effect
          }
          // console.log(obj)

          return obj;
        })

      } else {
        this.singer_items = this.singer_items.map((item, idx) => {
          // console.log(idx, index)
          const obj = {};
          obj.type = item.type;
          obj.label = item.label;
          obj.index = item.index;
          if (idx == index) {
            obj.effect = item.effect ? 0 : 1;
          } else {
            obj.effect = item.effect
          }
          // console.log(obj)
          return obj;
        })
      }
      // console.log(index)
    }
  },
};
</script>
<style lang="less" scoped>
@media screen and (max-width: 820px) {
  .login-container {
    margin-top: 50px !important;
  }
}

.login {
  background: url("https://jiangly.com/_nuxt/img/banner_111.a6be22c.gif");
  height: 100%;
  display: flex;
  justify-content: center;

  &-container {
    margin-top: 30px;

    .logo {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin-top: 30px;

      img {
        width: 80px;
        height: 80px;
        border-radius: 8px;
      }

      &-name {
        font-size: 14px;
        color: #fff;
        margin-top: 10px;
      }
    }

    .form {
      margin-top: 50px;
      width: 300px;
    }

    .links {
      display: flex;
      justify-content: flex-end;
      font-size: 12px;
      cursor: pointer;
      color: #fff;
      margin-top: 15px;
    }
  }
}
</style>
