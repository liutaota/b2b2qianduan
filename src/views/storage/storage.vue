<template>
  <div :id="isScreen?'fixed':''" class="table_wrap" @click="handle">
    <el-button v-if="!isScreen" type="primary" style="margin: 10px" @click="fullScreen">全屏显示</el-button>
    <table
      border="1"
      width="100%"
      cellpadding="20"
      align="center"
      cellspacing="0"
      style="height: 100vh"
    >
      <thead style="text-align: center">
        <th colspan="6">
          <h2>
            今&nbsp;&nbsp;&nbsp;日&nbsp;&nbsp;&nbsp;数&nbsp;&nbsp;&nbsp;据
          </h2>
        </th>
      </thead>
      <tr class="trTitle">
        <td>总单量</td>
        <td style="color: #fff; font-weight: 100">3,201</td>
        <td>B2B单量</td>
        <td style="color: #fff; font-weight: 100">{{ orderNum }}</td>
        <td>京东单量</td>
        <td style="color: #fff; font-weight: 100">1,201</td>
      </tr>
      <tr class="trTitle">
        <td colspan="4">待拦截(ERP单号、B2B单号、下单时间)</td>
        <td colspan="2">待上架货品ID</td>
      </tr>
      <tr>
        <td colspan="4" style="width: 70%">
          <ul ref="tabular_data" class="tabular_data">
            <li v-for="(item, i) in tableData" :key="i" ref="li" class="li">
              <div>{{ item.barcode }}</div>
              <div>{{ item.classname }}</div>
              <div>{{ item.classname1 }}</div>
            </li>
          </ul>
        </td>
        <td colspan="2" style="width: 30%">
          <ul class="tabular_data">
            <li style="color: #f7f360">
              <div>387166</div>
              <div>采购来货</div>
            </li>
            <li style="color: #f7f360">
              <div>387166</div>
              <div>采购来货</div>
            </li>
            <li style="color: #f7f360">
              <div>387166</div>
              <div>采购来货</div>
            </li>
            <li style="color: #f7f360">
              <div>387166</div>
              <div>采购来货</div>
            </li>
            <li style="color: #f7f360">
              <div>387166</div>
              <div>采购来货</div>
            </li>
            <li style="color: #f7f360">
              <div>387166</div>
              <div>采购来货</div>
            </li>
          </ul>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  name: 'StorageScreen',
  data() {
    return {
      tableData: [],
      queryForm: {
        size: 50,
        current: 1,
      },
      isScreen: false,
      orderNum: 0, // 今日b2b订单量
    };
  },
  mounted() {
    this.query();
    this.startMove();
    this.getB2BOrderNum();
    // 监听键盘按键事件
    this.$nextTick(function () {
      document.addEventListener('keyup', (e) => {
        // 此处填写你的业务逻辑即可
        if (e.keyCode === 27) {
          this.isScreen = false;
        }
      });
    });
  },
  methods: {
    query() {
      this.$http
        .get('order/getInterceptOrderList', { params: { ...this.queryForm }})
        .then((res) => {
          if (res.length === 0) {
            this.queryForm = {
              size: 50,
              current: 1,
            };
          }
          this.tableData.push(...res);
          return;
        });
    },
    getB2BOrderNum() {
      this.$http.get('order/getB2BOrderNum').then(res => {
        this.orderNum = res;
      });
      this.$http.get('order/getInterceptOrderList').then(res => {
        console.log(res);
      });
    },
    // 全屏显示
    fullScreen() {
      this.isScreen = true;
    },
    handle() {
      console.log(2323);
    },
    startMove() {
      let num = 0;
      const ul = this.$refs.tabular_data;
      setInterval(() => {
        num--;
        if (num <= -100) {
          num += 50;
          this.tableData.shift();
          const leng = this.tableData.length;
          if (leng < 50) {
            this.queryForm.current += 1;
            return;
          }
        }
        ul.style.top = num + 'px';
      }, 10);
    },
  },
};
</script>
<style scoped lang="less">
.table_wrap {
  width: 100%;
  height: calc(100vh - 90px);
  overflow: hidden;
}
#fixed {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
}
table {
  width: 100%;
  overflow: hidden;
  text-align: center;
  border-color: #02a6ff;
  background-color: #101010;
  color: #02a6ff;
  th {
    text-align: center;
    font-size: 30px;
    h2 {
      margin: 0;
      padding: 20px;
    }
  }
  .trTitle {
    height: 30px;
    font-size: 28px;
    font-weight: 500;
  }
  td {
    overflow: hidden;
    .tabular_data {
      width: 90%;
      height: 100%;
      list-style: none;
      position: relative;
      margin: 0 auto;
      .li {
        height: 50px;
        display: flex;
        justify-content: space-between;
        font-size: 24px;
        color: #f74647;
        line-height: 50px;
        div {
          width: 32%;
        }
      }
    }
  }
}
</style>
