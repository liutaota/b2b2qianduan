<template>
  <div style="margin: 10px 10px 0">
    <!-- 筛选 -->
    <Screen @query="query" />
    <!-- 活动 -->
    <el-tabs v-model.trim="activeName" type="border-card" @tab-click="handleClick">
      <el-tab-pane :label="`全场折扣 (${fullDiscount.length})`" name="fullDiscount">
        <Tabel
          id="el-tabs"
          :width="200"
          :columns="columns"
          :is_height="280"
          :table-data="fullDiscount"
          :loading="loading"
          :page-index="queryForm"
          @handleCurrent="handleCurrent"
        />
      </el-tab-pane>
      <el-tab-pane :label="`商品折扣 (${discount.length})`" name="discount">
        <Tabel
          id="el-tabs"
          :width="200"
          :columns="columns"
          :is_height="280"
          :table-data="discount"
          :loading="loading"
          :page-index="queryForm"
          @handleCurrent="handleCurrent"
        />
      </el-tab-pane>
      <el-tab-pane :label="`满减 (${stepDown.length})`" name="stepDown">
        <Tabel
          id="el-tabs"
          :width="200"
          :columns="columns"
          :is_height="280"
          :table-data="stepDown"
          :loading="loading"
          :page-index="queryForm"
          @handleCurrent="handleCurrent"
        />
      </el-tab-pane>
      <el-tab-pane :label="`满赠 (${stepGift.length})`" name="stepGift">
        <Tabel
          id="el-tabs"
          :width="200"
          :columns="columns"
          :is_height="280"
          :table-data="stepGift"
          :loading="loading"
          :page-index="queryForm"
          @handleCurrent="handleCurrent"
        />
      </el-tab-pane>
      <el-tab-pane :label="`限时秒杀&amp;限时特价 (${flashSale.length})`" name="flashSale">
        <Tabel
          id="el-tabs"
          :width="200"
          :columns="columns"
          :is_height="280"
          :table-data="flashSale"
          :loading="loading"
          :page-index="queryForm"
          @handleCurrent="handleCurrent"
        />
      </el-tab-pane>
      <el-tab-pane :label="`赠优惠卷 (${freeCoupons.length})`" name="freeCoupons">
        <Tabel
          id="el-tabs"
          :width="200"
          :columns="columns"
          :is_height="280"
          :table-data="freeCoupons"
          :loading="loading"
          :page-index="queryForm"
          @handleCurrent="handleCurrent"
        />
        <!-- <Pagination :total="total" :hide-page="true" @pagination="pagination" /> -->
      </el-tab-pane>
      <el-tab-pane :label="`组合套餐 (${booth.length})`" name="booth">
        <Tabel
          id="el-tabs"
          :width="200"
          :columns="columns"
          :is_height="280"
          :table-data="booth"
          :loading="loading"
          :page-index="queryForm"
          @handleCurrent="handleCurrent"
        />
      </el-tab-pane>
      <Pagination :total="total" @pagination="pagination" @handleSizeChange="handleSizeChange" />
    </el-tabs>
    <!-- 活动策略  客户集合 -->
    <Strategy :id="id" :active-name="activeName" />
  </div>
</template>

