<template>
  <!-- 筛选 -->
  <el-row>
    <el-col :span="24">
      <div class="row-col" style="margin: 10px 0" @keyup.enter="query()">
        <el-input
          v-model.number.trim="queryForm.applyNo"
          placeholder="请输入退单号"
          style="width:170px;margin-right: 25px"
          clearablex
        />
        <el-input
          v-model.number.trim="queryForm.orderNo"
          placeholder="请输入原单号"
          style="width:170px;margin-right: 25px"
          clearablex
        />
        <el-input
          v-model.number.trim="queryForm.memberPhone"
          placeholder="请输入手机号"
          style="width:170px;margin-right: 25px"
          clearablex
        />
        <el-input
          v-model.number.trim="queryForm.memberId"
          placeholder="请输入客户ID"
          style="width:170px;margin-right: 25px"
          clearablex
        />
        <el-input
          v-model.trim="queryForm.memberName"
          placeholder="请输入客户名称"
          style="width:170px;margin-right: 25px"
          clearablex
        />
        <el-select v-model="queryForm.refundState" placeholder="请选择" style="width:170px;margin-right: 25px">
          <el-option label="全部" value="" />
          <el-option label="待审核" value="PENDING" />
          <el-option label="处理中" value="DEAL_WITH" />
          <el-option label="待发货" value="TO_SEND" />
          <el-option label="待收货" value="TO_DELIVERY" />
          <el-option label="待验收" value="UN_DELIVERY" />
          <el-option label="已收货" value="DELIVERY_DONE" />
          <el-option label="已完成" value="DONE" />
          <el-option label="erp下发异常" value="ORDER_EXP" />
        </el-select>
        <!-- <el-date-picker
          v-model="queryForm.createDate"
          type="datetimerange"
          align="right"
          style="width: 400px;margin-right: 25px"
          unlink-panels
          range-separator="至"
          start-placeholder="创建时间从"
          end-placeholder="创建时间"
          :picker-options="pickerOptions"
          value-format="yyyy-MM-dd"
          clearable
        /> -->
        <el-button type="primary" @click="query">查询</el-button>
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
      isclick: true
    };
  },
  watch: {
    queryForm: {
      handler(val) {
        if (val.createDate === null) {
          this.queryForm.startTime = '';
          this.queryForm.endTime = '';
        }
        console.log(val.refundState);
        if (val.memberPhone === '' && val.applyNo === '' && val.orderNo === '' && val.memberId === '' && val.memberName === '' && val.refundState === undefined) {
          this.query();
        }
      },
      deep: true
    }
  },
  methods: {
    query: _throttle(function() {
      if (this.queryForm.createDate) {
        this.queryForm.startTime = this.queryForm.createDate[0];
        this.queryForm.endTime = this.queryForm.createDate[1];
        delete this.queryForm.createDate;
      }
      this.$emit('query', this.queryForm);
    }, 1000),
    // 重置
    reset: _throttle(function() {
      this.queryForm = {
        size: 50,
        current: 1,
      };
      this.query();
    }, 1000),
  },
};
</script>

<style scoped>
.search{
  display: inline-block;
}
</style>
