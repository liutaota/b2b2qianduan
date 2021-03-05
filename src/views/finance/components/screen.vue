<template>
  <!-- 筛选 -->
  <el-row>
    <el-col :span="24">
      <div class="row-col" style="margin: 10px 0" @keyup.enter="query()">
        <el-input
          v-show="isArction === 1"
          v-model.trim.number="queryForm.id"
          placeholder="请输入收款单ID"
          style="width: 200px; margin-right: 25px"
          clearablex
        />
        <el-input
          v-show="isArction === 2"
          v-model.trim.number="queryForm.id"
          placeholder="请输入退款单ID"
          style="width: 200px; margin-right: 25px"
          clearablex
        />
        <el-input
          v-show="isArction === 2"
          v-model.trim.number="queryForm.recDocNo"
          placeholder="请输入退款单号"
          style="width: 200px; margin-right: 25px"
          clearablex
        />
        <el-input
          v-show="isArction === 2"
          v-model.trim.number="queryForm.applyNo"
          placeholder="请输入退货单号"
          style="width: 200px; margin-right: 25px"
          clearablex
        />
        <el-input
          v-show="isArction !== 3"
          v-model.trim.number="queryForm.orderId"
          placeholder="请输入订单ID"
          style="width: 200px; margin-right: 25px"
          clearablex
        />
        <el-input
          v-show="isArction !== 3"
          v-model.trim.number="queryForm.orderNo"
          placeholder="请输入订单号"
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
        <el-input
          v-model.trim="queryForm.payFlowNo"
          placeholder="请输入支付流水号"
          style="width: 200px; margin-right: 25px"
          clearablex
        />
        <el-input
          v-show="isArction === 3"
          v-model.trim.num="queryForm.telephone"
          placeholder="请输入客户手机号"
          style="width: 200px; margin-right: 25px"
          clearablex
        />
        <el-input
          v-show="isArction === 3"
          v-model.trim.num="queryForm.tmpNo"
          placeholder="请输入支付单号"
          style="width: 200px; margin-right: 25px"
          clearablex
        />
        <el-select
          v-show="isArction !== 3"
          slot="state"
          v-model="queryForm.recType"
          placeholder="请选择支付方式"
          style="margin-right: 13px"
          clearable
          @change="query"
        >
          <el-option label="全部" value="" />
          <el-option label="现结" value="CASH" />
          <el-option label="月结" value="MONTH" />
          <el-option label="在线支付" value="ON_LINE" />
        </el-select>
        <el-select
          slot="state"
          v-show="isArction === 3"
          v-model.trim="tranposnames"
          placeholder="请选择线路"
          style="margin-right: 13px"
          clearable
          multiple
          collapse-tags
          @change="multiple"
          @clear="clear"
        >
          <el-option
            :label="item"
            :value="item"
            v-for="(item, index) in zxPhOrderList"
            :key="index"
          />
        </el-select>
        <el-select
          v-show="isArction !== 3"
          v-model="queryForm.orderState"
          placeholder="请选择订单状态"
          style="margin-right: 13px"
          clearable
          @change="query()"
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
          v-show="isArction !== 3"
          v-model.trim="queryForm.status"
          placeholder="请选择收款状态"
          style="margin-right: 13px"
          clearable
          @change="query()"
        >
          <el-option label="已取消" value="CANCEL" />
          <el-option label="待结算" value="TO_PAY" />
          <el-option label="已结算" value="DONE_PAY" />
        </el-select>
        <el-select
          slot="state"
          v-model.trim="queryForm.financeTrues"
          placeholder="请选择核销状态"
          style="margin-right: 13px"
          clearable
          @change="query()"
        >
          <el-option label="全部" value />
          <el-option label="未核销" value="0" />
          <el-option label="核销中" value="2" />
          <el-option label="已核销" value="1" />
          <el-option label="核销失败" value="3" />
        </el-select>
        <el-select
          slot="state"
          v-model.trim="queryForm.confirm"
          placeholder="请选择收款状态"
          style="margin-right: 13px"
          clearable
          v-show="isArction === 3"
          @change="query()"
        >
          <el-option label="全部" value="0" />
          <el-option label="未收款" value="1" />
          <el-option label="已收款" value="2" />
        </el-select>
        <el-select
          slot="state"
          v-model.trim="queryForm.payType"
          placeholder="请选择支付类型"
          style="margin-right: 13px"
          clearable
          v-show="isArction === 3"
          @change="query()"
        >
          <el-option label="全部" value />
          <el-option label="现金付款" value="CASH" />
          <el-option label="在线支付" value="ON_LINE" />
        </el-select>
        <el-date-picker
          v-model.trim="createDate"
          type="datetimerange"
          align="right"
          style="width: 400px; margin-right: 25px;margin-top:10px"
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

        <slot name="right" />
      </div>
      <div style="margin:10px 0">
        <el-button type="primary" @click="query()">查询</el-button>
        <el-button type="info" @click="reset">重置</el-button>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import moment from "moment";
