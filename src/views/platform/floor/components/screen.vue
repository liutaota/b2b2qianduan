<template>
  <!-- 筛选 -->
  <el-row>
    <el-col :span="24">
      <div class="row-col" style="margin-top: 10px;font-size:12px" @keyup.enter="query(queryForm)">
        <el-input
          v-model.number.trim="queryForm.title"
          placeholder="请输入楼层名称"
          style="width:145px;margin-right: 10px"
          clearablex
          size="small"
        />
        <el-button type="primary" icon="el-icon-search" @click="query(queryForm)">搜索</el-button>
      </div>
    </el-col>
  </el-row>
</template>

<script>
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
        if (val.apName === '') {
          this.query();
        }
      },
      deep: true
    }
  },
  methods: {
    query(queryForm) {
      this.$emit('query', queryForm);
    },
  }
};
</script>

<style scoped>
  .el-button{
    font-size: 12px;
  }
</style>
