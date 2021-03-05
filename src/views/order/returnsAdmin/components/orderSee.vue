<template>
  <div>
    <ul class="flexbox">
    <li>
      <div>
        <div>退货单ID</div>
        <div>{{ orderForm.id }}</div>
      </div>
      <div>
        <div>退货单号</div>
        <div>{{ orderForm.applyNo }}</div>
      </div>
    </li>
    <li>
      <div>
        <div>原单ID</div>
        <div>{{ orderForm.orderId }}</div>
      </div>
      <div>
        <div>原单单号</div>
        <div>{{ orderForm.orderNo }}</div>
      </div>
    </li>
    <li>
      <div>
        <div>退单时间</div>
        <div>{{ orderForm.createTime }}</div>
      </div>
      <div>
        <div>客户ID</div>
        <div>{{ orderForm.erpCustomerId }}</div>
      </div>
    </li>

    <li>
      <div>
        <div>客户</div>
        <div>{{ orderForm.memberName }}</div>
      </div>
      <div>
        <div>退货总金额</div>
        <div>{{ orderForm.refundAmount }}</div>
      </div>
    </li>
    <li>
      <div>
        <div>退货单状态</div>
        <div>{{ orderForm.refund_state }}</div>
      </div>
      <div>
        <div>退款方式</div>
        <div>{{ orderForm.returnType }}</div>
      </div>
    </li>
    <li>
      <div>
        <div>确认收货人</div>
        <div>{{ orderForm.receiveName }}</div>
      </div>
      <div>
        <div>收货时间</div>
        <div>{{ orderForm.receiveTime }}</div>
      </div>
    </li>
    <li>
      <div>
        <div>收货备注</div>
        <div>{{ orderForm.receiveMessage }}</div>
      </div>
      <div>
        <div>erp异常备注</div>
        <div>{{ orderForm.refundMessage }}</div>
      </div>
    </li>
    <li>
      <div>
        <div>退款备注</div>
        <div>{{ orderForm.memberMessage }}</div>
      </div>
      <div>
        <div>备注</div>
        <div>{{ orderForm.reErpRemark }}</div>
      </div>
    </li>
    <li>
      <div>
        <div>审核意见</div>
        <div>{{ orderForm.userMessage }}</div>
      </div>
      <div>
        <div>支付流水号</div>
        <div>{{orderForm.payFlowNo}}</div>
      </div>
    </li>
  </ul>
  <slot />
  </div>
</template>

<script>
export default {
  props: {
    orderForm: {
      type: Object,
      default: () => {},
    },
  },
};
</script>

<style lang="less" scoped>
.flexbox {
  border: 1px solid #ccc;
  padding: 0;
  li {
    display: flex;
    & > div {
      flex: 1;
      display: flex;
      div {
        padding: 10px;
        border: 1px solid #ccc;
        &:first-child {
          width: 20%;
          text-align: justify;
          text-justify: distribute-all-lines;
          text-align-last: justify;
        }
        &:last-child {
          width: 80%;
        }
      }
    }
  }
}
.expRemark {
    background: #ff463c;border-color: #ff463c; color: #fff;
}
</style>
