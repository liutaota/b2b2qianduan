<template>
  <div style="margin: 0 10px">
    <Screen
      :is-arction="isArction"
      @query="query"
      @APPQuery="APPQuery"
      @getRefund="getRefund"
    />
    <!-- <div class="tabs">
      <div class="search-wrap">
        <span
          v-permission="'FinanceListRecive'"
          class="tabTitle"
          :class="isArction === 1 ? 'Select' : ''"
          @click="
            isArction = 1;
            title = '收款单';
          "
          >收款单</span
        >
        <span
          v-permission="['FinanceListRefund', 'FinanceListRefundAmount']"
          class="tabTitle border-right"
          :class="isArction === 2 ? 'Select' : ''"
          @click="
            isArction = 2;
            title = '退款单';
          "
          >退款单</span
        >
        <span
          v-permission="['FinanceListAPP']"
          class="tabTitle border-right"
          :class="isArction === 3 ? 'Select' : ''"
          @click="
            isArction = 3;
            title = 'Erp收款单';
          "
          >Erp收款单</span
        >
      </div>
    </div> -->

    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="收款单" name="1" v-permission="'FinanceListRecive'">
        <div>
          <el-button
            v-permission="'FinanceListRepeatRefundCheck'"
            :type="'warning'"
            style="margin-top:10px"
            @click="collection(currentRow)"
            >重复核销</el-button
          >
          <el-button
            v-permission="'FinanceListUpdateRepeatRefund'"
            :type="'warning'"
            style="margin-top:10px"
            @click="openWriteOff"
            >修改核销状态</el-button
          >
          <el-button
            v-permission="'FinanceListOrderDetails'"
            size="mini"
            type="primary"
            @click="toOrderInfo(currentRow)"
            >订单详情</el-button
          >
          <el-button
            type="primary"
            v-permission="'FinanceListAPPExcel'"
            @click="exportExcel"
            >Excel导出</el-button
          >
        </div>
        <Tabel
          ref="singleTable"
          :columns="columns"
          :is_height="400"
          :table-data="financepData"
          :loading="loading"
          :page-index="queryForm"
          :row-class-name="tableRowClassName"
          :cell-style="cellStyle"
          @handleCurrent="handleCurrent"
        >
          <el-table-column
            slot="handleColumn"
            label="订单明细"
            width="190"
            fixed="right"
          >
            <template slot-scope="scope">
              <el-button
                v-permission="'FinanceListOrderSee'"
                size="mini"
                type="primary"
                @click="orderSee(scope.row)"
                >查看</el-button
              >
              <el-button
                v-permission="'FinanceListReciveCheck'"
                :type="
                  scope.row.financeTrue == 0 || scope.row.financeTrue == 3
                    ? 'warning'
                    : 'info'
                "
                style="margin-top:10px"
                @click="collection(scope.row, 'PAY_ORDER')"
                >核销</el-button
              >
            </template>
          </el-table-column>
        </Tabel>
        <Pagination
          :total="totalList"
          @pagination="totalPagination"
          @handleSizeChange="handleSizeChange"
        />
      </el-tab-pane>
      <el-tab-pane label="退款单" name="2" v-permission="'FinanceListRefund'">
        <div>
          <el-button
            v-permission="'FinanceListRepeatRefundCheck'"
            :type="'warning'"
            style="margin-top:10px"
            @click="collection(currentRow)"
            >重复核销</el-button
          >
          <el-button
            v-permission="'FinanceListUpdateRepeatRefund'"
            :type="'warning'"
            style="margin-top:10px"
            @click="openWriteOff"
            >修改核销状态</el-button
          >
          <el-button
            v-permission="'FinanceListOrderDetails'"
            size="mini"
            type="primary"
            @click="toOrderInfo(currentRow)"
            >订单详情</el-button
          >
          <el-button
            :type="
              currentRow.refundState !== 'REFUND_SUCCESS' ? 'danger' : 'info'
            "
            v-permission="'FinanceListAPPUpdateRefund'"
            @click="openRefundState"
            v-if="isArction === 2"
            >修改退款状态</el-button
          >
          <el-button
            type="primary"
            v-permission="'FinanceListAPPExcel'"
            @click="exportExcel"
            >Excel导出</el-button
          >
        </div>
        <Tabel
          ref="singleTable"
          :is_height="400"
          :columns="refundColumns"
          :table-data="refund"
          :loading="refundLoading"
          :page-index="refundQueryForm"
          :row-class-name="tableRowClassName"
          :cell-style="cellStyle"
          @handleCurrent="handleCurrent"
        >
          <el-table-column
            slot="handleColumn"
            label="订单明细"
            width="250"
            fixed="right"
          >
            <template slot-scope="scope">
              <el-button
                v-permission="'FinanceListOrderSee'"
                size="mini"
                type="primary"
                @click="orderSee(scope.row)"
                >查看</el-button
              >
              <el-button
                v-permission="'FinanceListRefundAmount'"
                :type="
                  scope.row.financeTrue !== 1 &&
                  scope.row.refundState !== 'REFUND_SUCCESS' &&
                  scope.row.recType === 'ON_LINE' && scope.row.expStatus === 'NORMAL'
                    ? 'danger'
                    : 'info'
                "
                style="margin-top:10px"
                @click="
                  if (
                    scope.row.financeTrue !== 1 &&
                    scope.row.refundState !== 'REFUND_SUCCESS' &&
                    scope.row.recType === 'ON_LINE'&& scope.row.expStatus === 'NORMAL'
                  ) {
                    refundMask = true;
                    refundForm = { id: scope.row.id };
                  }
                "
                >确认退款</el-button
              >
              <el-button
                v-permission="'FinanceListRefundCheck'"
                :type="
                  scope.row.financeTrue !== 1 &&
                  scope.row.refundState === 'REFUND_SUCCESS'
                    ? 'warning'
                    : 'info'
                "
                style="margin-top:10px"
                @click="collection(scope.row, 'REFUND')"
                >核销</el-button
              >
            </template>
          </el-table-column>
        </Tabel>
        <Pagination
          :total="refundTotal"
          @pagination="refundPagination"
          @handleSizeChange="handleRefundSizeChange"
        />
      </el-tab-pane>
      <el-tab-pane label="Erp收款单" name="3" v-permission="'FinanceListAPP'">
        <div>
          <el-button
            v-permission="'FinanceListUpdateRepeatRefund'"
            :type="'warning'"
            style="margin-top:10px"
            @click="openWriteOff"
            >修改核销状态</el-button
          >
          <el-button
            v-permission="'FinanceListAPPCollection'"
            type="primary"
            style="margin-top:10px"
            @click="openCollection"
            >确认收款</el-button
          >
          <el-button
            v-permission="'FinanceListAPPWriteOff'"
            type="warning"
            style="margin-top:10px"
            @click="openAPPWriteOff"
            >核销</el-button
          >
          <el-button
            type="primary"
            v-permission="'FinanceListAPPExcel'"
            @click="exportExcel"
            >Excel导出</el-button
          >
        </div>
        <Tabel
          ref="singleTable"
          :is_height="400"
          :columns="APPColumns"
          :table-data="APPList"
          :loading="APPLoading"
          :page-index="APPQueryForm"
          :row-class-name="tableRowClassName"
          :cell-style="cellStyle"
          :isSele="true"
          @handleCurrent="handleCurrent"
          @handleSelectionChange="handleSelectionChange"
        >
          <el-table-column
            slot="handleColumn"
            label="操作"
            width="220"
            fixed="right"
          >
            <template slot-scope="scope">
              <el-button
                v-permission="'FinanceListAPPOrderSee'"
                size="mini"
                type="primary"
                @click="orderSee(scope.row)"
                >查看</el-button
              >
              <el-button
                v-permission="'FinanceListAPPRefund'"
                :type="
                  scope.row.onlineTotal &&
                  scope.row.refundState !== 'REFUND_SUCCESS'
                    ? 'danger'
                    : 'info'
                "
                style="margin-top:10px"
                @click="openRefund(scope.row)"
                >退款</el-button
              >
              <el-button
                v-permission="'FinanceListAPPDelOrder'"
                type="danger"
                style="margin-top:10px"
                @click="
                  delAPPMask = true;
                  delAPPForm.id = scope.row.id;
                "
                >删除</el-button
              >
            </template>
          </el-table-column>
        </Tabel>
        <div class="pagination">
          <Pagination
            :total="APPTotal"
            @pagination="APPPagination"
            @handleSizeChange="handleAPPSizeChange"
          />
          <div class="sele">
            <p>条数：{{ appSelOrder.length }}</p>
            <p>
              现金总计：<span>{{ nummatter(selAmount.cashTotal) }}</span>
            </p>
            <p>
              支付总计：<span>{{ nummatter(selAmount.onlineTotal) }}</span>
            </p>
            <p>
              总金额：<span>{{ nummatter(selAmount.totalAmount) }}</span>
            </p>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <!-- 核销 -->
    <el-dialog
      :title="title + '核销'"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <el-form ref="dialogForm" :rules="rules" :model="form" label-width="80px">
        <el-form-item label="核销备注">
          <el-input v-model.trim="form.remark" type="textarea" rows="3" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          v-if="writeOffStatus !== 'APP'"
          @click="handleWriteOff()"
          >确 定</el-button
        >
        <el-button type="primary" v-else @click="APPCollection"
          >确 定</el-button
        >
        <el-button @click="handleClose">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 退款 -->
    <el-dialog
      :title="'退款'"
      :visible.sync="refundMask"
      width="30%"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <el-form
        ref="refundForm"
        :rules="rules"
        :model="refundForm"
        label-width="80px"
      >
        <el-form-item label="退款备注" prop="refundRemark">
          <el-input
            v-model.trim="refundForm.refundRemark"
            type="textarea"
            rows="3"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleRefund()" v-if="isArction !== 3"
          >确 定</el-button
        >
        <el-button type="primary" @click="APPRefund()" v-else>确 定</el-button>
        <el-button @click="handleClose">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 订单查看 -->
    <el-dialog
      :title="title + '查看'"
      :visible.sync="orderSeeMask"
      width="1200px"
      :before-close="orderSeeClose"
      :close-on-click-modal="false"
    >
      <OrderSee :order-form="orderForm" :isArction="isArction" />
      <span slot="footer" class="dialog-footer">
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
    <!-- 核销状态修改 -->
    <el-dialog
      title="核销状态修改"
      :visible.sync="writeOffMask"
      width="1200px"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <el-form
        ref="writeOffForm"
        :rules="rules"
        :model="writeOffFrom"
        label-width="80px"
      >
      <OrderSee :order-form="orderForm" :isArction="isArction" />
        <el-form-item label="核销状态" prop="financeTrue">
          <el-radio-group v-model="writeOffFrom.financeTrue">
            <el-radio :label="1">已核销</el-radio>
            <el-radio :label="2">未核销</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="核销备注" prop="remark">
          <el-input
            v-model.trim="writeOffFrom.remark"
            type="textarea"
            rows="3"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          v-if="isArction !== 3"
          @click="handleEditwriteOff"
          >编辑</el-button
        >
        <el-button type="primary" v-else @click="handleEditAPPWriteOff"
          >编辑</el-button
        >
        <el-button type="primary" @click="handleClose">关闭</el-button>
      </span>
    </el-dialog>
    <!-- 退款状态修改 -->
    <el-dialog
      title="退款状态修改"
      :visible.sync="refundStateMask"
      width="600px"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <el-form
        ref="refundStateForm"
        :rules="rules"
        :model="writeOffFrom"
        label-width="80px"
      >
        <el-form-item label="退款状态" prop="refundState">
          <el-radio-group v-model="writeOffFrom.refundState">
            <el-radio label="REFUND_SUCCESS">退款成功</el-radio>
            <el-radio label="REFUND_FAIL">退款失败</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="核销备注" prop="refundRemark">
          <el-input
            v-model.trim="writeOffFrom.refundRemark"
            type="textarea"
            rows="3"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="updateRefundState">确认</el-button>
        <el-button type="primary" @click="handleClose">关闭</el-button>
      </span>
    </el-dialog>
    <!-- 收款 -->
    <el-dialog
      :title="'收款'"
      :visible.sync="collectionMask"
      width="500px"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <el-form
        ref="APPForm"
        :rules="rules"
        :model="collectionForm"
        label-width="80px"
      >
        <el-form-item label="收款日期">
          <el-date-picker
            type="date"
            placeholder="选择日期"
            v-model="collectionForm.confirmTime"
            value-format="yyyy-MM-dd"
            style="width: 100%;"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="收款备注">
          <el-input
            v-model.trim="collectionForm.confirmRemark"
            type="textarea"
            rows="3"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="APPConfirmReceipt()">确 定</el-button>
        <el-button @click="handleClose">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 删除收款单 -->
    <el-dialog
      :title="'删除收款单'"
      :visible.sync="delAPPMask"
      width="30%"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <el-form
        ref="delForm"
        :rules="rules"
        :model="delAPPForm"
        label-width="80px"
      >
        <el-form-item label="删除备注" prop="delRemark">
          <el-input
            v-model.trim="delAPPForm.delRemark"
            type="textarea"
            rows="3"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="delAPPOrder()">确 定</el-button>
        <el-button @click="handleClose">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { _throttle } from "@/utils/public";
