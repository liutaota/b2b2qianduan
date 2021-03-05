<template>
  <el-dialog
    :title="'退货'+titles"
    :visible.sync="dialogVisible"
    width="80%"
    :before-close="handleClose"
    :close-on-click-modal="false"
  >
    <div class="tabel_wrap">
      <Tabel :columns="columns" :table-data="tableData.detailData" :loading="loading" :is_height="280" />
    </div>
    <hr>
    <slot name="detailed" />
    <!-- 按钮 -->

    <slot name="footer" class="dialog-footer">
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="handleEdit('FAIL')">不通过</el-button>
        <el-button type="primary" @click="handleEdit('DEAL_WITH')">通 过</el-button>
        <el-button @click="handleCancel">取 消</el-button>
      </div>
    </slot>
  </el-dialog>
</template>

<script>
import Tabel from '@/components/Table';
export default {
  name: 'Dashboard',
  components: {
    Tabel
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: () => false
    },
    titles: {
      type: String,
      default: () => '详情'
    },
    tableData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      columns: [
        {
          prop: 'goodsId',
          label: '货品Id',
        },
        {
          prop: 'goodsName',
          label: '通用名',
          width: 220
        },
        {
          prop: 'lotId',
          label: '批号ID',
        },
        {
          prop: 'lotNo',
          label: '批号',
        },
        {
          prop: 'batchId',
          label: '批次ID',
        },
        {
          prop: 'goodstype',
          label: '规格',
          width: 120
        },
        {
          prop: 'goodsunit',
          label: '单位',
        },
        {
          prop: 'goodsNum',
          label: '数量',
        },
        {
          prop: 'sellNum',
          label: '可退数量',
        },
        {
          prop: 'goodsPayPrice',
          label: '金额',
          formatter: 'nummatter'
        },
        {
          prop: 'refundAmount',
          label: '小计',
          formatter: 'nummatter'
        },
        {
          prop: 'goodsNum',
          label: '退款数量',
        },
        {
          prop: 'reasonInfo',
          label: '退款原因',
        },
      ],
      loading: false
    };
  },
  methods: {
    handleEdit(status) {
      this.$emit('handleEdit',status);
    },
    handleClose() {
      this.$emit('handleCancel');
    },
    handleCancel() {
      this.$emit('handleCancel');
    }
  }
};
</script>
<style scoped lang="less" >
// 表格
.tabel_wrap{
    margin-bottom: 30px;
}

// 订单按钮
.dialog-footer{
    text-align: center;
}
</style>
