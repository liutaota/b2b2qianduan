<template>
  <!-- 筛选 -->
  <el-row>
    <el-col :span="24">
      <div class="row-col" style="margin: 10px 0" @keyup.enter="query()">
        <el-input
          v-model.trim.number="queryForm.zxPhone"
          placeholder="请输入手机号"
          style="width: 140px; margin-right: 13px"
          clearablex
        />
        <el-input
          v-model.trim.number="queryForm.memberId"
          placeholder="请输入客户ID"
          style="width: 140px; margin-right: 13px"
          clearablex
        />
        <el-input
          v-model.trim.number="queryForm.id"
          placeholder="请输入ERP客户ID"
          style="width: 140px; margin-right: 13px"
          clearablex
        />
        <el-input
          v-model.trim.number="queryForm.name"
          placeholder="请输入客户名称"
          style="width: 140px; margin-right: 13px"
          clearablex
        />
        <el-button
          type="primary"
          style="margin-top: 10px"
          @click="query()"
        >搜索</el-button>
        <el-button type="info" @click="reset">重置</el-button>
        <!-- <div slot="right"  /> -->
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
        memberPhone: '',
        memberId: '',
        memberName: '',
        startTime: '',
        endTime: '',
      },
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
        if (val.createDate === null) {
          this.queryForm.startTime = '';
          this.queryForm.endTime = '';
        }
        if (
          val.orderNo === '' &&
          val.memberPhone === '' &&
          val.memberId === '' &&
          val.memberName === ''
        ) {
          this.query();
        }
      },
      deep: true,
    },
  },
  methods: {
    query: _throttle(function () {
      if (this.createDate) {
        this.queryForm.startTime = this.createDate[0];
        this.queryForm.endTime = this.createDate[1];
      }
      this.$emit('query', this.queryForm);
    }, 1000),
    // 重置
    reset: _throttle(function () {
      this.queryForm = {
        size: 50,
        current: 1,
      };
      this.createDate = [];
      this.query();
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
