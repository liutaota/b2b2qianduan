<template>
  <div style="margin: 10px">
    <Screen v-permission="'PlaceOrderLook'" @query="query" />
    <!-- 客户列表 -->
    <h3>客户列表</h3>
    <div>
      <Tabel
        :columns="columns"
        :table-data="customerList"
        :loading="loading"
        :page-index="queryForm"
        :is_height="custTabHeight"
        @handleCurrent="handleCurrent"
      >
        <el-table-column
          slot="handleColumn"
          label="操作"
          width="200"
          fixed="right"
        >
          <template slot="header">
            <div style="cursor: pointer" @click="isCustomer">
              操作 <i class="el-icon-arrow-down" />
            </div>
          </template>
          <template slot-scope="scope">
            <el-button
              v-permission="'PlaceOrderUsed'"
              type="primary"
              @click="getCustomerId(scope.row)"
            >选用</el-button>
          </template>
        </el-table-column>
      </Tabel>
      <!-- 分页器 -->
      <pagination
        :total="customerTotal"
        @pagination="customerPagination"
        @handleSizeChange="handleSizeChange"
      />
    </div>
    <!-- 历史订单 -->
    <h3 v-show="orderList.length > 0">历史订单</h3>
    <div v-show="orderList.length > 0">
      <Tabel
        :columns="orderColumns"
        :table-data="orderList"
        :loading="orderLoading"
        :page-index="orderQueryForm"
        :is_height="200"
      >
        <el-table-column
          slot="handleColumn"
          label="操作"
          width="200"
          fixed="right"
        >
          <template slot-scope="scope">
            <el-button
              type="primary"
              @click="toShopCarPay(scope.row, scope.row.id)"
            >
              再次购买
            </el-button>
            <el-button
              type="primary"
              @click="orderInfoMask=true;orderInfoList = scope.row.orderGoodsList;"
            >
              查看
            </el-button>
          </template>
        </el-table-column>
      </Tabel>
      <!-- 分页器 -->
      <pagination
        :total="orderTotal"
        @pagination="orderPagination"
        @handleSizeChange="handleOrderSizeChange"
      />
    </div>
    <h3 v-show="JSON.stringify(customer) !== '{}'">收货地址</h3>
    <!-- 收货地址 -->
    <div
      v-show="JSON.stringify(customer) !== '{}'"
      class="receivingGoods"
      style="margin-bottom: 20px"
    >
      <!-- 客户信息 -->
      <div class="customer">
        <p>{{ customer.customname }}</p>
        <p>{{ customer.zxPhone }}</p>
      </div>
      <!-- 地址 -->
      <div class="address-box">
        <div v-show="address" class="distribution">
          <div class="firstChild firstChild-padding">配送地址：</div>
          <div>
            <el-radio-group v-model.trim="radio">
              <el-radio
                v-for="(item, index) of address"
                :key="index"
                class="address"
                :label="index"
                :style="radio == index ? 'border-color:#4C9FFF' : ''"
              >{{
                `${item.companyname}   ${item.zxPhOrder}   ${item.address}`
              }}</el-radio>
            </el-radio-group>
          </div>
          <div class="lastChild firstChild-padding">默认地址</div>
        </div>
        <div v-show="address" class="settlement">
          <p class="firstChild">结算方式：</p>
          <p>现结</p>
        </div>
      </div>
    </div>
    <div v-if="JSON.stringify(customer) !== '{}'" style="margin-bottom: 20px">
      <el-button
        class="addCar"
        type="danger"
        @click="dialogVisible = true"
      >添加购物车</el-button>
    </div>
    <!-- 购物车商品 -->
    <div v-show="JSON.stringify(customer) !== '{}'" class="car-title conWidth">
      采购车
      <!-- <el-select
        v-model="activity"
        placeholder="请选择"
        class="carSelectActivity"
      >
        <el-option
          v-for="item in cartJoinActivity"
          :key="item.id"
          :label="item.abbreviation"
          :value="item.id"
        >
        </el-option> -->
      <div v-if="cartJoinActivity.length > 0" class="carSelectActivity flexBox">
        批量切换活动：
        <div class="select-style" @click="show3 = !show3">
          <span v-if="activity.id !== undefined" class="span">{{
            activity.abbreviation
          }}</span>
          <span v-else>活动</span>
          <i class="el-icon-arrow-down" />
          <div>
            <el-collapse-transition>
              <div v-show="show3" class="el-select-dropdown">
                <div
                  v-for="data of cartJoinActivity"
                  :key="data.asId"
                  class="transition-box one_hidden flexBox"
                  :class="activity.id === data.id ? 'isActive' : ''"
                  @click="
                    selectCartActivity(data);
                    show3 = true;
                  "
                >
                  <div
                    class="radio"
                    :class="activity.id === data.id ? 'isRadio' : ''"
                  >
                    <div v-if="activity.id === data.id" />
                  </div>
                  <p>{{ data.abbreviation }}</p>
                </div>
              </div>
            </el-collapse-transition>
          </div>
        </div>
      </div>

      <!-- </el-select> -->
    </div>
    <div v-show="JSON.stringify(customer) !== '{}'">
      <div class="car-main-name j_b_box">
        <div class="car-name-left">商品名称</div>
        <div
          class="car-name-right flexbox"
        >
          <p class="flexBox">批发价</p>
          <p class="flexBox">数量</p>
          <p class="flexBox" style="justify-content: center">小计</p>
          <p class="flexBox">操作</p>
        </div>
      </div>
      <!-- 商品 -->
      <goodsList
        v-for="(item, index) in carList"
        :key="index"
        :car-list="item.list"
        :res-list="carList"
        :index="index"
        :member-id="customer.id"
        :sel-car="selCar"
        @del="delGoods"
        @selectGiftVoList="selectGiftVoList"
        @getCartToActivity="getCar"
      />
    </div>
    <!-- 优惠卷选择 -->
    <el-tabs v-show="JSON.stringify(customer) !== '{}'" type="border-card" class="coupon-box">
      <el-tab-pane :label="`满减卷 (${fullReduction.length})`">
        <Coupon
          :indexs="0"
          :data="fullReduction"
          @selectCoupon="selectCoupon"
        />
        <p v-if="fullReduction.length === 0">
          <i class="el-icon-warning-outline" />结算商品中没有符合条件的商品
        </p>
      </el-tab-pane>
      <el-tab-pane :label="`折扣 (${discount.length})`">
        <Coupon :indexs="1" :data="discount" @selectCoupon="selectCoupon" />
        <p v-if="discount.length === 0">
          <i class="el-icon-warning-outline" />结算商品中没有符合条件的商品
        </p>
      </el-tab-pane>
      <el-tab-pane :label="`现金卷 (${cash.length})`">
        <Coupon :indexs="2" :data="cash" @selectCoupon="selectCoupon" />
        <p v-if="cash.length === 0">
          <i class="el-icon-warning-outline" />结算商品中没有符合条件的商品
        </p>
      </el-tab-pane>
    </el-tabs>
    <div v-if="JSON.stringify(customer) !== '{}'" class="flexbox" style="margin:20px 0">
      <span style="width:100px">随货备注：</span>
      <el-input
        v-model="goodsRemark"
        type="textarea"
        :rows="8"
        placeholder="请输入随货备注"
      />
    </div>
    <div v-if="JSON.stringify(customer) !== '{}'" class="flexbox" style="margin:20px 0">
      <span style="width:100px">备注：</span>
      <el-input
        v-model="remark"
        type="textarea"
        :rows="8"
        placeholder="请输入备注"
      />
    </div>
    <!-- 结算按钮 -->
    <div v-show="JSON.stringify(customer) !== '{}'" class="bottom-car conWidth">
      <div v-if="false" class="manjian centerBox">
        <p>满减</p>
        满100减20
        <span>(已减20元)</span>
      </div>
      <div class="bottom-all j_b_box">
        <div class="bottom-all-left centerBox">
          <img
            v-if="!isAllSelect"
            src="@/assets/img/icon1.png"
            alt
            @click="selectAll"
          >
          <img
            v-if="isAllSelect"
            src="@/assets/img/icon1-sel.png"
            alt
            @click="selectAll"
          >
          <span>已选（{{ selCar.length }}）</span>
          <el-link
            type="info"
            style="color: #000"
            @click="delAll"
          >批量删除</el-link>
          <!-- <button >批量删除</button> -->
          <!-- <button @click="collect">批量收藏</button> -->
        </div>
        <div class="bottom-all-right centerBox columnBox">
          <div style="margin-right: 10px">
            <!-- <p class="bottom-price" /> -->
            <p
              v-if="selCar.length > 0 && selCar[0].activityVo"
              class="bottom-price"
            >
              <span style="font-weight: 500; font-size: 25px">{{
                selCar[0].activityVo.abbreviation
              }}</span>
            </p>
            <p v-if="reduction" class="bottom-price Discount">
              满减：<span>￥ {{ -reduction | moneyFilter | toThousandFilter }}</span>
            </p>
            <p v-if="couponAmount > 0" class="bottom-price Discount">
              优惠卷：
              <span style="margin-right:10px">￥ {{ -couponAmount | moneyFilter | toThousandFilter }}</span>
              <!-- <el-link type="primary" @click="couponMask = true">
                优惠卷选择({{ couNum }})
                <i class="el-icon-arrow-right" />
              </el-link> -->
            </p>
            <p v-if="integralAmount > 0" class="bottom-price Discount">
              积分：
              <span>{{ integralAmount | moneyFilter | toThousandFilter }}</span>
            </p>
            <p v-if="fullCourtAmount" class="bottom-price Discount">
              全场折扣：<span>￥
                {{ fullCourtAmount | moneyFilter(2) | toThousandFilter }}</span>
            </p>
            <p class="bottom-price">
              合计：
              <span>￥{{ discountAmount | moneyFilter(2) | toThousandFilter }}</span>
            </p>
            <p
              v-if="originalPrice && originalPrice !== discountAmount"
              class="original-price"
              style="text-align: right;"
            >
              原价：
              <del>￥{{ originalPrice | moneyFilter(2) | toThousandFilter }}</del>
            </p>
          </div>
          <p v-if="selCar.length === 0" class="toPay gray"> 提交订单 </p>
          <p v-else class="toPay cursor" @click="orderMask = true">
            <i v-if="loading" class="el-icon-loading" /> 提交订单
          </p>
        <!-- <p class="bottom-price youhui">实付款：<span> <span>￥</span> 3.33</span></p> -->
        </div>
      </div>
    </div>
    <!-- 商品选择 -->
    <goods
      v-if="dialogVisible"
      :dialog-visible="dialogVisible"
      :member-id="customer.id"
      :car-list="carList"
      @handleClose="handleClose"
      @getCar="getCar"
    />
    <!-- 订单确认 -->
    <el-dialog
      :visible.sync="orderMask"
      width="30%"
      :before-close="handleClose"
    >
      <div class="bottom-all-right centerBox columnBox" style="align-items: center;">
        <div style="margin-right: 10px">
          <p
            v-if="selCar.length > 0 && selCar[0].activityVo"
            class="bottom-price"
          >
            <span style="font-weight: 500; font-size: 25px">{{
              selCar[0].activityVo.abbreviation
            }}</span>
          </p>
          <p v-if="reduction" class="bottom-price Discount">
            满减：<span>￥ {{ -reduction | moneyFilter | toThousandFilter }}</span>
          </p>
          <p v-if="couponAmount > 0" class="bottom-price Discount">
            优惠卷：
            <span>￥ {{ -couponAmount | moneyFilter | toThousandFilter }}</span>
          </p>
          <p v-if="integralAmount > 0" class="bottom-price Discount">
            积分：
            <span>{{ integralAmount | moneyFilter | toThousandFilter }}</span>
          </p>
          <p v-if="fullCourtAmount" class="bottom-price Discount">
            全场折扣：<span>￥
              {{ fullCourtAmount | moneyFilter(2) | toThousandFilter }}</span>
          </p>
          <p class="bottom-price">
            合计：
            <span>￥{{ discountAmount | moneyFilter(2) | toThousandFilter }}</span>
          </p>
          <p
            v-if="originalPrice && originalPrice !== discountAmount"
            class="original-price"
          >
            原价：
            <del>￥{{ originalPrice | moneyFilter(2) | toThousandFilter }}</del>
          </p>
        </div>
        <!-- <p class="bottom-price youhui">实付款：<span> <span>￥</span> 3.33</span></p> -->
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="payOrder">
          <i v-if="loading" class="el-icon-loading" />
          确 定
        </el-button>
        <el-button @click="orderMask = false">取 消</el-button>
      </span>
    </el-dialog>
    <OrderInfo :order-mask="orderInfoMask" :order-list="orderInfoList" @handleClose="handleClose" />
  </div>
