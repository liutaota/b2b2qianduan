<template>
  <div style="margin: 0 10px">
    <!-- 订单日志列表 -->
    <Tabel
      :table-data="orderLogList"
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
  name: 'OrderLog',
  components: {
    Tabel, Pagination
  },
  data() {
    return {
      loading: true,
      // 订单日志表格
      columns: [
        {
          prop: 'orderId',
          label: '订单id',
        },
        {
          prop: 'order_status',
          label: '订单状态',
        },
        {
          prop: 'createTime',
          label: '创建时间',
        },
        {
          prop: 'userId',
          label: '操作人',
        },
        {
          prop: 'logRole',
          label: '操作角色',
        },
        {
          prop: 'logMsg',
          label: '文字描述',
        },
        {
          prop: 'doneTime',
          label: '完成时间',
        },
        {
          prop: 'toErpNum',
          label: '下发版本',
        },
      ],
      orderLogList: [],
      // 搜索数据
      TotalList: {
        current: 1,
        size: 50,
      },
      // 支付状态
      orderStatus: [
        { val: 'CANCEL', desc: '已取消' },
        { val: 'UNPAID', desc: '未付款' },
        { val: 'TO_ERP', desc: '待下发' },
        { val: 'SEND_ERP', desc: '已下发' },
        { val: 'TO_SEND', desc: '拣货中' },
        { val: 'TO_DELIVERY', desc: '待收货' },
        { val: 'DONE', desc: '已收货' },
        { val: 'APPLY_REFUND', desc: '申请退款' },
        { val: 'SUCCESS_REFUND', desc: '退款成功' },
      ],
      total:0
    };
  },
  mounted() {
    this.query();
  },
  methods: {
    query() {
      this.loading = true;
      this.$http.get('order/getOrderLogListPage', {
        params: {
          ...this.TotalList
        }
      }).then(res => {
        res.records.map((item) => {
          item.order_status = this.setStaet(item.orderStatus, this.orderStatus);
        });
        this.orderLogList = res.records;
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
    // 设置状态
    setStaet(item, stateArr) {
      let state = null;
      stateArr.forEach((e) => {
        if (item === e.val) {
          state = e.desc;
          return;
        }
      });
      return state;
    },
  }
};
</script>

<style scoped>

</style>
