<template>
  <div style="margin: 0 10px">
    <Screen v-permission="'BillListLook'" :is-arction="isArction" @query="query" />
    <!-- 证照申请 -->
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
        <!-- <el-table-column
          slot="handleColumn"
          label="操作"
          width="190"
          fixed="right"
        >
          <template slot-scope="scope">
            <el-button
              v-permission="'BillListDetails'"
              size="mini"
              type="primary"
              @click="toOrderInfo(scope.row)"
            >查看</el-button>
            <el-button
              v-if="scope.row.status =='未支付'"
              v-permission="'BillListPay'"
              size="mini"
              type="danger"
              @click="collection(scope.row)"
            >去还款</el-button>
          </template>
        </el-table-column> -->
      </Tabel>
      <Pagination
        :total="total"
        @pagination="pagination"
        @handleSizeChange="handleSizeChange"
      />
    </div>
    <el-dialog
      :title="title + '核销'"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <el-form ref="form" :rules="rules" :model="form" label-width="80px">
        <p>核销方式：线下</p>
        <el-form-item label="核销备注" prop="remark">
          <el-input v-model.trim="form.remark" type="textarea" rows="3" />
        </el-form-item>
        <p class="lock">温馨提示：请确认是否收到客户还款</p>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <!--  -->
        <el-button type="primary" @click="handleWriteOff()">确 定</el-button>
        <el-button @click="handleClose">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import { _throttle } from '@/utils/public';
// const FsImg = () => import('@/components/FsImg');
const Pagination = () => import('@/components/Pagination');
const Tabel = () => import('@/components/Table');
const Screen = () => import('./components/screen');
// import Tabel from '@/components/Table';
export default {
  name: 'FinanceList',
  components: {
    Tabel,
    Pagination,
    Screen,
  },
  data() {
    return {
      queryForm: {
        size: 50,
        current: 1,
      },
      isArction: 1,
      loading: true,
      total: 1,
      billId: null, // 账单id
      dialogVisible: false, // 核销弹窗控制
      title: '账单', // 弹窗标题
      btnType: 'primary', // 按钮样式
      form: {
        remark: '', // 核销备注
      },
      columns: [
        {
          prop: 'memberId',
          label: 'b2b用户ID',
        },
        {
          prop: 'erpUserId',
          label: 'ERP用户ID',
        },
        {
          prop: 'userName',
          label: '用户名称',
          width: 200,
        },
        {
          prop: 'orderNo',
          label: '订单号',
          width: 250,
        },
        {
          prop: 'payAbcNo',
          label: '支付单号',
          width: 250,
        },
        {
          prop: 'pay_method',
          label: '支付方式',
        },
        {
          prop: 'payTime',
          label: '支付时间',
          width: 150
        },
        {
          prop: 'payTypeDoc',
          label: '支付说明',
        },
        {
          prop: 'totel',
          label: '实收款',
          formatter: 'nummatter',
        },
        {
          prop: 'recMethod',
          label: '收款类型',
        },
        {
          prop: 'refundMoney',
          label: '退款金额',
          formatter: 'nummatter',
        },
        {
          prop: 'payTime',
          label: '收款时间',
          width: 180,
        },
        {
          prop: 'status',
          label: '收款状态',
        },
        {
          prop: 'remark',
          label: '备注',
          width: 180,
        },
        {
          prop: 'createTime',
          label: '创建时间',
          width: 180,
        },
      ],
      financepData: [], // 收款单列表
      
      status: [
        { val: 'CANCEL', desc: '已取消' },
        { val: 'TO_PAY', desc: '待结算' },
        { val: 'DONE_PAY', desc: '已结算' }
      ],
      recType: [
        { val: 'ON_LINE', desc: '在线支付' },
        { val: 'CASH', desc: '现金' }
      ],
      recMethod: [
        { val: 'PAY_ORDER', desc: '下单' },
        { val: 'SHORT', desc: '短减' },
        { val: 'NO_ORDER', desc: '整单不出' },
        { val: 'REFUND', desc: '退款' },
        { val: 'REFUND_GOODS', desc: '退货' },
        { val: 'INTERCEPT', desc: '拦截退款' },
      ],
      // 支付方式
      payMethod: [
        { val: 'CASH', desc: '现结' },
        { val: 'MONTH', desc: '月结' },
        { val: 'ON_LINE', desc: '在线支付' },
      ],
      rules: {
        remark: [
          { required: true, message: '请输入核销备注', trigger: 'blur' },
        ],
      },
    };
  },
  created() {
    this.query();
  },
  methods: {
    query(queryForm) {
      this.loading = true;
      if (queryForm) {
        this.queryForm = queryForm;
      }
      this.$http
        .get('stateMent/getRecDocList', {
          params: { ...this.queryForm,payMethod:'ON_LINE' },
        })
        .then((res) => {
          this.financepData = res.records.map((item) => {
            item.recMethod = this.setStaet(item.recMethod, this.recMethod);
            item.status = this.setStaet(item.status, this.status);
            item.pay_method = this.setStaet(item.payMethod, this.payMethod);
            return item;
          });

          this.total = res.total;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    // 收款单核销
    collection() {
      // if (this.billId === null) {
      //   this.$message.warning("未选中" + this.title);
      //   return;
      // }
      this.dialogVisible = true;
    },
    // 选中行
    handleCurrent(row) {
      this.billId = row.id;
    },
    // 核销
    handleWriteOff() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.$http
            .get('stateMent/updateStatement', {
              params: { id: this.billId, ...this.form },
            })
            .then((res) => {
              this.$message.success('核销成功');
              this.query();
              this.handleClose();
            });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    // 订单明细
    toOrderInfo({ orderId: id }) {
      this.$router.push({ path: 'details', query: { id }});
    },
    // 更新状态
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
    // 编辑取消
    handleClose() {
      this.dialogVisible = false;
      this.billId = null;
      this.form = {
        remark: '', // 核销备注
      };
      this.$refs['form'].resetFields();
    },
    // 分页
    pagination({ page: current, limit: size }) {
      this.queryForm.current = current;
      this.query();
    },
    handleSizeChange({ page: current, limit: size }) {
      this.queryForm.size = size;
      this.query();
    },
  },
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
