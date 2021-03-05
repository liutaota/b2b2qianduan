<template>
  <div>
    <!-- <ul class="flexbox"> -->
    <div class="flexbox">
      <div v-for="(item, index) in orderTab" :key="index" class="cell">
        <div>{{ item.label }}</div>
        <div><span v-if="item.formatter === 'nummatter'">￥</span>{{ orderForm[item.prop] }}</div>
      </div>
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
      orderTab: [],
    }
  },
  created() {
    this.orderTab = [...this.columns]
    if (this.columns.length % 2 !== 0) {
      this.orderTab.push({})
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
</style>
