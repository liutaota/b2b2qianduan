<template>
  <!-- 筛选 -->
  <el-row>
    <el-col :span="24">
      <div class="row-col" style="margin: 10px 0" @keyup.enter="query()">
        <el-input
          v-model.trim.number="queryForm.id"
          placeholder="请输入优惠卷Id"
          style="width: 140px; margin-right: 13px"
          clearablex
        />
        <slot name="state" />
        <el-date-picker
          v-model.trim="createDate"
          type="datetimerange"
          align="right"
          style="width: 340px; margin-right: 13px"
          unlink-panels
          range-separator="至"
          start-placeholder="有效期"
          end-placeholder="有效期"
          value-format="yyyy-MM-dd HH:mm:ss"
          :picker-options="pickerOptions"
          :default-time="['00:00:00', '23:59:59']"
          clearable
          @change="queryTime"
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
            text: '当天',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
              picker.$emit('pick', [start, end]);
            }
          },
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
    queryTime(val) {
      if (val) {
        this.queryForm.startTime = val[0];
        this.queryForm.endTime = val[1];
      } else {
        this.queryForm.startTime = '';
        this.queryForm.endTime = '';
      }
      this.query();
    },
    query: _throttle(function () {
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
    }, 1000),
  },
};
</script>

<style scoped>
.search {
  display: inline-block;
}
</style>
