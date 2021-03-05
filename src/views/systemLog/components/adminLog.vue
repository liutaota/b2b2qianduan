<template>
  <div style="margin: 0 10px">
    <!-- 用户操作日志列表 -->
    <Tabel
      :table-data="AdminLogList"
      :columns="columns"
      :loading="loading"
      :page-index="TotalList"
      @handleCurrent="handleCurrent"
    />
    <Pagination :total="total" @pagination="totalPagination" @handleSizeChange="handleSizeChange" />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination';
import Tabel from '@/components/Table';
export default {
  name: 'AdminLog',
  components: {
    Tabel, Pagination
  },
  data() {
    return {
      loading: true,
      // 用户日志表格
      columns: [
        {
          prop: 'content',
          label: '内容',
        },
        {
          prop: 'createTime',
          label: '创建时间',
        },
        {
          prop: 'userName',
          label: '用户名称',
        },
        {
          prop: 'userId',
          label: '用户id',
        },
        {
          prop: 'ip',
          label: 'ip地址',
        },
        {
          prop: 'url',
          label: '操作地址',
        },
      ],
      AdminLogList: [],
      // 搜索数据
      TotalList: {
        current: 1,
        size: 50,
      },
      total: 0
    };
  },
  mounted() {
    this.query();
  },
  methods: {
    query() {
      this.loading = true;
      this.$http.get('user/getAdminLogList', {
        params: {
          ...this.TotalList
        }
      }).then(res => {
        this.AdminLogList = res.records;
        this.total = res.total;
      }).finally(() => {
        this.loading = false;
      });
    },
    /* toReset() {
      this.TotalList = { size: 50, current: 1 };
      this.query();
    },*/
    // 选中行事件
    handleCurrent(val) {},
    // 分页事件
    totalPagination({ page: current, limit: size }) {
      this.TotalList.current = current;
      this.query();
    },
    handleSizeChange({ page: current, limit: size }) {
      this.TotalList.size = size;
      this.query();
    },
  }
};
</script>

<style scoped>

</style>
