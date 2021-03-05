<template>
  <el-dialog
    title="优惠券选择"
    :visible.sync="dialogVisible"
    :before-close="handleClose"
    width="80%"
  >
    <!-- 优惠卷选择 -->
    <el-tabs type="border-card" class="coupon-box">
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
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="selCoupon">
        确 定
      </el-button>
      <el-button @click="handleClose">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
const Coupon = () => import('./coupon');
export default {
  components: {
    Coupon
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    memberId: {
      type: Number,
      default: 0
    },
    couponList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      fullReduction: [],
      discount: [],
      cash: [],
      couponId: null,
      couponAmount: 0,
      couponState: [
        { val: 'FULL_REDUCTION_TICKET', desc: '满减券', name: 'fullReduction' },
        { val: 'FULL_PRESENT_TICKET', desc: '折扣券', name: 'discount' },
        { val: 'CASH_TICKET', desc: '现金券', name: 'cash' },
      ],
    };
  },
  mounted() {
    // this.getCoupon();

  },
  methods: {
    // 优惠卷
    getCoupon() {
      const memberId = this.memberId;
      this.$http.get('order/getAdminByCartCoupon1', { params: { memberId }}).then((res) => {

      });
    },
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
    handleClose() {
      this.$emit('handleClose');
    },
    selCoupon() {
      this.$emit('selCoupon', this.couponAmount, this.couponId);
    }
  }
};
</script>

<style scoped lang="less">
// 优惠卷
.coupon-box {
  .el-tab-pane {
    padding: 0 10px;
  }
}
</style>
