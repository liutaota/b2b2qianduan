<template>
  <!-- 商品赠品列表 -->
  <el-tabs v-show="activeName !== 'fullDiscount'" v-model="active" type="border-card">
    <el-tab-pane label="活动商品" name="fullDiscount">
      <TableContainer :table-data="fullDiscount" :loading="loading" :columns="goodsColumns" :total="fullDisTotal" />
    </el-tab-pane>
    <el-tab-pane v-if="activeName === 'stepGift'" label="赠品列表" name="stepGift">
      <TableContainer :table-data="stepGift" :columns="giftColumns" :total="stepGiftTotal" />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import TableContainer from './tableContainer';
export default {
  components: {
    TableContainer
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
      active: 'fullDiscount',
      // 活动商品字段
      goodsColumns: [],
      // 赠品策略状态
      giftStrategy: [
        { val: 1, desc: '任选赠品数量' },
        { val: 2, desc: '任选赠品策略数量' },
        { val: 3, desc: '固定策略数量' },
        { val: 4, desc: '不赠' }
      ],
      // 赠品列表字段
      giftColumns: [
        { prop: 'erpGoodsId', label: '商品编号' },
        { prop: 'goodsName', label: '通用名' },
        { prop: 'goodsPrice', label: '赠品价格', formatter: 'nummatter' },
        { prop: 'storageId', label: '保管账id' },
        { prop: 'lotno', label: '批号' },
        { prop: 'erpAccflag', label: 'erp商品属性' },
        { prop: 'giftMultiple	', label: '赠送倍数' },
        { prop: 'giftNum', label: '赠品数量' },
        { prop: 'isUse', label: '是否启用' },
      ],
      // 活动商品数据
      fullDiscount: [],
      fullDisTotal: 0,
      // 赠品列表数据
      stepGift: [],
      stepGiftTotal: 0
    };
  },
  watch: {
    id(val) {
      this.active = 'fullDiscount';
      if (val === null) {
        this.fullDiscount = [];
        this.stepGift = [];
        return;
      }
      this.getActivityGoodsList(val);
    },
    activeName(val) {
      this.handleClick(val);
    }
  },
  created() {
    this.TableColumns();
  },
  methods: {
    // 活动商品
    getActivityGoodsList(asId) {
      // 活动商品
      this.loading = true;
      this.$http.get('goods/getActivityGoodsList', { params: { asId }}).then(res => {
        res.records.map(item => {
          // item.conditionNum /= 10000;
          // item.giftNum /= 10000;
        });
        this.fullDiscount = res.records;
        this.fullDisTotal = res.total;
      }).finally(() => {
        this.loading = false;
      });
      if (this.activeName !== 'stepGift') return;
      // 赠品列表
      this.$http.get('goods/getActivityGiftList', { params: { asId }}).then(res => {
        res.records.map(item => {
          item.erpAccflag = item.erpAccflag === 5 ? '赠品' : '商品';
          item.isUse = item.isUse === 0 ? '否' : '是';
          // item.conditionNum /= 10000;
          // item.giftNum /= 10000;
        });
        this.stepGift = res.records;
        this.stepGiftTotal = res.total;
      });
    },
    handleClick(name) {
      if (name === 'flashSale') {
        // 限时秒杀&限时特价
        this.$set(this.goodsColumns, 2, { prop: 'conditionNum', label: '最低数量' });
      }
    },
    TableColumns() {
      // 活动商品字段
      this.goodsColumns = [
        { prop: 'erpGoodsId', label: '商品编号' },
        { prop: 'goodsName', label: '通用名' },
        { prop: 'conditionNum', label: '满足数量' },
        { prop: 'topLimit', label: '商品上限' },
        { prop: 'conditionPrice', label: '满足金额', formatter: 'nummatter' },
        { prop: 'goodsPrice', label: '活动价格', formatter: 'nummatter' },
        { prop: 'isUse', label: '是否启用' },
      ];
    },
    handleSwith(row) {
      console.log(row, 'goodsGift');
    }
  }
};
</script>

<style scoped>
</style>