</template>

<script>
const Screen = () => import('./components/screen');
const Tabel = () => import('@/components/Table');
const pagination = () => import('@/components/Pagination');
const goodsList = () => import('./components/goodsList');
const goods = () => import('./components/goods');
const Coupon = () => import('./components/coupon');
const OrderInfo = () => import('./components/orderInfo');
export default {
  name: 'PlaceOrder',
  components: {
    Screen,
    Tabel,
    pagination,
    goodsList,
    goods,
    Coupon,
    OrderInfo
  },
  data() {
    return {
      loading: false,
      columns: [
        // 客户表格
        {
          prop: 'customname',
          label: '企业名称',
        },
        {
          prop: 'zxPhone',
          label: '手机号',
        },
        {
          prop: 'credate',
          label: '日期',
        },
        {
          prop: 'registadd',
          label: '地址',
        },
        {
          prop: 'customid',
          label: 'ERP编号',
        },
        {
          prop: 'id',
          label: '客户id',
        },
        {
          prop: 'settletype',
          label: '客户类型',
        },
        {
          prop: 'gspusestatusname',
          label: '客户质量',
        },
      ],
      customerList: [], // 客户数据
      cusList: [], // 赋值客户数据
      isCus: true, // 控制客户表格显示
      custTabHeight: 200, // 表格高度
      customer: {}, // 客户详情数据
      address: [], // 地址
      radio: 0, // 地址选中
      queryForm: {
        size: 50,
        current: 1,
      },
      customerTotal: 0,
      orderColumns: [
        {
          prop: 'memberName',
          label: '企业名称',
        },
        {
          prop: 'telephone',
          label: '手机号',
        },
        {
          prop: 'createTime',
          label: '日期',
        },
        {
          prop: 'orderNo',
          label: '订单号',
        },
        {
          prop: 'orderAmount',
          label: '订单金额',
          formatter: 'nummatter',
        },
        {
          prop: 'pay_method',
          label: '结算方式',
        },
        {
          prop: 'order_from',
          label: '订单来源',
        },
      ], // 历史订单列表
      orderLoading: false,
      orderList: [], // 历史订单数据
      orderQueryForm: {
        size: 50,
        current: 1,
      }, // 历史订单搜索数据
      orderTotal: 0,
      carList: [],
      selCar: [], // 选中商品
      deliveryAmount: 0, // 起送金额
      isAllSelect: true, // 全选商品
      dialogVisible: false, // 商品选择弹窗
      orderMask: false, // 订单确认弹窗
      couponMask: false, // 优惠券弹窗
      couponAmount: 0, // 优惠券金额
      couponId: null, // 优惠券id
      types: [
        {
          val: 'CASH',
          desc: '现结',
        },
        {
          val: 'MONTH',
          desc: '月结',
        },
        {
          val: 'ON_LINE',
          desc: '在线支付',
        },
      ], // 支付类型
      payMethod: '',
      couNum: 0, // 优惠券数量
      couponList: [], // 优惠券列表
      fullReduction: [], // 满减券
      discount: [], // 折扣券
      cash: [], // 现金券
      couponState: [
        { val: 'FULL_REDUCTION_TICKET', desc: '满减券', name: 'fullReduction' },
        { val: 'FULL_PRESENT_TICKET', desc: '折扣券', name: 'discount' },
        { val: 'CASH_TICKET', desc: '现金券', name: 'cash' },
      ],
      remark: '', // 备注
      orderInfoMask: false, // 历史订单弹窗
      orderInfoList: [],
      show3: false, // 批量活动下拉
      cartJoinActivity: [], //  批量活动
      activity: {},
      goodsRemark:'', // 随货备注
    };
  },
  computed: {
    // 总金额
    amounts() {
      let amount = 0;
      // const reduction = this.reduction;
      this.selCar.forEach((item) => {
        if (item.erpAccFlag !== 5) {
          // amount += item.amountPay;
          amount = this.$math.add(amount, item.amountPay);
        }
      });
      this.carList.forEach((item) => {
        if (
          item.list[0].activityGiftList !== null &&
          item.list[0].activityGiftList.length > 0
        ) {
          item.list[0].activityGiftList.forEach((data) => {
            // amount += data.amountPay;
            this.$math.add(amount, data.amountPay);
          });
        }
      });
      return amount;
    },
    // 积分
    integralAmount() {
      let integralAmount = 0;
      this.selCar.forEach((item) => {
        if (item.erpAccFlag === 5) {
          // integralAmount += item.integralAmount;
          integralAmount = this.$math.add(integralAmount, item.integralAmount);
        }
      });
      return integralAmount;
    },
    // 满减
    reduction() {
      let reduction = 0;
      this.carList.forEach((item) => {
        // reduction += item.list[0].reducePrice;
        reduction = this.$math.add(reduction, item.list[0].reducePrice);
      });
      return reduction;
    },
    // 全场折扣
    fullCourtAmount() {
      let fullCourtAmount = 0;
      let discountAmount = 0;
      this.selCar.forEach((item) => {
        if (item.erpAccFlag !== 5 && item.goodType !== 4) {
          // fullCourtAmount += item.amountPay;
          // discountAmount += item.amountPay;
          fullCourtAmount = this.$math.add(fullCourtAmount, item.amountPay);
          discountAmount = this.$math.add(discountAmount, item.amountPay);
        }
      });
      // fullCourtAmount -= this.couponAmount;
      // discountAmount -= this.couponAmount;
      fullCourtAmount = this.$math.subtract(fullCourtAmount, this.couponAmount);
      discountAmount = this.$math.subtract(discountAmount, this.couponAmount);
      if (
        this.selCar.length > 0 &&
        this.selCar[0].activityVo !== null &&
        fullCourtAmount >= this.selCar[0].activityVo.amountSatisfied
      ) {
        // discountAmount *= this.selCar[0].activityVo.discount;
        discountAmount = this.$math.multiply(discountAmount, this.selCar[0].activityVo.discount);
      }
      // fullCourtAmount = discountAmount - fullCourtAmount;
      fullCourtAmount = this.$math.subtract(discountAmount, fullCourtAmount);
      return fullCourtAmount;
    },
    // 原价总额
    originalPrice() {
      let amount = 0;
      this.selCar.forEach((item) => {
        if (item.erpAccFlag !== 5) {
          // amount += item.amountPay;
          amount = this.$math.add(amount, item.amountPay);
        }
      });
      this.carList.forEach((item) => {
        if (
          item.list[0].pitchOn === 1 &&
          item.list[0].activityGiftList !== null &&
          item.list[0].activityGiftList.length > 0
        ) {
          item.list[0].activityGiftList.forEach((data) => {
            // amount += data.amountPay;
            amount = this.$math.add(amount, data.amountPay);
          });
        }
      });
      return amount;
    },
    // 合计
    discountAmount() {
      let discountAmount = this.amounts;
      // discountAmount -= this.couponAmount;
      discountAmount = this.$math.subtract(discountAmount, this.couponAmount);
      // if (discountAmount >= this.selCar[0].activityVo.amountSatisfied) {
      //   discountAmount *= (this.selCar[0].activityVo.discount / 10000);
      // }
      // discountAmount += this.fullCourtAmount;
      discountAmount = this.$math.add(discountAmount, this.fullCourtAmount);
      return discountAmount;
    },
  },
  created() {
    this.query();
    document.addEventListener('keydown', this.handleKeyDown);
  },
  destroyed() {
    document.removeEventListener('keydown', this.handleKeyDown);
  },
  methods: {
    query(queryForm) {
      if (queryForm) {
        this.queryForm = queryForm;
      }
      const form = this.queryForm;
      this.loading = true;
      this.$http
        .get('/member/getCustomerByCustomerInfo', {
          params: {
            ...form,
          },
        })
        .then((data) => {
          this.customerTotal = data.total;
          this.customerList = data.records.map((item) => {
            item.picture = item.picture ? item.picture : [];
            return item;
          });
          this.cusList = this.customerList;
          this.custTabHeight = 200;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    // 购物车商品参与的活动
    getMyCartJoinActivity(memberId) {
      this.$http.get('/goods/getAdminCartJoinActivity', { params: { memberId }}).then((res) => {
        this.cartJoinActivity = res || [];
      });
    },
    // 活动选中
    selectCartActivity(data) {
      this.activity = data;
      this.updateCartActivity(data.id);
    },
    // 修改商品活动
    updateCartActivity(id) {
      console.log(this.customer);
      this.$http
        .get('/goods/updateAdminCartActivity', { params: { activityId: id, memberId: this.customer.id }})
        .then(() => {
          this.getCar();
        });
    },
    // 表格展开
    isCustomer() {
      this.isCus = !this.isCus;
      if (this.isCus) {
        this.customerList = this.cusList;
        this.custTabHeight = 200;
      } else {
        this.customerList = [];
        this.custTabHeight = 35;
      }
    },
    // 获取历史订单
    getOrderInfo(erpCustomerId) {
      this.orderLoading = true;
      this.$http
        .get('order/getAdminOrderInfoList', {
          params: { ...this.orderQueryForm, erpCustomerId, descs: 'oi.create_time' },
        })
        .then((res) => {
          this.orderList = res.records.map((item) => {
            item.isCar = false;
            switch (item.payMethod) {
              case 'CASH':
                item.pay_method = '现结';
                break;
              case 'MONTH':
                item.pay_method = '月结';
                break;
              case 'ON_LINE':
                item.pay_method = '在线支付';
                break;
              default:
                return;
            }
            switch (item.orderFrom) {
              case 1:
                item.order_from = 'pc商城';
                break;
              case 2:
                item.order_from = '小程序';
                break;
              case 3:
                item.order_from = '代客下单';
                break;
            }
            return item;
          });
          this.orderTotal = res.total;
        })
        .finally(() => {
          this.orderLoading = false;
        });
    },
    // 获取用户地址
    getAddress(memberId) {
      this.$http.get('member/getAdminBmsTrPosDef', { params: { memberId }}).then(res => {
        this.address = res;
      });
    },
    // 选择客户
    getCustomerId(customer) {
      if (customer.id === null) {
        this.$message.warning('当前用户没有在报货平台中注册');
        return;
      }
      this.customer = customer;
      this.isCus = true;
      // 地址
      this.address = `${customer.legalperson}  ${customer.zxPhone || ''} ${
        customer.registadd
      }`;
      this.types.forEach(item => {
        if (item.desc === customer.settletype) {
          this.payMethod = item.val;
        }
      });
      this.getOrderInfo(customer.erpUserId);
      this.getCar(customer.id);
      this.isCustomer();
      this.getAddress(customer.id);
      this.couponNum(customer.id);
      // 购物车商品参与的活动
      this.getMyCartJoinActivity(customer.id);
    },
    // 再次购买
    toShopCarPay(item, orderId) {
      this.$confirm('是否再次购买?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (item.isCar) return;
        item.isCar = true;
        this.$http
          .get('/pcOrderInfo/getTwoBuyGoodsInfoVo', {
            params: {
              orderId,
              memberId: this.customer.id,
            },
          })
          .then((res) => {
            const list = [];
            res = res.filter((item) => item.goodsNum !== 0);
            res.forEach((item) => {
              list.push({
                goodsNum: this.$math.divide(item.goodsNum, item.erpLeastsaleqty),
                goodsPrice: item.price,
                goodsImage: item.goodsImg,
                goodsName: item.goodsName,
                erpGoodsId: item.goodsId,
                storageId: item.erpStorageId,
                priceId: item.priceid,
                gcId: item.gcId,
                accflag: item.accflag,
                lotNo: item.lotno,
                lotId: item.lotid,
                memberId: this.customer.id,
              });
            });
            return list;
          })
          .then((list) => {
            this.$http
              .post('/goods/addAdminMemberCart', list)
              .then(() => {
                item.isCar = false;
                this.getCar();
              })
              .catch(() => {
                this.$message.error('添加购物车失败');
              });
          })
          .catch(() => {
            this.$message.error('添加购物车失败');
          });
      }).catch(() => {
      });
    },
    // 购物车列表
    getCar(memberId) {
      if (this.goodsId || this.orderId) return;
      if (!memberId) {
        memberId = this.customer.id;
      }
      this.$http
        .get('order/getAdminCartToActivity', { params: { memberId }})
        .then((res) => {
          const carList = [];
          for (const item in res) {
            res[item] = this.initGoodsInfo(res[item]);
            carList.push(...res[item]);
          }
          const isSelet = carList.some((item) => {
            return item.pitchOn === 1;
          });
          this.isAllSelect = isSelet;
          this.intiGoodsActivity(res);
          this.couponNum(memberId);
        });
    },
    intiGoodsActivity(res) {
      const carList = [];
      for (const item in res) {
        if (res[item].length > 0) {
          carList.push({
            activityId: item,
            list: res[item],
            key: item,
          });
        }
      }
      this.selCar = [];
      carList.sort((a, b) => {
        return b.key - a.key;
      });
      this.carList = carList.map((item) => {
        this.selCar.push(...item.list);
        return item;
      });
      this.selCar = this.selCar
        .filter((item) => item.isSelet)
        .map((item) => {
          item.amount = item.amountNum;
          return item;
        });
    },
    // 商品信息修改
    initGoodsInfo(res) {
      const giftList = [];
      let stqty = 0;
      let amountReduce = 0;
      // 累加商品的总额
      res.forEach((item) => {
        // amountReduce += item.amountNum;
        amountReduce = this.$math.add(amountReduce, item.amountNum);
      });
      // console.log(JSON.parse(JSON.stringify(res)));
      res.forEach((item, index) => {
        const obj = {};
        item.isFalse = false;
        item.goodsImgs = '';
        if (item.goodsImgList[0]) {
          item.goodsImgs = item.goodsImgList[0].code;
        } else {
          item.goodsImgs = 'zs/8CC5F0FB117304AEDE402E621C6B6D8139BFFA48';
        }
        if (item.storageId === 5) {
          item.activityVoList = [];
          item.activityId = null;
        }

        item.isSelet = item.pitchOn === 1;
        item.cxVisib = false;
        if (item.goodsunit === 'g' || item.goodsunit === 'kg') {
          item.goodsunit = '包';
        }
        if (this.customerLicense) {
          if (
            this.customerLicense.indexOf(item.busiscopeName) !== -1 ||
            item.busiscopeName === null
          ) {
            item.isBusiness = true; // 有经营范围
          } else {
            item.isBusiness = false;
          }
        }
        // item.zxB2bNumLimit /= 10000;
        item.isGoodsPayPrice = false;
        // item.goodsPrice *= item.zxB2bNumLimit;
        item.goodsPrice = this.$math.multiply(item.goodsPrice, item.zxB2bNumLimit);
        item.prices = item.goodsPrice;
        item.value = '';
        // item.amount = item.goodsNum * item.goodsPrice;
        item.amount = this.$math.multiply(item.goodsNum, item.goodsPrice);
        item.stqty = item.stqty || 0;
        item.abbreviation = '';
        item.reduction = 0; // 设置满减默认值
        item.index = index; // 给每一个商品添加唯一标识
        item.amountReduce = 0; // 满减总价初始化
        item.isReducePrice = false;
        item.show3 = false;
        // item.goodsPayPrice = item.goodsPrice; // 控制优惠活动显示
        if (item.killOrDiscount === '折扣') {
          item.isGoodsPayPrice = true;
          // item.goodsPrice = item.goodsPayPrice * item.zxB2bNumLimit;
          item.goodsPrice = this.$math.multiply(item.goodsPayPrice, item.zxB2bNumLimit);
          item.amountNum = item.amountPay;
          item.activitZQ = '折扣';
        }
        if (item.killOrDiscount === '限购') {
          item.isLimit = true;
          item.goodsPrice = math.multiply(
            item.limGoodsPayPrice,
            item.zxB2bNumLimit
          );
          item.activitZQ = "限购价";
        }
        if (item.killOrDiscount === '品牌特价') {
          item.isBrand = true;
          // item.goodsPrice = item.goodsPayPrice * item.zxB2bNumLimit;
          item.goodsPrice = this.$math.multiply(item.goodsPayPrice, item.zxB2bNumLimit);
          item.amountNum = item.amountPay;
          item.activitZQ = '特价';
        }
        if (item.killOrDiscount === '秒杀') {
          item.isSeckill = true;
          // item.goodsPrice = item.goodsPayPrice * item.zxB2bNumLimit;
          item.goodsPrice = this.$math.multiply(item.goodsPayPrice, item.zxB2bNumLimit);
          item.amountNum = item.amountPay;
          item.activitZQ = '秒杀';
        }
        // 赠品
        if (item.activityGiftList !== null && item.activityGiftList.length > 0) {
          item.activityGiftList.forEach(data => {
            data.goodsNum = data.giftNum;
            data.amountNum = data.amountPay;
          });
          giftList.push(...item.activityGiftList);
        }
        // 赠品
        if (item.giftStrategy === 30 || item.giftStrategy === 10) {
          giftList.push(item);
          // stqty += item.stqty;
          stqty = this.$math.add(stqty, item.stqty);
        }
        // 积分商品
        if (item.erpAccFlag === 5) {
          item.integralAmount = item.scoreTotal;
        }
        if (item.activityVoList) {
          //  let some = item.activityVoList.some(data => {
          //     return data.id === item.activityId;
          //   })
          // 获取参与活动
          item.activityVoList.forEach((data) => {
            if (data.activityStrategy === 20) {
              item.isGoodsContent = true;
              item.abbreviation += data.abbreviation + ',';
            }
            // if (!some && (data.activityStrategy === 30 || data.activityStrategy === 40)) {
            //     item.value = data;
            // }
            if (data.activityStrategy === 100) {
              item.isLimitContent = true;
              item.abbreviation = data.abbreviation;
            }
            if (item.activityId === data.id) {
              const { activityStrategy } = data;
              item.value = data;
              // 满减
              if (activityStrategy === 30) {
                item.isReducePrice = true;
                item.amountReduce = amountReduce;
              }
              // 满赠
              if (activityStrategy === 40) {
                item.isGoodsGift = true;
              }
            }
          });
          // 活动去重
          item.strategyList = item.activityVoList.reduce(function (a, b) {
            if (
              b.activityStrategy === 30 ||
              b.activityStrategy === 40 ||
              b.activityStrategy === 50
            ) {
              obj[b.id] ? '' : (obj[b.id] = true && a.push(b));
            }
            return a;
          }, []);
        }
        if (item.abbreviation) {
          item.abbreviation = item.abbreviation.slice(
            0,
            item.abbreviation.length - 1
          );
        }
      });
      if (giftList.length > 0) {
        res.forEach((item) => {
          if (giftList[0].giftStrategy === 30 && giftList[0].giftCount > 1) {
            item.isGiftGoods = true;
          } else {
            item.isGiftGoods = false;
          }
          item.giftList = JSON.parse(JSON.stringify(giftList));
          item.giftStqty = stqty;
        });
      }
      return res;
    },
    // 优惠券数量
    couponNum(memberId) {
      this.$http.get('order/getAdminByCartCoupon1', { params: { memberId }}).then((res) => {
        this.fullReduction = [];
        this.discount = [];
        this.cash = [];
        res.map((item) => {
          item.isCoupon = false; // 设置优惠卷选中
          // // 分发数据
          switch (item.type) {
            case 'FULL_REDUCTION_TICKET':
              item.couponType = '满减券';
              break;
            case 'FULL_PRESENT_TICKET':
              item.couponType = '折扣券';
              break;
            case 'CASH_TICKET':
              item.couponType = '现金券';
              break;
          }
          if (item.remark === '优惠券可用') {
            item.isAvailable = false;
          } else {
            item.isAvailable = true;
          }
          this.couponState.forEach((data) => {
            if (item.type === data.val) {
              this[data.name].push(item);
            }
          });
          // this.couponList = res;
        });
      });
    },
    // 关闭弹窗
    handleClose() {
      this.dialogVisible = false;
      this.orderMask = false;
      this.couponMask = false;
      this.orderInfoMask = false;
      this.orderInfoList = [];
    },
    // 下拉选中
    selectGiftVoList() {},
    // 全选
    selectAll() {
      this.carList.map((item) => {
        item.list.forEach((data) => {
          if (this.isAllSelect === true) {
            data.isSelet = false;
          } else {
            data.isSelet = true;
          }
        });
      });
      this.isAllSelect = !this.isAllSelect;
      if (this.isAllSelect) {
        this.isSelet = true;
      } else {
        this.isSelet = false;
        this.selCar = [];
      }
      if (this.carList.length !== 0) {
        this.selCar = [];
        this.carList.forEach((item) => {
          item.list
            .filter((data) => data.isSelet)
            .map((code) => {
              // code.amount = code.goodsNum * code.goodsPrice;
              code.amount = this.$math.multiply(code.goodsNum, code.goodsPrice);
              this.selCar.push(code);
              return item;
            });
        });
      }
      let pitchOn = this.carList.some((item) => {
        return item.list.some((data) => {
          return data.isSelet === true;
        });
      });
      pitchOn = pitchOn ? 1 : 2;
      this.$http
        .get('pcGoods/isPitchOnCart', {
          params: { pitchOn, memberId: this.customer.id },
        })
        .then(() => {
          this.getCar();
        });
      // this.distribute(this.carList)
      // this.stoDiscount();
    },
    // 批量删除
    delAll() {
      this.ids = [];
      this.carList.forEach((data) => {
        data.list
          .filter((item) => item.isSelet)
          .map((c) => {
            this.ids.push(c.id);
            this.delGoods();
          });
      });
    },
    // 下单
    payOrder() {
      // if (this.deliveryAmount > this.discountAmount / 10000) {
      //   this.$message.warning('商品总金额不能低于起送金额');
      //   return;
      // }
      if (this.customer.integral < this.integralAmount) {
        this.$message.warning('可用积分不足');
        return;
      }
      if (this.loading) return;
      this.loading = true;
      this.$http
        .post('/order/adminMemberPayOrder', {
          addressDetail: this.address[this.radio].address,
          invDemand: this.customer.invdemand,
          invType: this.customer.invtype,
          memberName: this.customer.customname,
          memberPhone: this.customer.zxPhone,
          tranposid: this.address[this.radio].tranposid,
          payMethod: this.payMethod,
          remark: this.remark,
          goodsRemark: this.goodsRemark,
          orderFrom: 3,
          translinename: this.address[this.radio].translinename,
          zxPhOrder: this.address[this.radio].zxPhone,
          couponIds: this.couponId,
          memberId: this.customer.id,
        })
        .then((res) => {
          this.loading = false;
          this.$message.success('下单成功');
          this.orderMask = false;
          this.getCar();
          this.$router.push({ path: 'details', query: { id: res.id }});
        })
        .finally(() => {
          this.loading = false;
        });
      // .catch(() => {
      //   this.$message({
      //     type: "info",
      //     message: "提交失败",
      //   });
      // })
    },
    // 删除购物车商品
    delGoods(item) {
      if (item) {
        this.ids = [item.id];
      }
      this.$confirm('确定将该商品从购物车移除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.$http
            .get('/pcGoods/delMemberCart', {
              params: {
                ids: this.ids.join(','),
                memberId: this.customer.id,
              },
            })
            .then(() => {
              this.getCar();
              this.$message.success('删除成功');
            });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          });
          if (item.goodsNum <= 0) {
            item.goodsNum = 1;
          }
        });
    },
    // 获取下单起送金额
    getDeliveryAmount() {
      this.$http
        .get('/pcOrderInfo/getDeliveryAmountByCustomerId', {})
        .then((res) => {
          this.deliveryAmount = res;
        });
    },
    // 搜索重置
    reset() {
      this.query();
      this.cusList = [];
      this.orderList = [];
      this.address = '';
      this.customer = {};
    },
    // 优惠券选择
    // selCoupon(couponAmount, couponId) {
    //   this.couponAmount = couponAmount;
    //   this.couponId = couponId;
    //   this.couponMask = false;
    // },
    // 优惠券选择
    selectCoupon(data) {
      this.couponId = '';
      this.couponAmount = 0;
      if (data.isCoupon) {
        this.fullReduction.map((item) => {
          if (item.id !== data.id) {
            item.isCoupon = false;
          }
        });
        this.discount.map((item) => {
          if (item.id !== data.id) {
            item.isCoupon = false;
          }
        });
        this.cash.map((item) => {
          if (item.id !== data.id) {
            item.isCoupon = false;
          }
        });
        if (data.reduceAmount) {
          this.couponAmount = data.reduceAmount;
        } else {
          this.couponAmount = data.couponDisAccount;
        }
        this.couponId = String(data.id);
      } else {
        this.couponId = '';
      }
    },
    // 获取行数据
    handleCurrent(val) {},
    // 分页事件
    customerPagination({ page: current, limit: size }) {
      this.queryForm.current = current;
      this.query();
    },
    handleSizeChange({ page: current, limit: size }) {
      this.queryForm.size = size;
      this.query();
    },
    // 历史订单分页事件
    orderPagination({ page: current, limit: size }) {
      this.orderQueryForm.current = current;
      this.getOrderInfo();
    },
    handleOrderSizeChange({ page: current, limit: size }) {
      this.orderQueryForm.size = size;
      this.getOrderInfo();
    },
    // 键盘快捷下单
    handleKeyDown(e) {
      var key = window.event.keyCode ? window.event.keyCode : window.event.which;
      if (key === 120) {
        if (JSON.stringify(this.customer) === '{}') {
          this.$message.warning('未选择客户');
          return;
        }
        if (this.selCar.length === 0) {
          this.$message.warning('暂无选择商品');
          return;
        }
        this.orderMask = true;
        // this.payOrder();
        e.preventDefault(); // 取消浏览器原有的ctrl+s操作
      }
    },
  },
};
</script>

