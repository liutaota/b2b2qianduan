<template>
  <div style="margin: 0 10px">
    <!-- 筛选 -->
    <Screen v-permission="'OrderListLook'" @query="query" @reset="reset" />
    <div class="orderBtn">
      <el-button
        v-permission="'OrderListDetails'"
        type="primary"
        @click="handleDerails"
        >订单详情</el-button
      >
      <!-- <el-button
        v-permission="'OrderListRepair'"
        type="success"
      >补货单</el-button> -->
      <el-button
        v-permission="'OrderListPay'"
        type="primary"
        @click="$router.push('placeOrder')"
        >代客下单</el-button
      >
      <el-button
        v-permission="'OrderListBank'"
        type="primary"
        @click="handleRecoveryOeder"
        >恢复订单</el-button
      >
      <el-button
        v-permission="'OrderListDel'"
        :type="delBtn"
        @click="handleDelOeder"
        >删除订单</el-button
      >
      <el-button
        v-permission="'OrderListRecepte'"
        :type="
          currentRow.orderState === 'TO_ERP' ||
          currentRow.orderState === 'TO_SEND'
            ? 'warning'
            : 'info'
        "
        @click="intercept"
        >订单拦截</el-button
      >
      <!-- <el-button
        v-permission="'OrderListWriteOff'"
        :type="WOBtn"
        @click="WriteOff"
      >核销</el-button> -->
      <el-button
        v-permission="'OrderWholeOrder'"
        :type="wholeBtn"
        @click="openWholeOrder"
        >整单不出</el-button
      >
      <el-button
        v-permission="'OrderExcel'"
        type="primary"
        @click="exportExcel"
        >Excel导出</el-button
      >
    </div>
    <!-- 订单列表显示 -->
    <Tabel
      :columns="columns"
      :table-data="orderList"
      :loading="loading"
      :page-index="queryForm"
      :row-class-name="tableRowClassName"
      :cell-style="cellStyle"
      @handleCurrent="handleCurrent"
      @sortChange="sortChange"
    >
      <el-table-column
        slot="handleColumn"
        label="操作"
        width="270"
        fixed="right"
      >
        <template slot-scope="scope">
          <el-button
            v-permission="'OrderSee'"
            size="mini"
            type="primary"
            @click="orderSee(scope.row)"
            >查看</el-button
          >
          <el-button
            v-permission="'OrderStatus'"
            size="mini"
            type="primary"
            @click="openStateEdit(scope.row)"
            >状态变更</el-button
          >
          <el-button
            v-permission="'OrderIssue'"
            size="mini"
            :type="scope.row.orderState === 'SEND_ERP' ? 'primary' : 'info'"
            @click="handleIssue(scope.row)"
            >重新下发</el-button
          >
        </template>
      </el-table-column>
    </Tabel>
    <!-- 分页器 -->
    <pagination
      :total="orderTotal"
      @pagination="orderPagination"
      @handleSizeChange="handleSizeChange"
    />
    <el-dialog
      title="状态修改"
      :visible.sync="dialogVisible"
      width="500px"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <div style="text-align: center">
        <el-select
          v-model.trim="updataState"
          placeholder="请选择订单状态"
          style="margin-right: 13px"
        >
          <el-option label="已取消" value="CANCEL" />
          <el-option label="未付款" value="UNPAID" />
          <el-option label="待下发" value="TO_ERP" />
          <el-option label="已下发" value="SEND_ERP" />
          <el-option label="拣货中" value="TO_SEND" />
          <el-option label="待收货" value="TO_DELIVERY" />
          <el-option label="已收货" value="TO_RECEIVED" />
          <el-option label="完成" value="DONE" />
          <el-option label="申请退款" value="APPLY_REFUND" />
          <el-option label="退款成功" value="SUCCESS_REFUND" />
          <el-option label="待拦截" value="INTERCEPT" />
          <el-option label="退款中" value="IN_REFUND" />
          <el-option label="erp已收货" value="ERP_TO_RECEIVED" />
        </el-select>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateOrderState">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="订单拦截"
      :visible.sync="dialogVisibleIn"
      width="1200px"
      :before-close="closeDialog"
      :close-on-click-modal="false"
    >
      <OrderSee :order-form="currentRow">
        <div>
          <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="拦截备注" prop="remark">
              <el-input
                v-model.trim="form.interceptRemark"
                type="textarea"
                rows="3"
              />
            </el-form-item>
          </el-form>
        </div>
      </OrderSee>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="updateDialogVisibleIn"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      title="订单核销"
      :visible.sync="maskWriteOff"
      width="500px"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleWriteOff(2)">未核销</el-button>
        <el-button type="primary" @click="handleWriteOff(1)">已核销</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="订单查看"
      :visible.sync="orderSeeMask"
      width="1200px"
      :before-close="orderSeeClose"
      :close-on-click-modal="false"
    >
      <OrderSee :order-form="orderForm" :columns="columns" />
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="openStateEdit(orderForm)"
          >状态变更</el-button
        >
        <el-button
          size="mini"
          :type="orderForm.orderState === 'SEND_ERP' ? 'primary' : 'info'"
          @click="handleIssue(orderForm)"
          >重新下发</el-button
        >
        <el-button
          type="primary"
          @click="
            orderSeeMask = false;
            orderForm = {};
          "
          >关闭</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      title="整单不出"
      :visible.sync="orderAddRecMask"
      width="30%"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <el-form
        ref="orderAddRecForm"
        :rules="rules"
        :model="orderAddRecForm"
        label-width="120px"
      >
        <el-form-item label="整单不出备注" prop="noOrderRemark">
          <el-input
            v-model.trim="orderAddRecForm.noOrderRemark"
            type="textarea"
            rows="3"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleOrderAddRec()">确 定</el-button>
        <el-button @click="handleClose">取 消</el-button>
      </span>
    </el-dialog>
    <!-- <el-dialog
      title="重新下发"
      :visible.sync="reErpMask"
      width="500px"
      :before-close="handleClose"
    >
      <el-form
        ref="reErpForm"
        :rules="rules"
        :model="reErpForm"
        label-width="120px"
      >
        <el-form-item label="重新下发备注" prop="reErpRemark">
          <el-input
            v-model.trim="reErpForm.reErpRemark"
            type="textarea"
            rows="3"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleReErp()">确 定</el-button>
        <el-button @click="handleClose">取 消</el-button>
      </span>
    </el-dialog> -->
    <ReIssue
      :re-erp-mask="reErpMask"
      @handleClose="handleClose"
      @handleReErp="handleReErp"
    />
  </div>
