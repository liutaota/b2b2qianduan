<template>
  <div style="margin:0 10px">
    <!-- 筛选 -->
    <el-row>
      <el-col :span="24">
        <div class="row-col screen-wrap" style="margin-top: 10px" @keyup.enter="query()">
          <el-input
            v-model.trim="queryForm.factoryname"
            placeholder="请输入厂家名称"
            style="width:230px;margin-right: 25px"
            clearablex
          />
          <el-checkbox v-model.trim="queryForm.isImg" label="无图片" border class="checkbox" />
          <el-button v-permission="'FactoryListLook'" type="primary" icon="el-icon-search" style="margin-left: 20px" @click="query()">搜索</el-button>
        </div>
      </el-col>
    </el-row>
    <div style="margin-top:10px">
      <el-button v-permission="'FactoryListTopping'" :type="botBtn" style="margin-right: 10px" @click="handleTopping">置顶</el-button>
      <el-button v-permission="'FactoryListBottoming'" :type="botBtn" style="margin-right: 10px" @click="handleSetTheBottom">置底</el-button>
      <el-button v-permission="'FactoryListTop'" :type="btnType" style="margin-right: 10px" @click="handleMoveUp">上移</el-button>
      <el-button v-permission="'FactoryListBottom'" :type="btnType" @click="handleMoveDown">下移</el-button>
    </div>
    <!-- 厂家列表 -->
    <el-table
      ref="multipleTable"
      v-loading="loading"
      :data="tableData"
      border
      stripe
      highlight-current-row
      style="width: 100%;margin-top:10px;font-size:12px"
      :header-cell-style="{background:'#F3F3F3',color:'#606266'}"
      element-loading-background="rgba(255, 255, 255, 0.8)"
      size="mini"
      :height="height"
      @current-change="handleCurrent"
    >
      <el-table-column
        label="序号"
        type="index"
        width="50"
        :index="indexMethod"
      />
      <el-table-column label="厂家名称" prop="factoryname" :show-overflow-tooltip="true" />
      <el-table-column label="厂家编号" prop="erpSupplyId" :show-overflow-tooltip="true" />
      <el-table-column label="简称" prop="factoryShort" :show-overflow-tooltip="true" />
      <el-table-column label="图片" prop="factoryImg" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <el-image
            v-if="!scope.row.imgMessage"
            style="width: 35px; height: 35px"
            :src="scope.row.factoryImage"
            @click.prevent="openMask(scope.$index)"
          />
          <img v-else :alt="scope.row.imgMessage">
          <el-dialog
            v-if="!scope.row.imgMessage"
            :visible.sync="scope.row.imageMask"
            width="30%"
          >
            <el-image
              :src="scope.row.factoryImage"
            />
          </el-dialog>
        </template>
      </el-table-column>
      <el-table-column label="地址" prop="address" :show-overflow-tooltip="true" />
      <el-table-column label="首字母" prop="factoryInitial" :show-overflow-tooltip="true" />
      <el-table-column label="是否推荐">
        <template slot-scope="scope">
          <!-- <el-button
            size="mini"
            @click="handleEdit(scope.row)"
          >编辑</el-button> -->
          <el-switch
            v-model.trim="scope.row.factoryRecommend"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :inactive-value="0"
            :active-value="1"
            @change="handleSwith(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.row)"
          >编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination :total="total" @pagination="pagination" @handleSizeChange="handleSizeChange" />
    <!-- 编辑 -->
    <FactoryEdit :dialog-form-visible="dialogFormVisible" :manufactor="manufactor" @handleCancel="handleCancel" @handleFactoryEdit="handleFactoryEdit" />
  </div>
</template>

<script>
import { _throttle } from '@/utils/public';
import Pagination from '@/components/Pagination';
import FactoryEdit from './cmponents/factoryEdit';
import { imgHost } from '@/config';

