<template>
  <div>
    <!-- <ul class="flexbox"> -->
    <div class="flexbox">
      <div v-for="(item, index) in orderTab" :key="index" class="cell">
        <div>{{ item.label }}</div>
        <div v-if="item.formatter === 'nummatter'">
          <span>￥</span>{{ orderForm[item.prop] || 0 }}
        </div>
        <div v-else>{{ orderForm[item.prop] }}</div>
      </div>
    </div>
    <h2 class="title">
      订单明细
    </h2>
    <div class="goodsList">
      <div>商品编号</div>
      <div>商品名称</div>
      <div>商品规格</div>
      <div style="flex:2">厂家</div>
      <div>单位</div>
      <div>产地</div>
      <div>商品数量</div>
      <div>金额</div>
    </div>
    <div class="goodsList" v-for="(item, index) in orderForm.orderGoodsList">
      <div>{{ item.goodsId }}</div>
      <div>{{ item.goodsName }}</div>
      <div>{{ item.goodsType }}</div>
      <div style="flex:2">{{ item.factoryname }}</div>
      <div>{{ item.goodsunit }}</div>
      <div>{{ item.prodarea || '' }}</div>
      <div>{{ item.goodsNum }}</div>
      <div>{{ item.amountPay }}</div>
    </div>
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
.title {
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #ccc;
  margin: 0;
  padding: 10px 0;
  margin-top: 20px;
}
.goodsList {
  display: flex;
  justify-content: space-between;
  align-items: center;
  div {
    flex: 1;
    border: 1px solid #ccc;
    height: 38px;
    line-height: 38px;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
