<template>
  <div>
    <div style="margin:10px 0">
      <el-button
        size="mini"
        type="primary"
        style="margin-right: 10px"
        v-permission="'HelpGuideTypeAdd'"
        @click="addMask = true"
      >新增类型</el-button>
      <TableMove
        style="display: inline-block;"
        v-permission="'HelpGuideTypeTopping'"
        :query-url="queryUrl"
        :query-form="queryForm"
        :table-data="helpType"
        :row="currentRow"
        :total="1"
        @handleTopping="handleTopping"
        @handleSetTheBottom="handleSetTheBottom"
        @handleMoveUp="handleMoveUp"
        @handleMoveDown="handleMoveDown"
      />
    </div>
    <Tabel ref="singleTable" :columns="columns" :table-data="helpType" :loading="loading" :page-index="queryForm" @handleCurrent="handleCurrent">
      <el-table-column slot="handleState" label="是否显示">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.helpShow"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-value="ON"
            inactive-value="OFF"
            @change="handleSwith(scope.row)"
          /></template>
      </el-table-column>
      <el-table-column slot="handleColumn" label="操作" fixed="right">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="updataHelp(scope.row)"
            v-permission="'HelpGuideTypeEdit'"
          >编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            v-permission="'HelpGuideTypeDel'"
            @click="handleDel(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </Tabel>
    <!-- 新增 -->
    <HelpEdit v-if="addMask" :dialog-form-visible="addMask" :form="current" @onSubmit="handleAdd" @cancel="cancel" />
    <!-- 编辑 -->
    <HelpEdit v-if="editMask" :dialog-form-visible="editMask" :title="'编辑'" :form="current" @onSubmit="handleEdit" @cancel="cancel" />
  </div>
</template>

<script>
import { _throttle } from '@/utils/public';
import Tabel from '@/components/Table';
import TableMove from '@/components/TableMove';
import HelpEdit from './helpTypeEdit';
export default {
  components: {
    Tabel, HelpEdit, TableMove
  },
  data() {
    return {
      queryForm: {
        size: 100,
        current: 1,
      },
      form: {
        typeName: '',
        helpSort: null
      },
      columns: [
        {
          prop: 'typeName',
          label: '类型名称',
        },
      ],
      helpType: [],
      loading: false,
      current: {},
      addMask: false,
      editMask: false,
      queryUrl: 'advPosition/getHelpTypeList',
      currentRow: {}
    };
  },
  created() {
    this.query();
  },
  methods: {
    query() {
      this.$http.get('advPosition/getHelpTypeList').then(res => {
        this.helpType = res;
      });
    },
    // 新增
    handleAdd: _throttle(function(e) {
      this.$http.post('advPosition/addHelpType', { ...e }).then(res => {
        this.addMask = false;
        this.$message({
          message: '添加成功',
          type: 'success'
        });
        this.current = {};
        this.query();
      });
    }),
    // 打开编辑
    updataHelp: _throttle(function(row) {
      this.current = { ...row };
      this.editMask = true;
    }),
    // 编辑
    handleEdit: _throttle(function(e) {
      console.log(e);
      this.$http.post('advPosition/updateHelpType', { ...e }).then(res => {
        this.editMask = false;
        this.$message({
          message: '编辑成功',
          type: 'success'
        });
        this.current = {};
        this.query();
      });
    }),
    // 删除
    handleDel: _throttle(function(row) {
    // 判断是否删除文件
      this.$confirm('确认删除？').then(() => {
        this.$http.get('advPosition/updateHelpTypeIsDel', { params: { id: row.id }}).then(res => {
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
    }),
    // 置顶
    handleTopping(val) {
      this.$http.get('advPosition/updateHelpTypeSort', { params: { ...val }}).then(res => {
        this.query();
      });
      if (this.queryForm.current !== 1) return;
    },
    // 置底
    handleSetTheBottom(val) {
      this.$http.get('advPosition/updateHelpTypeSort', { params: { ...val }}).then(res => {
        this.query();
      });
    },
    // 上移
    handleMoveUp(val, boolean) {
      const { nextId: helpTypeIdNext, prevId: helpTypeIdPrev } = val;
      const index = this.rowIndex;
      this.$http.get('advPosition/helpTypeSort', { params: { helpTypeIdNext, helpTypeIdPrev }}).then(_ => {
        if (boolean) {
          this.query();
        } else {
          const arrList = this.currentRow;
          this.$set(this.helpType, index, this.helpType[index - 1]);
          this.$set(this.helpType, index - 1, arrList);
          const rowIndex = this.helpType.findIndex(item => {
            return arrList.id === item.id;
          });
          this.rowIndex = rowIndex;
          // 获取到子组件中方法并选中行
          this.$refs['singleTable'].$refs.singleTable.setCurrentRow(this.helpType[rowIndex]);
        }
      });
    },
    // 下移
    handleMoveDown(val, boolean) {
      const { nextId: helpTypeIdNext, prevId: helpTypeIdPrev } = val;
      const index = this.rowIndex;
      this.$http.get('advPosition/helpTypeSort', { params: { helpTypeIdNext, helpTypeIdPrev }}).then(_ => {
        if (boolean) {
          this.query();
        } else {
          const arrList = this.currentRow;
          this.$set(this.helpType, index, this.helpType[index + 1]);
          this.$set(this.helpType, index + 1, arrList);
          const rowIndex = this.helpType.findIndex(item => {
            return arrList.id === item.id;
          });
          this.rowIndex = rowIndex;
          // 获取到子组件中方法并选中行
          this.$refs['singleTable'].$refs.singleTable.setCurrentRow(this.helpType[rowIndex]);
        }
      });
    },
    // 选中行事件
    handleCurrent(val) {
      this.currentRow = { ...val };
      // 获取下标
      const index = this.helpType.findIndex(item => {
        return val.id === item.id;
      });
      this.rowIndex = index;
    },
    // 是否显示
    handleSwith: _throttle(function(e) {
      const { id, helpShow } = e;
      this.$http.get('advPosition/updateHelpTypeShow', { params: { id, helpShow }}).then(res => {
        this.$message({
          message: '开启成功',
          type: 'success'
        });
        this.query();
      });
    }),
    // 编辑取消
    cancel() {
      this.addMask = false;
      this.editMask = false;
      this.current = {};
    },
  }
};
</script>

<style scoped>
</style>
