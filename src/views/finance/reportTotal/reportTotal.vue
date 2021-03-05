<template>
  <div style="margin: 0 10px">
    <Screen v-permission="'ReportTotalScreen'" @query="query" />
    <div>
      <el-button
        type="primary"
        v-permission="'ReportTotalExcel'"
        @click="exportExcel"
        >Excel导出</el-button
      >
    </div>
    <div style="margin: 10px 0">
      <Tabel
        ref="singleTable"
        :columns="columns"
        :table-data="financepData"
        :loading="loading"
        :is_height="500"
        :page-index="queryForm"
        @handleCurrent="handleCurrent"
      >
        <el-table-column slot="handleColumn" label="操作" fixed="right">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              v-permission="'ReportTotalOrderSee'"
              @click="
                orderForm = { ...scope.row };
                orderSeeMask = true;
              "
              >查看</el-button
            >
          </template>
        </el-table-column>
      </Tabel>
      <Pagination
        :total="total"
        @pagination="pagination"
        @handleSizeChange="handleSizeChange"
      />
    </div>
    <!-- 订单查看 -->
    <el-dialog
      :title="'订单查看'"
      :visible.sync="orderSeeMask"
      width="1200px"
      :before-close="orderSeeClose"
      :close-on-click-modal="false"
    >
      <OrderSee :order-form="orderForm" :columns="columns" />
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="orderSeeClose">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
const Pagination = () => import("@/components/Pagination");
const Tabel = () => import("@/components/Table");
const Screen = () => import("./components/screen");
const OrderSee = () => import("./components/orderSee");
import moment from "moment";
import { Loading } from "element-ui";
import { imgHost } from "@/config";
export default {
  name: "ReportTotal",
  components: {
    Tabel,
    Pagination,
    Screen,
    OrderSee
  },
  data() {
    return {
      queryForm: {
        size: 50,
        current: 1,
        startTime: moment()
          .subtract(7, "days")
          .format("YYYY-MM-DD 00:00:00"),
        endTime: moment(new Date()).format("YYYY-MM-DD 23:59:59")
      },
      loading: true,
      total: 1,
      billId: null, // 账单id
      dialogVisible: false, // 核销弹窗控制
      title: "账单", // 弹窗标题
      btnType: "primary", // 按钮样式
      columns: [
        {
          prop: "orderNo",
          label: "订单编号",
          width: 250
        },

        {
          prop: "userName",
          label: "买家名称",
          width: 260
        },
        {
          prop: "erpCustomerId",
          label: "ERPID"
        },
        {
          prop: "goodsAmount",
          label: "应付金额",
          formatter: "nummatter"
        },
        {
          prop: "actuallyMoney",
          label: "实收金额",
          formatter: "nummatter"
        },
        {
          prop: "refundAmount",
          label: "退款金额",
          formatter: "nummatter"
        },
        {
          prop: "couponName",
          label: "优惠券名称",
          width: 120
        },
        {
          prop: "couponLimAmount",
          label: "优惠券限额",
          formatter: "nummatter",
          width: 120
        },
        {
          prop: "couponAmount",
          label: "优惠券金额",
          formatter: "nummatter",
          width: 120
        },
        {
          prop: "pay_method",
          label: "支付方式"
        },
        {
          prop: "createTime",
          label: "费用发生时间",
          width: 180
        }
      ],
      financepData: [], // 收款单列表
      status: [
        { val: "CANCEL", desc: "已取消" },
        { val: "TO_PAY", desc: "待结算" },
        { val: "DONE_PAY", desc: "已结算" }
      ],
      // 支付方式
      payMethod: [
        { val: "CASH", desc: "现结" },
        { val: "MONTH", desc: "月结" },
        { val: "ON_LINE", desc: "在线支付" }
      ],
      orderForm: {},
      orderSeeMask: false
    };
  },
  created() {
    this.query();
  },
  methods: {
    // 关闭订单查看弹窗事件
    orderSeeClose() {
      this.orderSeeMask = false;
      this.orderForm = {};
    },
    query(queryForm) {
      this.loading = true;
      if (queryForm) {
        this.queryForm = queryForm;
      }
      this.$http
        .get("stateMent/getFinancialStatementTotalList", {
          params: { ...this.queryForm }
        })
        .then(res => {
          this.financepData = res.records.map(item => {
            item.pay_method = this.setStaet(item.payMethod, this.payMethod);
            return item;
          });
          //   this.orderForm = financepData[0];
          this.total = res.total;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    //excel导出
    exportExcel() {
      let loadingInstance = Loading.service({ fullscreen: true });
      this.$http
        .get('excel/getFinancialStatementTotalListExcel', { params: this.queryForm })
        .then(res => {
          window.open(`${imgHost + res}`, "_blank");
          loadingInstance.close();
        })
        .catch(() => {
          loadingInstance.close();
        });
    },
    // 选中行
    handleCurrent(row) {
      this.billId = row.id;
    },
    // 更新状态
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
    // 分页
    pagination({ page: current, limit: size }) {
      this.queryForm.current = current;
      this.query();
    },
    handleSizeChange({ page: current, limit: size }) {
      this.queryForm.size = size;
      this.query();
    }
  }
};
</script>

<style scoped lang="less">
.orderBtn {
  float: right;
  margin: 0 10px 10px;
}
// 头部切换
.tabs {
  margin-top: 15px;
  font-size: 14px;
  padding: 0px 10px;
  padding-left: 0;
  border-bottom: 1px solid #eef0f4;
  position: relative;
  .tabTitle {
    display: inline-block;
    padding: 10px;
    border: 1px solid #eef0f4;
    border-right: none;
    z-index: 12;
    margin-bottom: -1px;
    background: #f3f6f9;
    cursor: pointer;
  }
  .border-right {
    border: 1px solid #eef0f4;
  }
  .Select {
    border-bottom: 1px solid #fff;
    color: #3894ff;
    background: #fff;
  }
  .search {
    display: inline-block;
    position: absolute;
    right: 0;
  }
  .search-wrap {
    position: relative;
  }
  .el-table {
    margin: 0 !important;
  }
}
// 订单详细
ul {
  list-style: none;
  margin: 0;
  padding-left: 20px;
  li {
    line-height: 30px;
    span {
      display: inline-block;
      height: 100%;
      &:nth-child(2) {
        width: 400px;
      }
    }
  }
}
</style>
