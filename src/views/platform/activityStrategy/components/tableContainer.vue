<template>
  <div>
    <Tabel id="el-tabs" :width="200" :columns="columns" :is_height="280" :table-data="tableData" :page-index="queryForm" @handleCurrent="handleCurrent">
      <slot slot="handleState" name="handleState" />
    </Tabel>
    <Pagination :total="total" :hide-page="true" @pagination="pagination" @handleSizeChange="handleSizeChange" />
  </div>
</template>

<script>
import Tabel from '@/components/Table';
import Pagination from '@/components/Pagination';
export default {
  components: {
    Tabel,
    Pagination
  },
  props: {
    columns: {
      type: Array,
      default: () => []
    },
    tableData: {
      type: Array,
      default: () => []
    },
    total: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      queryForm: {
        size: 50,
        current: 1
      },
    };
  },
  mounted() {
    // this.query();
  },
  methods: {
    // 选中行
    handleCurrent() {},
    // 分页
    pagination({ page: current, limit: size }) {
      this.queryForm.current = current;
      this.query();
    },
    handleSizeChange({ page: current, limit: size }) {
      this.queryForm.size = size;
      this.query();
    },
  }
};
</script>

<style scoped lang="less">
</style>
