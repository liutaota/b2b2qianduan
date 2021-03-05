<template>
  <div>
    <div class="tabs" style="margin:10px">
      <div class="search-wrap">
        <span class="tabTitle" :class="isArction ===1?'Select':''" @click="isArction = 1">页面设置</span>
        <span class="tabTitle border-right" :class="isArction ===2?'Select':''" @click="isArction = 2">菜单设置</span>
        <!-- 筛选 -->
      </div>
    </div>
    <!-- 页面设置 -->
    <div v-show="isArction === 1">
      <pageSetup />
    </div>
    <!-- 菜单 -->
    <div v-show="isArction === 2">
      <menus />
    </div>
  </div>
</template>

<script>
const pageSetup = () => import('./components/page/pageSetup');
const menus = () => import('./components/menuEdit/menu.vue');
export default {
  components: {
    pageSetup, menus
  },
  data() {
    return {
      isArction: 1
    };
  }
};
</script>

<style scoped lang="less">
  // 头部切换
  .tabs{
    margin-top: 15px;
    font-size: 14px;
    padding: 0px 10px;
    padding-left: 0;
    border-bottom: 1px solid #EEF0F4;
    position: relative;
    .tabTitle {
      display: inline-block;
      padding: 10px;
      border: 1px solid #EEF0F4;
      border-right: none;
      z-index: 12;
      margin-bottom: -1px;
      background: #F3F6F9;
      cursor: pointer;
    }
    .border-right{
      border: 1px solid #EEF0F4;
    }
    .Select{
      border-bottom: 1px solid #fff;
      color: #3894FF;
      background: #fff;
    }
  .search{
    display: inline-block;
    position: absolute;
    right: 0;
  }
  .search-wrap{
    position: relative;
  }
  .el-table{
    margin: 0 !important;;
  }
}
</style>
