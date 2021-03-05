<template>
  <div style="margin-left: 10px">
    <!-- 筛选器 -->
    <Screen @query="query" @reset="reset" v-permission="'AbnormalScreen'">
      <el-select
        slot="state"
        v-model.trim="queryForm.expStatus"
        placeholder="请选择异常标识"
        style="margin-right: 13px"
        clearable
        @change="queryStatus"
      >
        <el-option label="全部" value="" />
        <el-option label="正常" value="NORMAL" />
        <el-option label="erp异常" value="ORDER_EXP" />
        <el-option label="整单不出" value="NO_ORDER" />
        <el-option label="短减" value="SHORT" />
        <el-option label="超时" value="OUT_TIME" />
        <el-option label="未知异常" value="CATCH_EXP" />
        <el-option label="待处理" value="DEAL_WITH" />
        <el-option label="拦截异常" value="INTERCEPT_EXP" />
        <el-option label="金额异常" value="AMOUNT_EXP" />
        <el-option label="核销异常" value="FINANCE_EXP" />
      </el-select>
    </Screen>
    <!-- <div class="orderBtn">
      <el-button type="success">异常处理</el-button>
    </div> -->
    <div class="divBox">
      <el-radio-group
        v-model.trim="queryForm.isTrue"
        v-permission="'AbnormalStats'"
        @change="query(queryForm)"
      >
        <el-radio-button label="">全部</el-radio-button>
        <el-radio-button :label="0">待处理</el-radio-button>
      </el-radio-group>
      <el-button
        v-permission="'AbnormalOrder'"
        style="margin:0 10px"
        :type="wholeBtn"
        @click="openWholeOrder"
        >整单不出</el-button
      >
    </div>
    <!-- 订单列表显示 -->
    <Tabel
      :columns="columns"
      :table-data="orderList"
      :loading="loading"
      :row-class-name="tableRowClassName"
      :cell-style="cellStyle"
      @cellClick="cellClick"
      @handleCurrent="handleCurrent"
    >
      <el-table-column
        slot="handleColumn"
        label="操作"
        width="260"
        fixed="right"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            v-permission="'AbnormalOrderSee'"
            @click="orderForm = {...scope.row};orderSeeMask = true; "
            >查看</el-button
          >
          <el-button
            size="mini"
            :type="expStatusBtn"
            v-permission="'AbnormalReplay'"
            @click="handleIssue(scope.row)"
            >重新下发</el-button
          >
          <el-button
            size="mini"
            :type="scope.row.isTrue === 0 ? 'primary' : 'info'"
            v-permission="'AbnormalConfirmException'"
            @click="handleAbnormal(scope.row)"
            >确认异常</el-button
          >
        </template>
      </el-table-column>
    </Tabel>
    <el-dialog
      title="异常处理"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="异常备注">
          <el-input v-model.trim="form.userRemark" type="textarea" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onSubmit">确 定</el-button>
        <el-button @click="handleClose">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 分页器 -->
    <pagination
      :total="total"
      @pagination="pagination"
      @handleSizeChange="handleSizeChange"
    />
    <ReIssue
      :re-erp-mask="reErpMask"
      @handleClose="handleClose"
      @handleReErp="handleReErp"
    />
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
    <!-- 订单查看 -->
    <el-dialog
      :title="'异常查看'"
      :visible.sync="orderSeeMask"
      width="1200px"
      :before-close="orderSeeClose"
      :close-on-click-modal="false"
    >
      <OrderSee :order-form="orderForm" :columns="columns" />
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="orderSeeClose"
          >关闭</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { _throttle } from "@/utils/public";
