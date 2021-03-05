<template>
  <!-- 筛选 -->
  <el-row>
    <el-col :span="24">
      <div class="row-col" style="margin: 10px 0" @keyup.enter="query()">
        <el-input
          v-model.trim="queryForm.content"
          placeholder="请输入活动内容"
          style="width:200px;margin-right: 25px"
          clearablex
        />
        <el-input
          v-model.number.trim="queryForm.erpGoodsId"
          placeholder="请输商品编号"
          style="width:200px;margin-right: 25px"
          clearablex
        />
        <el-date-picker
          v-model.trim="createDate"
          type="datetimerange"
          align="right"
          style="width: 340px;margin-right: 13px"
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
        <el-button type="primary" @click="query()">查询</el-button>
        <el-button type="info" @click="reset">重置</el-button>
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
      },
      // 日期
      pickerOptions: {
        shortcuts: [
          {
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date());
            },
          },
          {
            text: '昨天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', date);
            },
          },
          {
            text: '一周前',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', date);
            },
          },
        ],
      },
      createDate: []
    };
  },
  watch: {
    queryForm: {
      handler(val) {
        if (val.createDate === null) {
          this.queryForm.startTime = '';
          this.queryForm.endTime = '';
        }
        if (val.content === '') {
          this.query();
        }
      },
      deep: true
    }
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
    query() {
      this.$emit('query', this.queryForm);
    },
    // 重置
    reset: _throttle(function() {
      this.queryForm = {
        size: 50,
        current: 1,
      };
      this.createDate = [];
      this.query();
    }),
  },
};
</script>

<style scoped>
.search{
  display: inline-block;
}
</style>
