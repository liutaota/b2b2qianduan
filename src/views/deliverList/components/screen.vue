<template>
  <!-- 筛选 -->
  <el-row>
    <el-col :span="24">
      <div class="row-col" style="margin: 10px 0" @keyup.enter="query()">
        <el-input
          v-model.number.trim="queryForm.customid"
          placeholder="请输入客户Id"
          style="width: 140px; margin-right: 13px"
          clearablex
        />
        <el-input
          v-model.number.trim="queryForm.customname"
          placeholder="请输入客户名称"
          style="width: 140px; margin-right: 13px"
          clearablex
        />
        <el-input
          v-model.number.trim="queryForm.transortno"
          placeholder="请输入线序"
          style="width: 140px; margin-right: 13px"
          clearablex
        />

        <el-select
          slot="state"
          v-model="queryForm.translinename"
          placeholder="请选择线路"
          style="margin-right: 13px"
          clearable
          @change="
            queryTtranslinename('translinename', queryForm.translinename)
          "
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-select
          slot="state"
          v-model="queryForm.erpTotal"
          placeholder="请选择支付状态"
          style="margin-right: 13px"
          clearable
          @change="queryStatus('erpTotal', queryForm.erpTotal)"
        >
          <el-option label="全部" value="3" />
          <el-option label="未付款" value="1" />
          <el-option label="已付款" value="2" />
        </el-select>
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
        <!-- <el-date-picker
          v-model="createDate"
          type="datetimerange"
          align="right"
          style="width: 340px; margin-right: 13px"
          unlink-panels
          range-separator="至"
          start-placeholder="订单开始"
          end-placeholder="订单结束"
          value-format="yyyy-MM-dd HH:mm:ss"
          :picker-options="pickerOptions"
          :default-time="['00:00:00', '23:59:59']"
          clearable
          @change="queryTime"
        /> -->
        <el-button type="primary" style="margin-top: 10px" @click="query()"
          >搜索</el-button
        >
        <el-button type="info" style="margin-right: 10px" @click="reset"
          >重置</el-button
        >
        <slot name="right" />
      </div>
    </el-col>
  </el-row>
</template>

<script>
import { _throttle } from "@/utils/public";
export default {
  data() {
    return {
      queryForm: {
        size: 50,
        current: 1,
      },
      checked: false, // 自动刷新
      timer: null,
      // 日期
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      createDate: [],
      options: []
    };
  },
  watch: {
    queryForm: {
      handler(val) {
        if (val.createDate === null) {
          this.queryForm.startTime = "";
          this.queryForm.endTime = "";
        }
        if (
          val.orderNo === "" &&
          val.memberPhone === "" &&
          val.memberId === "" &&
          val.memberName === ""
        ) {
          this.query();
        }
      },
      deep: true
    }
  },
  created() {
    this.selectAllTransline();
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
    query: _throttle(function() {
      if (this.checked) {
        this.timer = setInterval(() => {
          this.$emit("query", this.queryForm);
        }, 60000);
      }
      this.$emit("query", this.queryForm);
    }, 500),
    // 重置
    reset: _throttle(function() {
      this.queryForm = {
        size: 50,
        current: 1
      };
      this.createDate = [];
      this.checked = false;
      clearInterval(this.timer);
      // this.query();
      this.$emit("reset", this.queryForm);
    }, 1000),
    // 线路查询
    queryTtranslinename(form, status) {
      this.queryForm[form] = status;
      this.query();
    },
    // 状态查询
    queryStatus(form, status) {
      this.queryForm[form] = status;
      this.query();
    },

    selectAllTransline() {
      this.$http.get("user/selectAllTransline", {}).then(res => {
        console.log(res);
        this.options = [];
        if (res[0]) {
          res.map(item => {
            this.options.push({
              value: item.translinename,
              desc: item.translinename
            });
          });
        }
      });
    }
  }
};
</script>

<style scoped>
.search {
  display: inline-block;
}
</style>
