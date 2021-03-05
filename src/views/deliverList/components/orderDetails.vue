<template>
  <div style="margin: 0 10px">
    <!-- 未结算列表显示 -->
    <h2>未结算订单</h2>
    <Tabel
      :columns="columns"
      :table-data="orderList"
      :loading="loading"
      :is_height="250"
      :page-index="queryForm"
    />
    <!-- 已结算列表显示 -->
    <h2>已结算订单</h2>
    <Tabel
      :columns="columns"
      :table-data="settledList"
      :loading="settledLoading"
      :page-index="queryForm"
      :is_height="250"
    />
    <!-- 分页器 -->
    <pagination
      :total="total"
      @pagination="orderPagination"
      @handleSizeChange="handleSizeChange"
    />
  </div>
</template>

<script>
import Tabel from "@/components/Table";
// 引入分页组件
import pagination from '@/components/Pagination';
export default {
  components: {
    Tabel, pagination
  },
  data() {
    return {
      activeName: "",
      orderDetails: {},
      loading: true,
      //   商品清单
      // 订单类别
      orderList: [],
      queryForm: {
        size: 50,
        current: 1,
        memberPhone: null,
        memberId: null,
        memberName: ""
      },
      settledList: [],
      settledLoading: false,
      total: 0,
      // 表格显示数据
      columns: [
        {
          prop: "customid",
          label: "客户id"
        },
        {
          prop: "customname",
          label: "客户",
          width: 300
        },
        {
          prop: "tranposname",
          label: "线路"
        },
        {
          prop: "transortno",
          label: "线序"
        },
        {
          prop: "payTotaline",
          label: "订单金额",
          width: 120,
          formatter: "nummatter"
        }
      ]
    };
  },
  created() {
    this.id = this.$route.query.id;
    this.query();
    this.getAdminTmpOrderRecDocList();
  },
  methods: {
    query() {
      const { id } = this.$route.query;
      this.loading = true;
      // 未结算
      this.$http
        .get("order/getErpOrderInfoByMemberId", {
          params: {
            erpUserId: id
          }
        })
        .then(res => {
          this.orderList = res;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    getAdminTmpOrderRecDocList() {
      const { id } = this.$route.query;
      this.settledLoading = true;
      // 已结算
      this.$http
        .get("stateMent/getAdminTmpOrderRecDocList", {
          params: {
            erpUserId: id,
            ...this.queryForm
          }
        })
        .then(res => {
          this.total = res.total;
          this.settledList = res.records;
        })
        .finally(() => {
          this.settledLoading = false;
        });
    },
     // 分页事件
    orderPagination({ page: current, limit: size }) {
      this.queryForm.current = current;
      this.getAdminTmpOrderRecDocList();
    },
    handleSizeChange({ page: current, limit: size }) {
      this.queryForm.size = size;
      this.getAdminTmpOrderRecDocList();
    },
    invoiceClick() {
      window.open(this.invoiceAddress, "_blank");
    },
    // 发票信息
    async getOrderInfoFPInfo() {
      const data = await this.$http.get("pcOrderInfo/getOrderInfoFPInfo", {
        params: { orderId: this.id }
      });
      if (data && this.orderDetails.fpStatus === "ON") {
        this.$http
          .get("pcOrderInfo/getErpKpAddressInfo", {
            params: { orderId: this.id }
          })
          .then(res => {
            this.isInvoice = true;
            this.invoiceAddress = res.address;
          });
      }
    },
    setStaet(item, stateArr) {
      let state = null;
      stateArr.forEach(e => {
        if (item === e.val) {
          state = e.desc;
          return;
        }
      });
      return state;
    },
    // 收款单
    getRecDocVoByOrderId() {
      this.$http
        .get("order/getRecDocVoByOrderId", {
          params: {
            orderId: this.id
          }
        })
        .then(res => {
          this.billList = res.map(item => {
            // 判断订单状态
            item.status = this.setStaet(item.status, this.statusFilter);
            // 结算方式
            item.recType = this.setStaet(item.recType, this.payMethod);
            // 订单来源
            item.recMethod = this.setStaet(item.recMethod, this.recMethod);
            return item;
          });
        });
    },
    // 订单日志
    getOrderLogListPage() {
      this.$http
        .get("order/getOrderLogList", {
          params: {
            orderId: this.id
          }
        })
        .then(res => {
          this.infoList = res.map(item => {
            // 判断订单状态
            item.orderStatus = this.setStaet(item.orderStatus, this.orderState);

            return item;
          });
        });
    },
    handleClick(tab, event) {
      switch (this.activeName) {
        case "2":
          this.getRecDocVoByOrderId();
          break;
        case "3":
          this.getOrderLogListPage();
          break;
      }
    },
    // 金额计算
    nummatter(money) {
      return money ? "￥" + money : "";
    }
  }
};
</script>

<style scoped lang="less">
.orderTitle {
  font-weight: 600;
  font-size: 14px;
}
.details {
  border-top: 1px solid #ccc;
  padding: 10px 0;
  ul {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
    flex-wrap: wrap;
    width: 100%;
    li {
      flex: 1;
      width: 550px;
      min-width: 25%;
      max-width: 25%;
      span {
        display: block;
        padding: 6px 0;
        font-size: 12px;
      }
    }
  }
}
</style>