export default {
  name: 'FactoryList',
  components: {
    Pagination, FactoryEdit,
  },
  data() {
    return {
      queryForm: {
        size: 50,
        current: 1,
      },
      tableData: [],
      loading: true,
      total: 1,
      btnType: 'primary',
      botBtn: 'primary',
      dialogFormVisible: false,
      manufactor: {},
      visible: false,
      checkList: [],
      height: 500,
      imgMessage: '',
      current: {},
      rowIndex: null,
      factoryid: null
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.height = window.innerHeight - 300;
      // 后面的50：根据需求空出的高度，自行调整
    });
    this.wid();
    this.query();
    this.$refs.multipleTable.toggleRowSelection(this.tableData[2], true);
  },
  methods: {
    // 开启图片预览
    openMask(e) {
      this.tableData[e].imageMask = true;
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    query() {
      this.loading = true;
      this.$http.get('goods/getFactoryList', {
        params: {
          ...this.queryForm
        }
      }).then(data => {
        this.tableData = data.records.map((item, i) => {
          // 将图片json格式转为对象
          if (item.factoryPic != null) {
            item.factoryImage = imgHost + item.factoryPic + `?${new Date()}`;
            item.imageMask = false;
          } else {
            item.factoryPic = null;
          }
          if (!item.factoryPic) {
            item.imgMessage = '无图片';
          }
          return item;
        });
        this.tableData = data.records;
        this.total = data.total;
        this.len = data.records.filter(item => {
          return item.factorySort !== null;
        });
      }).finally(() => {
        this.loading = false;
      });
    },
    // 根据屏幕大小自适应高度
    wid() {
      window.onresize = () => {
        return (() => {
          this.$nextTick(() => {
            this.height = window.innerHeight - 300;
            // 后面的50：根据需求空出的高度，自行调整
          });
        })();
      };
    },
    // 编辑
    handleEdit: _throttle(function(row) {
      if (row.factoryPic != null) {
        row.factoryPic = row.factoryPic.split('?')[0];
      }
      row.factoryPic === '无图片' ? row.factoryPic = null : row.factoryPic;
      this.manufactor = { ...row };
      this.dialogFormVisible = true;
    }),
    // 取消编辑
    handleCancel(e) {
      this.dialogFormVisible = e;
      this.manufactor = {};
    },
    // 提交编辑
    handleFactoryEdit: _throttle(function(e, index) {
      e.erpSupplyId = e.factoryid;
      if (e.createTime) delete e.createTime;
      this.$http.post('goods/updateFactory', { ...e }).then(res => {
        this.$message({
          message: '编辑成功',
          type: 'success'
        });
        this.dialogFormVisible = false;
        this.query();
        this.manufactor = {};
      });
    }),
    // 是否推荐
    handleSwith(row) {
      const { factoryid: erpSupplyId, factoryRecommend } = row;
      this.$http.get('goods/updateFactoryRecommend', { params: { erpSupplyId, factoryRecommend }}).then(res => {
        this.query();
      });
    },
    // 置顶
    handleTopping() {
      if (this.judge()) return;
      if (this.botBtn === 'info') {
        this.$message({
          message: '请先完善厂家信息',
          type: 'warning'
        });
        return;
      }
      if (this.queryForm.current === 1 && this.rowIndex === 0) return;
      const erpSupplyId = this.current.erpSupplyId;
      this.$http.get('goods/updateFactorySort', { params: { erpSupplyId, sortType: 'TOP' }}).then(res => {
        this.query();
      });
    },
    // 置底
    handleSetTheBottom() {
      if (this.judge()) return;
      if (this.botBtn === 'info') {
        this.$message({
          message: '请先完善厂家信息',
          type: 'warning'
        });
        return;
      }
      if (this.current.id === null) return;
      // 当数据为当前页数最后一条进入该判断
      if (this.rowIndex === this.tableData.length - 1) {
        let prevSort = null;
        // 判断是否是再所有数据最后一条
        if (this.queryForm.current === Math.ceil(this.total / this.queryForm.size)) return;
        const current = this.queryForm.current + 1;
        // 获取下一页请求第一条数据
        this.$http.get('goods/getFactoryList', {
          params: {
            size: this.queryForm.size,
            current
          }
        }).then(res => {
          // 获取下一页第一条数据并赋值
          prevSort = res.records[0].factorySort;
        });
        // 判断排序值是否为空
        if (prevSort === null) return;
      }
      const prevSort = this.tableData[this.rowIndex + 1].factorySort;
      // 判断下一条数据是否为空
      if (prevSort === null) return;
      // 判断是否有erpSupplyId是否为空
      const erpSupplyId = this.current.erpSupplyId !== null ? this.current.erpSupplyId : this.current.factoryid;
      // 发送置底请求
      this.$http.get('goods/updateFactorySort', { params: { erpSupplyId, sortType: 'DOWN' }}).then(res => {
        this.query();
      });
    },
    // 上移
    handleMoveUp() {
      if (this.judge()) return;
      if (this.botBtn === 'info') {
        this.$message({
          message: '请先完善厂家信息',
          type: 'warning'
        });
        return;
      }
      if (this.current.id === null) return;
      // 判断第一条数据无法上移
      if (this.rowIndex === 0 && this.queryForm.current === 1) return;
      const index = this.rowIndex;
      const tableData = this.tableData;
      // 获取当前数据
      const { id: erpSupplyIdNext } = this.current;
      // 判断是否为第一页第一条数据，不是则进入该判断语句进行与上一页最后一天数据进行互换上移
      if (this.queryForm.current !== 1 && this.rowIndex === 0) {
        const current = this.queryForm.current - 1;
        // 获取上一页数据
        this.$http.get('goods/getFactoryList', {
          params: {
            size: this.queryForm.size,
            current
          }
        }).then(res => {
          // 返回数据进行链式请求
          const { id: erpSupplyIdPrev } = res.records[res.records.length - 1];
          this.$http.get('goods/factorySort', { params: { erpSupplyIdNext, erpSupplyIdPrev }}).then(res => {
            this.query();
          });
        });
        return;
      }
      // 获取上一条数据
      const { id: erpSupplyIdPrev } = this.tableData[index - 1];
      this.$http.get('goods/factorySort', { params: { erpSupplyIdNext, erpSupplyIdPrev }}).then(res => {
        const arrList = this.current;
        this.$set(this.tableData, index, tableData[index - 1]);
        this.$set(this.tableData, index - 1, arrList);
        // 重新获取下标
        const rowIndex = this.tableData.findIndex(item => {
          return arrList.factoryid === item.factoryid;
        });
        this.rowIndex = rowIndex;
        this.$refs.multipleTable.setCurrentRow(this.tableData[rowIndex]);
      });
    },
    // 下移
    handleMoveDown() {
      if (this.judge()) return;
      if (this.botBtn === 'info') {
        this.$message({
          message: '请先完善厂家信息',
          type: 'warning'
        });
        return;
      }
      if (this.current.id === null) return;
      const index = this.rowIndex;
      const tableData = this.tableData;
      // 获取当前数据
      const { id: erpSupplyIdPrev } = this.current;
      // 判断是否为当前页最后一条数据
      if (this.rowIndex === this.tableData.length - 1) {
        // 判断是否为最后一页
        if (this.queryForm.current === Math.ceil(this.total / this.queryForm.size)) return;
        const current = this.queryForm.current + 1;
        // 获取下一页数据
        this.$http.get('goods/getFactoryList', {
          params: {
            size: this.queryForm.size,
            current
          }
        }).then(res => {
          const { id: erpSupplyIdNext } = res.records[0];
          if (erpSupplyIdNext === null) return;
          this.$http.get('goods/factorySort', { params: { erpSupplyIdNext, erpSupplyIdPrev }}).then(res => {
            this.query();
          });
        });
      } else {
        // 获取下一条数据
        const { id: erpSupplyIdNext } = this.tableData[this.rowIndex + 1];
        if (erpSupplyIdNext === null) return;
        this.$http.get('goods/factorySort', { params: { erpSupplyIdNext, erpSupplyIdPrev }}).then(res => {
          const arrList = this.current;
          this.$set(this.tableData, index, tableData[index + 1]);
          this.$set(this.tableData, index + 1, arrList);
          // 重新获取下标
          const rowIndex = this.tableData.findIndex(item => {
            return arrList.factoryid === item.factoryid;
          });
          this.rowIndex = rowIndex;
          this.$refs.multipleTable.setCurrentRow(this.tableData[rowIndex]);
        });
      }
    },
    // 选中行
    handleCurrent(row) {
      if (row === null || row === undefined) return;
      this.current = { ...row };
      if (row.id === null) {
        this.btnType = 'info';
      } else {
        this.btnType = 'primary';
      }
      // 获取下标
      const index = this.tableData.findIndex(item => {
        return row.factoryid === item.factoryid;
      });
      this.rowIndex = index;
      // 判断是否是最后一个可排序数据
      if (row.id === null) {
        this.botBtn = 'info';
      } else {
        this.botBtn = 'primary';
      }
    },
    // 判断表格是否选中
    judge() {
      if (JSON.stringify(this.current) === '{}') {
        this.$message({
          type: 'info',
          message: '未选择对应的厂家'
        });
        return true;
      }
      return false;
    },
    // 分页
    pagination({ page: current, limit: size }) {
      this.queryForm.current = current;
      this.query();
    },
    handleSizeChange({ page: current, limit: size }) {
      this.queryForm.size = size;
      this.query();
    },
    // 序号
    indexMethod(index) {
      return (this.queryForm.current - 1) * this.queryForm.size + index + 1;
    }
  }
};
</script>

<style scoped lang='less'>
  .checkbox{
    top: -2px;
  }
/deep/.el-table__body tr.current-row > td {
  background: #b5cbe2 !important;
}
</style>

