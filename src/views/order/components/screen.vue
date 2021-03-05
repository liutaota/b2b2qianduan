<template>
  <!-- 筛选 -->
  <el-row>
    <el-col :span="24">
      <div class="row-col" style="margin: 10px 0" @keyup.enter="query()">
        <el-input
          v-model.number.trim="queryForm.id"
          placeholder="请输入订单Id"
          style="width: 140px; margin-right: 13px"
          clearablex
        />
        <el-input
          v-model.number.trim="queryForm.orderNo"
          placeholder="请输入订单号"
          style="width: 140px; margin-right: 13px"
          clearablex
        />
        <el-input
          v-model.number.trim="queryForm.telephone"
          placeholder="请输入注册手机号"
          style="width: 140px; margin-right: 13px"
          clearablex
        />
        <el-input
          v-model.number.trim="queryForm.memberPhone"
          placeholder="请输入下单电话"
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
          v-model="queryForm.orderState"
          placeholder="请选择订单状态"
          style="margin-right: 13px"
          clearable
          @change="queryStatus('orderState', queryForm.orderState)"
        >
          <el-option label="全部" :value="null" />
          <el-option label="已取消" value="CANCEL" />
          <el-option label="未付款" value="UNPAID" />
          <el-option label="待下发" value="TO_ERP" />
          <el-option label="已下发" value="SEND_ERP" />
          <el-option label="拣货中" value="TO_SEND" />
          <el-option label="待收货" value="TO_DELIVERY" />
          <el-option label="已收货" value="TO_RECEIVED" />
          <el-option label="完成" value="DONE" />
          <el-option label="申请退款" value="APPLY_REFUND" />
          <el-option label="退款成功" value="SUCCESS_REFUND" />
          <el-option label="待拦截" value="INTERCEPT" />
          <el-option label="退款中" value="IN_REFUND" />
          <el-option label="erp已收货" value="ERP_TO_RECEIVED" />
        </el-select>
        <el-select
          slot="state"
          v-model="queryForm.orderFrom"
          placeholder="请选择订单来源"
          style="margin-right: 13px"
          clearable
          @change="queryStatus('orderFrom', queryForm.orderFrom)"
        >
          <el-option label="全部" :value="null" />
          <el-option label="pc商城" value="1" />
          <el-option label="小程序" value="2" />
          <el-option label="代客下单" value="3" />
        </el-select>
        <el-select
          slot="state"
          v-model="queryForm.deleteState"
          placeholder="请选择删除状态"
          style="margin-right: 13px"
          clearable
          @change="queryStatus('deleteState', queryForm.deleteState)"
        >
          <el-option label="全部" :value="null" />
          <el-option label="未删除" :value="0" />
          <el-option label="彻底删除" :value="2" />
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
        <el-date-picker
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
        />
        <el-button type="primary" style="margin-top: 10px" @click="query()"
          >搜索</el-button
        >
        <el-button type="info" style="margin-right: 10px" @click="reset"
          >重置</el-button
        >
        <!-- <div slot="right"  /> -->
        <el-checkbox v-model="checked" label="自动刷新" border />
        <slot name="right" />
      </div>
    </el-col>
  </el-row>
</template>

<script>
import { _throttle } from "@/utils/public";
import moment from "moment";
export default {
  data() {
    return {
      queryForm: {
        size: 50,
        current: 1,
        memberPhone: "",
        memberId: "",
        memberName: "",
        startTime: moment()
          .subtract(7, "days")
          .format("YYYY-MM-DD 00:00:00"),
        endTime: moment(new Date()).format("YYYY-MM-DD 23:59:59"),
        descs: "oi.create_time"
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
      createDate: []
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
    // 状态查询
    queryStatus(form, status) {
      this.queryForm[form] = status;
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
