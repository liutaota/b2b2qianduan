<template>
  <el-row style="margin-bottom: 10px">
    <el-col :span="24">
      <div class="row-col" @keyup.enter="query(queryForm)">
        <el-input
          v-model.trim="queryForm.companyName"
          placeholder="请输入企业名称"
          style="width:150px;margin-right: 25px"
          clearablex
        />
        <el-select v-model.trim="queryForm.companyType" size="small" placeholder="请选择类型" style="width:145px;margin-right: 10px">
          <el-option label="零售-单体药店" value="RETAIL_MONOMER_DRUGSTORE" />
          <el-option label="零售-连锁总部" value="RETAIL_CHAIN_HEADQUARTERS" />
          <el-option label="盈利性医疗机构" value="PROFITABILITY_MEDICAL_ESTABLISHMENT" />
          <el-option label="非盈利性医疗机构" value="NOT_PROFITABILITY_MEDICAL_ESTABLISHMENT" />
          <el-option label="批发-商业公司" value="WHOLESALE_BUSINESS_COMPANY" />
        </el-select>
        <el-input
          v-model.trim="queryForm.contactName"
          placeholder="请输入联系人姓名"
          style="width:150px;margin-right: 25px"
          clearablex
        />
        <el-input
          v-model.trim="queryForm.contactPhone"
          placeholder="请输入联系人手机"
          style="width:150px;margin-right: 25px"
          clearablex
        />
        <el-date-picker
          v-model.trim="createDate"
          type="datetimerange"
          align="right"
          style="width: 400px;margin-right: 25px"
          unlink-panels
          range-separator="至"
          start-placeholder="创建时间从"
          end-placeholder="创建时间"
          :picker-options="pickerOptions"
          value-format="yyyy-MM-dd HH:mm:ss"
          :default-time="['00:00:00', '23:59:59']"
          clearable
          @change="queryTime"
        />
        <el-button type="primary" @click="query(queryForm)">查询</el-button>
        <el-button type="info" @click="reset">重置</el-button>
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
        zxPhone: '',
        id: '',
        name: '',
        startTime: '',
        endTime: '',
      },
      createDate: [],
      // 日期
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick (picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '最近一个月',
            onClick (picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '最近三个月',
            onClick (picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }
        ]
      },
    };
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
    reset() {
      this.queryForm = {};
      this.queryForm.size = 20;
      this.queryForm.current = 1;
      this.createDate = [];
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
