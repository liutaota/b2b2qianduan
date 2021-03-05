<template>
  <div style="margin: 0 10px">
    <div>
      <el-button
        v-permission="'ReturnAdmReasonAdd'"
        type="primary"
        size="mini"
        @click="Add = true"
      >新增</el-button>
    </div>
    <!-- 订单列表显示 -->
    <Tabel :columns="columns" :table-data="reasonList" :loading="loading">
      <el-table-column slot="handleColumn" label="操作" fixed="right">
        <template slot-scope="scope">
          <el-button
            v-permission="'ReturnAdmReasonEdit'"
            size="mini"
            type="primary"
            class="el-icon-edit"
            @click="handleEdit(scope.row)"
          >编辑</el-button>
          <el-button
            v-permission="'ReturnAdmReasonDel'"
            size="mini"
            class="el-icon-delete"
            type="danger"
            @click="handleDelete(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </Tabel>
    <ReasonEdit :dialog-visible="Edit" :form="reasonRow" @handleEdit="handleEditData" @handleCancel="handleCancel" />
    <ReasonEdit :dialog-visible="Add" :form="queryForm" @handleEdit="handleAdd" @handleCancel="handleCancel" />
  </div>
</template>

<script>
import Tabel from '@/components/Table';
import ReasonEdit from './reasonEdit';
import { _throttle } from '@/utils/public';
export default {
  components: {
    Tabel,
    ReasonEdit
  },
  data() {
    return {
      // 退货原因表格
      columns: [
        {
          prop: 'reasonInfo',
          label: '退货原因',
        },
         {
          prop: 'erpReasonId',
          label: 'ERPid',
        },
        {
          prop: 'sort',
          label: '排序',
          sortable: true
        },
      ],
      queryForm: {},
      reasonRow: {},
      reasonList: [],
      loading: false,
      isArction: 2,
      Edit: false,
      Add: false,
      isclick: true
    };
  },
  mounted() {
    this.query();
  },
  methods: {
    // 退货订单请求数据
    query: _throttle(function() {
      this.loading = true;
      this.$http.get('order/getReasonList').then(res => {
        this.reasonList = res;
      }).finally(() => {
        this.loading = false;
      });
    }, 1000),
    // 新增
    handleAdd: _throttle(function(val) {
      this.$http.post('order/addReason', { ...val }).then(res => {
        this.$message({
          message: '添加成功',
          type: 'success'
        });
        this.Add = false;
        this.queryForm = {};
        this.query();
      });
    }, 1000),
    // 删除
    handleDelete(val) {
      this.$confirm('此操作将永久删除该订单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.get('order/updateReasonIsDel', { params: { id: val.id }}).then(res => {
          this.$message({
            message: '删除成功',
            type: 'success'
          });
          this.query();
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    // 编辑
    handleEdit(val) {
      this.reasonRow = { ...val };
      this.Edit = true;
    },
    // 提交编辑数据
    handleEditData: _throttle(function(val) {
      delete val.createTime;
      delete val.updateTime;
      this.$http.post('order/updateReason', { ...val }).then(res => {
        this.$message({
          message: '编辑成功',
          type: 'success'
        });
        this.reasonRow = {};
        this.Edit = false;
        this.query();
      });
    }, 1000),
    // 取消编辑
    handleCancel() {
      this.Edit = false;
      this.Add = false;
      this.reasonRow = {};
      this.queryForm = {};
    }
  }
};
</script>

<style scoped lang="less">
   .orderBtn{
    float: right;
    margin:0 10px 10px;
  }
  .tabs{
    margin-top: 15px;
    font-size: 14px;
    padding: 0px 10px;
    padding-left: 0;
    border-bottom: 1px solid #EEF0F4;
    position: relative;
    .tabTitle {
      display: inline-block;
      padding: 10px;
      border: 1px solid #EEF0F4;
      border-right: none;
      z-index: 12;
      margin-bottom: -1px;
      background: #F3F6F9;
      cursor: pointer;
    }
    .border-right{
      border: 1px solid #EEF0F4;
    }
    .Select{
      border-bottom: 1px solid #fff;
      color: #3894FF;
      background: #fff;
    }
  .search{
    display: inline-block;
    position: absolute;
    right: 0;
  }
  .search-wrap{
    position: relative;
  }
  .el-table{
    margin: 0 !important;;
  }
}
</style>
