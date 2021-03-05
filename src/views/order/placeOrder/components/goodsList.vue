<template>
  <div class="car-main-list-box" style="margin-bottom: 20px">
    <div v-if="carList[0].isReducePrice || carList[0].isGoodsGift">
      <div class="car-main-list-title">
        <p class="centerBox" style="position: relative">
          <span v-if="carList[0].isReducePrice" class="image-box">
            <img src="@/assets/img/manzeng.png" alt>
            <span>满减</span>
          </span>
          <span v-if="carList[0].isGoodsGift" class="image-box">
            <img src="@/assets/img/manzeng.png" alt>
            <span>满赠</span>
          </span>
          <span
            v-if="
              carList[0].value.activityStrategy === 30 ||
                carList[0].value.activityStrategy === 40
            "
            style="width: 660px; display: flex; align-items: center"
            class="activityContent"
          >{{ carList[0].value.content }}</span>

          <span v-if="carList[0].isReducePrice" class="fullGift">
            <span
              style="display: block"
            >￥{{
              carList[0].amountReduce | toThousandFilter
            }}</span>
            <span
              style="display: block; color: red"
            >￥{{
              -carList[0].reducePrice | toThousandFilter
            }}</span>
          </span>
          <span
            v-if="
              carList[0].value.activityStrategy === 40 &&
                carList[0].giftStqty === 0
            "
          >
            赠品已赠完
          </span>
          <!-- <span class="select" @click="selectGift" v-if="carList[0].isGiftGoods"
            >选择赠品 ></span
          > -->
        </p>
      </div>
    </div>
    <div
      v-for="(item, index) in carList"
      :key="index"
      class="car-main-list"
      :class="step2 ? 'car-main-list-2' : item.isFalse ? 'falseList' : ''"
    >
      <div v-if="item.goodType !== 4">
        <div class="discount-wrap">
          <span
            class="one-hidden"
          >商品编号：{{ item.goodsId || item.erpGoodsId }}</span>
          <p v-if="item.isSeckill" class="discount">
            <span>限时秒杀</span>
          </p>
          <p v-if="item.isBrand" class="discount">
            <span>品牌特价</span>
          </p>
          <p v-if="item.fullCourt" class="discount">
            <span>全场折扣</span>
          </p>
          <p v-if="item.isGoodsContent" class="discount">
            <span>商品折扣</span>
            <span>{{ item.abbreviation }}</span>
          </p>
          <p v-if="item.goodsCouponContent" class="discount">
            <span>优惠卷</span>
            <span>{{ item.goodsCouponContent }}</span>
          </p>
          <p class="discount" v-if="item.isLimitContent">
            <span>限购</span>
            <span style="margin-right:10px">{{item.abbreviation}}</span>
            <span style="color: #e1251b;">{{ item.limTop }}</span>
          </p>
        </div>
        <div class="car-main-list-all j_b_box">
          <div class="car-list-left flexbox">
            <img
              v-if="!item.isSelet"
              src="@/assets/img/icon1.png"
              alt
              class="car-left-icon"
              @click="selet(item)"
            >
            <img
              v-if="item.isSelet"
              src="@/assets/img/icon1-sel.png"
              alt
              class="car-left-icon"
              @click="selet(item)"
            >
            <div
              style="
                position: relative;
                width: 5.71 * 14px;
                height: 5.71 * 14px;
              "
            >
              <img
                :src="imgHost + item.goodsImgs"
                alt
                class="car-left-goods cursor"
                @click="toGoodsDetails(item)"
              >
              <img
                v-if="item.storageId === 5"
                src="@/assets/img/icon5.png"
                style="position: absolute; left: 0; top: 0; width: 40px"
              >
            </div>
            <p class="car-left-tong one-hidden flexBox columnBox">
              <span class="one-hidden">通用名：{{ item.goodsName }}</span>
              <span class="one-hidden">商品名：{{ item.currencyname }}</span>
              <span class="one-hidden">生产厂家：{{ item.factoryname }}</span>
            </p>
            <p class="car-left-gui flexBox columnBox one-hidden">
              <span class="one-hidden">规格：{{ item.goodstype }}</span>
              <span>单位：{{ item.goodsunit }}</span>
              <span class="one-hidden">批号：{{ item.lotNo }}</span>
            </p>
          </div>
          <div class="car-list-right flexbox">
            <div class="list-right-one flexBox columnBox">
              <!-- <span v-if="item.isGoodsPayPrice">{{ item.goodsDiscount }}</span> -->
              <p v-if="item.erpAccFlag === 5">
                <span>积分：
                  {{ item.convertibleIntegral | toThousandFilter }}
                </span>
              </p>
              <p
                v-else
                :style="
                  item.isGoodsPayPrice ||
                    item.isSeckill ||
                    item.isBrand ||
                    item.fullCourt || item.isLimit
                    ? 'color:red;font-weight: 700;font-size:14px'
                    : ''
                "
              >
                <span
                  v-if="
                    item.isGoodsPayPrice ||
                      item.isSeckill ||
                      item.isBrand ||
                      item.fullCourt
                  "
                >{{ item.activitZQ }}</span>
                <span>
                  ￥{{ item.goodsPrice | moneyFilter | toThousandFilter }}
                </span>
              </p>
              <span
                style="margin-left: 5px;"
                :style="!item.isLimit?'text-decoration: line-through;color: #888888;':''"
                v-if="item.isGoodsPayPrice || item.isSeckill || item.isBrand || item.fullCourt||item.isLimit"
              >
               <span v-if="item.limTop">原价</span> ￥{{ item.prices | moneyFilter | toThousandFilter }}
              </span>
              <div
                v-if="
                  item.strategyList !== undefined &&
                    item.strategyList.length !== 0
                "
                style="width: 100%"
                class="select-box"
              >
                <div
                  v-if="
                    step2 !== true &&
                      item.strategyList != undefined &&
                      item.strategyList.length > 0
                  "
                  class="select-style"
                  @click="item.show3 = !item.show3"
                >
                  <span v-if="item.value" class="span">{{
                    item.value.abbreviation
                  }}</span>
                  <span v-else>促销</span>
                  <i class="el-icon-arrow-down" />
                  <div>
                    <el-collapse-transition>
                      <div v-show="item.show3" class="el-select-dropdown">
                        <div
                          v-for="data of item.strategyList"
                          :key="data.asId"
                          class="transition-box one_hidden"
                          :class="item.activityId === data.id ? 'isActive' : ''"
                          @click="
                            selectGiftVoList(item, data, index);
                            item.show3 = true;
                          "
                        >
                          <div
                            class="radio"
                            :class="
                              item.activityId === data.id ? 'isRadio' : ''
                            "
                          >
                            <div v-if="item.activityId === data.id" />
                          </div>
                          <p>{{ data.abbreviation }}</p>
                        </div>
                      </div>
                    </el-collapse-transition>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="!step2" class="list-right-two">
              <addReduce
                :number.sync="item.goodsNum"
                @makeNum="makeNum(item, index)"
                @reduce="reduce(item, index)"
                @getValues="getValues(item)"
                @getChange="getChange(item, index)"
              />
              <p class="list-right-two-p">
                库存
                <span>{{ item.stqty > 500 ? ">500" : item.stqty }}</span> 件
              </p>
            </div>
            <div v-if="step2" class="list-right-two">
              <p class="list-right-two-p">x{{ item.goodsNum }}</p>
            </div>
            <div class="list-right-three">
              <div v-if="item.erpAccFlag === 5" class="integral">
                <img src="@/assets/img/integral.png" alt="">{{
                  item.scoreTotal | toThousandFilter
                }}
              </div>
              <div v-else>
                ￥{{ item.amountNum | moneyFilter | toThousandFilter }}
              </div>
            </div>
            <div
              v-if="!step2"
              class="list-right-four cursor"
              @click="del(item)"
            >
              删除
            </div>
          </div>
        </div>
        <img
          v-if="item.stqty === 0"
          src="@/assets/img/quehuo.png"
          class="quehuo"
        >
      </div>
    </div>
    <!-- {{carList[0].giftList }} -->
    <!-- 赠品商品显示 -->
    <div
      v-for="item in carList[0].giftList"
      :key="item.id"
      class="car-main-list"
      :class="step2 ? 'car-main-list-2' : item.isFalse ? 'falseList' : ''"
      style="margin-top: 10px"
    >
      <div class="car-main-list-all j_b_box">
        <div class="car-list-left flexbox">
          <div class="giftIcon">
            <p>赠品</p>
          </div>
          <div class="goodsGiftImage">
            <div v-if="item.stqty == 0" class="giftMask" />
            <img
              :src="imgHost + item.goodsImgs"
              alt
              class="car-left-goods cursor goodsGift"
            >
            <img
              v-if="item.stqty == 0"
              src="@/assets/img/giftquehuo.png"
              alt
              class="quehuoImage"
            >
          </div>
          <p class="car-left-tong one-hidden flexBox columnBox">
            <span class="one-hidden">商品名：{{ item.currencyname }}</span>
            <span class="one-hidden">通用名：{{ item.goodsName }}</span>
            <span class="one-hidden">生产厂家：{{ item.factoryname }}</span>
          </p>
          <p class="car-left-gui flexBox columnBox one-hidden">
            <span class="one-hidden">规格：{{ item.goodstype }}</span>
            <span>单位：{{ item.goodsunit }}</span>
            <span class="one-hidden">批号：{{ item.lotno }}</span>
          </p>
        </div>
        <div class="car-list-right flexbox">
          <div class="list-right-one flexBox columnBox">
            ￥{{ item.goodsPrice | moneyFilter | toThousandFilter }}
          </div>
          <!-- <div class="list-right-two" v-if="!step2">{{item.goodsNum}}</div> -->
          <div v-if="item.stqty !== 0" class="list-right-two">
            <div
              v-if="!step2 && item.giftStrategy === 30 && item.giftCount > 1"
              class="list-right-two"
            >
              <addReduce
                :number.sync="item.goodsNum"
                @makeNum="giftMakeNum(item)"
                @reduce="giftReduce(item)"
                @getValues="giftGetValues(item)"
              />
            </div>
            <p v-else class="list-right-two-p">x{{ item.goodsNum }}</p>
            <p class="list-right-two-p">
              库存
              <span>{{ item.stqty > 500 ? ">500" : item.stqty }}</span> 件
            </p>
          </div>
          <div v-else class="list-right-two quehuo1">已赠完</div>
          <div class="list-right-three">
            <span>
              ￥{{ item.amountNum | moneyFilter | toThousandFilter }}</span>
          </div>
        </div>
      </div>
    </div>
    <!-- <gift
      :giftVoList="giftVoList"
      :giftListNum="giftListNum"
      :dialogVisible="dialogVisible"
      :giftStrategy="giftStrategy"
      @handleClose="handleClose"
      @onSubmit="onSubmit"
    /> -->
  </div>
