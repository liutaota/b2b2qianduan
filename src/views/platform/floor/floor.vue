<template>
  <div style="margin: 10px" class="banned">
    <!-- 筛选 -->
    <Screen v-permission="'FloorLook'" @query="query" />
    <div class="goodsBtn" style="margin-right:10px">
      <el-button v-permission="'FloorAdd'" type="primary" @click="$router.push({ path: 'SINGLE_LINE' })">新增</el-button>
      <el-button v-permission="'FloorEdit'" :type="editBtn" @click="handleModify">编辑</el-button>
      <el-button v-permission="'FloorDel'" :type="delBtn" @click="handleDel">删除</el-button>
    </div>
    <TableMove
      v-permission="'FloorTopping'"
      :query-url="queryUrl"
      :query-form="queryForm"
      :table-data="floorList"
      :row="currentRow"
      :total="total"
      @handleTopping="handleTopping"
      @handleSetTheBottom="handleSetTheBottom"
      @handleMoveUp="handleMoveUp"
      @handleMoveDown="handleMoveDown"
    />
    <!-- 订单列表显示 -->
    <Tabel ref="singleTable" :columns="columns" :table-data="floorList" :loading="loading" :page-index="queryForm" @handleCurrent="handleCurrent">
      <el-table-column slot="handleColumn" label="状态" width="190" fixed="right">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.isUse"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-value="ON"
            inactive-value="OFF"
            @change="handleSwith(scope.row)"
          />
        </template>
      </el-table-column>
    </Tabel>
    <!-- 分页器 -->
    <pagination
      :total="total"
      @pagination="pagination"
      @handleSizeChange="handleSizeChange"
    />
  </div>
</template>

