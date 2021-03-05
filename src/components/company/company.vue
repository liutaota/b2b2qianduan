<template>
  <div>
    <el-table
      :data="tableData"
      highlight-current-row
      style="width: 100%"
      @selection-change="handleSelectionChange"
      ref="multipleTable"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="companyName" align="center" label="公司名称"></el-table-column>
      <el-table-column label="创建时间" prop="createTime"></el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "company",
  props: {
    tableData: Array
  },
  methods: {
    handleSelectionChange(val) {
      this.$emit("handleSelectionChange", val);
    }
  }
};
</script>

<style>
</style>