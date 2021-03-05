<template>
  <!-- 筛选 -->
  <el-row>
    <el-col :span="24">
      <div class="row-col" style="margin: 10px 0" @keyup.enter="query()">
        <el-input
          v-model.trim.number="queryForm.memberPhone"
          placeholder="请输入手机号"
          style="width:200px;margin-right: 25px"
          clearablex
        />
        <el-input
          v-model.trim.number="queryForm.memberId"
          placeholder="请输入客户ID"
          style="width:200px;margin-right: 25px"
          clearablex
        />
        <el-input
          v-model.trim="queryForm.memberName"
          placeholder="请输入客户名称"
          style="width:200px;margin-right: 25px"
          clearablex
        />
        <!-- <el-date-picker
          v-model.trim="queryForm.createDate"
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
        <el-button type="primary" @click="query()">查询</el-button>
        <el-button type="info" @click="reset">重置</el-button>
        <slot name="right" />
      </div>
    </el-col>
  </el-row>
</template>

<script>
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
    };
  },
  watch: {
    queryForm: {
      handler(val) {
        if (val.createDate === null) {
          this.queryForm.startTime = '';
          this.queryForm.endTime = '';
        }
        if (val.memberPhone === '' && val.memberId === '' && val.memberName === '') {
          this.query();
        }
      },
      deep: true
    }
  },
  methods: {
    query() {
      if (this.queryForm.createDate) {
        this.queryForm.startTime = this.queryForm.createDate[0];
        this.queryForm.endTime = this.queryForm.createDate[1];
        delete this.queryForm.createDate;
      }
      this.$emit('query', this.queryForm);
    },
    // 重置
    reset() {
      this.queryForm = {
        size: 50,
        current: 1,
      };
      this.query();
    },
  },
};
</script>

<style scoped>
.search{
  display: inline-block;
}
</style>
