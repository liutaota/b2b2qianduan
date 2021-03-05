<template>
  <div style="  margin: 0 10px;">
    <!-- 订单基本信息 -->
    <div style="  margin: 0 10px;">
      <p class="orderTitle">订单基本信息</p>
      <!-- 订单信息 -->
      <div class="details">
        <ul>
          <li>
            <span>客户ID：{{ orderDetails.memberId }}</span>
          </li>
          <li>
            <span>ERP客户ID：{{ orderDetails.erpCustomerId }}</span>
          </li>
          <li>
            <span>订单ID：{{ orderDetails.id }}</span>
          </li>
          <li>
            <span>订单编号：{{ orderDetails.orderNo }}</span>
          </li>
          <li>
            <span>支付编号：{{ orderDetails.payFlowNo }}</span>
          </li>
          <li>
            <span>采购商名称：{{ orderDetails.memberName }}</span>
          </li>
          <li>
            <span>手机号：{{ orderDetails.memberPhone }}</span>
          </li>
          <li>
            <span>地址：{{ orderDetails.addressDetail }}</span>
          </li>
          <li>
            <span>发票状态：{{ orderDetails.id }}</span>
          </li>
          <li>
            <span>发票类型：{{ orderDetails.invType }}</span>
          </li>
          <li>
            <span>抬头：{{ orderDetails.memberName }}</span>
          </li>
          <li>
            <span>订单状态：{{ orderDetails.orderState }}</span>
          </li>
          <li>
            <span>订单来源：{{ orderDetails.orderFrom }}</span>
          </li>
          <li>
            <span>支付方式：{{ orderDetails.payMethod }}</span>
          </li>
          <li>
            <span>配送方式：{{ orderDetails.logistics }}</span>
          </li>
          <li>
            <span>ERP同步：{{ orderDetails.erpOrderId }}</span>
          </li>
          <li>
            <span>ERP状态：{{ orderDetails.evaluationState }}</span>
          </li>
          <li>
            <span>价格类型：{{ orderDetails.priceId }}</span>
          </li>
          <li>
            <span>建立人ID：{{ orderDetails.memberId }}</span>
          </li>
          <li>
            <span>总价（元）：{{ nummatter(orderDetails.orderAmount) }}</span>
          </li>
          <li>
            <span>优惠（元）：{{ nummatter(orderDetails.goodsAmount) }}</span>
          </li>
          <li>
            <span>下单时间：{{ orderDetails.createTime }}</span>
          </li>
          <li>
            <span>备注：{{ orderDetails.remark }}</span>
          </li>
        </ul>
      </div>
    </div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="商品清单">
        <Tabel :loading="loading" :columns="commodityList" :table-data="orderGoodsList" :is_height="350" />
      </el-tab-pane>
      <el-tab-pane label="发货单">
        <Tabel :loading="loading" :columns="DeliveryTable" :table-data="DeliveryList" :is_height="350" />
      </el-tab-pane>
      <el-tab-pane label="发票">发票</el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Tabel from '@/components/Table';