</template>

<script>
// const gift = () => import("./gift");
const addReduce = () => import('./addReduce.vue');
import { _throttle } from '@/utils/public.js';
import { imgHost } from '@/config';
export default {
  components: {
    addReduce,
    // gift,
  },
  props: {
    carList: {
      type: Array,
      default: () => [],
    },
    resList: {
      type: Array,
      default: () => [],
    },
    isActivity: {
      type: Boolean,
      default: true,
    },
    step2: {
      type: Boolean,
      default: false,
    },
    memberId: {
      type: Number,
      default: 0,
    },
    indexs: {
      type: Number,
      default: 0,
    },
    selCar: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      value: '',
      dialogVisible: false,
      goodsIndex: 0,
      activityIndex: 0,
      gifts: {},
      giftStrategy: '',
      show3: false,
      giftListNum: 0,
      giftAmount: 0,
      imgHost: imgHost,
    };
  },
  mounted() {
    // this.carList.map((item) => {
    //   if (item.activityVoList === undefined) return;
    //   item.activityVoList.map((data, index) => {
    //     data.index = index;
    //   });
    // });
  },
  methods: {
    // 赠品数量增加
    giftMakeNum(item) {
      let giftListNum = this.carList[0].activityGiftList[0].num;
      this.carList[0].activityGiftList.forEach((data) => {
        if (data.giftStrategy === 30) {
          // giftListNum -= data.goodsNum;
          giftListNum = this.$math.subtract(giftListNum, data.goodsNum);
        }
      });
      this.carList[0].activityGiftList.forEach((data) => {
        if (giftListNum >= 0 && data.giftStrategy === 30) {
          data.goodsNums = data.goodsNum;
        }
      });
      if (giftListNum < 0) {
        let giftName = this.carList[0].activityGiftList[0].num;
        this.carList[0].activityGiftList.forEach((data) => {
          if (data.erpGoodsId !== item.erpGoodsId && data.giftStrategy === 30) {
            // giftName -= data.goodsNum;
            giftName = this.$math.subtract(giftName, data.goodsNum);
          }
        });
        item.goodsNum = giftName;
        if (
          this.carList[0].activityGiftList[0].goodsNums &&
          item.giftStrategy === 30
        ) {
          this.$alert('赠品数量已达到' + item.num, '', {
            confirmButtonText: '确定',
          });
        }
      }
      if (item.goodsNum > item.stqty) {
        item.goodsNum = item.stqty;
      }
      if (item.goodsNum === 0) {
        item.goodsNum = 0;
        return;
      }
      this.updateGift(item);
    },
    // 赠品数量减少
    giftReduce(item) {
      if (item.goodsNum === 0) {
        item.goodsNum = 1;
        return;
      }
      this.updateGift(item);
    },
    // 赠品数量更改
    giftGetValues(item) {
      let giftListNum = this.carList[0].activityGiftList[0].num;
      this.carList[0].activityGiftList.forEach((data) => {
        if (data.giftStrategy === 30) {
          // giftListNum -= data.goodsNum;
          giftListNum = this.$math.subtract(giftListNum, data.goodsNum);
        }
      });
      this.carList[0].activityGiftList.forEach((data) => {
        if (giftListNum >= 0 && data.giftStrategy === 30) {
          // data.goodsNums = data.goodsNum;
          data.goodsNums = this.$math.subtract(data.goodsNums, data.goodsNum);
        }
      });
      if (giftListNum < 0) {
        let giftName = this.carList[0].activityGiftList[0].num;
        this.carList[0].activityGiftList.forEach((data) => {
          if (data.erpGoodsId !== item.erpGoodsId && data.giftStrategy === 30) {
            // giftName -= data.goodsNum;
            giftName = this.$math.subtract(giftName, data.goodsNum);
          }
        });
        item.goodsNum = giftName;
      }
      if (item.goodsNum === 0) {
        item.goodsNum = 0;
        return;
      }
      this.updateGift(item);
    },
    updateGift(item) {
      const { cartGiftTmpId: id, goodsNum } = item;
      this.$http.post('pcOrderInfo/updateCartGiftTmp', { id, goodsNum, memberId: this.memberId });
    },
    // 取消赠品弹窗
    handleClose() {
      this.dialogVisible = false;
    },
    // 打开赠品
    selectGift() {
      this.dialogVisible = true;
      this.giftVoList = this.carList[0].activityGiftList;
      this.giftListNum = this.carList[0].activityGiftList[0].num;
    },
    // 活动下拉框选中
    selectGiftVoList(item, data) {
      item.asId = data.asId;
      item.activityId = data.id;
      this.updateCar(item);
    },
    // 发送数据
    onSubmit() {
      this.handleClose();
    },
    del(item) {
      this.$emit('del', item);
    },
    // 商品单选
    selet(item) {
      if (this.step2) return;
      item.isSelet = !item.isSelet;
      const index = this.selCar.findIndex((data) => {
        return item.index === data.index;
      });
      if (!item.isSelet) {
        this.selCar.splice(index, 1);
      } else {
        this.selCar.push(item);
      }
      this.updateCar(item);
    },
    // 改变商品数量
    makeNum(item) {
      // console.log(item.asId);
      if (item.goodsNum > item.stqty) {
        item.goodsNum = item.stqty;
        return;
      }
      this.goodsNumAmount(item);
    },
    // 改变商品数量
    reduce(item) {
      if (item.goodsNum === 0) {
        this.del(item);
        return;
      }
      this.goodsNumAmount(item);
    },
    getChange(item, index) {
      if (this.carList[index].goodsNum === 0) {
        this.carList[index].goodsNum = 1;
      }
    },
    // 总额
    goodsNumAmount(item) {
      if (item.erpAccFlag !== 5) {
        // item.amountNum = item.goodsNum * item.goodsPrice;
        item.amountNum = this.$math.multiply(item.goodsNum, item.goodsPrice);
        // item.pubGoodsPriceList[0].amount = item.goodsNum * item.goodsPrice;
        item.pubGoodsPriceList[0].amount = this.$math.multiply(item.goodsNum, item.goodsPrice);
      } else if (item.erpAccFlag === 5) {
        // item.amountNum = item.goodsNum * (item.convertibleIntegral);
        item.amountNum = this.$math.multiply(item.goodsNum, item.convertibleIntegral);
      }
      this.updateCar(item);
      this.$emit('getDiscount');
    },
    getDiscount() {
      const isAtrice = false;
      const selCar = [];
      this.carList.forEach((item) => {
        selCar.push(...item.list);
      });
      for (const item of selCar) {
        for (const data of item.activityVoList) {
          if (data.activityStrategy === 20) {
            const goodsList = [];
            data.activityGoodsList.forEach((res) => {
              selCar.map((code) => {
                if (code.erpGoodsId === res.erpGoodsId) {
                  goodsList.push(code);
                }
              });
            });
            // 商品折扣
          }
          if (isAtrice) break;
        }
        if (isAtrice) break;
      }
      this.$emit('getDiscount', selCar);
    },
    getValues(item) {
      if (item.goodsNum > item.stqty) {
        item.goodsNum = item.stqty;
        return;
      }
      if (item.goodsNum === 0) {
        item.goodsNum = 0;
        return;
      }
      this.goodsNumAmount(item);
    },
    getCartToActivity() {
      this.$emit('getCartToActivity');
    },
    updateCar: _throttle(function (item) {
      delete item.createTime;
      let storageId = null;
      const { goodsNum, memberId, id, activityId, asId } = item;
      const pitchOn = item.isSelet ? 1 : 2;
      if (item.erpAccFlag === 5) {
        storageId = 691;
      }
      this.$http
        .post('/pcGoods/updateMemberCart', {
          goodsNum,
          memberId,
          id,
          activityId,
          asId,
          pitchOn,
          storageId,
        })
        .then(() => {
          this.getCartToActivity();
        });
    }, 500),
  },
};
</script>

