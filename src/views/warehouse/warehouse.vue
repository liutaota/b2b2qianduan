<template>
  <div id="table_wrap" ref="full_el">
    <div class="top">
      <div class="left-title title-color">待拦截订单</div>
      <div class="main">
        <div class="main-left">
          <div class="left-top-info title-color flexBox title-border">
            <div class="xuhao flexBox">序号</div>
            <div class="erpOrder flexBox">ERP订单号</div>
            <div class="BOrder flexBox">B2B订单号</div>
            <div class="orderTime flexBox">下单时间</div>
          </div>
          <div class="ul-hidden">
            <ul ref="intercept">
              <li
                v-for="(item, index) in interceptOrder"
                :key="index"
                class="flexBox left-top-info"
              >
                <div class="xuhao">{{ item.index }}</div>
                <div class="erpOrder">{{ item.erpOrderId }}</div>
                <div class="BOrder">{{ item.orderNo }}</div>
                <div class="orderTime">{{ item.createTime }}</div>
              </li>
            </ul>
          </div>
        </div>
        <div class="main-right">
          <div class="right-top-title title-color flexBox">今日数据</div>
          <div class="order-tab j_a_box">
            <div class="order-amount">
              <div class="title-color">总单量</div>
              <div>{{ salesVolume.countall || 0 }}</div>
            </div>
            <div class="order-amount">
              <div class="title-color">B2B单量</div>
              <div>{{ salesVolume.countb2b || 0 }}</div>
            </div>
            <div class="order-amount">
              <div class="title-color">京东单量</div>
              <!-- <div>{{ salesVolume.countjd || 0 }}</div> -->
              <div><button>播放</button></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="middle flexbox">
      <div class="left-title title-color">采购到货上架</div>
      <div class="goods-box">
        <div class="goods-flex j_b_box goods-title title-color">
          <div class="goodsid">ID</div>
          <div class="goodsname">品名</div>
          <div class="factoryname">厂家</div>
          <div class="goodsnum">数量</div>
          <div class="goodstype">规格</div>
          <div class="supplier">供应商</div>
          <div class="arrival">到货时间</div>
          <!-- <div class="upper">剩余上架时间</div>
          <div class="complete">24小时完成率</div> -->
        </div>
        <div class="ul-hidden">
          <ul ref="goodsOff">
            <li
              v-for="(item, index) in goodsOff"
              :key="index"
              class="goods-flex flexbox goods"
            >
              <div class="goodsid">
                <p class="one-hidden">{{ item.goodsid }}</p>
              </div>
              <div class="goodsname">
                <p class="one-hidden">{{ item.goodsname }}</p>
              </div>
              <div class="factoryname">
                <p class="one-hidden">{{ item.factoryname }}</p>
              </div>
              <div class="goodsnum">
                <p class="one-hidden">{{ item.goodsqty }}</p>
              </div>
              <div class="goodstype">
                <p class="one-hidden">{{ item.goodstype }}</p>
              </div>
              <div class="supplier">
                <p class="one-hidden">{{ item.factoryname }}</p>
              </div>
              <div class="arrival">
                <p class="one-hidden">{{ item.recredate }}</p>
              </div>
              <!-- <div class="upper"><p class="one-hidden">2</p></div>
              <div class="complete"><p class="one-hidden">95%</p></div> -->
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="footer flexbox">
      <div class="left-title title-color">赠品到货上架</div>
      <div class="goods-box">
        <div class="goods-flex j_b_box title-color goods-title">
          <div class="goodsid">ID</div>
          <div class="goodsname">品名</div>
          <div class="factoryname">厂家</div>
          <div class="goodsnum">数量</div>
          <div class="goodstype">规格</div>
          <div class="supplier">供应商</div>
          <div class="arrival">到货时间</div>
          <!-- <div class="upper">剩余上架时间</div>
          <div class="complete">24小时完成率</div> -->
        </div>
        <div class="ul-hidden">
          <ul ref="gift">
            <li
              v-for="(item, index) in giftList"
              :key="index"
              class="goods-flex flexbox goods"
            >
              <div class="goodsid">
                <p class="one-hidden">{{ item.goodsid }}</p>
              </div>
              <div class="goodsname">
                <p class="one-hidden">{{ item.goodsname }}</p>
              </div>
              <div class="factoryname">
                <p class="one-hidden">{{ item.factoryname }}</p>
              </div>
              <div class="goodsnum">
                <p class="one-hidden">{{ item.goodsqty }}</p>
              </div>
              <div class="goodstype">
                <p class="one-hidden">{{ item.goodstype }}</p>
              </div>
              <div class="supplier">
                <p class="one-hidden">{{ item.factoryname }}</p>
              </div>
              <div class="arrival">
                <p class="one-hidden">{{ item.recredate }}</p>
              </div>
              <!-- <div class="upper"><p class="one-hidden">2</p></div>
              <div class="complete"><p class="one-hidden">95%</p></div> -->
            </li>
          </ul>
        </div>
      </div>
    </div>
    <audio
      id="audio"
      ref="myaudio"
      :src="music"
      controls
      autoplay="autoplay"
      hidden="true"
    />
    <full-screen ref="fullBtn" :is-show="isShow" :element="screenEl" @change="fullChangeFun" />
  </div>
