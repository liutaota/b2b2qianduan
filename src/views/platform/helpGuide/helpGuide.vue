<template>
  <div style="margin: 0 10px">
    <div class="tabs">
      <div class="search-wrap">
        <span 
        class="tabTitle" 
        :class="isArction ===1?'Select':''" 
        v-permission="'HelpGuideList'"
        @click="isArction = 1">帮助指南</span>
        <span
          class="tabTitle border-right"
          :class="isArction ===2?'Select':''"
          v-permission="'HelpGuideType'"
          @click="isArction = 2"
        >帮助类型</span>
        <!-- 筛选 -->
      </div>
    </div>
    <!-- 帮助指南 -->
    <div v-show="isArction === 1" v-permission="'HelpGuideList'">
      <div style="margin:10px 0">
        <el-button v-permission="'HelpGuideAdd'" style="margin-right: 10px" size="mini" type="primary" @click="addMask = true">新增指南</el-button>
        <TableMove
          v-permission="'HelpGuideTopping'"
          style="display: inline-block;"
          :query-url="queryUrl"
          :query-form="queryForm"
          :table-data="helpData"
          :row="currentRow"
          :total="total"
          @handleTopping="handleTopping"
          @handleSetTheBottom="handleSetTheBottom"
          @handleMoveUp="handleMoveUp"
          @handleMoveDown="handleMoveDown"
        />
      </div>
      <!-- 帮助指南表格 -->
      <Tabel ref="singleTable" :columns="columns" :table-data="helpData" :loading="loading" :page-index="queryForm" @handleCurrent="handleCurrent">
        <el-table-column slot="handleState" label="是否显示">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.helpShow"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-value="ON"
              inactive-value="OFF"
              :disabled="scope.row.id === CONST_IDS.HELPGUIDE_XIEYI"
              @change="handleSwith(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column slot="handleColumn" label="操作" width="190" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" v-permission="'HelpGuideEdit'" @click="updataHelp(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" v-permission="'HelpGuideDel'" @click="handleDel(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </Tabel>
      <!-- 新增 -->
      <HelpEdit
        v-if="addMask"
        :dialog-form-visible="addMask"
        :form="current"
        @onSubmit="handleAdd"
        @cancel="cancel"
      />
      <!-- 编辑 -->
      <HelpEdit
        v-if="editMask"
        :dialog-form-visible="editMask"
        :form="current"
        :title="'编辑'"
        @onSubmit="handleEdit"
        @cancel="cancel"
      />
    </div>
    <!-- 帮助类型 -->
    <div v-show="isArction === 2" style="margin:10px 0" v-permission="'HelpGuideType'">
      <keep-alive>
        <HelpType v-if="isArction === 2" />
      </keep-alive>
    </div>
  </div>
</template>

