<template>
  <div style="margin: 0 10px">
    <!-- 筛选 -->
    <Screen v-permission="'InteceptLook'" @query="query" @reset="reset">
      <el-select
        slot="state"
        v-model.trim="queryForm.orderState"
        placeholder="请选择订单状态"
        style="margin-right: 13px"
        clearable
        @change="queryStatus"
      >
        <el-option label="已取消" value="CANCEL" />
        <el-option label="未付款" value="UNPAID" />
        <el-option label="待下发" value="TO_ERP" />
        <el-option label="已下发" value="SEND_ERP" />
        <el-option label="拣货中" value="TO_SEND" />
        <el-option label="待收货" value="TO_DELIVERY" />
        <el-option label="已收货" value="DONE" />
        <el-option label="申请退款" value="APPLY_REFUND" />
        <el-option label="退款成功" value="SUCCESS_REFUND" />
      </el-select>
      <el-select
        slot="state"
        v-model.trim="queryForm.orderFrom"
        placeholder="请选择订单来源"
        style="margin-right: 13px"
        clearable
        @change="queryStatus"
      >
        <el-option label="pc商城" value="1" />
        <el-option label="小程序" value="2" />
        <el-option label="代客下单" value="3" />
      </el-select>
    </Screen>

    <div class="divBox">
      <el-radio-group v-model.trim="interceptStatus" @change="query('')">
        <el-radio-button label="TO_INTERCEPT">待拦截</el-radio-button>
        <el-radio-button label="INTERCEPT_SUCCESS">拦截成功</el-radio-button>
        <el-radio-button label="INTERCEPT_FAIL">拦截失败</el-radio-button>
      </el-radio-group>
      <div class="orderBtn">
        <el-button v-permission="'InteceptDetails'" type="danger" @click="handleDerails">订单详情</el-button>
      </div>
    </div>
    <!-- 订单列表显示 -->
    <Tabel
      :columns="columns"
      :table-data="orderList"
      :loading="loading"
      :page-index="queryForm"
      @handleCurrent="handleCurrent"
    ><el-table-column
      v-if="interceptStatus === 'TO_INTERCEPT'"
      slot="handleColumn"
      label="操作"
      width="200"
      fixed="right"
    >
      <template slot-scope="scope">
        <el-button
          v-permission="'InteceptSure'"
          size="mini"
          type="primary"
          @click="openStateEdit('scope.row', true)"
        >确定拦截</el-button>
        <el-button
          v-permission="'InteceptCancel'"
          size="mini"
          type="danger"
          @click="openStateEdit(scope.row, false)"
        >取消拦截</el-button>
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
      title="拦截状态修改"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <div>
        <p>订单id：{{ currentRow.id }}</p>
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="备注" prop="remark">
            <el-input v-model.trim="form.interceptRemark" type="textarea" rows="3" />
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="updateOrderState">确 定</el-button>
      </span>
    </el-dialog>
    <ReIssue :re-erp-mask="reErpMask" @handleClose="handleClose" @handleReErp="handleReErp" />
  </div>
