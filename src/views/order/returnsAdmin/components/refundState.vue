<template>
  <el-dialog
    title="退款状态更新"
    :visible.sync="dialogVisible"
    width="30%"
    :before-close="handleClose"
  >
    <ul class="StateList">
      <li>
        <div>退货单号：</div>
        <div>{{ tableData.applyNo }}</div>
      </li>
      <li>
        <div>退货时间：</div>
        <div>{{ tableData.createTime }}</div>
      </li>
      <li>
        <div>客户：</div>
        <div>{{ tableData.memberName }}</div>
      </li>
      <li>
        <div>退货总金额：</div>
        <div>{{ tableData.refundAmount ? '￥' + (tableData.refundAmount) : '0' }}</div>
      </li>
      <li>
        <div>退货单状态：</div>
        <div><el-select v-model.trim="value" placeholder="请选择">
          <el-option label="待审核" value="PENDING" />
          <el-option label="处理中" value="DEAL_WITH" />
          <el-option label="待发货" value="TO_SEND" />
          <el-option label="待收货" value="TO_DELIVERY" />
          <el-option label="待验收" value="UN_DELIVERY" />
          <el-option label="已收货" value="DELIVERY_DONE" />
          <el-option label="已完成" value="DONE" />
          <el-option label="不通过" value="FAIL" />
          <el-option label="erp下发异常" value="ORDER_EXP" />
        </el-select></div>
      </li>
    </ul>
    <!-- 按钮 -->
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleEdit">确 定</el-button>
      <el-button @click="handleCancel">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { _throttle } from '@/utils/public';
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: () => false
    },
    tableData: {
      type: Object,
      default: () => {}
    },
  },
  data() {
    return {
      value: ''
    };
  },
  watch: {
    tableData: {
      handler(val) {
        console.log(this.tableData);
        this.value = val.refundState;
      },
      deep: true,
    }
  },
  methods: {
    // 发送请求
    handleEdit: _throttle(function() {
      this.$emit('handleEdit', this.value);
    }, 1000),
    // 取消
    handleCancel() {
      this.$emit('handleCancel');
    },
    // 关闭蒙版
    handleClose() {
      this.$emit('handleCancel');
    },
  }
};
</script>

<style scoped lang="less">
   .orderBtn{
    float: right;
    margin:0 10px 10px;
  }
  // 订单状态列表
  .StateList{
    list-style: none;
    margin: 0;
    padding: 0;
    li {
      display: flex;
      line-height: 35px;
      div{
        flex: 4;
        &:nth-child(1){
          text-align: right;
          margin-right: 10px;
        }
        &:nth-child(2){
          flex: 6;
        }
      }
    }
  }
</style>
