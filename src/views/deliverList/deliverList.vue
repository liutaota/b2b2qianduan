<template>
  <div style="margin: 0 10px">
    <!-- 筛选 -->
    <Screen v-permission="'OrderListLook'" @query="query" @reset="reset" />
    <div class="orderBtn">
      <el-button
        v-permission="'DeliverListAdminReciverDetails'"
        type="primary"
        @click="handleDerails"
      >收款详情</el-button>
      <el-button
        v-permission="'DeliverListAdminExcel'"
        type="primary"
        @click="exportExcel"
      >Excel导出</el-button>
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
    >
    </Tabel>
    <!-- 分页器 -->
    <pagination
      :total="orderTotal"
      @pagination="orderPagination"
      @handleSizeChange="handleSizeChange"
    />
  </div>
</template>
<script>
import { _throttle } from '@/utils/public';
// 引入分页组件
import pagination from '@/components/Pagination';
import Tabel from '@/components/Table';
import Screen from './components/screen';
import {exportExcel} from '@/util.js'
export default {
  name: 'DeliverListAdmin',
  components: {
    pagination,
    Tabel,
    Screen,
  },
  data() {
    return {
      queryForm: {
        size: 50,
        current: 1,
        memberPhone: null,
        memberId: null,
        memberName: '',
      },
      // 订单类别
      orderList: [],
      // 表格显示数据
      columns: [
        {
          prop: 'customid',
          label: '客户id',
        },
        {
          prop: 'customname',
          label: '客户',
          width: 300,
        },
        {
          prop: 'settletype',
          label: '付款方式',
        },
        {
          prop: 'tranposname',
          label: '线路',
        },
        {
          prop: 'transortno',
          label: '线序',
        },
        {
          prop: 'zxPhone',
          label: '注册手机号',
          width: 180,
        },
        {
          prop: 'erpTotal',
          label: '订单金额',
          width: 120,
          formatter: 'nummatter',
        },
        {
          prop: 'address',
          label: '地址',
          width: 300,
        },
      ],
      // 日期
      pickerOptions: {
        shortcuts: [
          {
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date());
            },
          },
          {
            text: '昨天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', date);
            },
          },
          {
            text: '一周前',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', date);
            },
          },
        ],
      },
      orderTotal: 0,
      loading: true,
      orderId: null,
      id: null,
      updataState: null,
      dialogVisible: false,
      dialogVisibleIn: false, // 拦截弹窗
      delBtn: 'danger', // 删除按钮样式
      WOBtn: 'primary',
      maskWriteOff: false,
      // 订单状态
      orderState: [
        { val: 'CANCEL', desc: '已取消' },
        { val: 'UNPAID', desc: '未付款' },
        { val: 'TO_ERP', desc: '待下发' },
        { val: 'SEND_ERP', desc: '已下发' },
        { val: 'TO_SEND', desc: '拣货中' },
        { val: 'TO_DELIVERY', desc: '待收货' },
        { val: 'TO_RECEIVED', desc: '已收货' },
        { val: 'DONE', desc: '完成' },
        { val: 'APPLY_REFUND', desc: '申请退款' },
        { val: 'SUCCESS_REFUND', desc: '退款成功' },
        { val: 'INTERCEPT', desc: '待拦截' },
        { val: 'IN_REFUND', desc: '退款中' },
        { val: 'ERP_TO_RECEIVED', desc: 'erp已收货' },
      ],
      // 支付方式
      payMethod: [
        { val: 'CASH', desc: '现结' },
        { val: 'MONTH', desc: '月结' },
        { val: 'ON_LINE', desc: '在线支付' },
      ],
      exp_status: [
        { val: 'NORMAL', desc: '正常' },
        { val: 'ORDER_EXP', desc: 'erp异常' },
        { val: 'NO_ORDER', desc: '整单不出' },
        { val: 'SHORT', desc: '短减' },
        { val: 'OUT_TIME', desc: '超时' },
        { val: 'CATCH_EXP', desc: '未知异常' },
        { val: 'AMOUNT_EXP', desc: '金额异常' },
        { val: 'FINANCE_EXP', desc: '核销异常' },
      ],
      del_status: [
        { val: 0, desc: '未删除' },
        { val: 1, desc: '放入回收站' },
        { val: 2, desc: '彻底删除' },
      ],
      order_from: [
        { val: 1, desc: 'pc商城' },
        { val: 2, desc: '小程序' },
        { val: 3, desc: '代客下单' },
        { val: 5, desc: '小程序账单支付' },
        { val: 6, desc: 'pc账单核销' },
      ],
      currentRow: {},
      intercept_status: [
        { val: 'NORMAL', desc: '正常' },
        { val: 'TO_INTERCEPT', desc: '待拦截' },
        { val: 'INTERCEPT_SUCCESS', desc: '拦截成功' },
        { val: 'INTERCEPT_FAIL', desc: '拦截失败' },
      ],
      orderSeeMask: false, // 订单查看蒙版
      orderForm: {},
      rules: {
        noOrderRemark: [
          { required: true, message: '请输入整单不出备注', trigger: 'blur' },
        ],
        reErpRemark: [
          { required: true, message: '请输入重新下发备注', trigger: 'blur' },
        ],
      },
    };
  },
  mounted() {
    this.query();
  },
  methods: {
    // Excel导出
    exportExcel() {
      exportExcel('excel/getErpOrderInfoListExcel',this.queryForm)
    },
    orderSeeClose() {
      this.orderSeeMask = false;
      this.orderForm = {};
    },
    // 重置
    reset(queryForm) {
      this.queryForm = queryForm;
      this.queryForm.orderState = '';
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
        .get('order/getOrderInfoVoByTranslinename', {
          params: {
            ...form,
          },
        })
        .then((res) => {
          res.records.map((item) => {
            item.preferentialAmount = this.$math.subtract(item.orderAmount, item.goodsAmount);
            item.del_status = this.setStaet(item.deleteState, this.del_status);
            item.order_state = this.setStaet(item.orderState, this.orderState);
            item.pay_method = this.setStaet(item.payMethod, this.payMethod);
            item.exp_status = this.setStaet(item.expStatus, this.exp_status);
            item.order_from = this.setStaet(item.orderFrom, this.order_from);
            item.fp_status = item.fpStatus === 'ON' ? '已开' : '未开';
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
      stateArr.forEach((e) => {
        if (item === e.val) {
          state = e.desc;
          return;
        }
      });
      return state;
    },
    // 选中行
    handleCurrent(val) {
      this.id = val.customid;
      this.currentRow = val;
    },
    // 订单详情
    handleDerails() {
      if (this.id === null) {
        this.$message.info('未选择对应的订单');
        return;
      }
      const id = this.id;
      this.$router.push({ name: 'DeliverListAdminDetails', query: { id }});
      this.id = null;
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
    openStateEdit: _throttle(function (row) {
      this.dialogVisible = true;
      this.id = row.id;
      this.updataState = row.orderState;
    }),
    // 取消弹窗
    handleClose() {
      this.dialogVisible = false;
      this.id = null;
      this.updataState = '';
      this.maskWriteOff = false;
    },
    closeDialog() {
      this.dialogVisibleIn = false;
      this.currentRow = {};
      this.id = null;
    },
    // 订单查看
    orderSee(row) {
      this.orderForm = { ...row };
      this.orderSeeMask = true;
    },
    // 表格行变色
    tableRowClassName({ row, rowIndex }) {
      if (row.expStatus === 'FINANCE_EXP' || row.expStatus === 'NO_ORDER') {
        return 'danger-row';
      }
      if (row.expStatus === 'SHORT') {
        return 'warning-row';
      }
      return '';
    },
    // 改变单元格颜色
    cellStyle(row, column, rowIndex, columnIndex) {
      // 根据报警级别显示颜色
      // console.log(row.column,handleColumn rowIndex, columnIndex);
      if (row.column.label === '操作') {
        return 'background:#FFFFFF !important;';
      }
      return '';
    },
  },
};
</script>

<style scoped lang="less">
.orderBtn {
  float: left;
  margin: 0 0px 10px;
}

</style>
