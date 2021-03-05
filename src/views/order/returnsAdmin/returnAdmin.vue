<template>
  <div style="margin: 0 10px">
    <div class="tabs">
      <div class="search-wrap">
        <span
          v-permission="'ReturnAdminList'"
          class="tabTitle"
          :class="isArction === 1 ? 'Select' : ''"
          @click="isArction = 1"
          >退货订单</span
        >
        <span
          v-permission="'ReturnAdmReason'"
          class="tabTitle border-right"
          :class="isArction === 2 ? 'Select' : ''"
          @click="isArction = 2"
          >退货原因</span
        >
        <!-- 筛选 -->
      </div>
    </div>
    <!-- 退货订单 -->
    <div v-show="isArction === 1">
      <Screen v-permission="'ReturnAdminLook'" @query="query">
        <div slot="right" style="margin:10px 0">
          <el-button
            v-permission="'ReturnAdminReplay'"
            size="mini"
            :type="current.refund_state === 'erp下发异常' ? 'primary' : 'info'"
            @click="handleIssue(current)"
            >重新下发</el-button
          >
          <el-button
            v-permission="'ReturnAdminUpdate'"
            :type="statusType"
            @click="openState"
            >状态更新</el-button
          >
          <el-button
            v-permission="'ReturnAdminDetails'"
            size="mini"
            type="danger"
            @click="openDetail(current)"
            >详情</el-button
          >
        </div>
      </Screen>
      <!-- 退货订单订单显示 -->
      <el-table
        ref="multipleTable"
        v-loading="loading"
        :data="reasonData"
        style="width: 100%"
        width="100%"
        align="center"
        border
        highlight-current-row
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(255, 255, 255, 0.8)"
        :row-class-name="tableRowClassName"
        :max-height="height"
        :height="height"
        :cell-style="cellStyle"
        @row-click="handleCurrent"
      >
        <el-table-column
          label="序号"
          type="index"
          width="50"
          :index="indexMethod"
        />
        <el-table-column
          label="退货单ID"
          prop="id"
          :formatter="textmatter"
          show-overflow-tooltip
        />
        <el-table-column
          prop="applyNo"
          label="退货单号"
          :formatter="textmatter"
          show-overflow-tooltip
          width="200"
        />
        <el-table-column
          prop="payFlowNo"
          label="支付流水号"
          :formatter="textmatter"
          show-overflow-tooltip
        />
        <el-table-column
          prop="orderId"
          label="原单ID"
          :formatter="textmatter"
          show-overflow-tooltip
        />
        <el-table-column
          prop="orderNo"
          label="原单单号"
          :formatter="textmatter"
          show-overflow-tooltip
          width="200"
        />
        <el-table-column
          prop="createTime"
          label="退单时间"
          :formatter="textmatter"
          show-overflow-tooltip
          width="180"
        />
        <el-table-column
          prop="erpCustomerId"
          label="客户ID"
          :formatter="textmatter"
          show-overflow-tooltip
        />
        <el-table-column
          prop="memberName"
          label="客户"
          :formatter="textmatter"
          show-overflow-tooltip
          width="250"
        />
        <el-table-column
          prop="refundAmount"
          label="退货总金额"
          :formatter="nummatter"
          show-overflow-tooltip
          width="100"
        />
        <el-table-column
          prop="refund_state"
          label="退货单状态"
          :formatter="textmatter"
          show-overflow-tooltip
          width="100"
        />
        <el-table-column
          prop="returnType"
          label="退款方式"
          :formatter="textmatter"
          show-overflow-tooltip
          width="100"
        />
        <el-table-column
          prop="receiveName"
          label="确认收货人"
          :formatter="textmatter"
          show-overflow-tooltip
          width="120"
        />
        <el-table-column
          prop="receiveTime"
          label="收货时间"
          :formatter="textmatter"
          show-overflow-tooltip
          width="180"
        />
        <el-table-column
          prop="receiveMessage"
          label="收货备注"
          :formatter="textmatter"
          show-overflow-tooltip
          width="180"
        />
        <el-table-column
          prop="refundMessage"
          label="erp异常备注"
          :formatter="textmatter"
          show-overflow-tooltip
          width="180"
        />
        <el-table-column
          prop="memberMessage"
          label="退款备注"
          :formatter="textmatter"
          show-overflow-tooltip
          width="200"
        />
        <el-table-column
          prop="reErpRemark"
          label="备注"
          :formatter="textmatter"
          show-overflow-tooltip
          width="200"
        />
        <el-table-column
          prop="userMessage"
          label="审核意见"
          :formatter="textmatter"
          show-overflow-tooltip
          width="200"
        />
        <el-table-column label="操作" fixed="right" width="250">
          <template slot-scope="scope">
            <el-button
              v-permission="'ReturnAdminReplay'"
              size="mini"
              type="primary"
              @click="
                orderForm = { ...scope.row };
                orderSeeMask = true;
              "
              >查看</el-button
            >
            <el-button
              v-permission="'ReturnAdminCheck'"
              :type="scope.row.refund_state === '待审核' ? 'danger' : 'info'"
              @click="openTrial(scope.row)"
              >审核</el-button
            >
            <el-button
              v-permission="'ReturnAdminSureReceive'"
              :type="scope.row.refundState !== 'PENDING' ? 'primary' : 'info'"
              @click="openReceive(scope.row)"
              >确认收货</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <pagination
        :total="returnTotal"
        @pagination="pagination"
        @handleSizeChange="handleSizeChange"
      />
    </div>
    <!-- 退货原因 -->
    <div v-show="isArction === 2" style="margin: 10px 0">
      <keep-alive>
        <Reason v-if="isArction === 2" />
      </keep-alive>
    </div>
    <!-- 退货订单详情 -->
    <keep-alive>
      <Detail
        :dialog-visible="detail"
        :table-data="detailList"
        :titles="title"
        @handleCancel="handleCancel"
      >
        <ul slot="detailed" class="detailed_wrap">
          <li>
            <span>退货备注：</span>
            <span>
              {{ detailList.memberMessage }}
            </span>
          </li>
          <li>
            <span>审核意见：</span>
            <span>
              {{ detailList.userMessage }}
            </span>
          </li>
          <li>
            <span>退单状态：</span>
            <span>
              {{ detailList.refund_state }}
            </span>
          </li>
          <li>
            <span>退款方式：</span>
            <span>
              {{ detailList.returnType }}
            </span>
          </li>
          <li>
            <span>合计：</span>
            <span> ￥{{ detailList.refundAmount }} </span>
          </li>
        </ul>
        <div
          slot="footer"
          class="dialog-footer"
          style="margin: 10px 0;text-align: center"
        >
          <el-button type="primary" @click="handleDetail">关 闭</el-button>
        </div>
      </Detail>
    </keep-alive>
    <!-- 退货审核 -->
    <keep-alive>
      <Detail
        :dialog-visible="trial"
        :table-data="trialList"
        :titles="title"
        @handleEdit="handleTrial"
        @handleCancel="handleCancel"
      >
        <ul slot="detailed" class="detailed_wrap">
          <li style="margin-bottom: 10px">
            <span>退货备注：</span>
            <span>
              {{ trialList.memberMessage }}
            </span>
          </li>
          <li>
            <span>审核意见：</span>
            <span>
              <el-input
                v-model.trim="userMessage"
                type="textarea"
                :rows="5"
                resize="none"
                placeholder="请输入内容"
              />
            </span>
          </li>
        </ul>
      </Detail>
    </keep-alive>
    <!-- 退货状态管理 -->
    <keep-alive>
      <State
        :dialog-visible="updateStatus"
        :table-data="statusList"
        @handleEdit="handleStatus"
        @handleCancel="handleCancel"
      />
    </keep-alive>
    <el-dialog
      title="确认收货"
      :visible.sync="receiveMask"
      width="500px"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <el-form
        ref="receivForm"
        :model="receivForm"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item label="收货备注" prop="receiveMessage">
          <el-input
            v-model="receivForm.receiveMessage"
            type="textarea"
            rows="3"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmReceipt()">确 定</el-button>
        <el-button @click="handleClose">取 消</el-button>
      </span>
    </el-dialog>
    <ReIssue
      :re-erp-mask="reErpMask"
      @handleClose="handleClose"
      @handleReErp="handleReErp"
    />
    <!-- 订单查看 -->
    <el-dialog
      :title="'退货单查看'"
      :visible.sync="orderSeeMask"
      width="1200px"
      :before-close="orderSeeClose"
      :close-on-click-modal="false"
    >
      <OrderSee :order-form="orderForm" />
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="orderSeeClose">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// 引入分页组件
import pagination from "@/components/Pagination";
import ReIssue from "@/components/reIssue/reIssue";
// import Tabel from '@/components/Table';
import Screen from "./components/screen";
import Reason from "./components/returnReason";
import Detail from "./components/returnDetails";
import State from "./components/refundState";
const OrderSee = () => import("./components/orderSee");
// import { _throttle } from '@/utils/public';
export default {
  name: "ReturnAdmin",
  components: {
    pagination,
    // Tabel,
    Screen,
    Reason,
    Detail,
    State,
    ReIssue,
    OrderSee
  },
  data() {
    return {
      queryForm: {
        size: 50,
        current: 1
      },
      reasonData: [],
      returnTotal: 1,
      // 选中行
      current: {},
      // 退货原因表格
      reason: [
        {
          prop: "reasonInfo",
          label: "退货原因"
        },
        {
          prop: "sort",
          label: "排序"
        }
      ],
      btnType: "info",
      isArction: 1,
      loading: false,
      title: "详情",
      // 退货单状态
      refundState: [
        { val: "PENDING", desc: "待审核" },
        { val: "DEAL_WITH", desc: "处理中" },
        { val: "TO_SEND", desc: "待发货" },
        { val: "TO_DELIVERY", desc: "待收货" },
        { val: "UN_DELIVERY", desc: "待验收" },
        { val: "DELIVERY_DONE", desc: "已收货" },
        { val: "DONE", desc: "已完成" },
        { val: "FAIL", desc: "不通过" },
        { val: "ORDER_EXP", desc: "erp下发异常" }
      ],
      returnType: [
        { val: "NO_GOODS", desc: "不用退货" },
        { val: "NEED_GOODS", desc: "需要退货" }
      ],
      // 订单详情数据
      detailList: {},
      height: 300,
      detail: false,
      // 审核数据
      trialList: {},
      trial: false,
      userMessage: "",
      // 更新状态数据
      updateStatus: false,
      statusList: {},
      statusType: "primary",
      isState: true,
      reErpMask: false,
      reErpId: null,
      receiveMask: false,
      receivForm: {
        receiveMessage: ""
      },
      rules: {
        receiveMessage: [
          { required: true, message: "请输入确认收货备注", trigger: "blur" }
        ]
      },
      orderSeeMask: false,
      orderForm: {}
    };
  },
  mounted() {
    this.query();
    // 高度适应
    this.$nextTick(() => {
      this.height = window.innerHeight - 300;
      // 后面的50：根据需求空出的高度，自行调整
    });
    this.wid();
  },
  methods: {
    // 关闭订单查看弹窗事件
    orderSeeClose() {
      this.orderSeeMask = false;
      this.orderForm = {};
    },
    // 根据屏幕大小自适应高度
    wid() {
      window.onresize = () => {
        return (() => {
          this.$nextTick(() => {
            this.height = window.innerHeight - 300;
            // 后面的50：根据需求空出的高度，自行调整
          });
        })();
      };
    },
    openReceive(row) {
      if (row.refundState === "PENDING") {
        this.$message.warning("审核完成才可确认收货");
        return;
      }
      if (row.refundState === "DELIVERY_DONE") {
        this.$message.warning("该订单已收货");
        return;
      }
      this.receivForm.id = row.id;
      this.receiveMask = true;
    },
    // 确认收货
    confirmReceipt() {
      this.$refs["receivForm"].validate(valid => {
        if (valid) {
          this.$http
            .get("order/sureReceive", { params: this.receivForm })
            .then(res => {
              this.$message.success("收货成功");
              this.query();
              this.handleClose();
            });
        }
      });
    },
    // 重新下发
    handleReErp(reErpForm) {
      if (this.reErpLoading) return;
      this.reErpLoading = true;
      reErpForm.id = this.reErpId;
      this.$http
        .get("order/reRefundOrderErp", { params: reErpForm })
        .then(res => {
          this.$message({
            type: "success",
            message: "重新下发成功"
          });
          this.query();
          this.reErpLoading = false;
          this.handleClose();
        })
        .catch(() => {
          this.reErpLoading = false;
          this.handleClose();
        });
    },
    // 取消弹窗
    handleClose() {
      this.reErpMask = false;
      this.reErpId = null;
      if (this.$refs["receivForm"]) {
        this.$refs["receivForm"].resetFields();
        this.receiveMask = false;
        this.receiveMessage = "";
      }
    },
    // 退货订单请求数据
    query(queryForm) {
      if (queryForm) {
        this.queryForm = queryForm;
      }
      this.$http
        .get("order/getRefundReturnList", { params: { ...this.queryForm } })
        .then(res => {
          res.records.map(item => {
            item.returnType = this.setStaet(item.returnType, this.returnType);
            item.refund_state = this.setStaet(
              item.refundState,
              this.refundState
            );
          });
          this.reasonData = res.records;
          this.returnTotal = res.total;
        });
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
    /**
     * 退货订单事件
     */
    // 打开退货详情
    openDetail(row) {
      const {
        id,
        memberMessage,
        userMessage,
        refund_state,
        returnType,
        refundAmount
      } = row;
      if (id === undefined) {
        this.$message.warning("未选中订单");
        return;
      }
      this.title = "详情";
      this.detail = true;
      this.getDetail(id).then(res => {
        res.map(item => {
          // item.sellNum /= item.erpLeastsaleqty;
          // item.sellNum /= 10000;
          item.sellNum = item.sellNum - item.refundNum;
        });
        const detailList = {
          detailData: res,
          memberMessage,
          userMessage,
          refund_state,
          returnType,
          refundAmount
        };
        this.detailList = detailList;
      });
    },
    // 退货详情表关闭
    handleDetail() {
      this.handleCancel();
    },
    // 打开审核
    openTrial(row) {
      const { id, memberMessage, userMessage } = row;
      if (row.refund_state !== "待审核") return;
      this.trial = true;
      this.title = "审核";
      this.userMessage = userMessage;
      // 获取订单状态详情
      this.getDetail(id).then(res => {
        const trialList = {
          detailData: res,
          memberMessage
        };
        this.trialList = trialList;
      });
    },
    // 更新审核
    handleTrial(refundState) {
      if (this.userMessage === null || this.userMessage === "") {
        this.$message({
          message: "审核意见为空",
          type: "warning"
        });
        return;
      }
      this.$http
        .get("order/checkRefundReturn", {
          params: {
            id: this.current.id,
            userMessage: this.userMessage,
            refundState
          }
        })
        .then(res => {
          this.$message({
            message: "审核成功",
            type: "success"
          });
          this.btnType = "danger";
          this.trial = false;
          this.current = {};
          this.query();
        });
    },
    // 打开状态更新
    openState() {
      const {
        id,
        orderNo,
        createTime,
        memberName,
        refundAmount,
        refundState,
        refund_state,
        applyNo
      } = this.current;
      if (id === undefined) {
        this.$message({
          type: "info",
          message: "未选择对应的订单"
        });
        return;
      }
      if (refund_state === "已完成") return;
      this.updateStatus = true;
      this.statusList = {
        orderNo,
        createTime,
        memberName,
        refundAmount,
        refundState,
        applyNo
      };
    },
    // 更新状态
    handleStatus(e) {
      this.$http
        .get("order/updateRefundReturnReturnType", {
          params: { id: this.current.id, refundState: e }
        })
        .then(res => {
          this.$message({
            message: "状态更新成功",
            type: "success"
          });
          this.updateStatus = false;
          this.current = {};
          this.query();
        });
    },
    // 选中行
    handleCurrent(row) {
      // 设置审核按钮
      if (row.refund_state === "待审核") {
        this.btnType = "danger";
      } else {
        this.btnType = "info";
      }
      if (row.refund_state !== "已完成") {
        this.statusType = "primary";
      } else {
        this.statusType = "info";
      }
      this.current = row;
    },
    // 获取退货单详情
    getDetail(id) {
      return this.$http.get("order/getRefundDetail", { params: { id } });
    },
    // 重新下发
    handleIssue(row) {
      if (row.refund_state !== "erp下发异常") return;
      this.reErpId = row.id;
      this.reErpMask = true;
    },
    // // 表格行变色
    // tableRowClassName({ row, rowIndex }) {
    //   if (row.refundState === 'ORDER_EXP') {
    //     return 'warning-row';
    //   }
    //   return '';
    // },
    // 取消
    handleCancel() {
      this.detail = false;
      this.trial = false;
      this.updateStatus = false;
      this.current = {};
    },
    // 分页事件
    pagination({ page: current, limit: size }) {
      this.queryForm.current = current;
      this.query();
    },
    handleSizeChange({ page: current, limit: size }) {
      this.queryForm.size = size;
      this.query();
    },
    // 金额格式化
    nummatter(row, column) {
      if (row.isPrice) {
        return row[column.property] ? row[column.property] : "0";
      } else {
        return row[column.property] ? "￥" + row[column.property] : "0";
      }
    },
    // 文本格式化
    textmatter(row, column) {
      if (row[column.property] === 0) {
        return row[column.property];
      }
      return row[column.property] ? row[column.property] : "-";
    },
    // 序号
    indexMethod(index) {
      return (this.queryForm.current - 1) * this.queryForm.size + index + 1;
    },
    // 表格行变色
    tableRowClassName({ row, rowIndex }) {
      if (row.refundState === "PENDING" || row.refundState === "ORDER_EXP") {
        return "danger-row";
      }
      if (row.refundState === "TO_DELIVERY") {
        return "warning-row";
      }
      return "";
    },
    // 改变单元格颜色
    cellStyle(row, column, rowIndex, columnIndex) {
      // 根据报警级别显示颜色
      // console.log(row.column,handleColumn rowIndex, columnIndex);
      if (row.column.label === "操作") {
        return "background:#FFFFFF !important;";
      }
      return "";
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
/deep/.el-table .warning-row td {
  background: #e6a23c !important;
  color: #000;
}
/deep/.el-table .danger-row td {
  background: #fd4036 !important;
  color: #000;
}
/deep/ .el-table .warning-row:hover {
  color: #606266 !important;
  background: #e6a23c !important;
}
/deep/.el-table__body .warning-row.current-row > td {
  background: #e6a23c !important;
  color: blue !important;
}
/deep/ .el-table .danger-row:hover {
  color: #606266 !important;
  background: #ff463c !important;
}
/deep/.el-table__body .danger-row.current-row > td {
  background: #ff463c !important;
  color: blue !important;
}
</style>