<script>
import { _throttle } from '@/utils/public';
import Screen from './components/screen';
import Strategy from './components/strategy';
import Tabel from '@/components/Table';
import Pagination from '@/components/Pagination';
export default {
  name: 'ActivityStrategy',
  components: {
    Screen, Strategy, Tabel, Pagination
  },
  data() {
    return {
      loading: false,
      total: 0,
      id: null,
      activeName: 'fullDiscount',
      tab: '',
      queryForm: {
        size: 50,
        current: 1,
      },
      // 表格数据
      columns: [
        {
          prop: 'content',
          label: '促销内容',
          width: 240
        },
        {
          prop: 'abbreviation',
          label: '活动简称',
          width: 200
        },
        {
          prop: 'activity_strategy',
          label: '活动策略',
          width: 120
        },
        {
          prop: 'customSet_type',
          label: '集合类型',
          width: 100
        },
        {
          prop: 'warmTime',
          label: '预热时间',
          width: 160
        },
        {
          prop: 'week',
          label: '有效星期',
        },
        {
          prop: 'startEffectiveTime',
          label: '有效时间段',
          width: 160
        },
        {
          prop: 'startTime',
          label: '开始时间',
          width: 160
        },
        {
          prop: 'endTime',
          label: '结束时间',
          width: 160
        },
        {
          prop: 'timesStrategy',
          label: '限制策略',
        },
        {
          prop: 'times',
          label: '参与次数',
        },
        {
          prop: 'isSuperposition',
          label: '是否叠加',
        },
        {
          prop: 'createTime',
          label: '创建时间',
          width: 160
        },
        {
          prop: 'userId',
          label: '创建人',
        },
        {
          prop: 'isUse',
          label: '状态',
        },
      ],
      // 全场折扣
      fullDiscount: [],
      // 商品折扣
      discount: [],
      // 满减
      stepDown: [],
      // 满赠
      stepGift: [],
      // 赠优惠券
      freeCoupons: [],
      // 限时秒杀&限时特价
      flashSale: [],
      // 组合套餐
      booth: [],
      // 活动策略状态
      activityStrategy: [
        { val: 10, desc: '全场折扣' },
        { val: 20, desc: '商品折扣' },
        { val: 30, desc: '满减' },
        { val: 40, desc: '满赠' },
        { val: 50, desc: '赠优惠券' },
        { val: 60, desc: '限时秒杀&限时特价' },
        { val: 70, desc: '组合套餐' }
      ],
      // 集合类型状态
      customSetType: [
        { val: 1, desc: '全部可见' },
        { val: 2, desc: '部分可见' },
        // { val: U_VISIBLE', desc: '部分不可见' }
      ],
      // 限制策略状态
      timesStrategy: [
        { val: 0, desc: '全场一次' },
        { val: 1, desc: '每天' },
        { val: 2, desc: '周' },
        { val: 3, desc: '月' },
        { val: 4, desc: '年' }
      ],
      // 有效星期状态
      week: [
        { val: 0, desc: '全部' },
        { val: 1, desc: '周一' },
        { val: 2, desc: '周二' },
        { val: 3, desc: '周三' },
        { val: 4, desc: '周四' },
        { val: 5, desc: '周五' },
        { val: 6, desc: '周六' },
        { val: 7, desc: '周日' }
      ],
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
      this.loading = true;
      this.$http.get('goods/getActivityVoList', { params: { ...this.queryForm }}).then(res => {
        // 全场折扣
        this.fullDiscount = this.activeFieldArr(res.records, 10);
        // 商品折扣
        this.discount = this.activeFieldArr(res.records, 20);
        // 满减
        this.stepDown = this.activeFieldArr(res.records, 30);
        // 满赠
        this.stepGift = this.activeFieldArr(res.records, 40);
        // 赠优惠券
        this.freeCoupons = this.activeFieldArr(res.records, 50);
        // 限时秒杀&限时特价
        this.flashSale = this.activeFieldArr(res.records, 60);
        // 组合套餐
        this.booth = this.activeFieldArr(res.records, 70);
        res.records.forEach(item => {
          // 有效时间段
          item.startEffectiveTime = item.startEffectiveTime || '全天';
          // 是否叠加
          item.isSuperposition = item.isSuperposition === 1 ? '是' : '否';
          // 活动策略
          item.activity_strategy = this.setStaet(item.activityStrategy, this.activityStrategy);
          // 集合类型
          item.customSet_type = this.setStaet(item.customSetType, this.customSetType);
          // 限制策略
          item.timesStrategy = this.setStaet(item.timesStrategy, this.timesStrategy);
          // 有效星期
          item.week = this.setStaet(item.week, this.week);
        });
        this.total = res.total;
        if (this.fullDiscount.length === 0) return;
        this.id = this.fullDiscount[0].id || null;
      }).finally(() => {
        this.loading = false;
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
    // 分发数据
    activeFieldArr(Arrlist, Fiel) {
      return Arrlist.filter(item => {
        // console.log(item.activityStrategy, Fiel);
        // console.log(item.activityStrategy === Fiel);
        return item.activityStrategy === Fiel;
      });
    },
    // table表格切换
    handleClick(tab) {
      const activeName = this.activeName;
      this.id = null;
      // 切换获取id
      switch (activeName) {
        case 'fullDiscount':
          if (this.fullDiscount.length === 0) return;
          this.id = this.fullDiscount[0].id;
          break;
        case 'discount':
          if (this.discount.length === 0) return;
          this.id = this.discount[0].id || null;
          break;
        case 'stepDown':
          if (this.stepDown.length === 0) return;
          this.id = this.stepDown[0].id || null;
          break;
        case 'stepGift':
          if (this.stepGift.length === 0) return;
          this.id = this.stepGift[0].id || null;
          break;
        case 'flashSale':
          if (this.flashSale.length === 0) return;
          this.id = this.flashSale[0].id || null;
          break;
        case 'freeCoupons':
          if (this.freeCoupons.length === 0) return;
          this.id = this.freeCoupons[0].id || null;
          break;
        case 'booth':
          if (this.booth.length === 0) return;
          this.id = this.booth[0].id || null;
          break;
      }
    },
    // 编辑
    handleActivityEdit: _throttle(function() {}),
    // 删除
    ActivityDel: _throttle(function() {}),
    // 状态停用
    switchState() {},
    //   选中行
    handleCurrent(row) {
      this.id = row.id;
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
/deep/ .el-tabs__content {padding: 0 !important;}
.el-tabs {
  margin: 0 0 20px;
}
</style>
