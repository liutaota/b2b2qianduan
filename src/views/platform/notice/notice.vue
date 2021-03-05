<template>
  <div style="margin: 0 10px">
    <!-- 筛选 -->
    <el-row>
      <el-col :span="24">
        <div class="row-col" style="margin-top: 10px;font-size:12px" @keyup.enter="query()">
          <el-input
            v-model.trim.number="queryForm.content"
            placeholder="请输入公告"
            style="width:145px;margin-right: 10px"
            clearablex
            size="small"
            :loading="loading"
          />
          <el-button v-permission="'NoticeLook'" type="primary" @click="query()">查询</el-button>
          <el-button type="info" @click="queryForm={size: 50,current: 1,};query()">重置</el-button>
        </div>
      </el-col>
    </el-row>
    <div style="margin-top:10px">
      <el-button v-permission="'NoticeAdd'" type="primary" style="margin-right: 10px" @click="isShowAdd">新增</el-button>
      <el-button v-permission="'NoticeEdit'" type="primary" style="margin-right: 10px" @click="isShowEdit">编辑</el-button>
      <el-button v-permission="'NoticeDel'" type="danger" style="margin-right: 20px" @click="handleDel">删除</el-button>
      <TableMove
        v-permission="'NoticeTopping'"
        style="display: inline-block;"
        :query-url="queryUrl"
        :query-form="queryForm"
        :table-data="noticeList"
        :row="currentRow"
        :total="1"
        @handleTopping="handleTopping"
        @handleSetTheBottom="handleSetTheBottom"
        @handleMoveUp="handleMoveUp"
        @handleMoveDown="handleMoveDown"
      />
    </div>
    <!-- 公告列表 -->
    <Tabel ref="singleTable" :table-data="noticeList" :columns="columns" :loading="loading" :page-index="queryForm" @handleCurrent="handleCurrent">
      <el-table-column slot="handleColumn" label="是否启用">
        <template slot-scope="scope">
          <el-switch
            v-model.trim="scope.row.isUse"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-value="ON"
            inactive-value="OFF"
            @change="handleSwith(scope.row)"
          />
        </template>
      </el-table-column>
    </Tabel>
    <Pagination :total="total" @pagination="totalPagination" @handleSizeChange="handleSizeChange" />
    <AddEdit :dialog-form-visible="addMask" title="新增" :form="currentRow" @onSubmit="handleNoticeAdd" @cancel="cancel" />
    <AddEdit :dialog-form-visible="EditMask" :title="&quot;编辑&quot;" :form="currentRow" @onSubmit="handleNoticeEdit" @cancel="cancel" />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination';
