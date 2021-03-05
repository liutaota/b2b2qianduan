<template>
  <el-dialog
    :visible.sync="orderMask"
    width="90%"
    :before-close="handleClose"
  >
    <Tabel
      :columns="columns"
      :table-data="orderList"
      :page-index="orderQueryForm"
    />
  </el-dialog>
</template>

<script>
const Tabel = () => import('@/components/Table');
export default {
  components: { Tabel },
  props: {
    orderMask: {
      type: Boolean,
      default: false,
    },
    orderList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      columns: [
        {
          prop: 'erpGoodsId',
          label: '商品编码',
        },
        {
          prop: 'currencyname',
          label: '商品名',
          width: 180
        },
        {
          prop: 'factoryname',
          label: '厂家',
          width: 200
        },

        {
          prop: 'goodsSpec',
          label: '规格',
        },
        {
          prop: 'medicinetypename',
          label: '剂型',
          width: 180
        },
        {
          prop: 'goodsunit',
          label: '单位',
        },
        {
          prop: 'goodsPrice',
          label: '原价',
          formatter: 'nummatter',
        },
        {
          prop: 'goodsPayPrice',
          label: '售价',
          formatter: 'nummatter',
        },
        {
          prop: 'goodsNum',
          label: '采购量',
        },
        {
          prop: 'sellNum',
          label: '发货量',
        },
        {
          prop: 'amountNum',
          label: '原价合计',
          formatter: 'nummatter',
        },
        {
          prop: 'amountPay',
          label: '优惠合计',
          formatter: 'nummatter',
        },
        {
          prop: 'goodsSpec',
          label: '备注',
          width: 200
        },
      ],
      orderQueryForm: {
        size: 100000,
        current: 1,
      }
    };
  },
  methods: {
    handleClose() {
      this.$emit('handleClose');
    }
  }
};
</script>

<style scoped>
</style>
