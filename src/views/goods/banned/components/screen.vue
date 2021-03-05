<template>
  <!-- 筛选 -->
  <el-row>
    <el-col :span="24">
      <div class="row-col" style="margin-top: 10px;font-size:12px" @keyup.enter="query(queryForm)">
        <el-input
          v-model.trim="queryForm.customsetname"
          placeholder="请输入客户集合名称"
          style="width:155px;margin-right: 10px"
          clearablex
          size="small"
        />
        <el-input
          v-model.trim.number="queryForm.customsetid"
          placeholder="请输入客户集合ID"
          style="width:155px;margin-right: 10px"
          clearablex
          size="small"
        />
        <el-input
          v-model.trim="queryForm.goodssetname"
          placeholder="请输入货品集合名称"
          style="width:155px;margin-right: 10px"
          clearablex
          size="small"
        />
        <el-input
          v-model.trim.number="queryForm.goodssetid"
          placeholder="请输入货品集合ID"
          style="width:155px;margin-right: 10px"
          clearablex
          size="small"
        />
        <el-select v-model.trim="queryForm.forbidflag" size="small" placeholder="请选择禁销类型" style="width:145px;margin-right: 10px">
          <el-option label="全部" value=" " />
          <el-option label="禁销" value="1" />
          <el-option label="限销" value="2" />
        </el-select>
        <el-select v-model.trim="queryForm.usestatus" size="small" placeholder="请选择状态" style="width:145px;margin-right: 10px">
          <el-option label="全部" value=" " />
          <el-option label="正常" value="1" />
          <el-option label="作废" value="0" />
        </el-select>
        <el-button type="primary" icon="el-icon-search" @click="query()">搜索</el-button>
        <el-button type="info" @click="reset">重置</el-button>
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
        customsetid: '',
        goodssetid: '',
        forbidflag: '',
        usestatus: '',
        customsetname: '',
        goodssetname: ''
      },
    };
  },
  watch: {
    queryForm: {
      handler: function(val) {
        if (val.customsetid === '' && val.goodssetid === '' && val.customsetname === '' && val.goodssetname === '') {
          this.query();
        }
      },
      deep: true
    }
  },
  methods: {
    query() {
      this.$emit('query', this.queryForm);
    },
    // 重置
    reset() {
      this.queryForm = {
        size: 50,
        current: 1,
      };
      console.log(this.queryForm);
      this.query();
    },
  }
};
</script>

<style scoped>
  .el-button{
    font-size: 12px;
  }
</style>