import Tabel from '@/components/Table';
import TableMove from '@/components/TableMove';
import AddEdit from './components/noticeAddEdit';
export default {
  name: 'Notice',
  components: {
    Tabel, Pagination, AddEdit, TableMove
  },
  data() {
    return {
      loading: true,
      addMask: false,
      EditMask: false,
      rowIndex: null,
      // 搜索数据
      queryForm: {
        size: 50,
        current: 1,
      },
      // 公告表格
      columns: [
        {
          prop: 'content',
          label: '公告',
        },
        {
          prop: 'adminName',
          label: '添加人',
        },
        {
          prop: 'addTime',
          label: '发布日期',
        },
        {
          prop: 'startTime',
          label: '开始时间',
        },
        {
          prop: 'endTime',
          label: '结束时间',
        },
      ],
      noticeList: [],
      // 页码
      total: 1,
      currentRow: {},
      queryUrl: 'webPage/getNoticeList'
    };
  },
  watch: {
    queryForm: {
      handler: function(val) {
        if (val.content === '') {
          this.query();
        }
      },
      deep: true
    }
  },
  created() {
    this.query();
  },
  methods: {
    query() {
      this.loading = true;
      this.$http.get('webPage/getAdminNoticeList', {
        params: {
          ...this.queryForm
        }
      }).then(res => {
        this.noticeList = res.records;
        this.total = res.total;
      }).finally(() => {
        this.loading = false;
      });
    },
    // 筛选
    handleSearch() {
      this.queryForm.size = 20;
      this.queryForm.current = 1;
      if (this.search === '') {
        this.queryForm.goodssetname = '';
      }
      this.query();
    },
    // 打开新增
    isShowAdd() {
      this.currentRow = {};
      this.addMask = true;
    },
    // 公告添加
    handleNoticeAdd(val) {
      this.$http.post('webPage/addNotice', { ...val }).then(_ => {
        this.$message({
          message: '添加成功',
          type: 'success'
        });
        this.cancel();
        this.query();
        this.currentRow = {};
      });
    },
    // 打开编辑
    isShowEdit() {
      if (this.judge()) return;
      this.EditMask = true;
    },
    // 公告编辑
    handleNoticeEdit(val) {
      this.$http.post('webPage/updateNotice', { ...val, id: this.currentRow.id }).then(_ => {
        this.$message({
          message: '编辑成功',
          type: 'success'
        });
        this.cancel();
        this.query();
        this.currentRow = {};
      });
    },
    // 删除
    handleDel() {
      if (this.judge()) return;
      // 判断是否删除文件
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.get('webPage/noticeIsDel', { params: { id: this.currentRow.id }}).then(_ => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.query();
          this.currentRow = {};
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    // 选中行事件
    handleCurrent(row) {
      this.currentRow = { ...row };
      // 获取下标
      const index = this.noticeList.findIndex(item => {
        return row.id === item.id;
      });
      this.rowIndex = index;
    },
    // 取消弹窗
    cancel() {
      this.addMask = false;
      this.EditMask = false;
      this.currentRow = {};
    },
    // 更改状态
    handleSwith(row) {
      const { id, isUse } = row;
      this.$http.get('webPage/updateNoticeIsUse', { params: { id, isUse }}).then(_ => {
        if (row.isUse === 'ON') {
          this.$message({
            message: '开启成功',
            type: 'success'
          });
        } else if (row.isUse === 'OFF') {
          this.$message({
            message: '关闭成功',
            type: 'success'
          });
        }
        this.query();
      });
    },
    // 置顶
    handleTopping(val) {
      this.$http.get('webPage/updateNoticeSort', { params: { ...val }}).then(res => {
        this.query();
      });
    },
    // 置底
    handleSetTheBottom(val) {
      this.$http.get('webPage/updateNoticeSort', { params: { ...val }}).then(res => {
        this.query();
      });
    },
    // 上移
    handleMoveUp(val, boolean) {
      const { nextId: noticeIdNext, prevId: noticeIdPrev } = val;
      const index = this.rowIndex;
      this.$http.get('webPage/noticeSort', { params: { noticeIdNext, noticeIdPrev }}).then(_ => {
        if (boolean) {
          this.query();
        } else {
          const arrList = this.currentRow;
          this.$set(this.noticeList, index, this.noticeList[index - 1]);
          this.$set(this.noticeList, index - 1, arrList);
          const rowIndex = this.noticeList.findIndex(item => {
            return arrList.id === item.id;
          });
          this.rowIndex = rowIndex;
          // 获取到子组件中方法并选中行
          this.$refs['singleTable'].$refs.singleTable.setCurrentRow(this.noticeList[rowIndex]);
        }
      });
    },
    // 下移
    handleMoveDown(val, boolean) {
      const { nextId: noticeIdNext, prevId: noticeIdPrev } = val;
      const index = this.rowIndex;
      this.$http.get('webPage/noticeSort', { params: { noticeIdNext, noticeIdPrev }}).then(_ => {
        if (boolean) {
          this.query();
        } else {
          const arrList = this.currentRow;
          this.$set(this.noticeList, index, this.noticeList[index + 1]);
          this.$set(this.noticeList, index + 1, arrList);
          const rowIndex = this.noticeList.findIndex(item => {
            return arrList.id === item.id;
          });
          this.rowIndex = rowIndex;
          // 获取到子组件中方法并选中行
          this.$refs['singleTable'].$refs.singleTable.setCurrentRow(this.noticeList[rowIndex]);
        }
      });
    },
    // 判断表格是否选中
    judge() {
      if (JSON.stringify(this.currentRow) === '{}') {
        this.$message({
          type: 'info',
          message: '未选择对应的订单'
        });
        return true;
      }
      return false;
    },
    // 分页事件
    totalPagination({ page: current, limit: size }) {
      this.queryForm.current = current;
      this.query();
    },
    handleSizeChange({ page: current, limit: size }) {
      this.queryForm.size = size;
      this.query();
    },
  }
};
</script>

<style>
.el-scrollbar__view{
  height: 150px;
}
</style>