</template>

<script>
import FullScreen from './FullScreen';
import $http from 'axios';
export default {
  components: { FullScreen },
  data() {
    return {
      tableData: [],
      queryForm: {
        size: 50,
        current: 1,
      },
      goodsQueryForm: {
        size: 50,
        current: 1,
      },
      salesSlip: 0, // 看板当天销售单
      salesVolume: [], // 看板当天销售订单量
      B2BOrderNum: 0, // 单日B2B订单量
      goodsOff: [], // 采购入库未上架
      giftListTime: null, // 定时请求数据
      interceptQueryForm: {
        size: 50,
        current: 1,
      },
      interceptOrder: [], // 当天待拦截订单
      isinterceptOff: false,
      interceptTime: null, // 定时器控制
      interceptTimes: null,
      interceptLen: 0,
      interceptNum: 0,
      goodsTime: null,
      isGoodsOff: true, // 控制商品请求
      goodsOffLen: 0, // 商品数量
      giftList: [], // 看板赠品
      goodsNum: 0, // 商品移动
      giftQueryForm: {
        size: 50,
        current: 1,
      },
      isGiftOff: true, // 控制赠品请求
      giftLen: 0, // 赠品数量
      giftNum: 0,
      giftTime: null,
      music: '',
      audioNum: 0,
      audioPlay: null,
      audioTimer: null,
      goodsOffTime: null,
      element: null,
      isShow: false,
      body: null,
      screenShow: false,
      goodsLoad: false,
      giftLoad: false,
      interceptLoad: false,
      isLocation: false,
    };
  },
  watch: {
    screenShow(val) {
      this.$emit('change', val);
    },
    goodsOffLen(val) {
      if (val <= 40 && this.isGoodsOff) {
        this.goodsQueryForm.current += 1;
        this.getTVGoodsOff();
      }
    },
    giftLen(val) {
      if (val <= 40 && this.isGiftOff) {
        this.interceptQueryForm.current += 1;
        this.getTVGiftGoodsOff();
      }
    },
    interceptLen(val) {
      if (val <= 40 && this.isinterceptOff) {
        this.goodsQueryForm.current += 1;
        this.getInterceptOrderList();
      }
    },
    interceptOrder: {
      handler(val) {
        // clearInterval(this.interceptTimes);
        if (val.length < 6) {
          clearInterval(this.interceptTimes);
          this.interceptTimes = setInterval(() => {
            this.interceptQueryForm = {
              size: 50,
              current: 1,
            };
            $http.get('https://b2b-api.gdztyy.com/api/pcMember/getAdminOrderInfoInterceptList', { ...this.interceptQueryForm, interceptStatus: 'TO_INTERCEPT' })
              .then((res) => {
                // 停止动画
                clearInterval(this.interceptTime);
                this.interceptOrder = [];
                res.records.forEach((item, index) => {
                  item.index = (this.interceptQueryForm.current) * this.interceptQueryForm.size + index + 1;
                });
                // 判断获取的数据是否小于4条，
                if (res.total < 6) {
                  this.interceptOrder = res.records;
                  if (!this.audioPlay) {
                    this.plays();
                  }
                  return;
                }
                if (res.total === 0) {
                  this.audioPlay.pause();
                  return;
                }
                // 数据大于4条开始动画滚屏
                this.interceptOrder.push(...res.records);
                this.isinterceptOff = true;
                if (!this.audioPlay) {
                  this.plays();
                }
                this.startMove(
                  {
                    time: 'interceptTime',
                    ref: 'intercept',
                    list: 'interceptOrder',
                    len: 'interceptLen',
                    num: 'interceptNum',
                    isHandle: 'isinterceptOff',
                    width: 30
                  },
                  80
                );
              }).catch(() => {
                // 停止定时请求
                clearInterval(this.interceptTimes);
                this.locationReload();
              });
          }, 10000);
        } else {
          // 停止定时请求
          clearInterval(this.interceptTimes);
        }
      },
      deep: true,
    },
    // 监听赠品数据
    giftList: {
      handler(val) {
        // 判断赠品数据是否小于10条数据
        if (val.length < 7) {
          this.isGiftOff = false;
          // 定时发送请求
          clearInterval(this.giftListTime);
          this.giftListTime = setInterval(() => {
            this.giftQueryForm = {
              size: 50,
              current: 1,
            };
            $http.get('https://b2b-api.gdztyy.com/api/pcMember/getTVGiftGoodsOff', this.giftQueryForm)
              .then((res) => {
                // 停止动画
                clearInterval(this.giftTime);
                this.giftList = [];
                res.records.forEach((item, index) => {
                  item.index = (this.giftQueryForm.current) * this.giftQueryForm.size + index + 1;
                });
                // 判断获取的数据是否小于10条，
                if (res.total < 9) {
                  this.giftList = res.records;
                  return;
                }
                if (res.total === 0) return;
                this.giftList.push(...res.records);
                this.isGiftOff = true;
                // 数据大于10条开始动画滚屏
                this.startMove(
                  {
                    time: 'giftTime',
                    ref: 'gift',
                    list: 'giftList',
                    len: 'giftLen',
                    num: 'giftNum',
                    isHandle: 'isGiftOff',
                    width: 50
                  },
                  60
                );
              }).catch(() => {
                clearInterval(this.giftListTime);
                this.locationReload();
              });
          }, 10000);
        } else {
          // 停止定时请求
          clearInterval(this.giftListTime);
          // this.getTVGiftGoodsOff();
        }
      },
      deep: true
    },
    goodsOff: {
      handler(val) {
        if (val.length < 7) {
          this.isGoodsOff = false;
          clearInterval(this.goodsOffTime);
          this.goodsOffTime = setInterval(() => {
            this.goodsQueryForm = {
              size: 50,
              current: 1,
            };
            $http.get('https://b2b-api.gdztyy.com/api/pcMember/getTVGoodsOff', this.goodsQueryForm)
              .then((res) => {
                clearInterval(this.goodsTime);
                this.goodsOff = [];
                res.records.forEach((item, index) => {
                  item.index = (this.goodsQueryForm.current) * this.goodsQueryForm.size + index + 1;
                });
                if (res.total < 9) {
                  this.goodsOff = res.records;
                  return;
                }
                if (res.total === 0) return;
                // 数据大于10条开始动画滚屏
                this.goodsOff.push(...res.records);
                this.isGoodsOff = true;
                this.startMove(
                  {
                    time: 'goodsTime',
                    ref: 'goodsOff',
                    list: 'goodsOff',
                    len: 'goodsOffLen',
                    num: 'goodsNum',
                    isHandle: 'isGoodsOff',
                    width: 50
                  },
                  60
                );
              }).catch(() => {
                // 停止定时请求
                this.locationReload();
                clearInterval(this.goodsOffTime);
              });
          }, 10000);
        } else {
          // 停止定时请求
          clearInterval(this.goodsOffTime);
          // this.getTVGoodsOff();
        }
      },
      deep: true
    }
  },
  created() {
    // const search = window.location.search.substring(1).split('&')[0];
    // if (!(/(code=123456)$/i.test(search))) {
    //   window.location = window.location.origin + '/login';
    // }
    this.body = document.body;
    this.getOrderNum();
    this.getTVGoodsOff();
    this.getTVGiftGoodsOff();
    setInterval(() => {
      this.getOrderNum();
    }, 60000);
    setInterval(() => {
      this.locationReload();
    }, 3600 * 1000 * 4);
  },
  mounted() {
    this.getInterceptOrderList();
    this.element = this.$refs.full_el;
    window.addEventListener('resize', this.controlFun);
    this.fullScreen();
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.controlFun);
    clearInterval(this.interceptTime);
    clearInterval(this.giftTime);
    clearInterval(this.goodsTime);
    clearInterval(this.giftListTime);
    clearInterval(this.interceptTimes);
    clearInterval(this.goodsOffTime);
    this.audioPlay.pause();
  },
  methods: {
    controlFun() {
      if (document.body.scrollHeight === window.screen.height && document.body.scrollWidth === window.screen.width) {
        this.screenShow = true;
      } else {
        this.screenShow = false;
      }
    },
    fullScreen() {
      this.element.classList.add('container_full_element');
      const rfs = this.body.requestFullScreen || this.body.webkitRequestFullScreen || this.body.mozRequestFullScreen || this.body.msRequestFullScreen;
      let wscript;
      if (typeof rfs !== 'undefined' && rfs) {
        rfs.call(this.body);
        return;
      }
      if (typeof window.ActiveXObject !== 'undefined') {
        wscript = new ActiveXObject('WScript.Shell');
        if (wscript) {
          wscript.SendKeys('{F11}');
        }
      }
    },
    fullScreenOut() {
      this.element.classList.remove('container_full_element');
      const exitMethod = document.exitFullscreen || // W3C
          document.mozCancelFullScreen || // FireFox
          document.webkitExitFullscreen || // Chrome等
          document.webkitExitFullscreen; // IE11
      if (exitMethod) {
        exitMethod.call(document);
      } else if (typeof window.ActiveXObject !== 'undefined') { // for Internet Explorer
        const wscript = new ActiveXObject('WScript.Shell');
        if (wscript !== null) {
          wscript.SendKeys('{F11}');
        }
      }
    },
    fullChangeFun(val) {
      // 切换全屏调用的方法
    },
    plays() {
      if (this.audioPlay != null) {
        this.audioPlay.pause();
        this.audioPlay = null;
      }
      if (this.interceptOrder.length < 1) {
        this.audioNum = 0;
        return;
      }
      this.audioPlay = new Audio();
      this.audioPlay.src = 'http://tsn.baidu.com/text2audio?tex=您有待拦截的订单:' + this.interceptOrder[this.audioNum].orderNo + '&cuid=baike&lan=ZH&ctp=1&pdt=301&vol=9&spd=4&rate=32&per=0';
      this.audioPlay.play();
      this.audioPlay.onended = () => {
        this.audioNum++;
        if (this.audioNum >= this.interceptOrder.length) {
          this.audioNum = 0;
        }
        if (this.interceptOrder.length < 1) {
          this.audioPlay.pause();
          return;
        }
        this.audioPlay.src = 'http://tsn.baidu.com/text2audio?tex=您有待拦截的订单:' + this.interceptOrder[this.audioNum].orderNo + '&cuid=baike&lan=ZH&ctp=1&pdt=301&vol=9&spd=4&rate=32&per=0';
        this.audioPlay.load();
        this.audioPlay.play();
      };
      // audio.onended = () => {

      //   // 播放完毕，重新循环播放
      //   audio.load();
      // };
      // this.audioAutoPlay();
    },
    // audioAutoPlay() {
    //   const audio = document.getElementById('audio');
    //   audio.play();
    //   document.removeEventListener('touchstart', this.audioAutoPlay);
    // },
    // 当天待拦截订单
    getInterceptOrderList() {
      this.isinterceptOff = false;
      $http.get('https://b2b-api.gdztyy.com/api/pcMember/getAdminOrderInfoInterceptList', { ...this.interceptQueryForm, interceptStatus: 'TO_INTERCEPT' })
        .then((res) => {
          this.interceptLoad = true;
          // this.play();
          // this.interceptOrder = res.records;
          if (res.pages <= this.interceptQueryForm.current) {
            this.interceptQueryForm = {
              size: 50,
              current: 1,
            };
          }

          // console.log(res);
          // this.interceptOrder = res.records;
          if (res.pages <= this.interceptQueryForm.current) {
            this.interceptQueryForm = {
              size: 50,
              current: 1,
            };
          }
          res.records.forEach((item, index) => {
            item.index = (this.interceptQueryForm.current) * this.interceptQueryForm.size + index + 1;
          });
          this.interceptOrder.push(...res.records);
          this.isinterceptOff = true;
          if (res.total > 0) {
            if (!this.audioPlay) {
              this.plays();
            }
          }
          if (res.total < 6) return;
          this.startMove(
            {
              time: 'interceptTime',
              ref: 'intercept',
              list: 'interceptOrder',
              len: 'interceptLen',
              num: 'interceptNum',
              isHandle: 'isinterceptOff',
              width: 30
            },
            80
          );
        }).catch(() => {
          clearInterval(this.interceptTime);
          this.locationReload();
        });
    },
    // 看板赠品
    getTVGiftGoodsOff() {
      this.isGiftOff = false;
      $http.get('https://b2b-api.gdztyy.com/api/pcMember/getTVGiftGoodsOff', this.giftQueryForm)
        .then((res) => {
          this.giftLoad = true;
          if (res.pages <= this.giftQueryForm.current) {
            this.giftQueryForm = {
              size: 50,
              current: 0,
            };
          }
          // res.records.forEach((item, index) => {
          //   item.index = (this.giftQueryForm.current) * this.giftQueryForm.size + index + 1;
          // });
          this.giftList.push(...res.records);
          this.isGiftOff = true;
          if (res.records.length < 7) return;
          this.startMove(
            {
              time: 'giftTime',
              ref: 'gift',
              list: 'giftList',
              len: 'giftLen',
              num: 'giftNum',
              isHandle: 'isGiftOff',
              width: 50
            },
            55
          );
          return;
        }).catch(() => {
          clearInterval(this.giftTime);
          this.locationReload();
        });
    },
    locationReload() {
      if (this.isLocation) return;
      this.isLocation = true;
      setTimeout(() => {
        window.location.reload(true);
      }, 5000);
    },
    getTVGoodsOff() {
      this.isGoodsOff = false;
      // 采购入库未上架
      $http.get('https://b2b-api.gdztyy.com/api/pcMember/getTVGoodsOff', this.goodsQueryForm)
        .then((res) => {
          this.goodsLoad = true;
          if (res.pages <= this.goodsQueryForm.current) {
            this.goodsQueryForm = {
              size: 50,
              current: 0,
            };
          }
          // res.records.forEach((item, index) => {
          //   item.index = (this.goodsQueryForm.current) * this.goodsQueryForm.size + index + 1;
          // });
          this.goodsOff.push(...res.records);
          // this.goodsOff.forEach(data => {
          //   console.log(data.goodsid);
          // })
          this.isGoodsOff = true;
          if (res.records.length < 7) return;
          this.startMove(
            {
              time: 'goodsTime',
              ref: 'goodsOff',
              list: 'goodsOff',
              len: 'goodsOffLen',
              num: 'goodsNum',
              isHandle: 'isGoodsOff',
              width: 50
            },
            60
          );
          return;
        }).catch(() => {
          this.locationReload();
          clearInterval(this.goodsTime);
        });
    },
    getOrderNum() {
      // 看板当天销售订单量
      $http.get('https://b2b-api.gdztyy.com/api/pcMember/getTVToDaySalesTotal').then((res) => {
        this.salesVolume = res;
        return;
      }).catch(() => {
        this.locationReload();
      });
    },
    // 动画
    startMove({ time, ref, list, len, num, isHandle, width }, date) {
      const ul = this.$refs[ref];
      if (ul) {
        clearInterval(this[time]);
        this[time] = setInterval(() => {
          this[num]--;
          if (this[num] <= -100) {
            this[num] += width;
            this[list].shift();
          }
          ul.style.top = this[num] + 'px';
          this[len] = this[list].length;
          if (this[list].length > 40) {
            this[isHandle] = false;
          } else {
            this[isHandle] = true;
          }
        }, date);
      }
    },
  },
};
</script>
<style scoped lang="less">
@import "~@/assets/css/global.css";
@color: #e44848;
@title: #039bed;
@border: 3px solid @title;
@left: border-left;
@top: border-top;
@right: border-right;
@bottom: border-bottom;
ul,
li,
p {
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: 12px;
}
.border-title {
  border: 3px solid @title;
}
#table_wrap {
  width: 100vw;
  height: 100vh;
  box-sizing: border-box;
  border: 5px solid #7e7d7d;
  overflow: hidden;
  color: @color;
  background: #000;
  .title-color {
    color: @title;
    font-weight: bold;
    font-size: 18px;
  }
  /* flex布局 */

  .top {
    display: flex;
    height: 24%;
    .left-title {
      width: 4%;
      border: @border;
      @{left}: none;
      @{top}: none;
      writing-mode: vertical-rl; //垂直方向，从右向左
      display: flex;
      justify-content: space-around;
      align-items: center;
      letter-spacing: 10px;
      font-weight: 600;
      font-size: 20px;
    }
    .main {
      display: flex;
      width: 96%;
      & > div {
        width: 50%;
      }
      .main-left {
        .left-top-info {
          text-align: center;
          & > div {
            height: 30px;
            line-height: 30px;
          }
        }
        .title-border {
          border: @border;
          @{left}: none;
          @{top}: none;
          height: 24%;
          & > div {
            border-right: @border;
            height: 100%;
            &:last-child {
              @{right}: none;
            }
          }
        }
        .xuhao {
          width: 10%;
        }
        .BOrder,
        .erpOrder {
          width: 35%;
        }
        .orderTime {
          width: 20%;
        }
      }
      .ul-hidden {
        width: 100%;
        height: 76%;
        overflow: hidden;
        position: relative;
        border: @border;
        @{left}: none;
        @{top}: none;
      }
      ul {
        width: 100%;
        height: 76%;
        box-sizing: border-box;
        color: @color;
        position: absolute;
        li {
          div {
            height: 30px;
            width: 100%;
          }
        }
      }
      .main-right {
        font-size: 24px;
        font-weight: bold;
        .right-top-title {
          height: 24%;
          line-height: 30px;
          border: @border;
          @{left}: none;
          @{top}: none;
          box-sizing: border-box;
        }
        .order-tab {
          height: calc(76%);
          .order-amount {
            flex: 1;
            height: 100%;
            div {
              height: 50%;
              display: flex;
              justify-content: center;
              align-items: center;
              border: @border;
              @{left}: none;
              @{top}: none;
              &:last-child {
                color: #fff;
              }
            }
          }
        }
      }
    }
  }
  .footer,
  .middle {
    width: 100%;
    height: 38%;
    .left-title {
      width: 4%;
      border: @border;
      @{left}: none;
      @{top}: none;
      writing-mode: vertical-rl; //垂直方向，从右向左
      display: flex;
      justify-content: space-around;
      align-items: center;
      letter-spacing: 10px;
      font-weight: 600;
      font-size: 20px;
    }
  }
  .goods-box {
    width: 96%;
    border: @border;
    @{left}: none;
    @{top}: none;
    position: relative;
    .goods-flex {
      border-bottom: @border;
      div {
        // width: 11.5%;
        flex: 4;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        border-right: @border;
        &:last-child {
          @{right}: none;
        }
      }
      .goodsid {
        flex: 1;
      }
      // .goodsname {
      //   widows: 3%;
      // }
      // .factoryname {
      //   width: 15%;
      // }
      .goodsnum{
        flex: 1;
      }
      .goodstype {
        flex: 2;
      }
      .arrival {
        flex: 1.3;
      }
    }
    .goods-title {
      height: 15%;
    }
    .ul-hidden {
      width: 100%;
      height: 85%;
      overflow: hidden;
      position: relative;
    }
    ul {
      position: absolute;
      width: 100%;
      p {
        width: 60%;
        text-align: center;
      }
      li {
        height: 25px;
      }

    }
    .goods {
      border: none;
      div {
        border:.3px solid @color;
      }
    }
  }
}
</style>