<script>
import { CONST_IDS } from '@/config';
import Pagination from '@/components/Pagination';
import Tabel from '@/components/Table';
import TableMove from '@/components/TableMove';
import Screen from './components/screen';
import { _throttle } from '@/utils/public';
export default {
  name: 'Floor',
  components: {
    Screen, Tabel, Pagination, TableMove
  },
  data() {
    return {
      queryForm: {
        size: 50,
        current: 1,
        apName: ''
      },
      floorList: [],
      total: 1,
      loading: true,
      // 选中数据行
      currentRow: {},
      columns: [
        {
          prop: 'title',
          label: '楼层名称',
          width: 200
        },
        {
          prop: 'floorKey',
          label: '楼层KEY',
          width: 180
        },
        {
          prop: 'typeName',
          label: '展示样式',
          width: 180
        },
        {
          prop: 'linkPage',
          label: '页面关联',
        },
        {
          prop: 'goodsNum',
          label: '商品数量',
          width: 140
        },
        {
          prop: 'remark',
          label: '备注',
        },
      ],
      queryUrl: 'advPosition/getFloorList',
      rowIndex: null,
      editBtn: 'warning',
      delBtn: 'danger'
    };
  },
  created() {
    this.query();
  },
  methods: {
    query(queryForm) {
      if (queryForm) {
        this.queryForm = queryForm;
      }
      this.loading = true;
      this.$http.get('advPosition/getFloorList', { params: { ...this.queryForm }}).then(res => {
        res.records.map(item => {
          if (item.linkPage !== null && item.linkPage.length !== 0) {
            item.linkPage = item.linkPage.join(',');
          }
          // 判断类型
          switch (item.type) {
            case 'ROLL_LINE':
              item.typeName = '单行样式';
              break;
            case 'SINGLE_LINE':
              item.typeName = '多行样式';
              break;
            case 'MULTI_LINE':
              item.typeName = '标签样式';
              break;
            case 'BG_IMAGE':
              item.typeName = '背景样式';
              break;
            case 'SUGGEST_GOODS':
              item.typeName = '商品推荐样式';
              break;
            default:
              break;
          }
        });
        this.total = res.total;
        this.floorList = res.records;
      }).finally(() => {
        this.loading = false;
      });
    },
    // 新增
    handleAdd: _throttle(function(e) {
      this.$http.post('advPosition/addAdvPosition', { ...e }).then(res => {
        this.$message({
          message: '提交成功',
          type: 'success'
        });
        this.query();
        this.addMask = false;
      });
    }),
    // 删除
    handleDel: _throttle(function() {
      if (this.delBtn === 'info') {
        this.$message({
          message: '无法修改',
          type: 'warning'
        });
        return;
      }
      // 是否选中广告位
      if (this.currentRow.id === undefined) {
        this.$message({
          message: '未选中对应的广告位',
          type: 'warning'
        });
        return;
      }
      if (this.currentRow.isUse === 'ON') {
        this.$message({
          message: '楼层正在启用，暂时无法删除，请先关闭再操作！',
          type: 'warning'
        });
        return;
      }
      // 判断是否删除文件
      this.$confirm('确认删除？').then(() => {
        const { id } = this.currentRow;
        this.$http.get('advPosition/updateFloorIsDel', { params: { id }}).then(res => {
          this.$message({
            type: 'success',
            message: '删除成功!'
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
    // 打开修改
    handleModify: _throttle(function() {
      if (this.editBtn === 'info') {
        this.$message({
          message: '无法修改',
          type: 'warning'
        });
        return;
      }
      if (this.currentRow.id === undefined) {
        this.$message({
          message: '未选中对应的广告位',
          type: 'warning'
        });
        return;
      }
      this.$router.push({ path: this.currentRow.type, query: { id: this.currentRow.id }});
    }),
    // 升序
    riseClassify: _throttle(function(index, el) {
      if (index === 0) return;
      const { id: prevId, floorSort: prevNum } = el[index - 1];
      const { id: nextId, floorSort: nextNum } = el[index];
      this.$http.get('advPosition/updateFloorSort', { params: { prevId, prevNum, nextId, nextNum }}).then(res => {
        const arrList = el[index];
        this.$set(el, index, el[index - 1]);
        this.$set(el, index - 1, arrList);
      });
    }),
    // 降序
    dropClassify: _throttle(function(index, el) {
      if (index === el.length - 1) return;
      const { id: prevId, floorSort: prevNum } = el[index + 1];
      const { id: nextId, floorSort: nextNum } = el[index];
      this.$http.get('advPosition/updateFloorSort', { params: { prevId, prevNum, nextId, nextNum }}).then(res => {
        const arrList = el[index];
        this.$set(el, index, el[index + 1]);
        this.$set(el, index + 1, arrList);
      });
    }),
    // 状态
    handleSwith(row) {
      const { id, isUse } = row;
      this.$http.get('advPosition/updateFloorIsUse', { params: { id, isUse }}).then(res => {
        this.query();
      });
    },
    // 置顶
    handleTopping(val) {
      this.$http.get('advPosition/updateFloorSort', { params: { ...val }}).then(res => {
        this.query();
      });
      if (this.queryForm.current !== 1) return;
      // 获取到子组件中方法
      this.$refs['singleTable'].$refs.singleTable.setCurrentRow(this.floorList[0]);
    },
    // 置底
    handleSetTheBottom(val) {
      this.$http.get('advPosition/updateFloorSort', { params: { ...val }}).then(res => {
        this.query();
      });
    },
    // 上移
    handleMoveUp(val, boolean) {
      const { nextId: floorIdNext, prevId: floorIdPrev } = val;
      const index = this.rowIndex;
      this.$http.get('advPosition/floorSort', { params: { floorIdNext, floorIdPrev }}).then(_ => {
        if (boolean) {
          this.query();
        } else {
          const arrList = this.currentRow;
          this.$set(this.floorList, index, this.floorList[index - 1]);
          this.$set(this.floorList, index - 1, arrList);
          const rowIndex = this.floorList.findIndex(item => {
            return arrList.id === item.id;
          });
          this.rowIndex = rowIndex;
          // 获取到子组件中方法并选中行
          this.$refs['singleTable'].$refs.singleTable.setCurrentRow(this.floorList[rowIndex]);
        }
      });
    },
    // 下移
    handleMoveDown(val, boolean) {
      const { nextId: floorIdNext, prevId: floorIdPrev } = val;
      const index = this.rowIndex;
      this.$http.get('advPosition/floorSort', { params: { floorIdNext, floorIdPrev }}).then(_ => {
        if (boolean) {
          this.query();
        } else {
          const arrList = this.currentRow;
          this.$set(this.floorList, index, this.floorList[index + 1]);
          this.$set(this.floorList, index + 1, arrList);
          const rowIndex = this.floorList.findIndex(item => {
            return arrList.id === item.id;
          });
          this.rowIndex = rowIndex;
          // 获取到子组件中方法并选中行
          this.$refs['singleTable'].$refs.singleTable.setCurrentRow(this.floorList[rowIndex]);
        }
      });
    },
    // 选中行事件
    handleCurrent(val) {
      if (val.id === CONST_IDS.FLOOR_NEW_ID || val.id === CONST_IDS.FLOOR_ID_JIN || val.id === CONST_IDS.FLOOR_ID_MIAN) {
        this.editBtn = 'info';
        this.delBtn = 'info';
      } else {
        this.editBtn = 'warning';
        this.delBtn = 'danger';
      }
      this.currentRow = { ...val };
      // 获取下标
      const index = this.floorList.findIndex(item => {
        return val.id === item.id;
      });
      this.rowIndex = index;
    },
    // 分页事件
    pagination ({ page: current, limit: size }) {
      this.queryForm.current = current;
      this.query();
    },
    handleSizeChange({ page: current, limit: size }) {
      this.queryForm.size = size;
      this.query();
    },
  },
};
</script>

<style scoped lang='less'>
.search{
  text-align: center;
  margin: 10px 0;
}
.goodsBtn{
  float: left;
  margin:10px 0;
  .el-button{
     font-size: 12px !important;
     margin-right: 10px;
  }
}
</style>
