<template>
  <div class="dashboard-container">
    <!-- <component :is="currentRole" /> -->
    <el-button v-permission="'custimerList'"> test permission </el-button>
    <h2>欢迎登录中天药业--报货平台系统</h2>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: 'Dashboard',
  // components: { adminDashboard },
  data() {
    return {
      currentRole: 'adminDashboard'
    };
  },
  computed: {
    ...mapGetters([
      'roles'
    ])
  },
  created() {
    if (!this.roles.includes('admin')) {
      this.currentRole = 'adminDashboard'; // editorDashboard
    }
  }
};
</script>
<style lang="less">
  .dashboard-container{
    position: relative;
    height: calc(100vh - 85px);
    font-family: 'SourceHanSansCN-Medium', Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,SimSun,sans-serif;
    font-weight: Medium;
    font-size: 30px;
    color: #909399;
    h2 {
      position: absolute;
      width: 100%;
      text-align: center;
      top: 50%;
      transform: translateY(-210%);
    }
  }
</style>
