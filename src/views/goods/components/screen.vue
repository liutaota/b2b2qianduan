<template>
  <el-row style="margin-bottom: 10px">
    <el-col :span="24">
      <div class="row-col" style="margin-top: 10px" @keyup.enter="query(queryForm)">
        <el-input
          v-model.trim="queryForm.goodsid"
          placeholder="请输入货品ID"
          style="width:130px;margin-right: 20px"
          clearablex
        />
        <el-input
          v-model.trim="queryForm.barcode"
          placeholder="请输入条形码"
          style="width:130px;margin-right: 20px"
          clearablex
        />
        <el-input
          v-model.trim="queryForm.goodsname"
          placeholder="请输入商品名"
          style="width:130px;margin-right: 20px"
          clearablex
        />
        <el-input
          v-model.trim="queryForm.factoryname"
          placeholder="请输入生产厂商"
          style="width:130px;margin-right: 20px"
          clearablex
        />
        <!-- <el-checkbox v-model.trim="queryForm.isRacking" label="是否上架" border class="checkbox" style="margin-right: 20px" /> -->
        <el-select
          v-if="isArction"
          v-model.trim="queryForm.isRacking"
          size="small"
          placeholder="是否上架"
          style="width:145px;margin-right: 20px"
        >
          <el-option label="全部" value />
          <el-option label="未上架" :value="0" />
          <el-option label="已上架" :value="1" />
        </el-select>
        <slot name="select" />
        
        <el-checkbox
          v-model.trim="queryForm.isImg"
          label="无图片"
          border
          class="checkbox"
          style="margin-right: 20px"
        />
        <el-date-picker
          v-model.trim="invaliddate"
          type="daterange"
          align="right"
          style="width: 380px;margin-right: 20px"
          unlink-panels
          range-separator="至"
          start-placeholder="有效期"
          end-placeholder="有效期"
          value-format="yyyy-MM-dd"
          :picker-options="pickerOptions"
        />
        <slot />
        <el-button type="primary" @click="query">查询</el-button>
        <el-button type="info" @click="reset">重置</el-button>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import { _throttle } from '@/utils/public';
export default {
  props: {
    isArction: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      queryForm: {
        size: 50,
        current: 1,
        goodsid: '',
        barcode: '',
        goodsname: '',
        factoryname: '',
        startTime: '',
        endTime: '',
        isRacking: '',
      },
      invaliddate: [],
      // 日期
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            },
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            },
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            },
          },
        ],
      },
    };
  },
  watch: {
    queryForm: {
      handler (val) {
        if (this.invaliddate === null) {
          this.queryForm.startTime = '';
          this.queryForm.endTime = '';
        }
      },
      deep: true,
    },
    invaliddate(val) {
      if (val === null) {
        this.queryForm.startTime = '';
        this.queryForm.endTime = '';
      }
    },
  },
  methods: {
    query() {
      if (this.invaliddate) {
        this.queryForm.startTime = this.invaliddate[0];
        this.queryForm.endTime = this.invaliddate[1];
      }
      this.$emit('query', this.queryForm);
    },
    // 重置
    reset: _throttle(function () {
      this.queryForm = {
        size: 50,
        current: 1,
      };
      this.invaliddate = [];
      this.$emit('reset')
      this.query();
    }),
  },
};
</script>

<style scoped>
.search {
  display: inline-block;
}
</style>
