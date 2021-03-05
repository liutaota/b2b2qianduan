<template>
  <div style="margin: 0 10px">
    <screen v-permission="'MarketingLook'" @query="query" />
    <div class="goodsBtn" style="margin-right: 10px">
      <el-button v-permission="'MarketingAdd'" type="primary" @click="addMask = true">新增</el-button>
      <el-button v-permission="'MarketingEdit'" type="primary" @click="handleEdit">编辑</el-button>
      <el-button v-permission="'MarketingDel'" type="danger" @click="handleDel">删除</el-button>
      <el-button v-permission="'MarketingCustomerSend'" type="primary" @click="handleAdminGive">客户赠送</el-button>
      <el-button v-permission="'MarketingSend'" type="primary" @click="handleAdminGiveSet">集合赠送</el-button>
    </div>
    <Tabel
      :columns="columns"
      :table-data="marketingList"
      :loading="loading"
      :page-index="queryForm"
      @handleCurrent="handleCurrent"
    >
      <el-table-column slot="handleState" label="是否发放">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.isReceive"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="1"
            :inactive-value="0"
            @change="handleIsReceive(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column slot="handleColumn" label="是否可用">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.isUse"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="1"
            :inactive-value="0"
            @change="handleIsUse(scope.row)"
          />
        </template>
      </el-table-column>
    </Tabel>
    <Pagination
      :total="total"
      @pagination="totalPagination"
      @handleSizeChange="handleSizeChange"
    />
    <!-- 客户与商品集合 -->
    <aggregate :list="list" />
    <!-- 新增 -->
    <addEditForm
      :dialog-visible="addMask"
      :form="addForm"
      :title="'新增'"
      @onSubmit="handleAddCoupon"
      @cancel="cancel"
      @couponSelect="couponSelect"
    />
    <!-- 编辑 -->
    <addEditForm
      :dialog-visible="editMask"
      :form="currentRow"
      :title="'编辑'"
      @onSubmit="handleEditCoupon"
      @cancel="cancel"
    />
    <!-- 后台赠送弹窗 -->
    <adminGive
      :dialog-visible="adminGiveMask"
      :is-coupon="isCoupon"
      :form="memberForm"
      :member="member"
      :aggregate="aggregate"
      :marketing-list="marketingList"
      @handleMembeListSet="handleMembeListSet"
      @onSubmit="handleCouponToMember"
      @cancel="cancel"
      @isCoupon="getCoupon"
    />
  </div>
</template>

