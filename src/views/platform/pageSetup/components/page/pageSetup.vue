<template>
  <div style="margin:0 10px">
    <!-- 筛选 -->
    <el-row>
      <el-col :span="24">
        <div class="row-col" style="margin-top: 10px;font-size:12px" @keyup.enter="query()">
          <el-input
            v-model.trim="queryForm.title"
            placeholder="请输入页面名称"
            style="width:145px;margin-right: 10px"
            clearablex
            size="small"
          />
          <el-button
            v-permission="'PageSetupWebLook'"
            type="primary"
            icon="el-icon-search"
            @click="query"
          >查询</el-button>
        </div>
      </el-col>
    </el-row>
    <div style="margin-top: 10px">
      <el-button v-permission="'PageSetupWebAdd'" style="margin-right:20px" type="primary" @click="$router.push({path: 'page'});$store.dispatch('addPage', { page: {} });">新增页面</el-button>
      <TableMove
        v-permission="'PageSetupWebTopping'"
        style="display: inline-block;"
        :query-url="queryUrl"
        :query-form="queryForm"
        :table-data="pageData"
        :row="currentRow"
        :total="total"
        @handleTopping="handleTopping"
        @handleSetTheBottom="handleSetTheBottom"
        @handleMoveUp="handleMoveUp"
        @handleMoveDown="handleMoveDown"
      />
    </div>
    <!-- 表单 -->
    <Tabel ref="singleTable" :columns="columns" :table-data="pageData" :loading="loading" :page-index="queryForm" @handleCurrent="handleCurrent">
      <el-table-column slot="handleState" label="状态" width="190" fixed="right">
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
      <el-table-column slot="handleColumn" label="操作" fixed="right">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="updataPage(scope.row)"
          >修改页面</el-button>
          <el-button
            v-if="scope.row.id !== prohibit && scope.row.id !== integralProhibit"
            size="mini"
            type="danger"
            @click.stop="handleDel(scope.row)"
          >删除页面</el-button>
        </template>
      </el-table-column></Tabel>
    <Pagination :total="total" @pagination="pagination" @handleSizeChange="handleSizeChange" />
  </div>
</template>

<script>
import { CONST_IDS } from '@/config';
import { _throttle } from '@/utils/public';
import TableMove from '@/components/TableMove';
// import Pagination from '@/components/Pagination';
import Tabel from '@/components/Table';
// const Tabel = () => import('@/components/Tabel');
// const TableMove = () => import('@/components/TableMove');
const Pagination = () => import('@/components/Pagination');
export default {
  name: 'PageSetup',
  components: {
    Pagination, Tabel, TableMove
  },
  data() {
    return {
      loading: true,
      total: 0,
      queryForm: {
        size: 50,
        current: 1
      },
      columns: [
        {
          prop: 'title',
          label: '页面名称',
        },
        {
          prop: 'remark',
          label: '备注',
        },
      ],
      pageData: [],
      queryUrl: 'webPage/getWebPageList',
      currentRow: {},
      prohibit: null,
      integralProhibit: null,
    };
  },
  watch: {
    queryForm: {
      handler(val) {
        if (val.title === '') {
          this.query();
        }
      },
      deep: true
    }
  },
  created() {
    this.query();
    this.prohibit = CONST_IDS.PAGE_ID_INDEX;
    this.integralProhibit = CONST_IDS.PAGE_ID_JIFEN;
  },
  methods: {
    query() {
      this.loading = true;
      this.$http.get('webPage/getWebPageList', { params: { ...this.queryForm }}).then(res => {
        this.pageData = res.records;
        this.total = res.total;
      }).finally(() => {
        this.loading = false;
      });
    },
    // 修改
    updataPage: _throttle(function(row) {
      this.$store.dispatch('addPage', { page: row });
      this.$router.push({ path: 'page?id=' + row.id });
    }),
    // 状态修改
    handleSwith(row) {
      const { id, isUse } = row;
      this.$http.get('webPage/updateWebPageIsUse', { params: { id, isUse }}).then(res => {
        this.query();
      });
    },
    // 删除
    handleDel: _throttle(function(row) {
      this.$confirm('确认删除？').then(_ => {
        this.$http.get('webPage/updateWebPageIsDel', { params: { id: row.id }}).then(res => {
          this.$message({
            type: 'success',
            message: '删除成功'
          });
          this.query();
        });
      }).catch(_ => {
        return;
      });
    }, 200),
    // 分页
    pagination({ page: current, limit: size }) {
      this.queryForm.current = current;
      this.query();
    },
    handleSizeChange({ page: current, limit: size }) {
      this.queryForm.size = size;
      this.query();
    },
    // 置顶
    handleTopping(val) {
      this.$http.get('webPage/updateWebPageSort', { params: { ...val }}).then(res => {
        this.query();
      });
    },
    // 置底
    handleSetTheBottom(val) {
      if (this.currentRow.id === CONST_IDS.PAGE_ID_INDEX) {
        this.$message({
          message: '首页无法移动',
          type: 'warning'
        });
        return;
      }
      this.$http.get('webPage/updateWebPageSort', { params: { ...val }}).then(res => {
        this.query();
      });
    },
    // 上移
    handleMoveUp(val, boolean) {
      const { nextId: webPageIdNext, prevId: webPageIdPrev } = val;
      const index = this.rowIndex;
      if (index - 1 === 0) {
        this.$message({
          message: '无法移入首页位置',
          type: 'warning'
        });
        return;
      }
      this.$http.get('webPage/webPageSort', { params: { webPageIdNext, webPageIdPrev }}).then(_ => {
        if (boolean) {
          this.query();
        } else {
          const arrList = this.currentRow;
          this.$set(this.pageData, index, this.pageData[index - 1]);
          this.$set(this.pageData, index - 1, arrList);
          const rowIndex = this.pageData.findIndex(item => {
            return arrList.id === item.id;
          });
          this.rowIndex = rowIndex;
          // 获取到子组件中方法并选中行
          this.$refs['singleTable'].$refs.singleTable.setCurrentRow(this.pageData[rowIndex]);
        }
      });
    },
    // 下移
    handleMoveDown(val, boolean) {
      const { nextId: webPageIdNext, prevId: webPageIdPrev } = val;
      const index = this.rowIndex;
      if (this.currentRow.id === CONST_IDS.PAGE_ID_INDEX) {
        this.$message({
          message: '首页无法移动',
          type: 'warning'
        });
        return;
      }
      this.$http.get('webPage/webPageSort', { params: { webPageIdNext, webPageIdPrev }}).then(_ => {
        if (boolean) {
          this.query();
        } else {
          const arrList = this.currentRow;
          this.$set(this.pageData, index, this.pageData[index + 1]);
          this.$set(this.pageData, index + 1, arrList);
          const rowIndex = this.pageData.findIndex(item => {
            return arrList.id === item.id;
          });
          this.rowIndex = rowIndex;
          // 获取到子组件中方法并选中行
          this.$refs['singleTable'].$refs.singleTable.setCurrentRow(this.pageData[rowIndex]);
        }
      });
    },
    // 选中行事件
    handleCurrent(val) {
      // 获取下标
      const index = this.pageData.findIndex(item => {
        return val.id === item.id;
      });
      this.rowIndex = index;
      this.currentRow = { ...val };
    },
  }
};
</script>

<style>
</style>
