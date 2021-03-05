<template>
  <div>
    <div class="coupon">
      <div
        v-for="(item, index) of data"
        :key="index"
        style="margin-bottom: 16px;"
        @click="
          selectCoupon(item, index);
          handleCoupon(item, index);
        "
      >
        <div class="coupon-bgImage" :style="{ background: `url(${bgImage[indexs].url})` }">
          <div v-if="item.isAvailable" class="isAvailable" />
          <div class="coupon-information">
            <div
              style="padding: 0 10px; font-size: 12px; position: relative"
              class="couponIcon"
            >
              <img
                src="@/assets/img/iconWarning.png"
                alt=""
                class="iconWarning"
              >{{ item.explain }}使用
            </div>
            <div class="amount-box">
              <div v-if="item.reduceAmount" class="amount">
                <span class="money">
                  <span style="font-size: 16px">￥</span>{{ item.reduceAmount }}
                </span>
                <p>满{{ item.fullAmount }}元可用</p>
              </div>
              <p v-else-if="item.discount" class="amount">
                <span class="money">
                  {{ item.discount / 1000 }}
                </span>
              </p>
              <div class="information">
                <p>{{ item.couponType }}</p>
              </div>
            </div>
            <div
              v-if="item.useStartTime !== null && item.useEndTime !== null"
              class="termOfValidity"
            >
              有效期：{{ item.useStartTime.split(" ")[0] }} 至
              {{ item.useEndTime.split(" ")[0] }}
            </div>
            <div
              v-else-if="
                item.cUseEndTime !== null && item.cUseStartTime !== null
              "
              class="termOfValidity"
            >
              有效期：{{ item.cUseStartTime.split(" ")[0] }} 至
              {{ item.cUseEndTime.split(" ")[0] }}
            </div>
          </div>
          <p>
            <span>点</span>
            <span>击</span>
            <span>{{ receive ? "领" : "使" }}</span>
            <span>{{ receive ? "取" : "用" }}</span>
          </p>
          <img
            v-if="item.isCoupon"
            src="@/assets/img/Selected.png"
            alt=""
          >
        </div>
        <div v-if="item.isAvailable">{{ item.remark }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    receive: {
      type: Boolean,
      default: false,
    },
    indexs: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      bgImage: [
        {
          url: require('@/assets/img/fullReduction.png'),
        },
        {
          url: require('@/assets/img/Discount.png'),
        },
        {
          url: require('@/assets/img/cash.png'),
        },
      ],
    };
  },
  methods: {
    selectCoupon(data, index) {
      if (this.data[index].isAvailable) return;
      this.data[index].isCoupon = !this.data[index].isCoupon;
      this.data.map((item, indexs) => {
        if (index !== indexs) {
          item.isCoupon = false;
        }
      });
      this.$emit('selectCoupon', data, index);
    },
    handleCoupon(data, index) {
      if (this.data[index].isAvailable) return;
      this.$emit('handleCoupon', this.data[index]);
    },
  },
};
</script>

<style scoped lang="less">
// 优惠卷
.coupon {
  display: flex;
  // justify-content: space-between;
  flex-wrap: wrap;
  .coupon-bgImage {
    width: 264px;
    height: 112px;
    background: url("../../../../assets/img/Discount.png");
    margin-bottom: 5px;
    position: relative;
    display: flex;
    cursor: pointer;
    margin-right: 10px;
    .coupon-information {
      width: 217px;
      color: #fff;
      padding-top: 10px;
      .amount-box {
        display: flex;
        .amount {
          width: 100%;
          font-size: 38px;
          padding-left: 10px;
          font-weight: Bold;
          // display: flex;
          // justify-content: center;
          // align-items: center;
          .money {
            display: flex;
            justify-content: center;
            align-items: center;
          }
          p {
            font-size: 12px;
            font-weight: 100;
          }
        }
        .information {
          width: 100%;
          padding-top: 7px;
          display: flex;
          justify-content: center;
          // align-items: center;
          p {
            text-align: center;
            font-size: 30px;
          }
        }
      }
      .termOfValidity {
        font-size: 12px;
        margin-top: 7px;
        padding-left: 10px;
      }
    }
    & > p {
      width: 44px;
      font-weight: 900;
      font-size: 16px;
      padding: 3px 0;
      span {
        display: block;
        text-align: center;
      }
    }
    img {
      position: absolute;
      right: 0;
      bottom: 0;
    }
  }
  .isAvailable {
    width: 264px;
    height: 121px;
    background: #fff;
    position: absolute;
    z-index: 999;
    opacity: 0.6;
  }
}
.couponIcon {
  display: flex;
  align-items: center;
}
.iconWarning {
  position: static !important;
  margin-right: 4px;
}
p {
  margin: 0;
}
</style>