import { getInfo } from "@/api/user";
export default {
  props: {
    isArction: {
      type: Number,
      default: 1
    }
  },
  watch: {
    createDate: {
      handler(val) {
        if (val) return;
        switch (this.isArction) {
          case 1:
            this.isArction1 = {};
            break;
          case 2:
            this.isArction2 = {};
            break;
          case 3:
            this.isArction3 = {};
            break;
        }
      },
      deep: true
    },
    isArction(val) {
      let tranposnames = this.queryForm.tranposnames
      switch (this.isArction) {
        case 1:
          this.queryForm = {
              size: 50,
              current: 1,
              tranposnames
            };
          if (JSON.stringify(this.isArction1) === "{}") return;
          this.queryForm.startTime = this.isArction1.startTime;
          this.queryForm.endTime = this.isArction1.endTime;
          this.createDate = [this.queryForm.startTime, this.queryForm.endTime];
          break;
        case 2:
          this.queryForm = {
              size: 50,
              current: 1,
              tranposnames
            };
          if (JSON.stringify(this.isArction2) === "{}") return;
          this.queryForm.startTime = this.isArction2.startTime;
          this.queryForm.endTime = this.isArction2.endTime;
          this.createDate = [this.queryForm.startTime, this.queryForm.endTime];
          break;
        case 3:
          this.queryForm = {
              size: 50,
              current: 1,
              tranposnames
            };
          if (JSON.stringify(this.isArction3) === "{}") return;
          this.queryForm.startTime = this.isArction3.startTime;
          this.queryForm.endTime = this.isArction3.endTime;
          this.createDate = [this.queryForm.startTime, this.queryForm.endTime];
          break;
      }
    }
  },
  data() {
    return {
      queryForm: {
        size: 50,
        current: 1
      },
      zxPhOrderList: [],
      tranposnames: [],
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
      },
      createDate: [],
      isArction1: {
        startTime: moment(new Date()).format("YYYY-MM-DD 00:00:00"),
        endTime: moment(new Date()).format("YYYY-MM-DD 23:59:59")
      },
      isArction2: {
        startTime: moment(new Date()).format("YYYY-MM-DD 00:00:00"),
        endTime: moment(new Date()).format("YYYY-MM-DD 23:59:59")
      },
      isArction3: {
        startTime: moment(new Date()).format("YYYY-MM-DD 00:00:00"),
        endTime: moment(new Date()).format("YYYY-MM-DD 23:59:59")
      }
    };
  },
  created() {
    this.queryForm.startTime = this.isArction1.startTime;
    this.queryForm.endTime = this.isArction1.endTime;
    this.createDate = [this.queryForm.startTime, this.queryForm.endTime];
    this.getInfo();
  },
  methods: {
    multiple(val) {
      this.queryForm.tranposnames = val.toString();
    },
    clear() {
      if (this.zxPhOrderList.length > 0) {
        this.queryForm.tranposnames = this.zxPhOrderList[0];
        this.tranposnames = [this.zxPhOrderList[0]];
      }
    },
    queryTime(val) {
      this.createDate = val;
      if (val) {
        this.queryForm.startTime = val[0];
        this.queryForm.endTime = val[1];
      } else {
        this.queryForm.startTime = "";
        this.queryForm.endTime = "";
      }
      this.query();
    },
    getInfo() {
      getInfo().then(res => {
        if (res.translinename) {
          this.zxPhOrderList = res.translinename.split(",");
          this.tranposnames = res.translinename.split(",");
          this.$set(
            this.queryForm,
            "tranposnames",
            res.translinename.toString()
          );
        }
      });
    },
    query() {
      if (this.isArction === 2) {
        this.$emit("getRefund", { ...this.queryForm });
      } else if (this.isArction === 3) {
        if (this.queryForm.tranposnames) {
          this.$emit("APPQuery", this.queryForm);
        }
      } else {
        this.$emit("query", this.queryForm);
      }
    },
    // 重置
    reset() {
      let tranposnames =this.queryForm.tranposnames
      this.queryForm = {
        size: 50,
        current: 1,
        startTime: moment(new Date()).format("YYYY-MM-DD 00:00:00"),
        endTime: moment(new Date()).format("YYYY-MM-DD 23:59:59"),
      };
      if (this.isArction === 3) {
        this.queryForm.tranposnames = tranposnames;
      }
      this.createDate = [this.queryForm.startTime, this.queryForm.endTime];
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
