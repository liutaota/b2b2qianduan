<template>
  <div :style="'width:100%;height:100%;position: absolute;background:' + errGif.color">
    <div class="errPage-container">
      <el-button icon="el-icon-arrow-left" class="pan-back-btn" @click="back">返回</el-button>
      <el-row>
        <el-col :span="errGif.col">
          <h1 class="text-jumbo text-ginormous">Oops!</h1>
          <h2>页面正在开发当中</h2>
          <h6>如有不满请联系你领导</h6>
          <ul class="list-unstyled">
            <li>或者你可以去:</li>
            <li class="link-type">
              <router-link to="/">回首页</router-link>
            </li>
          </ul>
        </el-col>
        <el-col :span="12">
          <img :src="errGif.pic" height="428" alt="Girl has dropped her ice cream.">
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import errGif from '@/assets/401_images/401.gif';
const list = [
  { pic: errGif, col: 12, color: '' },
  {
    pic: 'https://wpimg.wallstcn.com/0e03b7da-db9e-4819-ba10-9016ddfdaed3',
    col: 7,
    color: '#e3e3e3',
  },
];
export default {
  name: 'UnderConstruction',
  data() {
    return {
      errGif: list[Math.random() > 0.5 ? 0 : 1],
      dialogVisible: false,
    };
  },
  methods: {
    back() {
      if (this.$route.query.noGoBack) {
        this.$router.push({ path: '/dashboard' });
      } else {
        this.$router.go(-1);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.errPage-container {
  width: 800px;
  max-width: 100%;
  margin: 30px auto;
  .pan-back-btn {
    background: #008489;
    color: #fff;
    border: none !important;
  }
  .pan-gif {
    margin: 0 auto;
    display: block;
  }
  .pan-img {
    display: block;
    margin: 0 auto;
    width: 100%;
  }
  .text-jumbo {
    font-size: 60px;
    font-weight: 700;
    color: #484848;
  }
  .list-unstyled {
    font-size: 14px;
    li {
      padding-bottom: 5px;
    }
    a {
      color: #008489;
      text-decoration: none;
      &:hover {
        text-decoration: underline;
      }
    }
  }
}
</style>