export default {
  name: 'Details',
  components: {
    Tabel,
  },
  data() {
    return {
      activeName: '',
      orderDetails: {},
      loading: true,
      //   商品清单
      commodityList: [
        {
          prop: 'goodsId',
          label: '商品编号',
        },
        {
          prop: 'goodsName',
          label: '商品名',
        },
        {
          prop: 'accflag',
          label: '商品属性',
          width: 180
        },
        {
          prop: 'goodsSpec',
          label: '规格',
          width: 180
        },
        {
          prop: 'goodsNum',
          label: '订购数量'
        },
        {
          prop: 'sellNum',
          label: '实发数量'
        },
        {
          prop: 'goodsPrice',
          label: '单价',
          formatter: 'nummatter'
        },
        {
          prop: 'erpLeastsaleqty',
          label: '最小销售数量',
          width: 100,
        },
        {
          prop: 'remark',
          label: '备注',
          width: 200,
        },
        {
          prop: 'goodsPayPrice',
          label: '优惠均价',
          formatter: 'nummatter',
          width: 140
        },
        {
          prop: 'goodsunit',
          label: '单位',
        },
        {
          prop: 'amountNum',
          label: '合计',
          formatter: 'nummatter'
        },
        {
          prop: 'amountPay',
          label: '优惠合计',
          formatter: 'nummatter'
        },
        {
          prop: 'erpStorageId',
          label: '保管账ID',
        },
        {
          prop: 'erpLotNo',
          label: '批号'
        },
        {
          prop: 'priceId',
          label: '价格类型'
        },
        {
          prop: 'factoryname',
          label: '厂家',
          width: 200
        }
      ],
      // 商品清单数据
      orderGoodsList: [],
      // 订单状态
      erpState: [
        { val: 'UN_EVALUATION', desc: '未评价' },
        { val: 'EVALUATION', desc: '已评价' },
        { val: 'EVALUATION_time', desc: '已过期未评价' }
      ],
      // 支付方式
      orderState: [
        { val: 'CANCEL', desc: '已取消' },
        { val: 'UNPAID', desc: '未付款' },
        { val: 'TO_ERP', desc: '待下发' },
        { val: 'TO_SEND', desc: '拣货中' },
        { val: 'TO_DELIVERY', desc: '待收货' },
        { val: 'DONE', desc: '已收货' },
        { val: 'APPLY_REFUND', desc: '申请退款' },
        { val: 'SUCCESS_REFUND', desc: '退款成功' }
      ],
      // ERP状态
      payMethod: [
        { val: 'CASH', desc: '现结' },
        { val: 'MONTH', desc: '月结' },
        { val: 'ON_LINE', desc: '在线支付' }
      ],
      // 发货单表格
      DeliveryTable: [
        {
          prop: 'goodsName',
          label: '通用名',
        },
        {
          prop: 'goodstype',
          label: '包装',
        },
        {
          prop: 'medicinetypename',
          label: '剂型',
        },
        {
          prop: 'goodsunit',
          label: '单位',
        },
        {
          prop: 'factoryname',
          label: '厂家',
          width: 200
        },
        {
          prop: 'prodarea',
          label: '产地',
          width: 200
        },
        {
          prop: 'dtlgoodsqty',
          label: '发货数量',
        },
        {
          prop: 'unitprice',
          label: '单价',
          formatter: 'nummatter'
        },
        {
          prop: 'goodsPayPrice',
          label: '折价',
        },
        {
          prop: 'total',
          label: '金额',
          formatter: 'nummatter'
        },
        {
          prop: 'lotno',
          label: '批号',
        },
        {
          prop: 'proddate',
          label: '生产日期',
          width: 150
        },
        {
          prop: 'invaliddate',
          label: '有效日期',
          width: 150
        },
        {
          prop: 'id',
          label: '发货单号',
        },
      ],
      // 发票单数据
      DeliveryList: [],
      priceId: [
        { val: 105, desc: '二价' },
        { val: 109, desc: '九价' },
        // { val: 'ON_LINE', desc: '在线支付' }
      ],
    };
  },
  mounted() {
    this.query();
  },
  methods: {
    query() {
      const { id } = this.$route.query;
      this.loading = true;
      this.$http.get('order/getOrderInfoById', { params: {
        id
      }}).then(res => {
        // 判断订单状态
        res.orderState = this.setStaet(res.orderState, this.orderState);
        // 判断支付方式
        res.payMethod = this.setStaet(res.payMethod, this.payMethod);
        // 判断ERP状态
        res.evaluationState = this.setStaet(res.evaluationState, this.erpState);
        res.orderFrom === 1 ? res.orderFrom = '电脑端' : res.orderFrom = '手机端';
        // 订单详情
        this.orderDetails = res;
        res.orderGoodsList.map(item => {
          if (item.goodsunit === 'g' || item.goodsunit === 'kg') {
            item.goodsunit = '包';
          }
          item.accflag = item.accflag === 5 ? '赠品' : '-';
          // item.goodsNum /= 10000;
          // item.erpLeastsaleqty /= 10000;
          // item.sellNum /= 10000;
          // item.amountNum /= 10000;
          item.priceId = this.setStaet(item.priceId, this.priceId);
        });
        // 商品清单
        this.orderGoodsList = res.orderGoodsList;
        // 发货单
        this.DeliveryList = res.orderGoodsDeliveryList || [];
      }).finally(() => {
        this.loading = false;
      });
    },
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
    handleClick() {},
    // 金额计算
    nummatter(money) {
      return money ? '￥' + (money) : '';
    },
  }
};
</script>

<style scoped lang="less">
.orderTitle{
  font-weight: 600;
  font-size: 14px;
}
.details{
  border-top: 1px solid #ccc;
  padding: 10px 0;
  ul{
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
    flex-wrap: wrap;
    width: 100%;
    li {
      flex: 1;
      width: 550px;
      min-width: 25%;
      max-width: 25%;
      span {
        display: block;
        padding: 6px 0;
        font-size: 12px;
      }
    }
  }
}
</style>
