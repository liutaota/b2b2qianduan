<template>
  <div>
    <el-row>
      <el-col :span="24">
        <div class="row-col">
          <el-select v-model.trim="queryForm.role" clearablex>
            <el-option value label="全部" />
            <el-option
              v-for="(item,index) in eRole"
              :key="index"
              :label="item.desc"
              :value="item.value"
            />
          </el-select>
          <el-date-picker
            v-model.trim="queryForm.startTime"
            type="date"
            align="right"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptions"
            style="margin-right:13px ;width: 250px;"
          />
          <el-input v-model.trim="queryForm.realName" placeholder="姓名" style="width:150px;" clearablex />
          <el-input v-model.trim="queryForm.telephone" placeholder="手机号码" style="width:150px;" clearablex />
          <el-input v-model.trim="queryForm.departmentName" placeholder="部门" style="width:150px;" clearablex />
          <el-button type="primary" icon="el-icon-search" @click="queryMember(queryForm)">搜索</el-button>
          <el-button type="info" icon="el-icon-document-delete" @click="reset">清空</el-button>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div class="row-col">
          <el-button type="primary" @click="addBtn">添加员工</el-button>
          <el-button v-if="authCheck('/memberList')" type="warning" :disabled="disabled" @click="editBtn">编辑</el-button>
          <el-button v-if="authCheck('/memberList')" type="danger" :disabled="disabled" @click="changeStatus">更换状态</el-button>
          <!-- <el-button @click="departmentDialog=true" class="el-button--danger-more"  >部门管理</el-button> -->
        </div>
      </el-col>
    </el-row>

    <Dtable :table-data="tableData" :loading="loading" @handleCurrent="handleCurrent" />
    <pagination
      :total="total"
      @pagination="handleCurrentChange"
      @handleSizeChange="handleSizeChange"
    />
    <addEdit
      :add-edit-visb="addEditVisb"
      :add-edit-form.sync="addEditForms"
      :add-edit-title="addEditTitle"
      :roles.sync="role"
      :department-ids.sync="departmentId"
      @addEditCancel="addEditCancel"
    />
  </div>
</template>
<script>
import moment from 'moment';
import { statusGlobalData } from '@/filters';
const Dtable = () => import('./components/table');
const addEdit = () => import('./components/addEdit');
export default {
  components: {
    Dtable,
    addEdit
  },
  data() {
    return {
      queryForm: {
        size: 10,
        current: 1,
        type: '',
        level: '',
        entryTime: ''
      },
      eRole: [],
      tableData: [],
      currentRow: null,
      loading: false,
      total: 0,
      // addEditDialog
      addEditForms: {},
      addEditVisb: false,
      addEditTitle: '',
      level: '',
      addEditFormsRef: {},
      pickerOptions: {
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date());
          }
        }, {
          text: '昨天',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24);
            picker.$emit('pick', date);
          }
        }, {
          text: '一周前',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', date);
          }
        }]
      },
      disabled: true,
      QuillValue: '',
      picture: [],
      statusGlobalData,
      departmentId: '',
      role: ''

    };
  },
  watch: {
    disabled() {

    }
  },
  created() {
    this.queryMember();
    this.eRole = this.statusGlobalData.role;
  },
  methods: {
    queryMember(queryForm) {
      if (queryForm) {
        this.queryForm.size = 10;
        this.queryForm.current = 1;
        this.queryForm = queryForm;
      }
      this.$http
        .get('/member/getMemberList', {
          params: {
            ...this.queryForm,
            descs: 'm.create_time',
          }
        })
        .then(data => {
          this.loading = false;
          this.tableData = data.records;
          this.total = data.total;
          this.disabled = true;
          this.tableData.map(item => {
            item.picture = item.picture ? item.picture : [];
          });
        })
        .catch(err => {
          console.error(err);
        });
      this.disabled = true;
    },
    addBtn() {
      this.addEditTitle = '添加员工';
      this.addEditVisb = true;
    },
    editBtn() {
      if (!this.currentRow) {
        return this.$message.warning('请先选择一行数据');
      }
      this.addEditTitle = '修改员工';
      this.addEditForms = this.currentRow;
      this.addEditVisb = true;
      this.departmentId = this.currentRow.departmentName;
      this.role = this.currentRow.role;
    },
    cancelBtn() {
      if (!this.currentRow) {
        return this.$message.warning('请先选择一行数据');
      }
      this.$confirm('确定取消该员工吗？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        this.$http.get('/member/adminCancelMember', {
          params: {
            id: this.currentRow.id
          }
        });
      }).then(() => {
        this.$message.success('操作成功');
        this.queryMember();
      });
    },
    addEditCancel(val) {
      this.addEditVisb = val;
      this.queryMember();
    },
    orderDetail() {
      if (!this.currentRow) {
        return this.$message.warning('请先选择一行数据');
      }
    },
    changeStatus() {
      if (!this.currentRow) {
        return this.$message.warning('请选择一行数据进行操作!');
      }
      let ShowLang = '';
      if (this.currentRow.status === 'STAFF') {
        ShowLang = '禁用';
      } else if (this.currentRow.status === 'DIMISSION') {
        ShowLang = '解锁';
      }
      this.$confirm('确定' + ShowLang + '该员工吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          try {
            if (ShowLang === '禁用') {
              await this.$http.post(`/member/updateMember`, {
                id: this.currentRow.id,
                status: 'DIMISSION'
              });
            } else if (ShowLang === '解锁') {
              console.log('FORBIDDEN');
              await this.$http.post(`/member/updateMember`, {
                id: this.currentRow.id,
                status: 'STAFF'
              });
            }
            this.$message.success('操作成功');
            this.queryMember();
          } catch (e) {
            window.console.log(e);
          }
        })
        .catch(() => {
          this.$message.info('操作取消');
        });
    },
    // 重置
    reset() {
      this.queryForm = {};
      this.queryMember();
    },
    // 选择数据行
    handleCurrent(val) {
      this.currentRow = val;
      this.disabled = false;
    },
    // handleCurrentChange(val) {
    //   this.queryForm.current = val;
    //   this.queryMember();
    // },
    // handleSizeChange(val) {
    //   this.queryForm.size = val;
    //   this.queryMember();
    // },
    // 分页事件
    handleCurrentChange({ page: current, limit: size }) {
      this.queryForm.current = current;
      this.query();
    },
    handleSizeChange({ page: current, limit: size }) {
      this.queryForm.size = size;
      this.query();
    },
    dateFormate(dateVal, pattern = 'YYYY-MM-DD') {
      return moment(dateVal).format(pattern);
    },
  }
};
</script>
<style lang="less">
</style>
