<template>
  <div>
    <!-- 客户策略列表 -->
    <el-tabs v-model.trim="active" type="border-card" style="margin-bottom:10px" @tab-click="handleClick">
      <el-tab-pane label="活动策略" name="strategy">
        <TableContainer
          :columns="strategyColumns"
          :table-data="strategyList"
          :loading="loading"
          :is_height="200"
          :total="strategyTotal"
          @handleCurrent="handleCurrent"
        />
      </el-tab-pane>
      <el-tab-pane label="客户集合" name="customer">
        <TableContainer
          :columns="customerColumns"
          :table-data="customerList"
          :loading="loading"
          :is_height="200"
          :total="customerTotal"
          @handleCurrent="handleCurrent"
        />
      </el-tab-pane>
    </el-tabs>
    <!-- 活动商品  赠品列表 -->
    <GoodsGift :id="activityId " :active-name="activeName" />
  </div>

</template>

<script>
import TableContainer from './tableContainer';
import GoodsGift from './goodsGift';
export default {
  components: {
    TableContainer, GoodsGift
  },
  props: {
    id: {
      type: Number,
      default: null
    },
    activeName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      loading: true,
      activityId: null,
      active: 'strategy',
      // 客户策略表格数据
      customerColumns: [
        { prop: 'activityId', label: '活动ID', },
        { prop: 'setname', label: '客户集合' },
        { prop: 'employeename', label: '建立人' },
        { prop: 'createTime', label: '创建时间' },
      ],
      // 客户集合数据
      customerList: [],
      customerTotal: 0,
      // 活动策略字段
      strategyColumns: [],
      strategyTotal: 0,
      // 活动策略数据列表
      strategyList: [],
      // 商品策略状态
      goodsStrategy: [
        { val: 1, desc: '任选商品数量' },
        { val: 2, desc: '任选商品策略数量' },
        { val: 3, desc: '任选商品金额' },
        { val: 4, desc: '任选商品策略金额' }
      ],
      // 赠品策略状态
      giftStrategy: [
        { val: 'GIFT_NUM', desc: '任选赠品数量' },
        { val: 'GIFT_STRATEGY_NUM', desc: '任选赠品策略数量' },
        { val: 'FIX_AMOUNT', desc: '固定策略数量' },
        { val: 'NO_GIFT', desc: '不赠' }
      ],
    };
  },
  watch: {
    id(val) {
      // 每次活动切换,选中策略
      this.active = 'strategy';
      if (val === null) {
        this.strategyList = [];
        this.customerList = [];
        this.activityId = null;
        return;
      }
      this.getActivityStrategyList(val);
    },
    activeName(val) {
      this.handleClick(val);
    }
  },
  mounted() {
    this.TableColumns();
  },
  methods: {
    getActivityStrategyList(activityId) {
    // 活动策略
      this.$http.get('goods/getActivityStrategyList', { params: { activityId }}).then(res => {
        res.records.forEach(item => {
          item.goodsStrategy = this.setStaet(item.goodsStrategy, this.goodsStrategy);
          item.giftStrategy = this.setStaet(item.giftStrategy, this.giftStrategy);
          item.topLimit = item.topLimit === 0 ? '无上限' : '';
          item.isUse = item.isUse === 0 ? '否' : '是';
          // item.meetQuantity /= 10000;
          // item.discount /= 10000;
          // item.amountSatisfied /= 10000;
          // item.reducedAmount /= 10000;
        });
        this.strategyList = res.records;
        this.strategyTotal = res.total;
        if (res.records.length === 0) return;
        this.activityId = res.records[0].id || null;
      }).finally(() => {
        this.loading = false;
      });
      // 客户集合
      this.$http.get('goods/getActivitySetList', { params: { activityId }}).then(res => {
        this.customerList = res.records;
        this.customerTotal = res.total;
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
    handleClick() {
      const activeName = this.activeName;
      // 切换后表格数据重新赋值
      this.TableColumns();
      // 根据类型添加数据
      if (activeName === 'stepGift') {
        // 满赠
        const strategyColumns = [
          { prop: 'goodsStrategy', label: '商品策略' },
          { prop: 'meetQuantity', label: '满足数量' },
          { prop: 'topLimit', label: '商品上限' },
          { prop: 'discount', label: '折扣' },
          { prop: 'amountSatisfied', label: '满足金额', formatter: 'nummatter', },
          { prop: 'cash', label: '返现金' },
          { prop: 'couponId', label: '优惠卷' },
          { prop: 'giftStrategy', label: '赠品策略' },
          { prop: 'isUse', label: '是否启用' },
        ];
        this.strategyColumns.splice(1, 10, ...strategyColumns);
      } else if (activeName === 'flashSale') {
        this.strategyColumns = [
          { prop: 'strategyName', label: '策略名字' },
          { prop: 'goodsStrategy', label: '商品策略' },
          { prop: 'isUse', label: '是否启用' },
        ];
      }
    },
    handleCurrent(row) {
      this.activityId = row.id;
    },
    // 表格字段数据封装
    TableColumns() {
      // 活动策略字段
      this.strategyColumns = [
        { prop: 'strategyName', label: '策略名字' },
        { prop: 'discount', label: '折扣' },
        { prop: 'amountSatisfied', label: '满足金额', formatter: 'nummatter', },
        { prop: 'reducedAmount', label: '优惠金额', formatter: 'nummatter', },
        { prop: 'isUse', label: '是否启用' },
      ];
    },
  }
};
</script>

<style scoped>
</style>