const Pagination = () => import("@/components/Pagination");
const Tabel = () => import("@/components/Table");
const Screen = () => import("./components/screen");
import OrderSee from "./components/orderSee";
import { Loading } from "element-ui";
import { imgHost } from "@/config";
import moment from "moment";
import { getInfo } from "@/api/user";
// import Tabel from '@/components/Table';
export default {
  name: "FinanceList",
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
        startTime: moment(new Date()).format("YYYY-MM-DD 00:00:00"),
        endTime: moment(new Date()).format("YYYY-MM-DD 23:59:59")
      },
      isArction: 1,
      activeName: "1",
      loading: true,
      totalList: 1,
      billId: null, // 账单id
      dialogVisible: false, // 核销弹窗控制
      title: "收款单", // 弹窗标题
      btnType: "primary", // 按钮样式
      form: {
        remark: "" // 核销备注
      },
      columns: [
        {
          prop: "id",
          label: "收款单ID"
        },
        {
          prop: "order_state",
          label: "订单状态"
        },
        {
          prop: "erpUserId",
          label: "客户ID"
        },
        {
          prop: "userName",
          label: "客户名称",
          width: 180
        },
        {
          prop: "orderNo",
          label: "订单号",
          width: 200
        },

        {
          prop: "payAbcNo",
          label: "收款流水号",
          width: 200
        },
        {
          prop: "payFlowNo",
          label: "支付流水号",
          width: 200
        },
        {
          prop: "financeName",
          label: "核销操作人",
          width: 180
        },
        {
          prop: "total",
          label: "应收款",
          formatter: "nummatter"
        },
        {
          prop: "premoney",
          label: "实收款",
          formatter: "nummatter"
        },
        {
          prop: "erpFinanceRemark",
          label: "erp核销备注",
          width: 180
        },
        {
          prop: "recType",
          label: "结算方式"
        },
        {
          prop: "finance_true",
          label: "是否核销"
        },
        {
          prop: "createTime",
          label: "创建时间",
          width: 180
        },
        {
          prop: "status",
          label: "收款状态"
        },

        {
          prop: "financeTime",
          label: "核销时间",
          width: 180
        },
        {
          prop: "remark",
          label: "备注",
          width: 180
        }
      ],
      financepData: [], // 收款单列表
      refund: [], // 退款单列表
      refundQueryForm: {
        size: 50,
        current: 1,
        startTime: moment(new Date()).format("YYYY-MM-DD 00:00:00"),
        endTime: moment(new Date()).format("YYYY-MM-DD 23:59:59")
      },
      refundLoading: false,
      refundTotal: 0,
      refundColumns: [
        {
          prop: "id",
          label: "退款单ID"
        },
        {
          prop: "order_state",
          label: "订单状态"
        },
        {
          prop: "orderId",
          label: "订单ID"
        },
        {
          prop: "erpUserId",
          label: "客户ID"
        },
        {
          prop: "userName",
          label: "客户名称",
          width: 180
        },
        {
          prop: "rec_method",
          label: "退单类型",
          width: 180
        },
        {
          prop: "refundName",
          label: "退款操作人",
          width: 180
        },
        {
          prop: "financeName",
          label: "核销操作人",
          width: 180
        },
        {
          prop: "applyNo",
          label: "退货单号",
          width: 200
        },
        {
          prop: "orderNo",
          label: "订单号",
          width: 200
        },
        {
          prop: "recDocNo",
          label: "退款单号",
          width: 200
        },
        {
          prop: "abcMessage",
          label: "回调报文",
          width: 200
        },
        {
          prop: "payFlowNo",
          label: "支付流水号",
          width: 200
        },
        {
          prop: "payAbcNo",
          label: "退款流水号",
          width: 200
        },
        {
          prop: "applyNo",
          label: "退货单号",
          width: 200
        },
        {
          prop: "refund_state",
          label: "退款状态"
        },
        {
          prop: "total",
          label: "应退款",
          formatter: "nummatter"
        },
        {
          prop: "exp_status",
          label: "异常状态",
        },
        {
          prop: "expRemark",
          label: "异常备注",
          width:200
        },
         
        {
          prop: "refundMoney",
          label: "实退款",
          formatter: "nummatter"
        },
        {
          prop: "finance_true",
          label: "是否核销"
        },
        {
          prop: "erpFinanceRemark",
          label: "erp核销备注",
          width: 180
        },
        {
          prop: "rec_type",
          label: "结算方式"
        },

        {
          prop: "createTime",
          label: "创建时间",
          width: 180
        },
        {
          prop: "refundTime",
          label: "退款时间",
          width: 180
        },
        {
          prop: "financeTime",
          label: "核销时间",
          width: 180
        },
        {
          prop: "remark",
          label: "备注",
          width: 180
        },
        {
          prop: "erpFinanceRemark",
          label: "erp异常备注",
          width: 180
        },
        {
          prop: "refundRemark",
          label: "退款备注",
          width: 180
        }
      ],
      status: [
        { val: "CANCEL", desc: "已取消" },
        { val: "TO_PAY", desc: "待结算" },
        { val: "DONE_PAY", desc: "已结算" }
      ],
      recType: [
        { val: "ON_LINE", desc: "在线支付" },
        { val: "CASH", desc: "现金" }
      ],
      recMethod: [
        { val: "PAY_ORDER", desc: "下单" },
        { val: "SHORT", desc: "短减" },
        { val: "NO_ORDER", desc: "整单不出" },
        { val: "REFUND", desc: "退款" },
        { val: "REFUND_GOODS", desc: "退货" },
        { val: "INTERCEPT", desc: "拦截退款" }
      ],
      refundState: [
        { val: "NO_REFUND", desc: "未退款" },
        { val: "REFUND_SUCCESS", desc: "退款成功" },
        { val: "REFUND_FAIL", desc: "退款失败" }
      ],
      rules: {
        remark: [
          { required: true, message: "请输入核销备注", trigger: "blur" }
        ],
        financeTrue: [
          { required: true, message: "请输入选择状态", trigger: "blur" }
        ],
        refundRemark: [
          { required: true, message: "请输入退款备注", trigger: "blur" }
        ],
        confirmRemark: [
          { required: true, message: "请输入收款备注", trigger: "blur" }
        ],
        delRemark: [
          { required: true, message: "请输入删除备注", trigger: "blur" }
        ]
        // refundState: [
        //   { required: true, message: "请输入退款备注", trigger: "blur" }
        // ]
      },
      financeTrue: [
        { val: 0, desc: "未核销" },
        { val: 1, desc: "已核销" },
        { val: 2, desc: "核销中" },
        { val: 3, desc: "核销失败" }
      ],
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
      // 异常状态
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
      refundBtn: "primary",
      handleRefundLoading: false, // 退款防重复点击
      recDocStatus: false,
      refundMask: false, // 退款弹窗
      refundForm: {},
      currentRow: {}, // 行选中
      orderSeeMask: false,
      orderForm: {},
      writeOffMask: false,
      writeOffFrom: {}, // 修改核销状态
      APPColumns: [
        {
          prop: "tranposname",
          label: "线路"
        },
        {
          prop: "erpUserId",
          label: "公司id"
        },
        {
          prop: "userName",
          label: "公司名称",
          width: 200
        },
        {
          prop: "cashTotal",
          label: "收款现金",
          formatter: "nummatter"
        },
        {
          prop: "onlineTotal",
          label: "在线支付",
          formatter: "nummatter",
          width: 120
        },
        {
          prop: "finance_true",
          label: "核销状态"
        },
        {
          prop: "payFlowNo",
          label: "支付流水号",
          width: 200
        },
        {
          prop: "tmpNo",
          label: "订单号",
          width: 200
        },
        // {
        //   prop: "refund_state",
        //   label: "退款状态"
        // },
        // {
        //   prop: "refundMoney",
        //   label: "实退款",
        //   formatter: "nummatter"
        // },
        {
          prop: "total",
          label: "合计",
          formatter: "nummatter"
        },
        {
          prop: "refundTime",
          label: "退款时间",
          width: 180
        },

        {
          prop: "transortno",
          label: "线序"
        },
        {
          prop: "telephone",
          label: "手机号",
          width: 180
        },
        {
          prop: "payTime",
          label: "支付时间",
          width: 150
        },
        {
          prop: "salesids",
          label: "erp订单",
          width: 150
        },
        {
          prop: "createTime",
          label: "创建时间",
          width: 150
        },
        {
          prop: "confirmTime",
          label: "确认收款时间",
          width: 150
        },
        {
          prop: "confirmName",
          label: "确认人",
          width: 150
        },
        {
          prop: "financeErpId",
          label: "核销人ID",
          width: 150
        },
        {
          prop: "financeName",
          label: "核销人",
          width: 150
        },

        {
          prop: "financeRemark",
          label: "核销备注",
          width: 180
        },
        {
          prop: "confirmRemark",
          label: "收款备注",
          width: 180
        },
        {
          prop: "erpFinanceRemark",
          label: "ERP核销备注",
          width: 180
        }
      ],
      APPList: [],
      APPLoading: false,
      APPQueryForm: {
        size: 50,
        current: 1,
        startTime: moment(new Date()).format("YYYY-MM-DD 00:00:00"),
        endTime: moment(new Date()).format("YYYY-MM-DD 23:59:59")
      },
      APPTotal: 0,
      writeOffStatus: "",
      collectionMask: false,
      collectionForm: {
        confirmTime: moment(new Date()).format("YYYY-MM-DD")
      },
      delAPPForm: {},
      delAPPMask: false,
      appSelOrder: [],
      refundStateMask: false, // 修改退款状态弹窗
      selAmount: {
        totalAmount: 0,
        cashTotal: 0,
        onlineTotal: 0
      } // erp 选中总款
    };
  },
  created() {
    this.query();
    this.getRefund();
    getInfo().then(res => {
      if (res.translinename) {
        this.APPQueryForm.tranposnames = res.translinename.toString();
        this.APPQuery();
      }
    });
  },
  mounted() {},
  methods: {
    handleClick(val) {
      this.isArction = Number(this.activeName);
      switch (this.isArction) {
        case 1:
          this.title = "收款单";
          break;
        case 2:
          this.title = "退款单";
          break;
        case 3:
          this.title = "Erp收款单";
          break;
      }
    },
    // 打开修改退款状态弹窗
    openRefundState() {
      const row = this.currentRow;
      if (row.id === undefined) {
        this.$message.warning("请选择订单");
        return;
      }
      if (row.refundState === "REFUND_SUCCESS") {
        this.$message.warning("该订单已退款成功，无需修改");
        return;
      }
      this.writeOffFrom.refundState = "REFUND_SUCCESS";
      this.writeOffFrom.id = row.id;
      this.refundStateMask = true;
    },
    // 修改退款状态
    updateRefundState() {
      this.$refs["refundStateForm"].validate(valid => {
        if (valid) {
          this.$http
            .get("stateMent/updateRecDocRefundState", {
              params: this.writeOffFrom
            })
            .then(res => {
              this.getRefund();
              this.handleClose();
            });
        }
      });
    },
    // erp 收款单多选
    handleSelectionChange(val) {
      this.selAmount = {
        totalAmount: 0,
        cashTotal: 0,
        onlineTotal: 0
      };
      this.appSelOrder = val;
      val.forEach(item => {
        this.selAmount.totalAmount = this.$math.add(
          item.total,
          this.selAmount.totalAmount
        );
        this.selAmount.cashTotal = this.$math.add(
          item.cashTotal,
          this.selAmount.cashTotal
        );
        this.selAmount.onlineTotal = this.$math.add(
          item.onlineTotal,
          this.selAmount.onlineTotal
        );
      });
    },
    // 删除app收款单
    delAPPOrder() {
      this.$refs["delForm"].validate(valid => {
        if (valid) {
          let loadingInstance = Loading.service({ fullscreen: true });
          this.$http
            .get("stateMent/delErpB2bOrderRecDoc", { params: this.delAPPForm })
            .then(() => {
              this.$message.success("删除成功");
              this.APPQuery();
              this.handleClose();
              loadingInstance.close();
            })
            .catch(() => {
              loadingInstance.close();
            });
        }
      });
    },
    // app Excel导出
    exportExcel() {
      let loadingInstance = Loading.service({ fullscreen: true });
      let url = "";
      if (this.isArction === 1) {
        url = "excel/getRecDocListExcel";
      } else if (this.isArction === 2) {
        url = "excel/getRefundRecDocListExcel";
      } else if (this.isArction === 3) {
        url = "excel/getErpB2bOrderRecDocExcel";
      }
      this.$http
        .get(url, { params: this.APPQueryForm })
        .then(res => {
          window.open(`${imgHost + res}`, "_blank");
          loadingInstance.close();
        })
        .catch(() => {
          loadingInstance.close();
        });
    },
    // app确认收款
    APPConfirmReceipt() {
      this.$refs["APPForm"].validate(valid => {
        if (valid) {
          let loadingInstance = Loading.service({ fullscreen: true });
          let ids = "";
          this.appSelOrder.forEach(item => {
            ids += item.id + ",";
          });
          this.collectionForm.ids = ids.substring(0, ids.length - 1);
          this.collectionForm.confirmTime += " 00:00:00";
          this.$http
            .get("stateMent/confirmErpB2bOrderRecDocList", {
              params: this.collectionForm
            })
            .then(res => {
              loadingInstance.close();
              this.$message.success("收款成功");
              this.APPQuery();
              this.handleClose();
            })
            .catch(err => {
              loadingInstance.close();
            });
        }
      });
    },
    // 打开app退款
    openRefund(row) {
      if (row.onlineTotal) {
        this.refundMask = true;
        this.refundForm = { id: row.id };
      }
    },
    // 打开确认收款
    openCollection() {
      // let row = this.currentRow;
      if (this.appSelOrder.length === 0) {
        this.$message.warning(`未选择收款单`);
        return;
      }
      let filter = this.appSelOrder.filter(item => {
        return item.confirmTime;
      });
      if (filter.length > 0) {
        let tmpNo = "";
        filter.forEach(item => {
          tmpNo += item.tmpNo + "，";
        });
        tmpNo = tmpNo.substring(0, tmpNo.length - 1);
        this.$message({
          message: `您选择的收款单里：${tmpNo} 已经确认收款`,
          type: "warning",
          duration: 0,
          showClose: true
        });
        return;
      }
      // every = this.appSelOrder.some(item => {
      //   return item.financeTrue !== 1;
      // });
      // if (every) {
      //   this.$message.warning(`选中的订单有未核销，请核销后在进行收款`);
      //   return;
      // }
      this.collectionMask = true;
    },
    // 打开app核销
    openAPPWriteOff() {
      if (this.appSelOrder.length === 0) {
        this.$message.warning(`未选择收款单`);
        return;
      }
      let filter = this.appSelOrder.filter(item => {
        return !item.confirmTime;
      });
      if (filter.length > 0) {
        let tmpNo = "";
        filter.forEach(item => {
          tmpNo += item.tmpNo + ",";
        });
        tmpNo = tmpNo.substring(0, tmpNo.length - 1);
        this.$message({
          message: `您选择的收款单里：${tmpNo} 未确认收款`,
          type: "warning",
          duration: 0,
          showClose: true
        });
        return;
      }
      filter = this.appSelOrder.filter(item => {
        return item.financeTrue === 1 || item.financeTrue === 2;
      });
      if (filter.length > 0) {
        let tmpNo = "";
        filter.forEach(item => {
          tmpNo += item.tmpNo + "，";
        });
        tmpNo = tmpNo.substring(0, tmpNo.length - 1);
        this.$message({
          message: `您选择的收款单里：${tmpNo} 有核销中或已核销`,
          type: "warning",
          duration: 0,
          showClose: true
        });
        return;
      }

      this.title = "Erp收款单";
      this.writeOffStatus = "APP";
      this.dialogVisible = true;
    },
    //app退款
    APPRefund() {
      this.$refs["refundForm"].validate(valid => {
        if (valid) {
          let loadingInstance = Loading.service({ fullscreen: true });
          this.$http
            .get("stateMent/refundErpB2bOrderRecDoc", {
              params: this.refundForm
            })
            .then(res => {
              loadingInstance.close();
              this.$message({
                message: `已经发起退款请求，等待（银行/微信/支付宝）审核，温馨提示：1、支付宝可能需要第二天才能到账`,
                type: "success",
                duration: 6000,
                showClose: true
              });
              this.APPQuery();
              this.handleClose();
            })
            .catch(err => {
              loadingInstance.close();
            });
        }
      });
    },
    // 核销
    handleEditAPPWriteOff() {
      this.$refs["writeOffForm"].validate(valid => {
        if (valid) {
          const { id, financeTrue, remark: financeRemark } = this.writeOffFrom;
          let loadingInstance = Loading.service({ fullscreen: true });
          this.$http
            .get("stateMent/updateFinanceErpB2bOrderRecDocVo", {
              params: { id, financeTrue, financeRemark }
            })
            .then(res => {
              loadingInstance.close();
              this.$message.success("已经加入核销队列，等待系统核销！");
              this.APPQuery();
              this.handleClose();
            })
            .catch(() => {
              loadingInstance.close();
            });
        }
      });
    },
    // APP 核销
    APPCollection() {
      this.$refs["dialogForm"].validate(valid => {
        if (valid) {
          let loadingInstance = Loading.service({ fullscreen: true });
          let ids = "";
          this.appSelOrder.forEach(item => {
            ids += item.id + ",";
          });
          ids = ids.substring(0, ids.length - 1);
          this.$http
            .get("stateMent/updateFinanceErpB2bOrderRecDocVos", {
              params: { ids, financeRemark: this.form.remark, financeTrue: 2 }
            })
            .then(res => {
              loadingInstance.close();
              this.$message.success("核销状态修改成功");
              this.APPQuery();
              this.handleClose();
            })
            .catch(() => {
              loadingInstance.close();
            });
        }
      });
    },
    // APP列表
    APPQuery(queryForm) {
      if (queryForm) {
        queryForm.tranposname =
          queryForm.tranposname === "全部" ? "" : queryForm.tranposname;
        this.APPQueryForm = queryForm;
      }
      this.APPLoading = true;
      this.$http
        .get("stateMent/getErpB2bOrderRecDocVoList", {
          params: this.APPQueryForm
        })
        .then(res => {
          this.APPTotal = res.total;
          this.APPList = res.records.map(item => {
            item.finance_true = this.setStaet(
              item.financeTrue,
              this.financeTrue
            );
            item.total = this.$math.add(item.cashTotal, item.onlineTotal);
            item.refund_state = this.setStaet(
              item.refundState,
              this.refundState
            );
            return item;
          });
        })
        .finally(() => {
          this.APPLoading = false;
        });
    },
    // 打开修改核销状态
    openWriteOff() {
      if (JSON.stringify(this.currentRow) === "{}") {
        this.$message.warning(`未选择${this.title}`);
        return;
      }
      if (this.currentRow.financeTrue !== 1 && this.currentRow !== 2) {
        this.currentRow.financeTrue = null;
      }
      this.writeOffFrom = { ...this.currentRow };
      this.writeOffMask = true;
    },
    // 核销状态修改
    handleEditwriteOff() {
      this.$refs["writeOffForm"].validate(valid => {
        if (valid) {
          const { orderId, financeTrue, remark } = this.writeOffFrom;
          let loadingInstance = Loading.service({ fullscreen: true });
          this.$http
            .get("order/reFinanceOrder", {
              params: { orderId, financeTrue, remark }
            })
            .then(res => {
              loadingInstance.close();
              this.$message.success("核销状态修改成功");
              this.query();
              this.getRefund();
              this.handleClose();
            })
            .catch(() => {
              loadingInstance.close();
            });
        }
      });
    },
    // 订单查看关闭
    orderSeeClose() {
      this.orderSeeMask = false;
      this.orderForm = {};
    },
    // 订单查看
    orderSee(row) {
      this.orderForm = { ...row };
      this.orderSeeMask = true;
    },
    query(queryForm) {
      this.loading = true;
      if (queryForm) {
        this.queryForm = queryForm;
      }
      this.$http
        .get("stateMent/getRecDocList", {
          params: { recMethod: "PAY_ORDER", ...this.queryForm }
        })
        .then(res => {
          this.financepData = res.records.map(item => {
            item.finance_true = this.setStaet(
              item.financeTrue,
              this.financeTrue
            );
            item.recType = this.setStaet(item.recType, this.recType);
            item.status = this.setStaet(item.status, this.status);
            item.order_state = this.setStaet(item.orderState, this.orderState);
            return item;
          });

          this.totalList = res.total;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    // 退款单数据
    getRefund(queryForm) {
      this.refundLoading = true;
      if (queryForm) {
        this.refundQueryForm = queryForm;
      }
      this.$http
        .get("stateMent/getRecDocList", {
          params: { recMethod: "REFUND", ...this.refundQueryForm }
        })
        .then(res => {
          this.refund = res.records.map(item => {
            item.finance_true = this.setStaet(
              item.financeTrue,
              this.financeTrue
            );
            item.rec_type = this.setStaet(item.recType, this.recType);
            item.status = this.setStaet(item.status, this.status);
            item.order_state = this.setStaet(item.orderState, this.orderState);
            item.rec_method = this.setStaet(item.recMethod, this.recMethod);
            item.exp_status = this.setStaet(item.expStatus, this.expStatus);
            item.refund_state = this.setStaet(
              item.refundState,
              this.refundState
            );
            return item;
          });

          this.refundTotal = res.total;
        })
        .finally(() => {
          this.refundLoading = false;
        });
    },
    // 收款单核销
    collection(row, status) {
      if (JSON.stringify(row) === "{}" || row === null) {
        this.$message.warning(`未选择${this.title}`);
        return;
      }
      if (status === "PAY_ORDER") {
        if (row.financeTrue !== 0 && row.financeTrue !== 3) return;
      } else if (status === "REFUND") {
        // console.log(row.financeTrue === 1 || row.refundState !== 'REFUND_SUCCESS');
        if (row.financeTrue === 1 || row.refundState !== "REFUND_SUCCESS")
          return;
      }
      if (status === "REFUND") {
        this.title = "退款单";
      } else if (status === "PAY_ORDER") {
        this.title = "收款单";
      }

      this.writeOffStatus = status;
      this.billId = row.id;
      this.dialogVisible = true;
    },
    // 退款
    handleRefund: _throttle(function() {
      this.$refs["refundForm"].validate(valid => {
        if (valid) {
          let loadingInstance = Loading.service({ fullscreen: true });
          this.$http
            .get("stateMent/refundRecDocOrder", {
              params: { ...this.refundForm }
            })
            .then(res => {
              this.$message({
                message: `已经发起退款请求，等待（银行/微信/支付宝）审核，温馨提示：1、支付宝可能需要第二天才能到账`,
                type: "success",
                duration: 6000,
                showClose: true
              });
              this.query();
              this.getRefund();
              this.handleClose();
              loadingInstance.close();
            })
            .catch(() => {
              this.handleClose();
              loadingInstance.close();
            });
        }
      });
    }, 1000),
    // 选中行
    handleCurrent(row) {
      if (row.financeTrue === 1) {
        this.btnType = "primary";
      } else {
        this.btnType = "info";
      }
      this.billId = row.id;
      this.currentRow = row;
      this.orderForm = { ...row };
    },
    // 核销
    handleWriteOff() {
      this.$refs["dialogForm"].validate(valid => {
        if (valid) {
          if (this.billId === null) return;
          let loadingInstance = Loading.service({ fullscreen: true });
          this.$http
            .get("stateMent/updateRecDocStatus", {
              params: { id: this.billId, ...this.form }
            })
            .then(res => {
              this.$message.success("已经加入核销队列，等待系统核销！");
              this.query();
              this.getRefund();
              this.handleClose();
              loadingInstance.close();
            })
            .catch(() => {
              loadingInstance.close();
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 订单明细
    toOrderInfo({ orderId: id }) {
      if (id === undefined || id === null) {
        this.$message.warning(`未选择${this.title}`);
        return;
      }
      this.$router.push({ path: "/order/details", query: { id } });
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
    // 编辑取消
    handleClose() {
      this.dialogVisible = false;
      this.billId = null;
      this.refundMask = false;
      this.collectionMask = false; // 确认收款弹窗
      this.form = {
        remark: "" // 核销备注
      };
      this.writeOffMask = false;
      this.writeOffFrom = {};
      this.refundForm = {};
      this.currentRow = {};
      this.collectionForm = {
        confirmTime: moment(new Date()).format("YYYY-MM-DD")
      };
      this.delAPPMask = false; // 删除erp订单弹窗
      this.delAPPForm = {};
      this.refundStateMask = false; // 退款状态修改弹窗
      if (this.$refs["form"]) {
        this.$refs["form"].resetFields();
      }
      if (this.$refs["APPForm"]) {
        this.$refs["APPForm"].resetFields();
      }
      if (this.$refs["writeOffForm"]) {
        this.$refs["writeOffForm"].resetFields();
      }
      if (this.$refs["refundStateForm"]) {
        this.$refs["refundStateForm"].resetFields();
      }
      if (this.$refs["delForm"]) {
        this.$refs["delForm"].resetFields();
      }
      if (this.$refs["refundForm"]) {
        this.$refs["refundForm"].resetFields();
      }
      if (this.$refs["dialogForm"]) {
        this.$refs["dialogForm"].resetFields();
      }
    },
    // 分页
    totalPagination({ page: current, limit: size }) {
      this.queryForm.current = current;
      this.query();
    },
    handleSizeChange({ page: current, limit: size }) {
      this.queryForm.size = size;
      this.query();
    },
    // 表格行变色
    tableRowClassName({ row, rowIndex }) {
      if (row.financeTrue === 3) {
        return "danger-row";
      }
      if (row.financeTrue !== 1) {
        return "warning-row";
      }
      return "";
    },
    // 退款单分页
    refundPagination({ page: current, limit: size }) {
      this.refundQueryForm.current = current;
      this.getRefund();
    },
    handleRefundSizeChange({ page: current, limit: size }) {
      this.refundQueryForm.size = size;
      this.getRefund();
    },
    // APP退款单分页
    APPPagination({ page: current, limit: size }) {
      this.APPQueryForm.current = current;
      this.APPQuery();
    },
    handleAPPSizeChange({ page: current, limit: size }) {
      this.APPQueryForm.size = size;
      this.APPQuery();
    },
    cellStyle(row, column, rowIndex, columnIndex) {
      // 根据报警级别显示颜色
      // console.log(row.column,handleColumn rowIndex, columnIndex);
      if (row.column.label === "订单明细") {
        return "background:#FFFFFF !important;";
      }
      return "";
    },
    // 金额计算
    nummatter(money) {
      return money ? "￥" + money : "0";
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
  // margin-top: 15px;
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
/deep/ .el-loading-spinner {
  font-size: 44px !important;
}
.pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .sele {
    width: 600px;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
