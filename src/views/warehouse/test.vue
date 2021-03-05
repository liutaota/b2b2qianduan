<template>
  <div ref="full_el">
    <p>我是需要全屏的页面</p>
    <full-screen ref="fullBtn" :element="screenEl" @change="fullChangeFun" />
  </div>
</template>

<script>
import FullScreen from './FullScreen';
export default {
  name: 'Index',
  components: { FullScreen },
  data() {
    return {
      screenEl: null
    };
  },
  mounted() {
  // 将需要全屏的页面元素赋值给 screenEl
    this.screenEl = this.$refs.full_el;
  },
  methods: {
    fullChangeFun(val) {
      console.log(val);
      // 切换全屏调用的方法
    }
  }
};
</script>

<style scoped>
</style>