<script>
const Tabel = () => import('@/components/Table/index.vue');
const screen = () => import('./components/screen.vue');
const aggregate = () => import('./components/aggregate.vue');
const adminGive = () => import('./components/adminGive.vue');
const addEditForm = () => import('./components/addEditForm.vue');
import Pagination from '@/components/Pagination';
export default {
  name: 'Marketing',
  components: {
    screen, Tabel, aggregate, adminGive, addEditForm, Pagination
  },
  data() {
    return {
      loading: false, // 数据加载
      queryForm: {
        size: 50,
        current: 1,
      },
      columns: [ // 表格内容
        {
          prop: 'id',
          label: '优惠卷Id',
        },
        {
          prop: 'couponName',
          label: '优惠卷名称',
          width: 170
        },
        {
          prop: 'couponType',
          label: '优惠卷类型',
          width: 100
        },
        {
          prop: 'price',
          label: '面值',
          width: 100,
          formatter: 'nummatter',
        },
        {
          prop: 'explain',
          label: '优惠卷描述',
          width: 200
        },
        {
          prop: 'couponAccept',
          label: '总数量',
          width: 100

        },
        {
          prop: 'remainNum',
          label: '剩余数量',
          width: 100
        },
        {
          prop: 'usedAmount',
          label: '已使用数量',
          width: 100
        },
        {
          prop: 'fullAmount',
          label: '满足金额',
          width: 100,
          formatter: 'nummatter',
        },
        {
          prop: 'reduceAmount',
          label: '优惠金额',
          width: 100,
          formatter: 'nummatter',
        },
        {
          prop: 'limitNum',
          label: '限领数量',
          width: 100

        },
        {
          prop: 'receiveStartTime',
          label: '领取开始时间',
          width: 200
        },
        {
          prop: 'receiveEndTime',
          label: '领取结束时间',
          width: 200
        },
        {
          prop: 'useStartTime',
          label: '使用开始时间',
          width: 200
        },
        {
          prop: 'useEndTime',
          label: '使用结束时间',
          width: 200
        },
        {
          prop: 'createTime',
          label: '创建时间',
          width: 200
        },
      ],
      marketingList: [], // 优惠卷数据
      currentRow: {}, // 选中行数据
      adminGiveMask: false, // 后台赠送 弹窗
      member: '', // 后台赠品控制显示集合
      addMask: false, // 新增弹窗
      addForm: {
        goodsSetType: 'PART'
      }, // 新增表单数据
      editMask: false, // 编辑弹窗
      editForm: {}, // 编辑表单数据
      memberForm: {}, // 后台赠送客户数据
      aggregate: {},
      isCoupon: false,
      couponForm: null,
      total: 0,
      list: {
        customerSetList: [], // 客户集合
        goodsSetList: [], // 货品集合
      },
    };
  },
  created() {
    this.query();
  },
  methods: {
    query(queryForm) {
      if (queryForm) {
        this.queryForm = queryForm;
      }
      this.$http.get('coupon/getCouponList', { params: { ...this.queryForm }}).then(res => {
        // 设置优惠卷类型
        res.records.map(item => {
          switch (item.type) {
            case 'FULL_REDUCTION_TICKET':
              item.couponType = '满减券';
              break;
            case 'FULL_PRESENT_TICKET':
              item.couponType = '折扣券';
              break;
            case 'CASH_TICKET':
              item.couponType = '现金券';
              break;
            default:
              break;
          }
          item.price = item.reduceAmount || item.discount;
          if (!item.reduceAmount) {
            item.isPrice = true;
          }
          // item.discounts = item.discount / 10000;
          // item.fullAmounts = item.fullAmount / 10000;
          // item.reduceAmounts = item.reduceAmount / 10000;
        });
        this.total = res.total;
        this.marketingList = res.records;
      });
    },
    getCoupon(val) {
      this.isCoupon = val;
    },
    // 新增优惠卷
    handleAddCoupon(form) {
      this.$http.post('coupon/addCoupon', { ...form }).then(res => {
        this.$message.success('新增优惠卷成功');
        this.query();
        this.cancel();
      });
    },
    // 编辑优惠卷
    handleEditCoupon(form) {
      this.$http.post('coupon/updateCoupon', { ...form }).then(res => {
        this.$message.success('编辑优惠卷成功');
        this.query();
        this.cancel();
        this.currentRow = {};
      });
    },
    // 是否发放
    handleIsReceive(row) {
      const { id, isReceive } = row;
      this.$http.get('coupon/cutIsReceive', { params: { id, isReceive }}).then(res => {
        if (isReceive === 0) {
          this.$message.success('关闭成功');
        } else if (isReceive === 1) {
          this.$message.success('开启成功');
        }
        this.query();
      });
    },
    // 是否可用
    handleIsUse(row) {
      const { id, isUse } = row;
      this.$http.get('coupon/downCoupon', { params: { id, isUse }}).then(res => {
        if (isUse === 0) {
          this.$message.success('关闭成功');
        } else if (isUse === 1) {
          this.$message.success('开启成功');
        }
        this.query();
      });
    },
    // 后台赠送
    handleCouponToMember(form, isExist) {
      const { giveNum, couponId } = form;
      let customerIdList = '';
      form.customerSetList.forEach(item => {
        customerIdList += item.customerSetId + ',';
      });
      customerIdList = customerIdList.substring(0, customerIdList.length - 1);
      this.couponForm = form;
      this.$http.get('coupon/adminGiveCouponToMember', { params: { customerIdList, couponId, giveNum, isExist }}).then(res => {
        this.$message.success('赠送客户成功');
        this.query();
        this.cancel();
        this.isCoupon = true;
      });
    },
    handleMembeListSet(form) {
      const { couponId, giveNum, customerSetList } = form;
      this.$http.post('coupon/adminGiveCouponToMemberSet', { couponId, giveNum, customerSetList }).then(res => {
        this.$message.success('赠送客户成功');
        this.query();
        this.cancel();
        this.isCoupon = true;
      });
    },
    // 编辑
    handleEdit() {
      if (this.currentRow.id === undefined) {
        this.$message.warning('请选中需要编辑优惠卷');
        return;
      }
      this.editMask = true;
    },
    // 删除
    handleDel() {
      if (this.currentRow.id === undefined) {
        this.$message.warning('请选中需要删除的优惠卷');
        return;
      }
      this.$confirm('是否要删除改优惠卷? 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.get('coupon/delCoupon', { params: { id: this.currentRow.id }}).then(res => {
          this.$message.success('删除成功');
          this.currentRow = {};
        });
      }).catch(() => {
        this.$message.info('已取消删除');
        this.currentRow = {};
      });
    },
    // 后台赠送
    handleAdminGive() {
      this.adminGiveMask = true;
      this.member = 'memberId';
      this.aggregate = {
        path: 'member/getCustomerByCustomerInfo',
        listKey: {
          key: 'customid',
          label: 'customname',
        },
        tabTitle: '客户',
        search: {
          key: 'id',
          label: 'name'
        },
      };
    },
    // 集合赠送
    handleAdminGiveSet() {
      this.adminGiveMask = true;
      this.member = 'memberList';
      this.aggregate = {
        path: 'member/getAdminMemberList',
        listKey: {
          key: 'customsetid',
          label: 'customsetname',
        },
        tabTitle: '集合',
        search: {
          key: 'customsetid',
          label: 'customsetname'
        },
      };
    },
    // 选中行
    handleCurrent(val) {
      const receiveTime = [];
      const useTime = [];
      //   可领取时间
      receiveTime[0] = val.receiveStartTime;
      receiveTime[1] = val.receiveEndTime;
      val.receiveTime = receiveTime;
      //   可使用时间
      useTime[0] = val.useStartTime;
      useTime[1] = val.useEndTime;
      val.useTime = useTime;
      // 客户集合类型
      val.memberType = val.customSetType;
      val.goodsType = val.goodsSetType;
      this.currentRow = { ...val };
      this.list.customerSetList = val.customerSetList || [];
      this.list.goodsSetList = val.goodsSetList || [];
    },
    // 取消弹窗
    cancel() {
      this.adminGiveMask = false;
      this.addMask = false;
      this.editMask = false;
      this.currentRow = {};
      this.memberForm = {};
      this.addForm = {};
    },
    couponSelect() {
      // if (this.addForm.type === 'FULL_REDUCTION_TICKET') {
      //   this.addForm.discounts = '';
      // } else if (this.addForm.type === 'FULL_PRESENT_TICKET') {
      //   this.addForm.reduceAmount = '';
      //   this.addForm.fullAmount = '';
      // } else if (this.addForm.type === 'CASH_TICKET') {
      //   this.addForm.fullAmount = '';
      //   this.addForm.discounts = '';
      // }
    },
    totalPagination({ page: current, limit: size }) {
      this.queryForm.current = current;
      this.query();
    },
    handleSizeChange({ page: current, limit: size }) {
      this.queryForm.size = size;
      this.query();
    },
  }
};
</script>

<style scoped>
</style>