</template>
<script>
import { _throttle } from "@/utils/public";
// 引入分页组件
import pagination from "@/components/Pagination";
import Tabel from "@/components/Table";
import ReIssue from "@/components/reIssue/reIssue";
import Screen from "./components/screen";
import OrderSee from "./components/orderSee";
import {exportExcel} from '@/util.js';
import { getToken } from '@/utils/auth';
import moment from "moment";
export default {
  name: "OrderList",
  components: {
    pagination,
    Tabel,
    Screen,
    OrderSee,
    ReIssue
  },
  data() {
    return {
      queryForm: {
        size: 50,
        current: 1,
        memberPhone: null,
        memberId: null,
        memberName: "",
        startTime: moment().subtract(7, 'days').format("YYYY-MM-DD 00:00:00"),
        endTime: moment(new Date()).format("YYYY-MM-DD 23:59:59"),
        descs: "oi.create_time"
      },
      // 表格显示数据
      columns: [
        {
          prop: "id",
          label: "订单id"
        },
        {
          prop: "orderNo",
          label: "订单号",
          width: 180
        },
        {
          prop: "payOrderNo",
          label: "支付单号",
          width: 200
        },
        {
          prop: "erpCustomerId",
          label: "客户id"
        },
        {
          prop: "memberName",
          label: "客户",
          width: 300
        },
        {
          prop: "order_state",
          label: "订单状态"
        },
        {
          prop: "exp_status",
          label: "异常状态"
        },
        {
          prop: "telephone",
          label: "注册手机号",
          width: 120
        },
        {
          prop: "memberPhone",
          label: "下单电话",
          width: 120
        },
        {
          prop: "createTime",
          label: "下单时间",
          width: 150,
          sortable: "custom"
        },
        {
          prop: "pay_method",
          label: "结算方式"
        },
        {
          prop: "payType",
          label: "支付码"
        },
        {
          prop: "payFlowNo",
          label: "支付流水号",
          width: 200
        },
        {
          prop: "payTypeDoc",
          label: "支付说明",
          width: 180
        },
        {
          prop: "orderAmount",
          label: "订单金额",
          width: 120,
          formatter: "nummatter"
        },
        {
          prop: "actuallyMoney",
          label: "实付金额",
          width: 120,
          formatter: "nummatter"
        },
        {
          prop: "goodsAmount",
          label: "应付金额",
          width: 120,
          formatter: "nummatter"
        },
        {
          prop: "preferentialAmount",
          label: "优惠金额",
          width: 120,
          formatter: "nummatter"
        },
        {
          prop: "erpAmount",
          label: "到货金额",
          width: 120,
          formatter: "nummatter"
        },
        {
          prop: "order_from",
          label: "订单来源",
          width: 120
        },
        {
          prop: "invType",
          label: "发票类型",
          width: 130
        },
        {
          prop: "fp_status",
          label: "发票状态",
          width: 130
        },
        {
          prop: "expRemark",
          label: "异常备注",
          width: 200,
          isExpRemark: true // 订单弹窗控制异常备注背景颜色
        },
        {
          prop: "del_status",
          label: "删除状态",
          width: 200
        },
        {
          prop: "intercept_status",
          label: "拦截状态",
          width: 200
        },
        {
          prop: "interceptRemark",
          label: "拦截备注",
          width: 120
        },
        {
          prop: "goodsRemark",
          label: "随货备注",
          width: 180
        },
        {
          prop: "remark",
          label: "下单备注",
          width: 180
        },
        {
          prop: "interceptTime",
          label: "拦截时间",
          width: 180
        },
        {
          prop: "addressDetail",
          label: "地址",
          width: 300
        }
      ],
      // 日期
      pickerOptions: {
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            }
          },
          {
            text: "昨天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", date);
            }
          },
          {
            text: "一周前",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            }
          }
        ]
      },
      // 订单类别
      orderList: [],
      orderTotal: 0,
      loading: true,
      orderId: null,
      id: null,
      updataState: null,
      dialogVisible: false,
      dialogVisibleIn: false, // 拦截弹窗
      delBtn: "danger", // 删除按钮样式
      WOBtn: "primary",
      maskWriteOff: false,
      // 订单状态
      orderState: [
        { val: "CANCEL", desc: "已取消" },
        { val: "UNPAID", desc: "未付款" },
        { val: "TO_ERP", desc: "待下发" },
        { val: "SEND_ERP", desc: "已下发" },
        { val: "TO_SEND", desc: "拣货中" },
        { val: "TO_DELIVERY", desc: "待收货" },
        { val: "TO_RECEIVED", desc: "已收货" },
        { val: "DONE", desc: "完成" },
        { val: "APPLY_REFUND", desc: "申请退款" },
        { val: "SUCCESS_REFUND", desc: "退款成功" },
        { val: "INTERCEPT", desc: "待拦截" },
        { val: "IN_REFUND", desc: "退款中" },
        { val: "ERP_TO_RECEIVED", desc: "erp已收货" }
      ],
      // 支付方式
      payMethod: [
        { val: "CASH", desc: "现结" },
        { val: "MONTH", desc: "月结" },
        { val: "ON_LINE", desc: "在线支付" }
      ],
      exp_status: [
        { val: "NORMAL", desc: "正常" },
        { val: "ORDER_EXP", desc: "erp异常" },
        { val: "NO_ORDER", desc: "整单不出" },
        { val: "SHORT", desc: "短减" },
        { val: "OUT_TIME", desc: "超时" },
        { val: "CATCH_EXP", desc: "未知异常" },
        { val: "AMOUNT_EXP", desc: "金额异常" },
        { val: "FINANCE_EXP", desc: "核销异常" }
      ],
      del_status: [
        { val: 0, desc: "未删除" },
        { val: 1, desc: "放入回收站" },
        { val: 2, desc: "彻底删除" }
      ],
      order_from: [
        { val: 1, desc: "pc商城" },
        { val: 2, desc: "小程序" },
        { val: 3, desc: "代客下单" },
        { val: 5, desc: "小程序账单支付" },
        { val: 6, desc: "pc账单核销" }
      ],
      currentRow: {},
      form: {},
      intercept_status: [
        { val: "NORMAL", desc: "正常" },
        { val: "TO_INTERCEPT", desc: "待拦截" },
        { val: "INTERCEPT_SUCCESS", desc: "拦截成功" },
        { val: "INTERCEPT_FAIL", desc: "拦截失败" }
      ],
      orderSeeMask: false, // 订单查看蒙版
      orderForm: {},
      orderAddRecMask: false,
      orderAddRecForm: {},
      rules: {
        noOrderRemark: [
          { required: true, message: "请输入整单不出备注", trigger: "blur" }
        ],
        reErpRemark: [
          { required: true, message: "请输入重新下发备注", trigger: "blur" }
        ]
      },
      orderAddRecLoading: false, // 整单不出弹窗
      wholeBtn: "primary", // 整单不出按钮控制
      reErpMask: false,
      reErpLoading: false,
      reErpId: null
    };
  },
  mounted() {
    this.query();
  },
  methods: {
    // Excel导出
    exportExcel() {
      exportExcel('excel/getOrderInfoListExcel',this.queryForm)
    },
    openWholeOrder(row) {
      if (this.currentRow.expStatus !== "NO_ORDER") return;
      if (this.id === null) return;
      this.orderAddRecMask = true;
    },
    orderSeeClose() {
      this.orderSeeMask = false;
      this.orderForm = {};
    },
    // 重新下发请求
    handleReErp(reErpForm) {
      if (this.reErpLoading) return;
      this.reErpLoading = true;
      reErpForm.id = this.reErpId;
      this.$http
        .get("order/reErpOrder", { params: reErpForm })
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
    // 整单不出
    handleOrderAddRec() {
      this.$refs["orderAddRecForm"].validate(valid => {
        if (valid) {
          if (this.orderAddRecLoading) return;
          this.orderAddRecLoading = true;
          this.$http
            .get("order/noOrderAddRecOrder", {
              params: { id: this.id, ...this.orderAddRecForm }
            })
            .then(res => {
              this.query();
              this.orderAddRecLoading = false;
              if (res) {
                this.$message({
                  message: `整单不出退款单生成成功，退款单号：${res.recDocNo},请到财务->对账管理->退款单功能完成核销和退款`,
                  type: "success",
                  duration: 0,
                  showClose: true
                });
                this.$message.success();
              }
              this.handleClose();
            })
            .catch(() => {
              this.orderAddRecLoading = false;
              this.handleClose();
            });
        }
      });
    },
    // 重置
    reset(queryForm) {
      this.queryForm = queryForm;
      this.queryForm.orderState = "";
      this.queryForm.descs = "oi.create_time";
      this.query();
    },
    // 订单列表
    query(queryForm) {
      if (queryForm) {
        this.queryForm = queryForm;
      }
      const form = this.queryForm;
      this.loading = true;
      this.$http
        .get("order/getAdminOrderInfoList", {
          params: {
            ...form
          }
        })
        .then(res => {
          res.records.map(item => {
            item.preferentialAmount = this.$math.subtract(
              item.orderAmount,
              item.goodsAmount
            );
            item.del_status = this.setStaet(item.deleteState, this.del_status);
            item.order_state = this.setStaet(item.orderState, this.orderState);
            item.pay_method = this.setStaet(item.payMethod, this.payMethod);
            item.exp_status = this.setStaet(item.expStatus, this.exp_status);
            item.order_from = this.setStaet(item.orderFrom, this.order_from);
            item.fp_status = item.fpStatus === "ON" ? "已开" : "未开";
            item.intercept_status = this.setStaet(
              item.interceptStatus,
              this.intercept_status
            );
          });
          // 订单状态判断
          this.orderTotal = res.total;
          this.orderList = res.records;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    // 设置状态
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
    // 选中行
    handleCurrent(val) {
      if (val.deleteState === 0) {
        this.delBtn = "danger";
      } else {
        this.delBtn = "info";
      }
      if (val.orderState === "TO_RECEIVED") {
        this.WOBtn = "primary";
      } else {
        this.WOBtn = "info";
      }
      if (val.expStatus === "NO_ORDER") {
        this.wholeBtn = "primary";
      } else {
        this.wholeBtn = "info";
      }
      this.id = val.orderGoodsList[0].orderId;
      this.currentRow = val;
    },
    // 订单详情
    handleDerails() {
      if (this.id === null) {
        this.$message.info("未选择对应的订单");
        return;
      }
      const id = this.id;
      this.$router.push({ path: "details", query: { id } });
    },
    // 重新下发订单
    handleIssue: _throttle(function(row) {
      if (row.order_state !== "已下发") return;
      this.reErpId = row.id;
      this.reErpMask = true;
    }, 1000),
    // 核销请求
    handleWriteOff: _throttle(function(financeTrue) {
      this.$http
        .get("order/reFinanceOrder", { params: { id: this.id, financeTrue } })
        .then(() => {
          this.$message.success("核销完成");
          this.query();
          this.handleClose();
        });
    }),
    // 核销弹窗
    WriteOff() {
      if (this.WOBtn === "info") return;
      if (this.id === null) return this.$message.info("未选择对应的订单");
      this.maskWriteOff = true;
    },
    // 订单时间排序
    sortChange(column) {
      if (column.order === "ascending") {
        this.queryForm.ascs = "";
        this.queryForm.descs = "oi.create_time";
      } else if (column.order === "descending") {
        this.queryForm.descs = "";
        this.queryForm.ascs = "oi.create_time";
      } else {
        this.queryForm.descs = "";
        this.queryForm.ascs = "";
      }
      this.query();
    },
    // 分页事件
    orderPagination({ page: current, limit: size }) {
      this.queryForm.current = current;
      this.query();
    },
    handleSizeChange({ page: current, limit: size }) {
      this.queryForm.size = size;
      this.query();
    },
    // 打开状态修改
    openStateEdit: _throttle(function(row) {
      this.dialogVisible = true;
      this.id = row.id;
      this.updataState = row.orderState;
    }),
    // 取消弹窗
    handleClose() {
      this.dialogVisible = false;
      this.id = null;
      this.updataState = "";
      this.maskWriteOff = false;
      this.reErpMask = false;
      this.reErpId = null;
      if (this.$refs["orderAddRecForm"]) {
        this.$refs["orderAddRecForm"].resetFields();
        this.orderAddRecMask = false;
        this.orderAddRecForm = {};
      }
    },
    // 更改状态
    updateOrderState: _throttle(function() {
      this.$http
        .get("order/updateAdminOrderState", {
          params: { id: this.id, orderState: this.updataState }
        })
        .then(res => {
          this.handleClose();
          this.query();
        });
    }),
    // 删除订单
    handleDelOeder() {
      if (this.id === null) {
        this.$message.info("未选择对应的订单");
        return;
      }
      if (this.delBtn === "info") return;
      this.$confirm("确认删除此订单？, 是否继续？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http
            .get("order/adminDelOrderInfo", {
              params: { id: this.id, deleteState: 2 }
            })
            .then(res => {
              this.$message.success("删除成功");
              this.query();
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 打开订单拦截
    intercept(row) {
      if (JSON.stringify(this.currentRow) === "{}") {
        this.$message.info("未选择对应的订单");
        return;
      }
      if (
        this.currentRow.orderState === "TO_ERP" ||
        this.currentRow.orderState === "TO_SEND"
      ) {
        this.dialogVisibleIn = true;
      }
    },
    closeDialog() {
      this.dialogVisibleIn = false;
      this.currentRow = {};
      this.form = {};
      this.id = null;
    },
    // 订单查看
    orderSee(row) {
      this.orderForm = { ...row };
      this.orderSeeMask = true;
    },
    // 订单拦截
    updateDialogVisibleIn() {
      this.$http
        .get("order/updateOrderInfoVoIntercept", {
          params: {
            id: this.currentRow.id,
            interceptStatus: "TO_INTERCEPT",
            ...this.form
          }
        })
        .then(res => {
          this.$message.success("操作成功");
          this.closeDialog();
          this.query();
        });
    },
    // 恢复订单
    handleRecoveryOeder() {
      if (this.id === null) {
        this.$message.info("未选择对应的订单");
        return;
      }
      this.$http
        .get("order/recoverDelMyOrderInfo", { params: { id: this.id } })
        .then(res => {
          this.$message.success("恢复成功");
          this.query();
        });
    },
    // 表格行变色
    tableRowClassName({ row, rowIndex }) {
      if (row.expStatus === "FINANCE_EXP" || row.expStatus === "NO_ORDER") {
        return "danger-row";
      }
      if (row.expStatus === "SHORT") {
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
  float: left;
  margin: 0 0px 10px;
}
</style>
