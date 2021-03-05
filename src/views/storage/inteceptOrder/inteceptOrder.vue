<template>
  <div style="margin: 0 10px">
    <!-- 筛选 -->
    <!-- <Screen @query="query" @reset="reset">
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
    </Screen> -->
    <div class="tabs">
      <div class="search-wrap">
        <span
          class="tabTitle"
          :class="isArction === 1 ? 'Select' : ''"
          @click="isArction = 1"
        >待拦截</span>
        <span
          class="tabTitle border-right"
          :class="isArction === 2 ? 'Select' : ''"
          @click="isArction = 2"
        >拦截成功</span>
        <span
          class="tabTitle border-right"
          :class="isArction === 3 ? 'Select' : ''"
          @click="isArction = 3"
        >拦截失败</span>
        <!-- 筛选 -->
      </div>
    </div>
    <div class="divBox">
      <div class="orderBtn">
        <el-button v-permission="'InteceptOrderAdd'" type="primary" @click="handleDerails">新增数据</el-button>
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
      slot="handleColumn"
      label="操作"
      width="200"
      fixed="right"
    >
      <template slot-scope="scope">
        <el-button
          v-permission="'InteceptOrderSure'"
          size="mini"
          type="primary"
          @click="openStateEdit(scope.row, 'INTERCEPT_SUCCESS')"
        >确定拦截</el-button>
        <el-button
          v-permission="'InteceptOrderCancel'"
          size="mini"
          type="danger"
          @click="openStateEdit(scope.row, 'INTERCEPT_FAIL')"
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
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="b2b单号" prop="remark">
            <el-input v-model.trim="form.b2bOrderNo" />
          </el-form-item>
          <el-form-item label="erp订单号" prop="remark">
            <el-input v-model.trim="form.erpOrderNo" type="textarea" rows="3" />
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addInterceptOrder">确 定</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { _throttle } from '@/utils/public';
// 引入分页组件
import pagination from '@/components/Pagination';
import Tabel from '@/components/Table';
// import Screen from './components/screen';
export default {
  name: 'InteceptOrder',
  components: {
    pagination,
    Tabel,
    // Screen,
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
      isArction: 1,
      interceptStatus: 'TO_INTERCEPT',
      // 表格显示数据
      columns: [
        {
          prop: 'b2bOrderNo',
          label: 'b2b订单号',
        },
        {
          prop: 'erpOrderNo',
          label: 'erp订单号',
        },
        {
          prop: 'statusCode',
          label: '拦截状态',
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
      currentRow: {},
      form: {},
      status: [
        { val: 'NORMAL', desc: '正常' },
        { val: 'TO_INTERCEPT', desc: '待拦截' },
        { val: 'INTERCEPT_SUCCESS', desc: '拦截成功' },
        { val: 'INTERCEPT_FAIL', desc: '拦截失败' },
      ],
      isSuccess: false,
    };
  },
  watch: {
    isArction(val) {
      switch (val) {
        case 1:
          this.interceptStatus = 'TO_INTERCEPT';
          this.query();
          break;
        case 2:
          this.interceptStatus = 'INTERCEPT_SUCCESS';
          this.query();
          break;
        case 3:
          this.interceptStatus = 'INTERCEPT_FAIL';
          this.query();
          break;
      }
    },
  },
  mounted() {
    this.query();
  },
  methods: {
    // 重置
    reset() {
      this.queryForm.orderState = '';
      this.query();
    },
    // 订单列表
    query() {
      this.loading = true;
      this.$http
        .get('order/getManuallyInterceptList', {
          params: {
            ...this.queryForm,
            status: this.interceptStatus,
          },
        })
        .then((res) => {
          res.records.map((item) => {
            item.statusCode = this.setStaet(item.status, this.status);
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
    // 新增拦截订单
    handleDerails() {
      this.dialogVisible = true;
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
    // 状态修改
    openStateEdit: _throttle(function (row, isSuccess) {
      let code = '';
      if (isSuccess === 'INTERCEPT_FAIL') {
        code = '取消';
      }
      delete row.createTime;
      delete row.dealWithTime;
      this.$confirm('是否' + code + '拦截订单？', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(() => {
        this.$http.post('order/updateManuallyIntercept', { ...row, status: isSuccess }).then(res => {
          console.log(res);
          this.$message.success(code + '拦截成功');
          this.query();
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    }),
    // 取消弹窗
    handleClose() {
      this.dialogVisible = false;
      this.updataState = '';
      this.form = {};
    },
    // 新增手工拦截订单
    addInterceptOrder: _throttle(function () {
      this.$http
        .post('order/addManuallyIntercept', {
          ...this.form,
        })
        .then((res) => {
          this.$message.success('新增拦截订单成功');
          this.handleClose();
          this.query();
        });
    }),
  },
};
</script>

<style scoped lang="less">
.divBox {
  display: flex;
}
.orderBtn {
  margin-top: 10px;
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
</style>
