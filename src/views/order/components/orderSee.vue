<template>
  <div>
    <div class="flexbox">
      <div v-for="(item, index) in orderTab" :key="index" class="cell">
        <div>{{ item.label }}</div>
        <div  :class="item.isExpRemark && orderForm.expStatus !== 'NORMAL' ? 'expRemark' : ''">
          <span v-if="item.formatter === 'nummatter'">￥</span
          >{{ orderForm[item.prop] }}
        </div>
      </div>
    </div>
    <!-- <ul class="flexbox">
      <li>
        <div>
          <div>订单id</div>
          <div>{{ orderForm.id }}</div>
        </div>
        <div>
          <div>订单号</div>
          <div>{{ orderForm.orderNo }}</div>
        </div>
      </li>
      <li>
        <div>
          <div>客户id</div>
          <div>{{ orderForm.erpCustomerId }}</div>
        </div>
        <div>
          <div>客户</div>
          <div>{{ orderForm.memberName }}</div>
        </div>
      </li>
      <li>
        <div>
          <div>订单状态</div>
          <div>{{ orderForm.order_state }}</div>
        </div>
        <div>
          <div>异常状态</div>
          <div>{{ orderForm.exp_status }}</div>
        </div>
      </li>
      <li>
        <div>
          <div>注册手机号</div>
          <div>{{ orderForm.telephone }}</div>
        </div>
        <div>
          <div>下单电话</div>
          <div>{{ orderForm.memberPhone }}</div>
        </div>
      </li>
      <li>
        <div>
          <div>下单时间</div>
          <div>{{ orderForm.createTime }}</div>
        </div>
        <div>
          <div>结算方式</div>
          <div>{{ orderForm.pay_method }}</div>
        </div>
      </li>
      <li>
        <div>
          <div>订单金额</div>
          <div>
            {{ orderForm.orderAmount ? "￥" + orderForm.orderAmount : "0" }}
          </div>
        </div>
        <div>
          <div>实付金额</div>
          <div>
            {{ orderForm.actuallyMoney ? "￥" + orderForm.actuallyMoney : "0" }}
          </div>
        </div>
      </li>
      <li>
        <div>
          <div>应付金额</div>
          <div>
            {{ orderForm.goodsAmount ? "￥" + orderForm.goodsAmount : "0" }}
          </div>
        </div>
        <div>
          <div>优惠金额</div>
          <div>
            {{
              orderForm.preferentialAmount
                ? "￥" + orderForm.preferentialAmount
                : "0"
            }}
          </div>
        </div>
      </li>
      <li>
        <div>
          <div>到货金额</div>
          <div>
            {{ orderForm.erpAmount ? "￥" + orderForm.erpAmount : "0" }}
          </div>
        </div>
        <div>
          <div>订单来源</div>
          <div>{{ orderForm.order_from }}</div>
        </div>
      </li>
      <li>
        <div>
          <div>发票类型</div>
          <div>{{ orderForm.invType }}</div>
        </div>
        <div>
          <div>异常备注</div>
          <div>{{ orderForm.expRemark }}</div>
        </div>
      </li>
      <li>
        <div>
          <div>删除状态</div>
          <div>{{ orderForm.del_status }}</div>
        </div>
        <div>
          <div>拦截状态</div>
          <div>{{ orderForm.intercept_status }}</div>
        </div>
      </li>
      <li>
        <div>
          <div>拦截备注</div>
          <div>{{ orderForm.interceptRemark }}</div>
        </div>
        <div>
          <div>拦截时间</div>
          <div>{{ orderForm.interceptTime }}</div>
        </div>
      </li>
      <li>
        <div>
          <div>随货备注</div>
          <div>{{ orderForm.goodsRemark }}</div>
        </div>
        <div>
          <div>下单备注</div>
          <div>{{ orderForm.remark }}</div>
        </div>
      </li>
      <li>
        <div>
          <div>地址</div>
          <div>{{ orderForm.addressDetail }}</div>
        </div>
        <div>
          <div />
          <div />
        </div>
      </li>
    </ul> -->
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    orderForm: {
      type: Object,
      default: () => {}
    },
    columns: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      orderTab: []
    };
  },
  created() {
    this.orderTab = [...this.columns];
    if (this.columns.length % 2 !== 0) {
      this.orderTab.push({});
    }
  }
};
</script>

<style lang="less" scoped>
// .flexbox {
//   border: 1px solid #ccc;
//   padding: 0;
//   li {
//     display: flex;
//     & > div {
//       flex: 1;
//       display: flex;
//       div {
//         padding: 10px;
//         border: 1px solid #ccc;
//         &:first-child {
//           width: 20%;
//           text-align: justify;
//           text-justify: distribute-all-lines;
//           text-align-last: justify;
//         }
//         &:last-child {
//           width: 80%;
//         }
//       }
//     }
//   }
// }
// .expRemark {
//   background: #ff463c;
//   border-color: #ff463c;
//   color: #fff;
// }
.flexbox {
  border: 1px solid #ccc;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  .cell {
    display: flex;
    width: 50%;
    & > div {
      display: flex;
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
.expRemark {
  background: #ff463c;
  border-color: #ff463c;
  color: #fff;
}
</style>
