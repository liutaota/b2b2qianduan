<template>
  <div style="margin: 0 10px">
    <!-- 筛选 -->
    <el-row>
      <el-col :span="24">
        <div
          class="row-col"
          style="margin-top: 10px; font-size: 12px"
          @keyup.enter="query"
        >
          <el-input
            v-model.trim="TotalList.daName"
            placeholder="请输入规则名称"
            style="width: 145px; margin-right: 10px"
            size="small"
          />
          <el-input
            v-model.trim="TotalList.areaName"
            placeholder="请输入地区"
            style="width: 145px; margin-right: 10px"
            size="small"
          />
          <el-button
            v-permission="'GiveRiseLook'"
            type="primary"
            icon="el-icon-search"
            @click="handleSearch"
          >查询</el-button>
        </div>
      </el-col>
    </el-row>
    <div style="margin-top: 10px">
      <el-button
        v-permission="'GiveRiseAdd'"
        type="primary"
        :loading="deliveryAdd"
        @click="deliveryAdd = true"
      >新增规则</el-button>
    </div>
    <!-- 表单 -->
    <el-table
      :data="giveRiseList"
      :loading="loading"
      :show-overflow-tooltip="true"
      border
      style="width: 100%; margin-top: 10px; font-size: 12px"
      :header-cell-style="{ background: '#F3F3F3', color: '#606266' }"
      highlight-current-row
    >
      <el-table-column label="序号" type="index" width="180" />
      <el-table-column prop="daName" label="规则名称" width="180" />
      <el-table-column prop="areaName" label="地区" width="180" />
      <el-table-column prop="type" label="类型" width="180" />
      <el-table-column prop="daAmount" label="金额" />
      <el-table-column prop="isUse" label="状态">
        <template slot-scope="scope">
          <el-switch
            v-model.trim="scope.row.isUse"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-value="ON"
            inactive-value="OFF"
            :disabled="scope.row.id === 1"
            @change="handleSwith(scope.row)"
          /></template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="200">
        <template slot-scope="scope">
          <el-button
            type="primary"
            @click="editUpdata(scope.row)"
          >编辑</el-button>
          <el-button
            v-if="scope.row.id !== 1"
            type="danger"
            @click="handleDel(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <Pagination
      :total="total"
      @pagination="totalPagination"
      @handleSizeChange="handleSizeChange"
    />
    <!-- 新增 -->
    <Edit
      :dialog-form-visible="deliveryAdd"
      :form="current"
      @handleCancel="handleCancel"
      @handleEdit="handleAdd"
    />
    <!-- 编辑 -->
    <Edit
      :dialog-form-visible="deliveryEdit"
      :title="title"
      :form="current"
      :disabled="defDis"
      @handleCancel="handleCancel"
      @handleEdit="handleEdit"
    />
  </div>
</template>

<script>
import { _throttle } from '@/utils/public';
import Pagination from '@/components/Pagination';
import Edit from './components/Edit';
export default {
  name: 'GiveRise',
  components: {
    Pagination,
    Edit,
  },
  data() {
    return {
      loading: true,
      giveRiseList: [],
      // 页码
      total: 1,
      // 搜索
      TotalList: {
        size: 50,
        current: 1,
        daName: '',
      },
      current: {},
      deliveryEdit: false,
      deliveryAdd: false,
      // 地区选择
      options: [],
      defDis: false,
      title: '编辑',
    };
  },
  watch: {
    TotalList: {
      handler(val) {
        if (val.daName === '' && val.areaName === '') {
          this.query();
        }
      },
      deep: true,
    },
  },
  mounted() {
    this.query();
  },
  methods: {
    query() {
      this.loading = true;
      this.$http
        .get('advPosition/getDeliveryAmount', { params: { ...this.TotalList }})
        .then((res) => {
          res.records.map((item) => {
            switch (item.type) {
              case 'PROVINCE':
                item.type = '省';
                break;
              case 'CITY':
                item.type = '市';
                break;
              case 'DISTRICT':
                item.type = '区';
                break;
              case 'DEFAULT':
                item.type = '默认';
                break;
              default:
                break;
            }
          });
          this.total = res.total;
          this.giveRiseList = res.records;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    // 筛选
    handleSearch: _throttle(function () {
      this.TotalList.size = 10;
      this.TotalList.current = 1;
      if (this.search === '') {
        this.TotalList.goodssetname = '';
      }
      this.query();
    }),
    // 是否启用
    handleSwith: _throttle(function (e) {
      this.$http
        .get('advPosition/updateDeliveryAmountIsUse', {
          params: { id: e.id, isUse: e.isUse },
        })
        .then((res) => {
          if (e.isUse === 'ON') {
            this.$message({
              message: '启用成功',
              type: 'success',
            });
          } else if (e.isUse === 'OFF') {
            this.$message({
              message: '关闭成功',
              type: 'success',
            });
          }
          this.query();
        });
    }),
    // 分页
    totalPagination({ page: current, limit: size }) {
      this.TotalList.current = current;
      this.query();
    },
    handleSizeChange({ page: current, limit: size }) {
      this.TotalList.size = size;
      this.query();
    },
    // 新增规则
    handleAdd: _throttle(function (e, val) {
      const intercept = this.giveRiseList.some((item) => {
        return item.areaId === e.areaId;
      });
      if (intercept) {
        this.$message.error('地区不可重复');
        return;
      }
      const type = this.setType(e.areaId.split('-'));
      this.$http
        .post('advPosition/addDeliveryAmount', { ...e, type })
        .then((res) => {
          this.$message({
            message: '添加成功',
            type: 'success',
          });
          this.deliveryAdd = false;
          this.current = {};
          this.query();
        });
    }),
    // 删除
    handleDel: _throttle(function (row) {
      // 判断是否删除文件
      this.$confirm('确认删除？')
        .then(() => {
          // const { id } = this.currentRow;
          this.$http.get('', { params: { id: row.id }}).then((res) => {
            this.$message({
              type: 'success',
              message: '删除成功!',
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
    // 编辑
    handleEdit: _throttle(function (e, val) {
      const type = this.setType(e.areaId.split('-'));
      delete e.createTime;
      this.$http
        .post('advPosition/updateDeliveryAmount', { ...e, type })
        .then((res) => {
          this.$message({
            message: '编辑成功',
            type: 'success',
          });
          this.deliveryEdit = false;
          this.current = {};
          this.query();
        });
    }),
    // 类型判断
    setType(val) {
      let type = null;
      if (val === null) {
        type = 'DISTRICT';
        return type;
      }
      switch (val.length) {
        case 1:
          type = 'PROVINCE';
          break;
        case 2:
          type = 'CITY';
          break;
        case 3:
          type = 'DISTRICT';
          break;
        default:
          break;
      }
      return type;
    },
    editUpdata: _throttle(function (row) {
      if (row.areaName === '全国') {
        this.defDis = true;
      }
      this.current = { ...row };
      this.deliveryEdit = true;
    }),
    // 取消
    handleCancel() {
      this.deliveryEdit = false;
      this.deliveryAdd = false;
      this.defDis = false;
      this.current = {};
    },
  },
};
</script>

<style lang="less" scoped>
/deep/.el-table__body tr.current-row > td {
  background: #b5cbe2 !important;
}
</style>