<style scoped lang="less">
.car-main-list-title {
  height: 2.79 * 14px;
  font-size: 14px;
  p {
    border-bottom: 1px dashed #e6e6e6;
    margin-left: 1.5 * 14px;
    height: 100%;
    padding-left: 1.43 * 14px;
  }
  img {
    width: 2.71 * 14px;
    height: 1.71 * 14px;
    margin-right: 0.5 * 14px;
  }
}
.car-list-left {
  width: 60%;
  color: #333333;
  padding: 1rem 1.43 * 14px;
  box-sizing: border-box;
  .giftIcon {
    height: 86px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 20px;
    p {
      width: 38px;
      height: 20px;
      color: #fefefe;
      background: #ffa200;
      text-align: center;
      border-radius: 2px;
    }
  }
  .shixiao {
    width: 2.29 * 14px;
    height: 1.29 * 14px;
    background: #dadada;
    color: #666666;
    font-size: 14px;
    border-radius: 0.29 * 14px;
    margin-right: 1.43 * 14px;
    margin-top: 2.21 * 14px;
    z-index: 10;
  }
  .car-left-icon {
    width: 1 * 14px;
    height: 1 * 14px;
    margin-right: 2 * 14px;
    margin-top: 1 * 14px;
  }
  .car-left-goods {
    width: 5.71 * 14px;
    height: 5.71 * 14px;
    border: 1px solid #e6e6e6;
    margin-right: 1.5 * 14px;
  }
  .car-left-tong {
    margin-right: 1.5 * 14px;
    width: 21 * 14px;
    span {
      margin-bottom: 0.71 * 14px;
      width: 100%;
    }
  }
  .car-left-gui {
    width: 210px;
    span {
      margin-bottom: 0.71 * 14px;
      width: 100%;
    }
  }
}
.car-list-right {
  width: 40%;
  font-size: 14px;
  padding: 1rem 0 * 14px;
  box-sizing: border-box;
  .list-right-one {
    width: 160px;
    text-align: center;
    position: relative;
    /deep/ .select-style {
      width: 60px;
      border: 1px solid #e1251b !important;
      color: #e1251b !important;
      padding: 1px 5px;
      i {
        color: #e1251b !important;
      }
      .el-select-dropdown {
        border: 1px solid #e1251b !important;
        top: 14px !important;
        left: -1px !important;
        border-radius: 0px !important;
        .popper__arrow {
          display: none;
        }
        &::after {
          content: "";
          width: 110px;
          border-bottom: 1px solid #fff !important;
          display: inline-block;
          position: absolute;
          left: 0;
          top: -1px;
        }
      }
    }
    /deep/ .el-input__inner {
      &::placeholder {
        color: #e1251b !important;
      }

      &::-webkit-input-placeholder {
        /* WebKit browsers 适配谷歌 */
        color: #e1251b !important;
      }

      &:-moz-placeholder {
        /* Mozilla Firefox 4 to 18 适配火狐 */
        color: #e1251b !important;
      }

      &::-moz-placeholder {
        /* Mozilla Firefox 19+ 适配火狐 */
        color: #e1251b !important;
      }

      &:-ms-input-placeholder {
        /* Internet Explorer 10+  适配ie*/
        color: #e1251b !important;
      }
    }
    .list-right-cuxiao {
      width: 3.57 * 14px;
      height: 1.43 * 14px;
      border: 1px solid #f9948f;
      color: #e1251b;
      margin-top: 1.14 * 14px;
      z-index: 16;
      background: #fff;
      .cuxiao-jt {
        width: 0.43 * 14px;
        height: 0.36 * 14px;
        margin-left: 0.3 * 14px;
      }
    }
    .bt-hidden {
      border: 1px solid #e1251b;
      border-bottom: none;
    }
    .cx-main {
      border: 1px solid #e1251b;
      position: absolute;
      left: 5.2 * 14px;
      top: 4 * 14px;
      padding: 0.93rem 0.79 * 14px;
      padding-top: 0.6 * 14px;
      width: 18.14 * 14px;
      box-sizing: border-box;
      background: #fff;
      z-index: 25;
      .cx-list {
        margin-bottom: 1.07 * 14px;
        img:first-of-type {
          width: 0.71 * 14px;
          height: 0.71 * 14px;
          margin-right: 0.93 * 14px;
        }
        img:nth-of-type(2) {
          width: 2.79 * 14px;
          height: 2.79 * 14px;
          border: 1px solid #e6e6e6;
          margin-right: 0.64 * 14px;
        }
        .cx-right {
          width: 66%;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          p {
            text-align: left;
          }
          .cx-price {
            color: #e1251b;
          }
        }
        .cx-name {
          width: 100%;
        }
      }
      .cx-btn {
        button {
          width: 3.14 * 14px;
          height: 1.71 * 14px;
          text-align: center;
          line-height: 1.71 * 14px;
          color: #fff;
          border: 1px solid #e1251b;
          background: #e1251b;
          border-radius: 0.29 * 14px;
        }
        .cancel {
          background: #fff;
          border: 1px solid #e6e6e6;
          margin-left: 1.13 * 14px;
          color: #666666;
        }
      }
    }
    .hg-list {
      width: 90%;
      margin-top: 1.5 * 14px;
      border: 1px solid #e1251b;
      color: #e1251b;
      font-size:  14px;
      height: 1.43 * 14px;
      padding: 0 0.6 * 14px;
      box-sizing: border-box;
      p {
        line-height: 1.43 * 14px;
        width: 97%;
      }
      img {
        width: 0.43 * 14px;
        height: 0.36 * 14px;
      }
    }
  }
  .list-right-two {
    width: 8.58 * 14px;
    text-align: center;
    font-size: 14px;
    .list-right-two-p {
      margin-top: 0.2 * 14px;
      span {
        color: #e1251b;
      }
    }
  }
  .list-right-three {
    width: 8.58 * 14px;
    text-align: center;
  }
  .list-right-four {
    width: 7.58 * 14px;
    text-align: center;
    padding-top: 1 * 14px;
    box-sizing: border-box;
    z-index: 20;
  }
}
.centerBox {
  padding: 5px 0 10px;
  .image-box {
    position: relative;
    width: 38px;
    height: 100%;
    margin-right: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #ffa200;
    img {
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-40%);
    }
  }
}

