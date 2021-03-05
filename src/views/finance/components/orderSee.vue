<template>
  <div>
    <ul v-show="isArction === 1" class="flexbox">
      <li>
        <div>
          <div>收款单ID</div>
          <div>{{ orderForm.id }}</div>
        </div>
        <div>
          <div>客户ID</div>
          <div>{{ orderForm.erpUserId }}</div>
        </div>
      </li>
      <li>
        <div>
          <div>客户名称</div>
          <div>{{ orderForm.userName }}</div>
        </div>
        <div>
          <div>订单号</div>
          <div>{{ orderForm.orderNo }}</div>
        </div>
      </li>
      <li>
        <!-- <div>
          <div>退款单号</div>
          <div>{{ orderForm.applyNo }}</div>
        </div> -->
        <div>
          <div>核销操作人</div>
          <div>{{ orderForm.financeName }}</div>
        </div>
        <div>
          <div>收款流水号</div>
          <div>{{ orderForm.payAbcNo }}</div>
        </div>
      </li>
      <li>
        <div>
          <div>应收款</div>
          <div>{{ orderForm.total ? "￥" + orderForm.total : "0" }}</div>
        </div>
        <div>
          <div>实收款</div>
          <div>
            {{ orderForm.premoney ? "￥" + orderForm.premoney : "0" }}
          </div>
        </div>
      </li>
      <li>
        <div>
          <div>erp核销备注</div>
          <div :class="!orderForm.erpFinanceRemark ? 'expRemark' : ''">
            {{ orderForm.erpFinanceRemark }}
          </div>
        </div>
        <div>
          <div>结算方式</div>
          <div>
            {{ orderForm.recType }}
          </div>
        </div>
      </li>
      <li>
        <div>
          <div>是否核销</div>
          <div>
            {{ orderForm.finance_true }}
          </div>
        </div>
        <div>
          <div>创建时间</div>
          <div>
            {{ orderForm.createTime }}
          </div>
        </div>
      </li>
      <li>
        <div>
          <div>核销时间</div>
          <div>{{ orderForm.financeTime }}</div>
        </div>
        <div>
          <div>备注</div>
          <div>{{ orderForm.remark }}</div>
        </div>
      </li>
      <li>
        <div>
          <div>收款状态</div>
          <div>
            {{ orderForm.status }}
          </div>
        </div>
        <!-- <div>
          <div>退款备注</div>
          <div>{{ orderForm.refundRemark }}</div>
        </div> -->
        <div>
          <div>支付流水号</div>
          <div>
            {{ orderForm.payFlowNo }}
          </div>
        </div>
      </li>
    </ul>
    <ul v-show="isArction === 2" class="flexbox">
      <li>
        <div>
          <div>退款单ID</div>
          <div>{{ orderForm.id }}</div>
        </div>
        <div>
          <div>退款单号</div>
          <div>{{ orderForm.recDocNo }}</div>
        </div>
      </li>
      <li>
        <div>
          <div>退款流水号</div>
          <div>{{ orderForm.payAbcNo }}</div>
        </div>
        <div>
          <div>退货单号</div>
          <div>{{ orderForm.applyNo }}</div>
        </div>
      </li>
      <li>
        <div>
          <div>客户ID</div>
          <div>{{ orderForm.erpUserId }}</div>
        </div>
        <div>
          <div>客户名称</div>
          <div>{{ orderForm.userName }}</div>
        </div>
      </li>
      <li>
        <div>
          <div>退款操作人</div>
          <div>{{ orderForm.refundName }}</div>
        </div>
        <div>
          <div>核销操作人</div>
          <div>{{ orderForm.financeName }}</div>
        </div>
      </li>
      <li>
        <div>
          <div>订单ID</div>
          <div>{{ orderForm.orderId }}</div>
        </div>
        <div>
          <div>订单号</div>
          <div>{{ orderForm.orderNo }}</div>
        </div>
      </li>
      <li>
        <div>
          <div>应退款</div>
          <div>{{ orderForm.total ? "￥" + orderForm.total : "0" }}</div>
        </div>
        <div>
          <div>实退款</div>
          <div>
            {{ orderForm.refundMoney ? "￥" + orderForm.refundMoney : "0" }}
          </div>
        </div>
      </li>
      <li>
        <div>
          <div>是否核销</div>
          <div>
            {{ orderForm.finance_true }}
          </div>
        </div>
        <div>
          <div>结算方式</div>
          <div>
            {{ orderForm.recType }}
          </div>
        </div>
      </li>
      <li>
        <div>
          <div>创建时间</div>
          <div>
            {{ orderForm.createTime }}
          </div>
        </div>
        <div>
          <div>核销时间</div>
          <div>{{ orderForm.financeTime }}</div>
        </div>
      </li>
      <li>
        <div>
          <div>退款时间</div>
          <div>{{ orderForm.refundTime }}</div>
        </div>
        <div>
          <div>退款备注</div>
          <div>{{ orderForm.refundRemark }}</div>
        </div>
      </li>
      <li>
        <div>
          <div>备注</div>
          <div>
            {{ orderForm.remark }}
          </div>
        </div>
        <div>
          <div>收款状态</div>
          <div>{{ orderForm.status }}</div>
        </div>
      </li>
      <li>
        <div>
          <div>退款状态</div>
          <div>
            {{ orderForm.refund_state }}
          </div>
        </div>
        <div>
          <div>回调报文</div>
          <div>
            {{ orderForm.abcMessage }}
          </div>
        </div>
      </li>
      <li>
        <div>
          <div>erp核销备注</div>
          <div :class="!orderForm.erpFinanceRemark ? 'expRemark' : ''">
            {{ orderForm.erpFinanceRemark }}
          </div>
        </div>
        <div>
          <div>支付流水号</div>
          <div>
            {{ orderForm.payFlowNo }}
          </div>
        </div>
      </li>
       <li>
        <div>
          <div>退单类型</div>
          <div>
            {{ orderForm.rec_method }}
          </div>
        </div>
        <div>
          <div>异常备注</div>
          <div>
            {{ orderForm.expRemark }}
          </div>
        </div>
      </li>
    </ul>
    <ul v-show="isArction === 3" class="flexbox">
      <li>
        <div>
          <div>公司id</div>
          <div>{{ orderForm.erpUserId }}</div>
        </div>
        <div>
          <div>公司名称</div>
          <div>{{ orderForm.userName }}</div>
        </div>
      </li>
      <li>
        <div>
          <div>订单号</div>
          <div>{{ orderForm.payFlowNo }}</div>
        </div>
        <div>
          <div>支付单号</div>
          <div>{{ orderForm.tmpNo }}</div>
        </div>
      </li>
      <li>
        <div>
          <div>收款现金</div>
          <div>
            {{ orderForm.cashTotal ? "￥" + orderForm.cashTotal : "0" }}
          </div>
        </div>
        <div>
          <div>在线支付金额</div>
          <div>
            {{ orderForm.onlineTotal ? "￥" + orderForm.onlineTotal : "0" }}
          </div>
        </div>
      </li>
      <li>
        <div>
          <div>合计</div>
          <div>{{ orderForm.total ? "￥" + orderForm.total : "0" }}</div>
        </div>
        <div>
          <div>手机号</div>
          <div>{{ orderForm.telephone }}</div>
        </div>
      </li>
       <li>
        <div>
          <div>线路</div>
          <div>{{ orderForm.tranposname }}</div>
        </div>
        <div>
          <div>线序</div>
          <div>{{ orderForm.transortno }}</div>
        </div>
      </li>
      <li>
        <div>
          <div>支付时间</div>
          <div>{{ orderForm.payTime }}</div>
        </div>
        <div>
          <div>创建时间</div>
          <div>{{ orderForm.createTime }}</div>
        </div>
      </li>
      <li>
        <div>
          <div>核销人ID</div>
          <div>{{ orderForm.financeErpId }}</div>
        </div>
        <div>
          <div>核销人</div>
          <div>{{ orderForm.financeName }}</div>
        </div>
      </li>
      <li>
        <div>
          <div>erp订单</div>
          <div>{{ orderForm.salesids }}</div>
        </div>
        <div>
          <div>确认收款时间</div>
          <div>{{ orderForm.confirmTime }}</div>
        </div>
      </li>
      <li>
        <div>
          <div>确认人</div>
          <div>{{ orderForm.confirmName }}</div>
        </div>
        <div>
          <div>收款备注</div>
          <div>{{ orderForm.confirmRemark }}</div>
        </div>
      </li>
      <li>
        <div>
          <div>核销状态</div>
          <div>{{ orderForm.finance_true }}</div>
        </div>
        <div>
          <div>核销备注</div>
          <div>{{ orderForm.financeRemark }}</div>
        </div>
      </li>
      <li>
        <div>
          <div>ERP核销备注</div>
          <div>{{ orderForm.erpFinanceRemark }}</div>
        </div>
        <div>
          <div>支付流水号</div>
          <div>{{orderForm.payFlowNo}}</div>
        </div>
      </li>
      <li>
        <div>
          <div>APP收款细单</div>
          <div>
            <p
              v-for="(item, index) in orderForm.tmpErpOrderRecDocList"
              class="j_b_box"
            >
              <span>支付单号：{{ item.tmpNo }}</span>
              <span>ERP订单id：{{ item.salesid }}</span>
              <span>{{ item.satypeid | sourcetype }}</span>
              <span>金额：{{ item.total ? "￥" + item.total : "0" }}</span>
            </p>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  filters: {
    sourcetype(val) {
      switch (val) {
        case "1":
          return "销售单";
        case "2":
          return "配送单";
        case "3":
          return "退款单";
        default:
          return "";
      }
    }
  },
  props: {
    orderForm: {
      type: Object,
      default: () => {}
    },
    isArction: {
      type: Number,
      default: 1
    }
  }
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
          width: 114px;
          text-align: justify;
          text-justify: distribute-all-lines;
          text-align-last: justify;
        }
        &:last-child {
          flex: 1;
        }
      }
    }
    p {
      display: flex;
      justify-content: space-between;
      margin: 0;
      line-height: 30px;
      span {
        &:first-child {
          flex: 2;
        }
        flex: 1;
      }
    }
  }
}
.expRemark {
  background: #ff463c;
  border-color: #ff463c;
  color: #fff;
}
</style>
