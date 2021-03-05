<template>
  <div style="margin: 0 10px">
    <!-- 客户日志列表 -->
    <Screen @query="query" @reset="query" />
    <Tabel
      :table-data="memberLogList"
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
import Screen from './screen';
export default {
  name: 'MemberLog',
  components: {
    Tabel, Pagination, Screen
  },
  data() {
    return {
      loading: true,
      // 客户日志表格
      columns: [
        {
          prop: 'memberId',
          label: '客户id',
        },
        {
          prop: 'createTime',
          label: '创建时间',
        },
        {
          prop: 'ip',
          label: '登录地址',
        },
        {
          prop: 'metaData',
          label: '操作信息',
        },
      ],
      memberLogList: [],
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
    query(from) {
      if (from) {
        this.TotalList = from;
      }
      this.loading = true;
      this.$http.get('member/getMemberLogList', {
        params: {
          ...this.TotalList
        }
      }).then(res => {
        this.memberLogList = res.records;
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
