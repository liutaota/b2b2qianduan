<template>
  <!-- 筛选 -->
  <el-row>
    <el-col :span="24">
      <div class="row-col" style="margin: 10px 0" @keyup.enter="query()">
        <el-input
          v-model.trim.number="queryForm.id"
          placeholder="请输入账单ID"
          style="width: 200px; margin-right: 25px"
          clearablex
        />
        <el-input
          v-model.trim.number="queryForm.erpUserId"
          placeholder="请输入客户ID"
          style="width: 200px; margin-right: 25px"
          clearablex
        />
        <el-input
          v-model.trim="queryForm.userName"
          placeholder="请输入客户名称"
          style="width: 200px; margin-right: 25px"
          clearablex
        />
        <el-select
          slot="state"
          v-model.trim="queryForm.status"
          placeholder="请选择状态"
          style="margin-right: 13px"
          clearable
          @change="query()"
        >
          <el-option label="已支付" value="PAID" />
          <el-option label="未支付" value="UNPAID" />
        </el-select>
        <el-date-picker
          v-model.trim="createDate"
          type="datetimerange"
          align="right"
          style="width: 400px;margin-right: 25px"
          unlink-panels
          range-separator="至"
          start-placeholder="业务日期从"
          end-placeholder="业务日期"
          :picker-options="pickerOptions"
          value-format="yyyy-MM-dd HH:mm:ss"
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
export default {
  props: {
    isArction: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      queryForm: {
        size: 50,
        current: 1,
      },
      createDate: [],
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
    };
  },
  watch: {
    // queryForm: {
    //   handler(val) {
    //     if (val.createDate === null) {
    //       this.queryForm.startTime = '';
    //       this.queryForm.endTime = '';
    //     }
    //     if (
    //       val.memberPhone === '' &&
    //       val.memberId === '' &&
    //       val.memberName === ''
    //     ) {
    //       this.query();
    //     }
    //   },
    //   deep: true,
    // },
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
      if (this.isArction === 2) {
        this.$emit('getRefund', { ...this.queryForm });
      } else {
        this.$emit('query', { ...this.queryForm });
      }
    },
    // 重置
    reset() {
      this.queryForm = {
        size: 50,
        current: 1,
      };
      this.createDate = [];
      this.query();
    },
  },
};
</script>

<style scoped>
.search {
  display: inline-block;
}
</style>
