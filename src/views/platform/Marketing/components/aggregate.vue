<template>
  <div style="margin-top:20px">
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="商品集合" name="goods">
        <Tabel
          :columns="goodsColumns"
          :table-data="list.goodsSetList"
          :loading="goodsLoading"
          :page-index="goodsForm"
        />
      </el-tab-pane>
      <el-tab-pane label="客户集合" name="customer">
        <Tabel
          :columns="customerColumns"
          :table-data="list.customerSetList"
          :loading="customerLoading"
          :page-index="customerForm"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
const Tabel = () => import('@/components/Table/index.vue');
export default {
  components: {
    Tabel
  },
  props: {
    list: {
      type: Object,
      default: () => {},
    }
  },
  data() {
    return {
      activeName: 'goods',
      goodsForm: {
        size: 50,
        current: 1,
      },
      // 商品集合
      goodsLoading: false,
      goodsColumns: [// 商品集合表格
        {
          prop: 'goodsSetId',
          label: '集合编号',
          width: 200
        },
        {
          prop: 'goodsSetName',
          label: '通用名',
          // width: 200
        },
      ],
      // 客户集合
      customerForm: {
        size: 50,
        current: 1,
      },
      customerLoading: false,
      customerColumns: [ // 客户集合表格
        {
          prop: 'customerSetId',
          label: '集合编号',
          width: 200
        },
        {
          prop: 'customerSetName',
          label: '通用名',
          // width: 200
        },
      ],
    };
  },
  created() {},
  methods: {
    query() {
      // 客户集合
      // this.$http.get('coupon/getCouponReceiveList', { params: { ...this.customerForm }}).then(res => {});
      // // 商品集合
      // this.$http.get('', { params: { ...this.goodsForm }}).then(res => {});
    },
  }
};
</script>

<style scoped lang="less">
/deep/ .el-tabs__content {padding: 0 !important;}
.el-tabs {
  margin: 0 0 20px;
}
</style>
