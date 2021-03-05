<template>
  <!-- 筛选 -->
  <el-row>
    <el-col :span="24">
      <div class="row-col" style="margin: 10px 0" @keyup.enter="query()">
        <el-input
          v-model.number.trim="queryForm.memberId"
          placeholder="请输入客户id"
          style="width: 140px; margin-right: 13px"
          clearablex
        />
        <el-input
          v-model.number.trim="queryForm.userName"
          placeholder="请输入客户名称"
          style="width: 140px; margin-right: 13px"
          clearablex
        />
        <el-button
          type="primary"
          style="margin-top: 10px"
          @click="query()"
        >搜索</el-button>
        <el-button type="info" style="margin-right: 10px" @click="reset">重置</el-button>
        <!-- <div slot="right"  /> -->
        <el-checkbox v-model="checked" label="自动刷新" border />
        <slot name="right" />
      </div>
    </el-col>
  </el-row>
</template>

<script>
import { _throttle } from '@/utils/public';
export default {
  data() {
    return {
      queryForm: {
        size: 50,
        current: 1,
        descs: 'ml.create_time'
      },
      checked: false, // 自动刷新
      timer: null,
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
      createDate: [],
    };
  },
  watch: {
    queryForm: {
      handler(val) {
        if (
          val.memberId === '' &&
          val.userName === ''
        ) {
          this.query();
        }
      },
      deep: true,
    },
  },
  methods: {
    queryTime(val) {
      this.query();
    },
    query: _throttle(function () {
      this.$emit('query', this.queryForm);
    }, 500),
    // 重置
    reset: _throttle(function () {
      this.queryForm = {
        size: 50,
        current: 1,
        descs: 'ml.create_time'
      };
      this.$emit('reset', this.queryForm);
    }, 1000),
  },
};
</script>

<style scoped>
.search {
  display: inline-block;
}
</style>
