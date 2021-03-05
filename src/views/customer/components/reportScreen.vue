<template>
  <el-row style="margin-bottom: 10px">
    <el-col :span="24">
      <div class="row-col" @keyup.enter="query(queryForm)">
        <el-input
          v-model.trim="queryForm.customids"
          placeholder="请输入客户ID"
          style="width:150px;margin-right: 25px"
          clearablex
        />
        <el-input
          v-model.trim="queryForm.customname"
          placeholder="请输入客户名称"
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
        <el-button type="info" @click="report(queryForm)">导出</el-button>
      </div>
    </el-col>
  </el-row>
</template>

<script>
    import { imgHost } from '@/config';
    import  axios from 'axios'
    import  {ossUrl} from '@/config.js'
    import store from '@/store'
    import { getToken } from '@/utils/auth';

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
      this.queryForm.size = 50;
      this.queryForm.current = 1;
      this.createDate = [];
      this.query();
    },
      report(queryForm) {
          if (queryForm.startTime === '' || queryForm.endTime === '') {
              this.$message.warning('时间为空,不能导出');
              return;
          }

          this.$http.get('report/exportCandidateTempt', {
             params: {startTime:queryForm.startTime,endTime:queryForm.endTime },

         })
            .then(res => {
                window.open(`${ossUrl + res}`, "_blank");
             }).catch(() => {
             this.$message.error('下载失败1111')
         });


      },
  },
};
</script>

<style scoped>
.search{
  display: inline-block;
}
</style>
