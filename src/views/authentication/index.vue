<template>
  <div style="margin-left: 5px">
    <div style="margin-top: 10px">
      <Screen @query="query" />
    </div>
    <el-row style="float: left;margin-right: 20px">
      <el-col :span="24">
        <el-radio-group v-model="status" @change="query('')">
          <el-radio-button label="">全部</el-radio-button>
          <el-radio-button label="IN_REVIEW">待审核</el-radio-button>
          <el-radio-button label="APPROVE">审核通过</el-radio-button>
          <el-radio-button label="NOT_APPROVED">驳回</el-radio-button>
        </el-radio-group>
      </el-col>
    </el-row>
    <Dtable
      :table-data="tableData"
      :loading="loading"
      :add-edit-forms-ref="addEditFormsRef"
      :query-form="queryForm"
      @handleCurrent="handleCurrent"
    />
    <pagination
      :total="total"
      @pagination="pagination"
      @handleSizeChange="handleSizeChange"
    />
  </div>
</template>
<script>
import { statusGlobalData } from '@/filters';
import pagination from '@/components/Pagination';
import Screen from './components/screen';
const Dtable = () => import('./components/table');
export default {
  name: 'Authentication',
  components: {
    Dtable,
    pagination,
    Screen
  },
  data () {
    return {
      queryForm: {
        size: 50,
        current: 1,
        zxPhone: '',
        id: '',
        name: '',
        createDate: '',
        startTime: '',
        endTime: '',
      },
      EditMask: false,
      addMask: false,
      eType: [],
      tableData: [],
      currentRow: {},
      loading: false,
      total: 0,
      addEditForms: {},
      addEditVisb: false,
      addEditTitle: '',
      addEditFormsRef: {},
      orderDate: null,
      disabled: true,
      customerStatus: '',
      departmentAll: [],
      activeName: '',
      eName: [],
      eCustomerStatus: [],
      eCustomerType: [],
      statusGlobalData,
      status: ''
    };
  },
  watch: {
    disabled () {
    }
  },
  created () {
    this.query();
    this.eCustomerStatus = this.statusGlobalData.customerStatus;
    this.eCustomerType = this.statusGlobalData.customerType;
  },
  methods: {

    query (queryForm) {
      if (queryForm) {
        this.queryForm.size = 10;
        this.queryForm.current = 1;
        this.queryForm = queryForm;
      }
      this.loading = true;
      this.$http
        .get('/member/getAuthenticationList', {
          params: {
            ...this.queryForm,
            status: this.status,
          }
        })
        .then(data => {
          data.records.map(item => {
            switch (item.companyType) {
              case 'RETAIL_MONOMER_DRUGSTORE':
                item.company_type = '零售-单体药店';
                break;
              case 'RETAIL_CHAIN_HEADQUARTERS':
                item.company_type = '零售-连锁总部';
                break;
              case 'PROFITABILITY_MEDICAL_ESTABLISHMENT':
                item.company_type = '医疗机构';
                break;
              // case 'NOT_PROFITABILITY_MEDICAL_ESTABLISHMENT':
              //   item.company_type = '非盈利性医疗机构';
              //   break;
              case 'WHOLESALE_BUSINESS_COMPANY':
                item.company_type = '批发-商业公司';
                break;
            }
          });
          this.tableData = data.records;
          this.total = data.total;
          this.disabled = true;
          this.tableData.map(item => {
            item.area_name = '';
            item.areaName.split(',').forEach(data => {
              item.area_name += data;
            });
            item.picture = item.picture ? item.picture : [];
          });
        }).finally(() => {
          this.loading = false;
        });
      this.disabled = true;
    },

    // 重置
    reset () {
      this.queryForm = {};
      this.query();
    },
    // 选择数据行
    handleCurrent (val) {
      this.currentRow = val;
      this.disabled = false;
    },
    // 分页事件
    pagination({ page: current, limit: size }) {
      this.queryForm.current = current;
      this.query();
    },
    handleSizeChange({ page: current, limit: size }) {
      this.queryForm.size = size;
      this.query();
    },
    /**
       * 日期选择
       */
    orderDateChange (val) {
      if (val) {
        this.queryForm.beginTime = this.dateFormate(
          val[0],
          'YYYY-MM-DD 00:00:00'
        );
        this.queryForm.endTime = this.dateFormate(
          val[1],
          'YYYY-MM-DD 23:59:59'
        );
      } else {
        this.queryForm.beginTime = '';
        this.queryForm.endTime = '';
      }
    },
    handleSelectionChange (val) {
      this.companyId = [];
      const list = val;
      if (val.length > 0) {
        list.map(item => {
          this.companyId.push(item.id);
          this.companyId = Array.from(new Set(this.companyId));
        });
      }
    },
  }
};
</script>
<style lang="less">
  .row-left {
    height: 85vh;
    padding: 0 10px;
    margin-right: 10px;
    border-right: 1px solid #ccc;
  }

  #search {
    margin-left: 450px;
    margin-top: 20px;
  }
</style>
