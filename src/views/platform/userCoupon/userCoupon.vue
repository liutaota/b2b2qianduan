<template>
  <div style="margin-left: 10px">
    <!-- 筛选 -->
    <el-row>
      <el-col :span="24">
        <div
          v-permission="'UserCouponLook'"
          class="row-col"
          style="margin-top: 10px; font-size: 12px"
          @keyup.enter="query()"
        >
          <el-input
            v-model.trim="TotalList.userName"
            placeholder="请输入用户名称"
            style="width: 145px; margin-right: 10px"
            clearablex
            size="small"
          />
          <el-input
            v-model.trim="TotalList.telephone"
            placeholder="请输入用户手机号"
            style="width: 145px; margin-right: 10px"
            clearablex
            size="small"
          />
          <el-input
            v-model.trim="TotalList.couponCode"
            placeholder="请输入优惠卷码"
            style="width: 145px; margin-right: 10px"
            clearablex
            size="small"
          />
          <el-select
            slot="state"
            v-model.trim="TotalList.status"
            placeholder="请选择优惠卷状态"
            style="margin-right: 13px"
            clearable
          >
            <el-option
              v-for="(item, index) of couponStatus"
              :key="index"
              :label="item.desc"
              :value="item.val"
            />
          </el-select>
          <el-date-picker
            v-model.trim="createDate"
            type="datetimerange"
            align="right"
            style="width: 340px; margin-right: 13px"
            unlink-panels
            range-separator="至"
            start-placeholder="有效期"
            end-placeholder="有效期"
            value-format="yyyy-MM-dd HH:mm:ss"
            :picker-options="pickerOptions"
            :default-time="['00:00:00', '23:59:59']"
            clearable
            @change="queryTime"
          />
          <el-button
            type="primary"
            icon="el-icon-search"
            @click="handleSearch"
          >查询</el-button>
          <el-button
            type="info"
            @click="
              TotalList = { size: 50, current: 1 };
              createDate = [];
              query();
            "
          >重置</el-button>
        </div>
      </el-col>
    </el-row>
    <el-button
      v-permission="'UserCouponDel'"
      type="danger"
      style="margin-top: 10px"
      @click="handleDel"
    >删除</el-button>
    <!-- 表单 -->
    <Tabel
      ref="singleTable"
      :columns="columns"
      :table-data="giveRiseList"
      :loading="loading"
      :page-index="TotalList"
      @handleCurrent="handleCurrent"
      @handleSelectionChange="handleSelectionChange"
    >
      <el-table-column slot="index" type="selection" />
    </Tabel>
    <Pagination
      :total="total"
      @pagination="totalPagination"
      @handleSizeChange="handleSizeChange"
    />
  </div>
</template>

<script>
import { _throttle } from '@/utils/public';
// import TableMove from '@/components/TableMove';
import Pagination from '@/components/Pagination';
// import Edit from './components/Edit';
const Tabel = () => import('@/components/Table');
export default {
  name: 'Parameter',
  components: {
    Pagination,
    Tabel,
  },
  data() {
    return {
      loading: true,
      giveRiseList: [],
      // 页码
      total: 1,
      // 搜索
      TotalList: {
        size: 50,
        current: 1,
      },
      current: {},
      currentRow: {},
      rowIndex: null,
      couponStatus: [
        { val: 'UNUSED', desc: '未使用' },
        { val: 'USE', desc: '已使用' },
        { val: 'TO_RECEIVE', desc: '待领取' },
        { val: 'OVERDUE', desc: '已过期' },
        { val: 'DEL', desc: '已废弃' },
      ],
      columns: [
        {
          prop: 'userName',
          label: '用户名称',
        },
        {
          prop: 'telephone',
          label: '手机号',
        },
        {
          prop: 'couponName',
          label: '优惠卷名称',
        },
        {
          prop: 'useStartTime',
          label: '可用开始时间',
        },
        {
          prop: 'useEndTime',
          label: '可用结束时间',
        },
        {
          prop: 'couponCode',
          label: '优惠卷码',
        },
        {
          prop: 'couponStatus',
          label: '状态',
        },
      ],
      // 日期
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            },
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            },
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            },
          },
        ],
      },
      ids: '',
      createDate: [],
    };
  },
  watch: {
    TotalList: {
      handler(val) {
        if (val.name === '') {
          this.query();
        }
      },
      deep: true,
    },
  },
  mounted() {
    this.query();
  },
  methods: {
    queryTime(val) {
      if (val) {
        this.TotalList.startTime = val[0];
        this.TotalList.endTime = val[1];
      } else {
        this.TotalList.startTime = '';
        this.TotalList.endTime = '';
      }
      this.query();
    },
    query() {
      this.loading = true;
      this.$http
        .get('coupon/getCouponReceiveList', { params: { ...this.TotalList }})
        .then((res) => {
          res.records.map((item) => {
            item.couponStatus = this.setStaet(item.status, this.couponStatus);
          });
          this.giveRiseList = res.records;
          this.total = res.total;
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
    // 筛选
    handleSearch() {
      this.TotalList.size = 20;
      this.TotalList.current = 1;
      this.query();
    },
    // 分页
    totalPagination({ page: current, limit: size }) {
      this.TotalList.current = current;
      this.query();
    },
    handleSizeChange({ page: current, limit: size }) {
      this.TotalList.size = size;
      this.query();
    },
    // 打开编辑
    editUpdata: _throttle(function (row) {
      this.deliveryEdit = true;
      this.current = { ...row };
    }),
    // 选中行事件
    handleCurrent(val) {
      if (val === null) return;
      this.currentRow = { ...val };
      // 获取下标
      const index = this.giveRiseList.findIndex((item) => {
        return val.id === item.id;
      });
      this.ids = val.id;
      this.rowIndex = index;
    },
    handleSelectionChange(val) {
      let ids = '';
      val.map((item) => {
        ids += item.id + ',';
      });
      ids = ids.substring(0, ids.length - 1);
      this.ids = ids;
    },
    handleDel() {
      if (this.ids === '') {
        this.$message.info('未选中客户');
        return;
      }
      this.$http
        .get('coupon/delCouponReceive', { params: { ids: this.ids }})
        .then((res) => {
          this.$message.success('删除成功');
          this.query();
        });
    },
  },
};
</script>

<style>
</style>
