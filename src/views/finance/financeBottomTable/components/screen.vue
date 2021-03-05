<template>
  <!-- 筛选 -->
  <el-row>
    <el-col :span="24">
      <div class="row-col" style="margin: 10px 0" @keyup.enter="query()">
        <el-input
          v-model.number.trim="queryForm.orderNo"
          placeholder="请输入订单号"
          style="width: 140px; margin-right: 13px"
          clearablex
        />
        <el-input
          v-model.number.trim="queryForm.erpCustomerId"
          placeholder="请输入客户ID"
          style="width: 140px; margin-right: 13px"
          clearablex
        />
        <el-input
          v-model.trim="queryForm.memberName"
          placeholder="请输入客户名称"
          style="width: 140px; margin-right: 13px"
          clearablex
        />
        <el-select
          slot="state"
          v-model="queryForm.payMethod"
          placeholder="请选择支付方式"
          style="margin-right: 13px"
          clearable
          @change="queryStatus('payMethod', queryForm.payMethod)"
        >
          <el-option label="全部" value="" />
          <el-option label="现结" value="CASH" />
          <el-option label="月结" value="MONTH" />
          <el-option label="在线支付" value="ON_LINE" />
        </el-select>
        <el-date-picker
          v-model.trim="createDate"
          type="datetimerange"
          align="right"
          style="width: 400px; margin-right: 25px"
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
import moment from "moment";
export default {
  data() {
    return {
      queryForm: {
        size: 50,
        current: 1,
        startTime: moment().subtract(7, 'days').format("YYYY-MM-DD 00:00:00"),
        endTime: moment(new Date()).format("YYYY-MM-DD 23:59:59")
      },
      createDate:[],
      // 日期
      pickerOptions: {
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            }
          },
          {
            text: "昨天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", date);
            }
          },
          {
            text: "一周前",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            }
          }
        ]
      }
    };
  },
  created() {
   this.createDate = [this.queryForm.startTime, this.queryForm.endTime];
  },
  methods: {
    queryTime(val) {
      if (val) {
        this.queryForm.startTime = val[0];
        this.queryForm.endTime = val[1];
      } else {
        this.queryForm.startTime = "";
        this.queryForm.endTime = "";
      }
      this.query();
    },
    query() {
      this.$emit("query", { ...this.queryForm });
    },
    // 重置
    reset() {
      this.queryForm = {
        size: 50,
        current: 1
      };
      this.query();
    }
  }
};
</script>

<style scoped>
.search {
  display: inline-block;
}
</style>