<style scoped lang="less">
.receivingGoods {
  border: 1px solid #bdbdbd;
  font-size: 14px;
  .customer {
    display: flex;
    padding-left: 20px;
    box-sizing: border-box;
    background: #f1f1f1;
    border-bottom: 2px solid #c7c7c7;
    p {
      margin-right: 50px;
    }
  }
  .address-box {
    padding: 20px;

    .distribution {
      display: flex;
      p {
        margin: 0;
      }
      .address {
        padding: 10px 15px;
        border: 1px solid #dee2e8;
        border-radius: 4px;
        display: block;
        margin: 0;
        margin-bottom: 10px;
      }
    }
    .settlement {
      display: flex;
    }
    .firstChild {
      margin-right: 20px;
    }
    .lastChild {
      margin-left: 20px;
    }
    .firstChild-padding {
      padding: 10px 0;
    }
  }
}
.car-title {
  padding: 12px 3.21 * 14px;
  box-sizing: border-box;
  color: #333;
  border: 1px solid #f0f0f0;
  border-bottom: 1px solid #e1251b;
  margin-top: 20px;
  position: relative;
  z-index: 99;
  .carSelectActivity {
    // border: 1px solid #e1251b;
    // padding: 5px 10px;
    position: absolute;
    right: 24%;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
  }
  .select-style {
    // position: absolute;
    position: relative;
    // right: 24%;
    // top: 0;
    // transform: translateY(-50%);
    width: 170px;
    border: 1px solid #e1251b !important;
    color: #e1251b !important;
    // text-align: center;
    padding: 0 5px;
    padding-right: 25px;
    box-sizing: border-box;
    text-align: left;
    background: #fff;
    cursor: pointer;
    .span {
      display: inline-block;
      width: 100%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    i {
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
      color: #e1251b !important;
    }
    .el-select-dropdown {
      position: absolute;
      width: 430px;
      box-shadow: none;
      border-radius: 0;
      left: -1px;
      top: 14px;
      border: 1px solid #e1251b;
      color: #6a6a6a;
      .one_hidden {
        width: 100%;
        line-height: 30px;
        padding: 0 5px 0 10px;
        box-sizing: border-box;
        display: flex;
        // align-items: center;
        .radio {
          width: 10px;
          height: 10px;
          display: inline-block;
          border-radius: 50%;
          border: 1px solid #999;
          position: relative;
          div {
            width: 6px;
            height: 6px;
            background: #e1251b;
            border-radius: 50%;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
          }
        }
        .isRadio {
          border: 1px solid #e1251b;
        }
        p {
          flex: 1;
          // overflow: hidden;
          // white-space: nowrap;
          // text-overflow: ellipsis;
          margin-left: 5px;
        }
        &:hover {
          background: #f5f7fa;
        }
      }
      .isActive {
        color: #e1251b;
      }
      &::before {
        content: "";
        display: block;
        width: 168px;
        border-top: 1px solid #fff;
        position: absolute;
        left: 0;
        top: -2px;
        z-index: 99;
      }
    }
  }
}
.car-main-name {
    color: #333;
    width: 100%;
    height: 2.71 * 14px;
    line-height: 2.71 * 14px;
    border: 1px solid #f0f0f0;
    border-top: none;
    box-sizing: border-box;
    margin-bottom: 5px;
    .car-name-left {
      width: 60%;
      padding: 0rem 10.86 * 14px;
      box-sizing: border-box;
    }
    .car-name-right {
      width: 40%;
      p:nth-of-type(1) {
        width: 160px;
        text-align: center;
      }
      p:nth-of-type(2) {
        width: 8.58 * 14px;
        text-align: center;
      }
      p:nth-of-type(3) {
        width: 8.58 * 14px;
        text-align: center;
      }
      p:nth-of-type(4) {
        width: 7.58 * 14px;
        text-align: center;
      }
    }
    .car-name-right-2 {
      p:nth-of-type(3) {
        width: 13.58 * 14px;
        justify-content: flex-end;
      }
    }
  }
.bottom-car {
  //   position: fixed;
  //   bottom: 0;
  width: 100%;
  //   left: 50%;
  // margin-left: -42.19 * 14px;
  //   transform: translateX(-50%);
  z-index: 30;
  background: #fff;
  .manjian {
    width: 100%;
    height: 2.71 * 14px;
    background: #ffeed1;
    padding-left: 1.64 * 14px;
    box-sizing: border-box;
    font-size: 0.86 * 14px;
    color: #4d4d4d;
    p {
      width: 2.14 * 14px;
      height: 1.29 * 14px;
      text-align: center;
      background: #e1251b;
      color: #fff;
      margin-right: 0.86 * 14px;
    }
    span {
      color: #e1251b;
      margin-left: 0.6 * 14px;
    }
  }

  .bottom-all {
    color: #333;
    font-size: 0.86 * 14px;
    // height: 4.43 * 14px;
    border: 1px solid #e6e6e6;
    box-sizing: border-box;
    align-items: flex-end;
    padding-top: 20px;
    .bottom-all-left {
      padding: 20px 1.43 * 14px;
      height: 100%;
      box-sizing: border-box;
      img {
        width: 1 * 14px;
        height: 1 * 14px;
        margin-right: 1.5 * 14px;
      }
      span {
        margin-right: 1.5 * 14px;
      }
      button {
        margin-right: 1.5 * 14px;
      }
    }
    .bottom-all-right {
      align-items: flex-end;
      p {
        margin: 0;
      }
      .youhui {
        margin-right: 0.6 * 14px;
        margin-top: 0.36 * 14px;
      }
      .zongji {
        margin-top: 0.36 * 14px;
      }
      .toPay {
        width: 150px;
        height: 4.43 * 14px;
        background: #e1251b;
        color: #fff;
        line-height: 4.43 * 14px;
        font-size: 1.57 * 14px;
        &.gray {
          background: #999999;
        }
      }
      .bottom-price {
        color: #666666;
        font-size: 1 * 14px;
        margin-bottom: 0.71 * 14px;
        width: 20 * 14px;
        text-align: right;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        & > span {
          display: inline-block;
          font-size: 1.4 * 14px;
          text-align: right;
          color: #e1251b;
          font-weight: bold;
        }
      }
      .original-price {
        color: #666666;
        font-size: 1 * 14px;
        margin-bottom: 0.71 * 14px;
        width: 20 * 14px;
        text-align: right;
      }
    }
  }
}
.j_b_box {
  display: flex;
  display: -webkit-flex;
  justify-content: space-between;
  align-items: center;
}
.flexbox {
  display: flex !important;
}
.flexBox {
  display: flex;
  display: -webkit-flex;
  justify-content: center;
  align-items: center;
}
.one-hidden {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.columnBox {
  flex-direction: column !important;
}
.car-main-list-all {
  font-size: 14px !important;
}
.centerBox {
  display: flex;
  display: -webkit-flex;
  align-items: center;
}
.cursor {
  cursor: pointer;
}
.coupon {
  padding: 0 20px;
  font-size: 18px;
  cursor: pointer;
}
.bottom-all-right {
  .youhui {
    margin-right: 0.6 * 14px;
    margin-top: 0.36 * 14px;
  }
  .zongji {
    margin-top: 0.36 * 14px;
  }
  .bottom-price {
     color: #666666;
    font-size: 14px;
    margin-bottom: 9.94px;
    width: 280px;
    text-align: right;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    span {
      display: inline-block;
      font-size: 19.6px;
      text-align: right;
      color: #e1251b;
      font-weight: bold;
    }
  }
  .toPay {
    width: 7.14 * 14px;
    height: 4.43 * 14px;
    background: #e1251b;
    color: #fff;
    text-align: center;
    line-height: 4.43 * 14px;
    font-size: 1.57 * 14px;
    &.gray {
      background: #999999;
    }
  }
}
/deep/ .el-button {
  .el-icon-loading {
    font-size: 12px !important;
  }
}
// 优惠卷
.coupon-box {
  .el-tab-pane {
    padding: 0 10px;
  }
}
.addCar {
  width: 100px;
  height: 50px;
}
</style>
