<template>
  <div style="margin: 10px">
    <div style="margin-top: 10px">
      <reportScreen v-permission="'CustomerListLook'" @query="query" />
    </div>
    <el-row style="float: left;margin: 0 20px 10px 0">

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
    <AddEdit
      :dialog-form-visible="addMask"
      title="添加用户"
      :form="addFrom"
      @onSubmit="handleMemberAdd"
      @cancel="cancel"
    />
    <el-dialog
      title="修改账号"
      :visible.sync="dialogVisible"
      width="40%"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <el-form ref="form" :model="userForm" label-width="80px" :rules="rules">
        <el-form-item label="erp用户id">
          <el-input v-model.trim="userForm.customerid" disabled />
        </el-form-item>
        <el-form-item label="手机号" prop="telephone">
          <el-input v-model.trim="userForm.telephone" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="editUser('form')">提交</el-button>
          <el-button type="primary" @click="cancel('form')">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { statusGlobalData } from '@/filters';
// import pagination from '@/components/Pagination';
// import Screen from './components/screen';
// import AddEdit from './components/memberAddEdit';
const Dtable = () => import('./components/report');
const AddEdit = () => import('./components/memberAddEdit');
const reportScreen = () => import('./components/reportScreen');
const pagination = () => import('@/components/Pagination');
import axios from 'axios'
export default {
  name: 'SalesReport',
  components: {
    AddEdit,
    Dtable,
    pagination,
    reportScreen
  },
  data () {
    var telephone = (rule, value, callback) => {
      // let phoneReg = /(^1[3|4|5|6|7|8|9]\d{9}$)|(^09\d{8}$)/;
      if (value === '') {
        callback(new Error('请输入手机号'));
      } else if (!this.isCellPhone(value)) {
        // 引入methods中封装的检查手机格式的方法
        callback(new Error('请输入正确的手机号!'));
      } else {
        callback();
      }
    };
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
      addFrom: {},
      userForm: {
        telephone: '',
        customerid: '',
      },
      dialogVisible: false,
      // 表单验证规则
      rules: {
        telephone: [{ required: true, validator: telephone, trigger: 'blur' }],
      },
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
    // 打开新增
    isShowAdd() {
      const customer = this.addFrom;
      if (JSON.stringify(customer) === '{}') {
        this.$message.info('未选择当前对象');
        return;
      }
      if (customer.erpUserId !== null) {
        this.$message.warning('客户已存在，无需添加');
        return;
      }
      this.addMask = true;
    },
    // 取消弹窗
    cancel(form) {
      this.addMask = false;
      this.EditMask = false;
      this.dialogVisible = false;
      this.userForm = {
        telephone: '',
        customerid: '',
      };
      this.currentRow = {};
      this.addFrom = {};
      if (form) {
        this.$refs[form].resetFields();
      }
    },
    handleMemberAdd(val) {
      const { customid: erpUserId, telephone, password, rePassword } = val;
      this.$http.post('member/addMember', { erpUserId, telephone, password, rePassword }).then(o => {
        this.$message({
          message: '添加成功',
          type: 'success'
        });
        this.cancel();
        this.query();
        this.currentRow = {};
        this.addFrom = {};
      });
    },
    query (queryForm) {
    console.log('-----------------111')
      if (queryForm) {
        this.queryForm.page_size = 50;
        this.queryForm.page_no = 1;
        this.queryForm = queryForm;
      }
      this.queryForm.page_size = this.queryForm.size;
      this.queryForm.page_no =this.queryForm.current;
      let memberId = '';
      const role = window.sessionStorage.getItem('role');
      if (role === 'superAdmin') {
        memberId = 0;
      } else {
        memberId = null;
      }
      this.loading = true;
      this.$http
        .get('/report/list', {
          params: {
            ...this.queryForm,
            memberId,
            descs: 'v.credate',
          }
        })
        .then(data => {
        console.log(99999999999)

          this.tableData = data.records;
          this.total = data.total;
          this.disabled = true;
          this.tableData.map(item => {
            item.picture = item.picture ? item.picture : [];
          });
        }).finally(() => {
          this.loading = false;
        });
      this.disabled = true;
    },
    addEditCancel (val) {
      this.addEditVisb = val;
      this.query();
    },

    // 重置密码
    rePwd () {
      const customer = this.currentRow;
      if (JSON.stringify(customer) === '{}') {
        this.$message({
          type: 'info',
          message: '未选择当前对象'
        });
        return;
      }
      this.$prompt('请输入重置密码', '提示', {
        confirmButtonText: '确定',
        closeOnPressEscape: true,
        cancelButtonText: '取消',
        inputPattern: /^(\w){6,20}$/,
        inputErrorMessage: '只能输入6-20个字母、数字、下划线'
      }).then(({ value }) => {
        const memberId = customer.id;
        const rePassword = value;
        // console.log(customer.id, rePassword);
        this.$http.post('/member/rePassword', {
          memberId,
          rePassword,
        }).then(() => {
          this.query();
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '修改失败'
          });
        });
      });
    },
    addMember(val) {
      this.$http.post('member/addMember', { ...val }).then(() => {
        this.$message.success('添加成功');
        this.cancel();
        this.query();
        this.currentRow = {};
      });
    },
    // 重置
    reset () {
      this.queryForm = {};
      this.query();
    },
    // 选择数据行
    handleCurrent (val) {
      if (val !== null) {
        this.currentRow = JSON.parse(JSON.stringify(val));
        this.currentRow.rePassword = '';
        this.currentRow.password = '';
        this.userForm.telephone = val.telephone;
        this.userForm.customerid = val.customid;
        this.addFrom = JSON.parse(JSON.stringify(val));
      }
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
    openUser() {
      if (JSON.stringify(this.currentRow) === '{}') {
        this.$message.info('未选择当前对象');
        return;
      }
      this.dialogVisible = true;
    },
    editUser(formName) {
      const customer = this.userForm;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$http.get('member/updateMemberTelephone', { params: { ...customer }}).then(res => {
            this.$message.success('修改成功');
            this.query();
            this.cancel();
          });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    handleClose() {
      this.dialogVisible = false;
      this.userForm = {};
    },
    isCellPhone(val) {
      if (!/^1[3456789]\d{9}$/.test(val)) {
        return false;
      } else {
        return true;
      }
    },
    pointsPage() {
      if (JSON.stringify(this.currentRow) === '{}') {
        this.$message.info('未选择当前对象');
        return;
      }
      if (!this.currentRow.id) {
        this.$message.info('当前用户无积分记录');
        return;
      }
      this.$router.push('/customer/IntegralRecord?memberId=' + this.currentRow.id);
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
