<template>
  <!-- 筛选 -->
  <el-row>
    <el-col :span="24">
      <div class="row-col" style="margin: 10px 0" @keyup.enter="query()">
        <el-input
          v-model.trim.number="queryForm.erpEmployeeId"
          placeholder="请输入erpId"
          style="width: 200px; margin-right: 25px"
          clearablex
        />
        <el-input
          v-model.trim="queryForm.userName"
          placeholder="请输入账号"
          style="width: 200px; margin-right: 25px"
          clearablex
        />
        <el-input
          v-model.trim="queryForm.role"
          placeholder="请输入角色"
          style="width: 200px; margin-right: 25px"
          clearablex
        />
        <el-input
          v-model.trim="queryForm.name"
          placeholder="请输入名称"
          style="width: 200px; margin-right: 25px"
          clearablex
        />
        <el-input
          v-model.trim.number="queryForm.employeeNo"
          placeholder="请输入工号"
          style="width: 200px; margin-right: 25px"
          clearablex
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
      default: 1,
    },
  },
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
        delete this.queryForm.createDate;
      } else {
        this.queryForm.startTime = '';
        this.queryForm.endTime = '';
        delete this.queryForm.createDate;
      }
      this.query();
    },
    query() {
      this.$emit('query', { ...this.queryForm });
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
.search {
  display: inline-block;
}
</style>
