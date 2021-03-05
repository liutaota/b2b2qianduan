<!-- FullScreen.vue 全屏组件 -->

<template>
  <div>
    <span v-show="!screenShow" class="full_Screen" @click="fullScreen"><a>全屏展示</a></span>
    <span v-show="screenShow" class="full_Screen" @click="fullScreenOut"><a>退出全屏</a></span>
  </div>
</template>

<script>
export default {
  name: 'FullScreen',
  props: {
    element: {},
    isShow: false
  },
  data() {
    return {
      screenShow: false,
      body: null
    };
  },
  watch: {
    screenShow(val) {
      this.$emit('change', val);
    },
    isShow(val) {
      if (val) {
        this.fullScreen();
      }
    }
  },
  created() {
    // 全屏后其他元素会被覆盖 -- 故采用全屏整个body再将需要全屏的页面置顶
    this.body = document.body;
    /* document.onkeydown = function(e) {
        console.log('===========', e)
      }*/
  },
  mounted() {
    window.addEventListener('resize', this.controlFun);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.controlFun);
  },
  methods: {
    controlFun() {
      if (document.body.scrollHeight === window.screen.height && document.body.scrollWidth === window.screen.width) {
        this.screenShow = true;
      } else {
        this.screenShow = false;
      }
    },
    fullScreen() {
      this.element.classList.add('container_full_element');
      const rfs = this.body.requestFullScreen || this.body.webkitRequestFullScreen || this.body.mozRequestFullScreen || this.body.msRequestFullScreen;
      let wscript;
      if (typeof rfs !== 'undefined' && rfs) {
        rfs.call(this.body);
        return;
      }
      if (typeof window.ActiveXObject !== 'undefined') {
        wscript = new ActiveXObject('WScript.Shell');
        if (wscript) {
          wscript.SendKeys('{F11}');
        }
      }
    },
    fullScreenOut() {
      this.element.classList.remove('container_full_element');
      const exitMethod = document.exitFullscreen || // W3C
          document.mozCancelFullScreen || // FireFox
          document.webkitExitFullscreen || // Chrome等
          document.webkitExitFullscreen; // IE11
      if (exitMethod) {
        exitMethod.call(document);
      } else if (typeof window.ActiveXObject !== 'undefined') { // for Internet Explorer
        const wscript = new ActiveXObject('WScript.Shell');
        if (wscript !== null) {
          wscript.SendKeys('{F11}');
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
  .full_Screen {
    z-index: 800;
    position: fixed;
    right: 15px;
    bottom: 10px;
    color: #606266;
    border: 1px solid #c0c4cc;
    background-color: white;
    border-radius: 50px;
    padding: 3px 8px;
  }
</style>
<style lang="scss">
  .container_full_element {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 9999;
  }
</style>