</template>
<script>
import { _throttle } from '@/utils/public';
import ReIssue from '@/components/reIssue/reIssue';
// 引入分页组件
import pagination from '@/components/Pagination';
import Tabel from '@/components/Table';
import Screen from './components/screen';
export default {
  name: 'OrderList',
  components: {
    pagination,
    Tabel,
    Screen,
    ReIssue
  },
  data() {
    return {
      queryForm: {
        size: 50,
        current: 1,
        memberPhone: null,
        memberId: null,
        memberName: '',
        startTime: '',
        endTime: '',
      },

      interceptStatus: 'TO_INTERCEPT',
      // 表格显示数据
      columns: [
        {
          prop: 'id',
          label: '订单id',
        },
        {
          prop: 'orderNo',
          label: '订单号',
          width: 180,
        },
        {
          prop: 'intercept_status',
          label: '拦截状态',
          width: 120,
        },
        {
          prop: 'interceptRemark',
          label: '拦截备注',
          width: 120,
        },
        {
          prop: 'interceptTime',
          label: '拦截时间',
          width: 180,
        },
        {
          prop: 'erpCustomerId',
          label: '客户id',
        },
        {
          prop: 'memberName',
          label: '客户',
          width: 300,
        },
        {
          prop: 'order_state',
          label: '订单状态',
        },
        {
          prop: 'exp_status',
          label: '异常状态',
        },
        {
          prop: 'telephone',
          label: '注册手机号',
          width: 120,
        },
        {
          prop: 'memberPhone',
          label: '下单电话',
          width: 120,
        },
        {
          prop: 'createTime',
          label: '下单时间',
          width: 150,
        },
        {
          prop: 'pay_method',
          label: '结算方式',
        },
        {
          prop: 'orderAmount',
          label: '订单金额',
          width: 120,
          formatter: 'nummatter',
        },
        {
          prop: 'order_from',
          label: '订单来源',
          width: 120,
        },
        {
          prop: 'invType',
          label: '发票类型',
          width: 130,
        },
        {
          prop: 'expRemark',
          label: '异常备注',
          width: 200,
        },
        {
          prop: 'del_status',
          label: '删除状态',
          width: 200,
        },
        {
          prop: 'addressDetail',
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
      // 订单类别
      orderList: [],
      orderTotal: 0,
      loading: true,
      orderId: null,
      id: null,
      updataState: null,
      dialogVisible: false,
      dialogVisibleIn: false, // 拦截弹窗
      // 支付方式
      orderState: [
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
      form: {},
      intercept_status: [
        { val: 'NORMAL', desc: '正常' },
        { val: 'TO_INTERCEPT', desc: '待拦截' },
        { val: 'INTERCEPT_SUCCESS', desc: '拦截成功' },
        { val: 'INTERCEPT_FAIL', desc: '拦截失败' },
      ],
      isSuccess: false,
      reErpMask: false,
      reErpId: null
    };
  },
  mounted() {
    this.query();
  },
  methods: {
    // 重新下发
    handleReErp(reErpForm) {
      if (this.reErpLoading) return;
      this.reErpLoading = true;
      reErpForm.id = this.reErpId;
      this.$http.get('order/reErpOrder', { params: reErpForm }).then((res) => {
        this.$message({
          type: 'success',
          message: '重新下发成功',
        });
        this.query();
        this.reErpLoading = false;
        this.handleClose();
      }).catch(() => {
        this.reErpLoading = false;
        this.handleClose();
      });
    },
    // 状态查询
    queryStatus() {
      this.query();
    },
    // 重置
    reset() {
      this.queryForm.orderState = '';
      this.query();
    },
    // 订单列表
    query(queryForm) {
      if (queryForm) {
        queryForm.orderState = this.queryForm.orderState;
        this.queryForm = queryForm;
      }
      const form = this.queryForm;
      // this.$http.get('enumData').then(res => {
      //   console.log(res);
      // });
      this.loading = true;
      this.$http
        .get('order/getOrderInfoInterceptList', {
          params: {
            ...form,
            interceptStatus: this.interceptStatus,
          },
        })
        .then((res) => {
          res.records.map((item) => {
            item.del_status = this.setStaet(item.deleteState, this.del_status);
            item.order_state = this.setStaet(item.orderState, this.orderState);
            item.pay_method = this.setStaet(item.payMethod, this.payMethod);
            item.exp_status = this.setStaet(item.expStatus, this.exp_status);
            item.order_from = this.setStaet(item.orderFrom, this.order_from);
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
      this.id = val.id;
      this.currentRow = val;
    },
    // 订单详情
    handleDerails() {
      if (this.id === null) {
        this.$message({
          type: 'info',
          message: '未选择对应的订单',
        });
        return;
      }
      const id = this.id;
      this.$router.push({ path: 'order/details', query: { id }});
    },
    // 重新下发订单
    handleIssue: _throttle(function (row) {
      if (row.order_state !== '已下发') return;
      this.reErpId = row.id;
      this.reErpMask = true;
    }, 1000),
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
    openStateEdit: _throttle(function (row, isSuccess) {
      this.isSuccess = isSuccess;
      this.dialogVisible = true;
      this.id = row.id;
      this.updataState = row.orderState;
    }),
    // 取消弹窗
    handleClose() {
      this.dialogVisible = false;
      this.id = null;
      this.updataState = '';
      this.reErpMask = false;
      this.reErpId = null;
    },
    // 更改状态
    updateOrderState: _throttle(function () {
      let interceptStatus = '';
      if (this.isSuccess) {
        interceptStatus = 'INTERCEPT_SUCCESS';
      } else {
        interceptStatus = 'INTERCEPT_FAIL';
      }
      this.$http
        .get('order/updateOrderInfoVoIntercept', {
          params: {
            id: this.id,
            interceptStatus,
            ...this.form,
          },
        })
        .then((res) => {
          this.handleClose();
          this.query();
        });
    }),
    // 删除订单
    handleDelOeder() {
      if (this.id === null) {
        this.$message.info('未选择对应的订单');
        return;
      }
      this.$http
        .get('order/adminDelOrderInfo', {
          params: { id: this.id, deleteState: 2 },
        })
        .then((res) => {
          this.$message.success('删除成功');
          this.query();
        });
    },
    // 打开订单拦截
    intercept() {
      if (this.id === null) {
        this.$message.info('未选择对应的订单');
        return;
      }
      this.dialogVisibleIn = true;
    },
    closeDialog() {
      this.dialogVisibleIn = false;
      this.currentRow = {};
    },
    // 订单拦截
    updateDialogVisibleIn() {
      this.$http
        .get('order/updateOrderInfoVoIntercept', {
          params: {
            id: this.currentRow.id,
            interceptStatus: this.currentRow.interceptStatus,
            ...this.form,
          },
        })
        .then((res) => {
          this.$message.success('操作成功');
          this.closeDialog();
          this.query();
        });
    },
    // 恢复订单
    handleRecoveryOeder() {
      if (this.id === null) {
        this.$message.info('未选择对应的订单');
        return;
      }
      this.$http
        .get('order/recoverDelMyOrderInfo', { params: { id: this.id }})
        .then((res) => {
          this.$message.success('恢复成功');
          this.query();
        });
    },
  },
};
</script>

<style scoped lang="less">
.divBox {
  display: flex;
}
.orderBtn {
  margin-left: 20px;
}
</style>
