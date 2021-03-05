<template>
  <div>
    <div class="center-row4-add j_b_box">
      <p :class="isInput ? 'flexBox cursor' : 'flexBox'" @click.stop="reduce">
        <img src="@/assets/img/reduce.png" alt>
      </p>
      <!-- {{ numbers }} -->
      <!-- <el-input
        type="text"
        v-model.trim.number="numbers"
        @input="getValues"
        @click.stop
        v-if="isInput"
        style=" font-size: 12px;"
      /> -->
      <input v-if="isInput" v-model.trim.number="numbers" type="text" oninput="value=value.replace(/[^\d]/g,'')" @input="getValues" @change="getChange" @click.stop>
      <input v-if="!isInput" v-model.trim.number="num" type="text" class="isinput" oninput="value=value.replace(/[^\d]/g,'')">
      <p :class="isInput ? 'flexBox cursor' : 'flexBox'" @click.stop="makeNum">
        <img src="@/assets/img/add.png" alt>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AddReduce',
  props: {
    number: {
      type: Number,
      default: 0
    },
    isInput: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      num: 1,
    };
  },
  computed: {
    numbers: {
      get() {
        return this.number;
      },
      set(val) {
        this.$emit('update:number', val * 1);
      },
    },
  },
  methods: {
    makeNum() {
      this.numbers++;
      this.$emit('makeNum', this.numbers);
    },
    reduce() {
      if (this.numbers === 0) {
        this.numbers = 0;
        return;
      }
      this.numbers--;
      this.$emit('reduce', this.numbers);
    },
    getValues() {
      this.$emit('getValues', this.numbers);
    },
    getChange() {
      this.$emit('getChange', this.numbers);
    }
  },
};
</script>

<style lang="less" scoped>
.center-row4-add {
  height: 28px;
  border: 1px solid #b3b3b3;
  p {
    width: 2.14 * 14px;
    height: 100%;
    img {
      width: 1re;
      height: 1 * 14px;
    }
  }
  input {
    width: 50%;
    height: 100%;
    color: #1a1a1a;
    font-size: 0.86 * 14px;
    text-align: center;
    border: none;
  }
  .isinput {
    background: #f2f2f2;
    color: #b3b3b3;
    box-sizing: border-box;
  }
  p:first-of-type {
    border-right: 1px solid #b3b3b3;
  }
  p:last-of-type {
    border-left: 1px solid #b3b3b3;
  }
}
/deep/ .el-input__inner {
  text-align: center !important;
}
.j_b_box {
  display: flex;
  display: -webkit-flex;
  justify-content: space-between;
  align-items: center;
}
.flexBox {
    display: flex;
    display: -webkit-flex;
    justify-content: center;
    align-items: center;
}
</style>
