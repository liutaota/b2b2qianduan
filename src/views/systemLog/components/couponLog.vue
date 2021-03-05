<template>
  <div style="margin: 0 10px">
    <!-- 优惠券日志列表 -->
    <Tabel
      :table-data="couponLogList"
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
  name: 'CouponLog',
  components: {
    Tabel, Pagination
  },
  data() {
    return {
      loading: true,
      // 优惠券日志表格
      columns: [
        {
          prop: 'memberId',
          label: '客户id',
        },
        {
          prop: 'couponId',
          label: '优惠券id',
        },
        {
          prop: 'couponCode',
          label: '优惠券码',
        },
        {
          prop: 'orderNo',
          label: '订单号',
        },
        {
          prop: 'orderAmount',
          label: '原订单金额',
          formatter: 'nummatter',
        },
        {
          prop: 'couponAmount',
          label: '优惠金额',
          formatter: 'nummatter',
        },
        {
          prop: 'orderFinalAmount',
          label: '抵扣优惠后订单金额',
          formatter: 'nummatter',
        },
        {
          prop: 'createTime',
          label: '创建时间',
        },
        {
          prop: 'status',
          label: '日志状态',
        },
        {
          prop: 'orderId',
          label: '订单id',
        },
        {
          prop: 'giftNum',
          label: '赠送数量',
        },
      ],
      couponLogList: [],
      // 搜索数据
      TotalList: {
        current: 1,
        size: 50,
      },
      total:0
    };
  },
  mounted() {
    this.query();
  },
  methods: {
    query() {
      this.loading = true;
      this.$http.get('coupon/getCouponLogList', {
        params: {
          ...this.TotalList
        }
      }).then(res => {
        res.records.map(s => {
          s.status = s.status === 1 ? '已使用' : '未使用';
        });
        this.couponLogList = res.records;
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
