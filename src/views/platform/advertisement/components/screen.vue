<template>
  <!-- 筛选 -->
  <el-row>
    <el-col :span="24">
      <div class="row-col" style="margin-top: 10px;font-size:12px" @keyup.enter="query(queryForm)">
        <el-input
          v-model.trim="queryForm.advName"
          placeholder="请输入广告位名称"
          style="width:145px;margin-right: 10px"
          clearablex
          size="small"
        />
        <el-select v-model="queryForm.apDisplay" placeholder="请选择活动区域" style="margin-right: 10px">
          <el-option label="顶部广告位" value="TOP_BANNER" />
          <el-option label="轮播广告位" value="CAROUSEL_BANNER" />
          <el-option label="中部单图" value="CENTER_ONLY" />
          <el-option label="中部多图小" value="CENTER_MORE_LITTLE" />
          <el-option label="中部多图大" value="CENTER_MORE_BIG" />
          <el-option label="侧边广告" value="BROADSIDE_BANNER" />
          <el-option label="弹窗广告" value="POPUP_BANNER" />
        </el-select>
        <el-button type="primary" icon="el-icon-search" @click="query(queryForm)">搜索</el-button>
        <el-button type="info" @click="queryForm.advName='';queryForm.apDisplay='';query(queryForm)">重置</el-button>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import { _throttle } from '@/utils/public';
export default {
  name: 'BannedGoodsList',
  data() {
    return {
      queryForm: {
        size: 50,
        current: 1,
        apName: null,
      },
    };
  },
  watch: {
    queryForm: {
      handler: function(val) {
        if (val.advName === '') {
          this.query();
        }
      },
      deep: true
    }
  },
  methods: {
    query: _throttle(function(queryForm) {
      this.$emit('query', queryForm);
    }),
  }
};
</script>

<style scoped>
  .el-button{
    font-size: 12px;
  }
</style>