<script>
import { _throttle } from '@/utils/public';
import { CONST_IDS } from '@/config';
import Tabel from '@/components/Table';
import TableMove from '@/components/TableMove';
import HelpEdit from './components/helpEdit';
import HelpType from './components/helpType';
export default {
  name: 'HelpGuide',
  components: {
    Tabel,
    HelpEdit,
    HelpType,
    TableMove
  },
  data() {
    return {
      CONST_IDS,
      queryForm: {
        size: 100,
        current: 1,
      },
      isArction: 1,
      loading: true,
      total: 1,
      helpData: [],
      columns: [
        {
          prop: 'helpTitle',
          label: '标题',
          width: 180,
        },
        {
          prop: 'help_info',
          label: '帮助内容',
          width: 180,
        },
        {
          prop: 'type',
          label: '帮助类型',
          width: 180,
        },
        {
          prop: 'helpUrl',
          label: '跳转链接',
          width: 180,
        },
        {
          prop: 'createTime',
          label: '更新时间',
          width: 180,
        },
      ],
      addMask: false,
      editMask: false,
      helpType: [],
      current: {},
      currentRow: {},
      queryUrl: 'advPosition/getHelpList',
      rowIndex: null,
    };
  },
  created() {
    this.query();
  },
  methods: {
    query() {
      this.loading = true;
      this.$http
        .get('advPosition/getHelpList')
        .then((res) => {
          return res;
        })
        .then((res) => {
         
          // 获取帮助类型
          this.$http.get('advPosition/getHelpTypeList').then((result) => {
            res.map((item) => {
              item.type = this.setStaet(item.typeId, result);
              item.help_info = this.removeHTMLTag(item.helpInfo);
            });
            this.helpData = res;
          });
        })
        .finally(() => {
          this.loading = false;
        });
    },
    // 去除富文本html标签
    removeHTMLTag(str) {
      str = str.replace(/<\/?[^>]*>/g, ''); // 去除HTML tag
      str = str.replace(/[ | ]*\n/g, '\n'); // 去除行尾空白
      // str = str.replace(/\n[\s| | ]*\r/g,'\n'); //去除多余空行
      str = str.replace(/ /gi, ''); // 去掉
      var arrEntities = { lt: '<', gt: '>', nbsp: ' ', amp: '&', quot: '"' };
      return str.replace(/&(lt|gt|nbsp|amp|quot);/gi, function (all, t) {
        return arrEntities[t];
      });
    },
    // 更新状态
    setStaet(item, stateArr) {
      let state = null;
      stateArr.forEach((e) => {
        if (item === e.id) {
          state = e.typeName;
          return;
        }
      });
      return state;
    },
    // 打开编辑
    updataHelp: _throttle(function(row) {
      this.current = { ...row };
      this.editMask = true;
    }),
    // 新增
    handleAdd: _throttle(function(e) {
      this.$http.post('advPosition/addHelp', { ...e }).then((res) => {
        this.addMask = false;
        this.$message({
          message: '添加成功',
          type: 'success',
        });
        this.current = {};
        this.query();
      });
    }),
    // 编辑
    handleEdit: _throttle(function(e) {
      this.$http.post('advPosition/updateHelp', { ...e }).then((res) => {
        this.editMask = false;
        this.$message({
          message: '编辑成功',
          type: 'success',
        });
        this.current = {};
        this.query();
      });
    }),
    // 删除
    handleDel: _throttle(function(row) {
      // 判断是否删除文件
      this.$confirm('确认删除？').then(() => {
        this.$http
          .get('advPosition/updateHelpIsDel', { params: { id: row.id }})
          .then((res) => {
            this.$message({
              message: '删除成功',
              type: 'success',
            });
            this.query();
          });
      })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          });
        });
    }),
    // 置顶
    handleTopping(val) {
      this.$http.get('advPosition/updateHelpSort', { params: { ...val }}).then(res => {
        this.query();
      });
      if (this.queryForm.current !== 1) return;
    },
    // 置底
    handleSetTheBottom(val) {
      this.$http.get('advPosition/updateHelpSort', { params: { ...val }}).then(res => {
        this.query();
      });
    },
    // 上移
    handleMoveUp(val, boolean) {
      const { nextId: helpIdNext, prevId: helpIdPrev } = val;
      const index = this.rowIndex;
      this.$http.get('advPosition/helpSort', { params: { helpIdNext, helpIdPrev }}).then(_ => {
        if (boolean) {
          this.query();
        } else {
          const arrList = this.currentRow;
          this.$set(this.helpData, index, this.helpData[index - 1]);
          this.$set(this.helpData, index - 1, arrList);
          const rowIndex = this.helpData.findIndex(item => {
            return arrList.id === item.id;
          });
          this.rowIndex = rowIndex;
          // 获取到子组件中方法并选中行
          this.$refs['singleTable'].$refs.singleTable.setCurrentRow(this.helpData[rowIndex]);
        }
      });
    },
    // 下移
    handleMoveDown(val, boolean) {
      const { nextId: helpIdNext, prevId: helpIdPrev } = val;
      const index = this.rowIndex;
      this.$http.get('advPosition/helpSort', { params: { helpIdNext, helpIdPrev }}).then(_ => {
        if (boolean) {
          this.query();
        } else {
          const arrList = this.currentRow;
          this.$set(this.helpData, index, this.helpData[index + 1]);
          this.$set(this.helpData, index + 1, arrList);
          const rowIndex = this.helpData.findIndex(item => {
            return arrList.id === item.id;
          });
          this.rowIndex = rowIndex;
          // 获取到子组件中方法并选中行
          this.$refs['singleTable'].$refs.singleTable.setCurrentRow(this.helpData[rowIndex]);
        }
      });
    },
    // 选中行事件
    handleCurrent(val) {
      this.currentRow = { ...val };
      // 获取下标
      const index = this.helpData.findIndex(item => {
        return val.id === item.id;
      });
      this.rowIndex = index;
    },
    // 是否显示
    handleSwith: _throttle(function(e) {
      const { id, helpShow } = e;
      this.$http
        .get('advPosition/updateHelpShow', { params: { id, helpShow }})
        .then((res) => {
          this.$message({
            message: '开启成功',
            type: 'success',
          });
        });
    }),
    // 编辑取消
    cancel() {
      this.addMask = false;
      this.editMask = false;
      this.current = {};
    },
  },
};
</script>

<style scoped lang="less">
.orderBtn {
  float: right;
  margin: 0 10px 10px;
}
// 头部切换
.tabs {
  margin-top: 15px;
  font-size: 14px;
  padding: 0px 10px;
  padding-left: 0;
  border-bottom: 1px solid #eef0f4;
  position: relative;
  .tabTitle {
    display: inline-block;
    padding: 10px;
    border: 1px solid #eef0f4;
    border-right: none;
    z-index: 12;
    margin-bottom: -1px;
    background: #f3f6f9;
    cursor: pointer;
  }
  .border-right {
    border: 1px solid #eef0f4;
  }
  .Select {
    border-bottom: 1px solid #fff;
    color: #3894ff;
    background: #fff;
  }
  .search {
    display: inline-block;
    position: absolute;
    right: 0;
  }
  .search-wrap {
    position: relative;
  }
  .el-table {
    margin: 0 !important;
  }
}
// 订单详细
ul {
  list-style: none;
  margin: 0;
  padding-left: 20px;
  li {
    line-height: 30px;
    span {
      display: inline-block;
      height: 100%;
      &:nth-child(2) {
        width: 400px;
      }
    }
  }
}
</style>
