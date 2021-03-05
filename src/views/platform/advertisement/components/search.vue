<template>
  <div>
    <el-select v-model="value" placeholder="请选择" class="select" @change="handleJump">
      <el-option label="顶部广告" value="TOP_BANNER" />
      <el-option label="中部广告单图" value="CENTER_ONLY" />
      <el-option label="中部广告多图(小)" value="CENTER_MORE_LITTLE" />
      <el-option label="中部广告多图(大)" value="CENTER_MORE_BIG" />
      <el-option label="轮播广告" value="CAROUSEL_BANNER" />
      <el-option label="侧边广告" value="BROADSIDE_BANNER" />
      <el-option label="弹窗广告" value="POPUP_BANNER" />
    </el-select>
    <span class="btn" @click="handleSubmit"><i class="el-icon-refresh-right" />样式预览</span>
  </div>
</template>

<script>
import { _throttle } from '@/utils/public';
export default {
  data() {
    return {
      input: '',
      value: '',
      imgSize: {
        width: 1180,
        height: 100
      },
      advList: []
    };
  },
  mounted() {
    const index = this.$route.path.split('/');
    const path = index[index.length - 1];
    this.value = path;
  },
  methods: {
    handleSubmit: _throttle(function() {
      this.$emit('handleSubmit');
    }),
    handleJump() {
      // 判断是否传值
      switch (this.value) {
        // 顶部
        case 'TOP_BANNER' :
          this.imgSize = {
            width: 1920,
            height: 80,
          };
          break;
        // 中部广告单图
        case 'CENTER_ONLY' :
          this.imgSize = {
            width: 1180,
            height: 100,
          };
          break;
        // 中部广告多图(小)
        case 'CENTER_MORE_LITTLE' :
          this.imgSize = {
            width: 170,
            height: 100,
          };
          break;
        // 中部广告多图(大)
        case 'CENTER_MORE_BIG' :
          this.imgSize = {
            width: 375,
            height: 218,
          };
          break;
        // 轮播广告
        case 'CAROUSEL_BANNER' :
          this.imgSize = {
            width: 1920,
            height: 520,
          };
          break;
        // 侧边广告
        case 'BROADSIDE_BANNER' :
          this.imgSize = {
            width: null,
            height: null,
          };
          break;
        // 弹窗广告
        case 'POPUP_BANNER' :
          this.imgSize = {
            width: null,
            height: null,
          };
          break;
      }
      const { width, height } = this.imgSize;
      this.$router.push({ path: this.value, query: { width, height }});
      return;
    }
  }
};
</script>

<style scoped>
.select {
    margin: 10px 10px 0 0;
}
.btn{
    color: #409EFF;
    font-size: 14px;
}
</style>
