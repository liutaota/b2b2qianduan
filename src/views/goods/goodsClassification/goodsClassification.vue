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
            v-model.trim="TotalList.oldclassname"
            placeholder="请输入ERP分类名称"
            style="width: 145px; margin-right: 10px"
            size="small"
          />
          <el-input
            v-model.trim.number="TotalList.classid"
            placeholder="请输入ERP分类id"
            style="width: 145px; margin-right: 10px"
            size="small"
          />
          <el-select v-model.trim="TotalList.classNo" style="margin-right: 10px" placeholder="请选择等级分类">
            <el-option label="一级分类" :value="1" />
            <el-option label="二级分类" :value="2" />
            <el-option label="三级分类" :value="3" />
          </el-select>
          <el-checkbox
            v-model.trim="TotalList.isImg"
            label="无图片"
            border
            class="checkbox"
            style="margin-right: 20px"
          />
          <el-button
            type="primary"
            icon="el-icon-search"
            @click="query"
          >查询</el-button>
          <el-button
            type="info"
            @click="
              TotalList = { size: 50, current: 1, isImg: false };
              query();
            "
          >重置</el-button>
        </div>
      </el-col>
    </el-row>
    <!-- <div style="margin-top: 10px">
      <el-button type="primary" :loading="deliveryAdd" @click="deliveryAdd = true;">新增规则</el-button>
    </div> -->
    <!-- 表单 -->
    <el-table
      ref="multipleTable"
      v-loading="loading"
      :data="giveRiseList"
      border
      stripe
      highlight-current-row
      style="width: 100%; margin-top: 10px; font-size: 12px"
      :header-cell-style="{ background: '#F3F3F3', color: '#606266' }"
      element-loading-background="rgba(255, 255, 255, 0.8)"
      size="mini"
      :height="height"
    >
      <el-table-column
        label="序号"
        type="index"
        width="50"
        :index="indexMethod"
      />
      <el-table-column
        label="id"
        prop="id"
        :show-overflow-tooltip="true"
        :formatter="textmatter"
      />
      <el-table-column
        label="分类简称"
        prop="classname"
        :show-overflow-tooltip="true"
        :formatter="textmatter"
      />
      <el-table-column
        label="ERP分类名"
        prop="oldclassname"
        :show-overflow-tooltip="true"
        :formatter="textmatter"
      />
      <el-table-column
        label="ERP分类id"
        prop="classid"
        :show-overflow-tooltip="true"
        :formatter="textmatter"
      />
      <el-table-column
        label="图片"
        prop="classImg"
      >
        <template slot-scope="scope">
          <el-image
            v-if="!scope.row.imgMessage"
            style="width: 35px; height: 35px"
            :src="scope.row.factoryImage"
            @click.prevent="openMask(scope.$index)"
          />
          <span v-else>{{ scope.row.imgMessage }}</span>
          <!-- <img v-else :alt="scope.row.imgMessage"> -->
        </template>
      </el-table-column>
      <el-table-column label="操作" width="320px" fixed="right">
        <template slot-scope="scope">
          <el-button
            type="primary"
            @click="editUpdata(scope.row)"
          >编辑</el-button>
          <!-- <el-button v-if="scope.row.id !== 1" type="danger" @click="handleDel(scope.row)">删除</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <Pagination
      :total="total"
      @pagination="totalPagination"
      @handleSizeChange="handleSizeChange"
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
    <el-dialog
      :visible.sync="imageMask"
      width="30%"
      :close-on-click-modal="false"
    >
      <el-image
        :src="factoryImage"
      />
    </el-dialog>
  </div>
</template>

<script>
import { _throttle } from '@/utils/public';
import Pagination from '@/components/Pagination';
import Edit from './components/Edit';
import { imgHost } from '@/config';
export default {
  name: 'GoodsClassification',
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
      },
      current: {},
      deliveryEdit: false,
      deliveryAdd: false,
      // 地区选择
      options: [],
      defDis: false,
      title: '编辑',
      height: 500,
      columns: [
        {
          prop: 'classname',
          label: '分类简称',
        },
        {
          prop: 'oldclassname',
          label: 'ERP分类名',
        },
        {
          prop: 'classid',
          label: 'ERP分类id',
        },
      ],
      factoryImage: '',
      imageMask: false
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
  created() {
    this.$nextTick(() => {
      this.height = window.innerHeight - 300;
      // 后面的50：根据需求空出的高度，自行调整
    });
    this.wid();
    this.query();
  },
  mounted() {},
  methods: {
    query() {
      this.loading = true;
      this.$http
        .get('goods/getGoodsClassTypeVoList', { params: { ...this.TotalList }})
        .then((res) => {
          res.records.map((item) => {
            // 将图片json格式转为对象
            if (item.classImg != null) {
              item.factoryImage = imgHost + item.classImg + `?${new Date()}`;
              item.imageMask = false;
            } else {
              item.classImg = null;
            }
            if (!item.classImg) {
              item.imgMessage = '无图片';
            }
          });
          this.total = res.total;
          this.giveRiseList = res.records;
        })
        .finally(() => {
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
    // 开启图片预览
    openMask(e) {
      // this.giveRiseList[e].imageMask = true;
      this.factoryImage = this.giveRiseList[e].factoryImage;
      this.imageMask = true;
    },
    // 分页
    totalPagination({ page: current, limit: size }) {
      this.TotalList.current = current;
      this.query();
    },
    handleSizeChange({ page: current, limit: size }) {
      this.TotalList.size = size;
      this.query();
    },
    editUpdata(row) {
      this.current = { ...row };
      this.deliveryEdit = true;
    },
    // 文本格式化
    textmatter (row, column) {
      if (row[column.property] === 0) {
        return row[column.property];
      }
      return row[column.property] ? row[column.property] : '-';
    },
    // 编辑
    handleEdit: _throttle(function (e, val) {
      delete e.createTime;
      e.erpClassId = e.classid;
      e.className = e.classname;
      this.$http.post('goods/editClass', { ...e }).then((res) => {
        this.$message({
          message: '编辑成功',
          type: 'success',
        });
        this.deliveryEdit = false;
        this.current = {};
        this.query();
      }, 1000);
    }),
    // 取消
    handleCancel() {
      this.deliveryEdit = false;
      this.deliveryAdd = false;
      this.defDis = false;
      this.current = {};
    },
    handleClose() {},
    // 序号
    indexMethod(index) {
      return (this.TotalList.current - 1) * this.TotalList.size + index + 1;
    },
  },
};
</script>

<style lang="less" scoped>
/deep/.el-table__body tr.current-row > td {
  background: #b5cbe2 !important;
}
</style>