import ReIssue from "@/components/reIssue/reIssue";
// 引入分页组件
import pagination from "@/components/Pagination";
import Tabel from "@/components/Table";
import Screen from "../components/screen";
const OrderSee = () => import("./components/orderSee");
export default {
  name: "Abnormal",
  components: {
    pagination,
    Tabel,
    Screen,
    ReIssue,
    OrderSee
  },
  data() {
    return {
      queryForm: {
        size: 50,
        current: 1,
        expStatus: "",
        isTrue: ""
      },
      columns: [
        {
          prop: "id",
          label: "订单id"
        },
        {
          prop: "orderNo",
          label: "订单号",
          width: 200
        },
         {
          prop: "payFlowNo",
          label: "支付流水号",
          width: 200
        },
        {
          prop: "erpCustomerId",
          label: "客户id"
        },
        {
          prop: "memberName",
          label: "客户名称",
          width: 180
        },
        {
          prop: "telephone",
          label: "注册手机号",
          width: 120
        },
        {
          prop: "memberPhone",
          label: "下单电话",
          width: 140
        },
        {
          prop: "orderAmount",
          label: "订单金额",
          formatter: "nummatter",
          width: 140
        },
        {
          prop: "rptAmount",
          label: "优惠金额",
          formatter: "nummatter",
          width: 140
        },
        {
          prop: "orderFrom",
          label: "订单来源"
        },
        {
          prop: "createTime",
          label: "下单时间",
          width: 150
        },
        {
          prop: "expTime",
          label: "下发时间",
          width: 150
        },
        {
          prop: "doneTime",
          label: "下发成功时间",
          width: 150
        },
        {
          prop: "exp_status",
          label: "异常辨识",
          width: 200
        },
        {
          prop: "userRemark",
          label: "处理备注",
          width: 200
        },
        {
          prop: "expRemark",
          label: "异常备注",
          width: 200,
          tooltip: false
        }
      ],
      expStatusBtn: "info",
      orderList: [],
      total: 1,
      loading: true,
      expStatus: [
        { val: "NORMAL", desc: "正常" },
        { val: "ORDER_EXP", desc: "erp异常" },
        { val: "NO_ORDER", desc: "整单不出" },
        { val: "SHORT", desc: "短减" },
        { val: "OUT_TIME", desc: "超时" },
        { val: "CATCH_EXP", desc: "未知异常" },
        { val: "DEAL_WITH", desc: "待处理" },
        { val: "INTERCEPT_EXP", desc: "拦截异常" },
        { val: "AMOUNT_EXP", desc: "金额异常" },
        { val: "FINANCE_EXP", desc: "核销异常" }
      ],
      orderFrom: [
        { val: 1, desc: "pc商城" },
        { val: 2, desc: "小程序" },
        { val: 3, desc: "代客下单" },
        { val: 5, desc: "小程序账单支付" },
        { val: 6, desc: "pc账单核销" }
      ],
      isclick: true,
      dialogVisible: false,
      form: {},
      isSuccess: false,
      reErpMask: false,
      reErpId: null,
      wholeBtn: "primary", // 整单不出按钮控制
      orderAddRecMask: false,
      currentRow: {},
      id: null,
      orderAddRecForm: {},
      rules: {
        noOrderRemark: [
          { required: true, message: "请输入整单不出备注", trigger: "blur" }
        ]
      },
      orderSeeMask: false, // 异常订单查看弹窗
      orderForm: {} // 异常订单
    };
  },
  mounted() {
    this.query();
  },
  methods: {
    // 关闭订单查看弹窗事件
    orderSeeClose() {
      this.orderSeeMask = false;
      this.orderForm = {}
    },
    handleCurrent(val) {
      if (val.expStatus === "NO_ORDER") {
        this.wholeBtn = "primary";
      } else {
        this.wholeBtn = "info";
      }
      this.currentRow = val;
    },
    // 整单不出
    handleOrderAddRec() {
      this.$refs["orderAddRecForm"].validate(valid => {
        if (valid) {
          if (this.orderAddRecLoading) return;
          this.orderAddRecLoading = true;
          this.$http
            .get("order/noOrderAddRecOrder", {
              params: { ...this.orderAddRecForm, id: this.id }
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
    openWholeOrder(row) {
      if (this.currentRow.expStatus !== "NO_ORDER") return;
      this.id = this.currentRow.id;
      this.orderAddRecMask = true;
    },
    queryStatus() {
      this.query();
    },
    // 重新下发
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
    handleClose() {
      this.form = {};
      this.dialogVisible = false;
      this.reErpMask = false;
      this.reErpId = null;
      this.orderAddRecMask = false;
      this.orderAddRecForm = {};
      if (this.$refs["form"]) {
        this.$refs["form"].resetFields();
      }
    },
    reset() {
      this.queryForm.expStatus = "";
      this.query();
    },
    query(queryForm) {
      if (queryForm) {
        queryForm.expStatus = this.queryForm.expStatus;
        this.queryForm = queryForm;
      }
      this.loading = true;
      this.$http
        .get("order/getOrderInfoExceptionList", {
          params: { ...this.queryForm }
        })
        .then(res => {
          res.records.map(res => {
            res.isTrue = parseInt(res.isTrue);
            res.exp_status = this.setStaet(res.expStatus, this.expStatus);
            // 订单来源
            res.orderFrom = this.setStaet(res.orderFrom, this.orderFrom);
            if (res.exp_status !== "正常") {
              this.expStatusBtn = "primary";
            }
          });
          this.orderList = res.records;
          this.total = res.total;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    handleAbnormal(item) {
      if (item.isTrue === 1) return;
      this.form.id = item.id;
      this.dialogVisible = true;
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
    // 拒绝事件
    handleRefuse() {},
    // 退款
    handleRefund() {},
    // 分页事件
    pagination({ page: current, limit: size }) {
      this.queryForm.current = current;
      this.query();
    },
    handleSizeChange({ page: current, limit: size }) {
      this.queryForm.size = size;
      this.query();
    },
    // 重新下发订单
    handleIssue: _throttle(function(row) {
      // 重新下发的事 件
      if (row.exp_status === "NORMAL") return;
      this.reErpId = row.id;
      this.reErpMask = true;
    }, 1000),
    // 异常处理
    onSubmit() {
      this.$http
        .get("/order/isTrueExpOrder", {
          params: this.form
        })
        .then(res => {
          this.$message.success("处理成功");
          this.dialogVisible = false;
          this.query();
        });
    },
    cellClick(row, column) {
      if (column.property === "expRemark") {
        this.$alert(row.expRemark, "异常备注", {
          confirmButtonText: "确定",
          callback: action => {
            return;
          }
        });
      }
    },
    // 改变单元格颜色
    cellStyle(row, column, rowIndex, columnIndex) {
      // 根据报警级别显示颜色
      // console.log(row.column,handleColumn rowIndex, columnIndex);
      if (row.column.label === "操作") {
        return "background:#FFFFFF !important;";
      }
      return "";
    },
    // 表格行变色
    tableRowClassName({ row, rowIndex }) {
      if (row.expStatus === "NO_ORDER") {
        return "danger-row";
      }
      if (row.expStatus === "SHORT") {
        return "warning-row";
      }
      return "";
    }
  }
};
</script>

<style scoped></style>