.quehuo {
  position: absolute;
  left: 72%;
  top: 34px;
  width: 120px;
}
.quehuo1 {
  // font-size: 18px !important;
  color: #e1251b;
  font-weight: 900;
}
.car-main-list-box {
  padding: 5px 0;
  border: 1px solid #e6e6e6;
}
.car-main-list-title {
  p {
    border-bottom: 1px dashed #e6e6e6;
    margin-left: 1.5 * 14px;
    height: 100%;
    padding-left: 1.43 * 14px;
  }
  img {
    width: 2.71 * 14px;
    height: 1.71 * 14px;
    margin-right: 0.5 * 14px;
  }
}
.falseList {
  border: 2px solid #e1251b;
}
.car-main-list {
  // margin-bottom: 1.36 * 14px;
  position: relative;
  // 商品折扣活动显示
  .discount-wrap {
    padding: 12px 0 0 60px;
    font-size: 14px;
    .discount {
      display: inline-block;
      span {
        &:first-child {
          display: inline-block;
          // width: 60px;
          height: 16px;
          border: 1px solid #e0281c;
          color: #e0281c;
          margin: 0 10px;
          line-height: 16px;
          padding: 0 3px;
        }
        &:last-child {
          font-weight: 700;
        }
      }
    }
  }
  // &:first-of-type {
  //   border-top: none;
  // }
  .cover {
    position: absolute;
    width: 100%;
    height: 100%;
    background: #f0f0f0;
    z-index: 20;
    opacity: 0.6;
  }
  // &:first-of-type {
  //   border-top: none;
  // }

  .car-list-left {
    width: 60%;
    color: #333333;
    padding: 1rem 1.43 * 14px;
    box-sizing: border-box;
    .giftIcon {
      height: 86px;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0 20px;
      p {
        width: 38px;
        height: 20px;
        color: #fefefe;
        background: #ffa200;
        text-align: center;
        border-radius: 2px;
      }
    }
    .shixiao {
      width: 2.29 * 14px;
      height: 1.29 * 14px;
      background: #dadada;
      color: #666666;
      font-size: 14px;
      border-radius: 0.29 * 14px;
      margin-right: 1.43 * 14px;
      margin-top: 2.21 * 14px;
      z-index: 10;
    }
    .car-left-icon {
      width: 1 * 14px;
      height: 1 * 14px;
      margin-right: 2 * 14px;
      margin-top: 1 * 14px;
    }
    .car-left-goods {
      width: 5.71 * 14px;
      height: 5.71 * 14px;
      border: 1px solid #e6e6e6;
      margin-right: 1.5 * 14px;
    }
    .car-left-tong {
      margin-right: 1.5 * 14px;
      width: 21 * 14px;
      span {
        margin-bottom: 0.71 * 14px;
        width: 100%;
      }
    }
    .car-left-gui {
      width: 210px;
      span {
        margin-bottom: 0.71 * 14px;
        width: 100%;
      }
    }
  }
  .car-list-right {
    width: 40%;
    font-size: 14px;
    padding: 1rem 0 * 14px;
    box-sizing: border-box;
    height: 82px;
    .list-right-one {
      width: 160px;
      text-align: center;
      position: relative;
      display: flex;
      justify-content: end;
      .select-style {
        width: 112px;
        border: 1px solid #e1251b !important;
        color: #e1251b !important;
        // text-align: center;
        padding: 0 5px;
        margin: 8px auto;
        box-sizing: border-box;
        text-align: left;
        position: relative;
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
          width: 250px;
          box-shadow: none;
          border-radius: 0;
          left: -1px;
          top: 14px;
          border: 1px solid #e1251b;
          color: #6a6a6a;
              z-index: 9;
          .one_hidden {
            width: 100%;
            line-height: 30px;
            padding: 0 5px 0 10px;
            box-sizing: border-box;
            display: flex;
            align-items: center;
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
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
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
            width: 110px;
            border-top: 1px solid #fff;
            position: absolute;
            left: 0;
            top: -2px;
            z-index: 99;
          }
        }
      }
      /deep/ .el-input__inner {
        &::placeholder {
          color: #e1251b !important;
        }

        &::-webkit-input-placeholder {
          /* WebKit browsers 适配谷歌 */
          color: #e1251b !important;
        }

        &:-moz-placeholder {
          /* Mozilla Firefox 4 to 18 适配火狐 */
          color: #e1251b !important;
        }

        &::-moz-placeholder {
          /* Mozilla Firefox 19+ 适配火狐 */
          color: #e1251b !important;
        }

        &:-ms-input-placeholder {
          /* Internet Explorer 10+  适配ie*/
          color: #e1251b !important;
        }
      }
      .list-right-cuxiao {
        width: 3.57 * 14px;
        height: 1.43 * 14px;
        border: 1px solid #f9948f;
        color: #e1251b;
        margin-top: 1.14 * 14px;
        z-index: 16;
        background: #fff;
        .cuxiao-jt {
          width: 0.43 * 14px;
          height: 0.36 * 14px;
          margin-left: 0.3 * 14px;
        }
      }
      .bt-hidden {
        border: 1px solid #e1251b;
        border-bottom: none;
      }
      .cx-main {
        border: 1px solid #e1251b;
        position: absolute;
        left: 5.2 * 14px;
        top: 4 * 14px;
        padding: 0.93rem 0.79 * 14px;
        padding-top: 0.6 * 14px;
        width: 18.14 * 14px;
        box-sizing: border-box;
        background: #fff;
        z-index: 25;
        .cx-list {
          margin-bottom: 1.07 * 14px;
          img:first-of-type {
            width: 0.71 * 14px;
            height: 0.71 * 14px;
            margin-right: 0.93 * 14px;
          }
          img:nth-of-type(2) {
            width: 2.79 * 14px;
            height: 2.79 * 14px;
            border: 1px solid #e6e6e6;
            margin-right: 0.64 * 14px;
          }
          .cx-right {
            width: 66%;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            p {
              text-align: left;
            }
            .cx-price {
              color: #e1251b;
            }
          }
          .cx-name {
            width: 100%;
          }
        }
        .cx-btn {
          button {
            width: 3.14 * 14px;
            height: 1.71 * 14px;
            text-align: center;
            line-height: 1.71 * 14px;
            color: #fff;
            border: 1px solid #e1251b;
            background: #e1251b;
            border-radius: 0.29 * 14px;
          }
          .cancel {
            background: #fff;
            border: 1px solid #e6e6e6;
            margin-left: 1.13 * 14px;
            color: #666666;
          }
        }
      }
      .hg-list {
        width: 90%;
        margin-top: 1.5 * 14px;
        border: 1px solid #e1251b;
        color: #e1251b;
        font-size: 14px;
        height: 1.43 * 14px;
        padding: 0 0.6 * 14px;
        box-sizing: border-box;
        p {
          line-height: 1.43 * 14px;
          width: 97%;
        }
        img {
          width: 0.43 * 14px;
          height: 0.36 * 14px;
        }
      }
    }
    .list-right-two {
      width: 8.58 * 14px;
      text-align: center;
      font-size: 14px;
      .list-right-two-p {
        margin-top: 0.2 * 14px;
        span {
          color: #e1251b;
        }
      }
    }
    .list-right-three {
      width: 8.58 * 14px;
      text-align: center;
      .integral {
        display: flex;
        justify-content: center;
        align-items: center;
      }
      img {
        width: 25px;
        margin-right: 10px;
      }
    }
    .list-right-four {
      width: 7.58 * 14px;
      text-align: center;
      // padding-top: 1 * 14px;
      box-sizing: border-box;
      z-index: 20;
    }
  }
}
.activityContent {
  height: 100%;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  overflow: hidden;
  -webkit-box-orient: vertical;
  white-space: normal;
  text-overflow: ellipsis;
}
.fullGift {
  display: flex;
  width: 300px;
  position: absolute;
  right: 100px;
  justify-content: center;
  flex-direction: column;
  text-align: center;
}
.select {
  color: #e1251b;
  margin-left: 50px;
  cursor: pointer;
  position: absolute;
  right: 20px;
}
.goodsGiftImage {
  position: relative;
  margin-right: 20px;
  .giftMask {
    background: rgba(0, 0, 0, 0.8);
  }
  img {
    margin-right: 0 !important;
  }
  .quehuoImage,
  .giftMask {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    height: 100%;
  }
  .quehuoImage {
    width: 68px;
    height: 52px;
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
  font-size:14px !important;
}
.centerBox {
    display: flex;
    display: -webkit-flex;
    align-items: center;
}
p {
  margin: 0;
}
.cursor {
  cursor: pointer;
}
</style>
