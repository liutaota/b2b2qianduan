<template>
  <div ref="tableCot" style="margin:0 10px">
    <Screen @query="query" />
    <el-button type="primary" plain style="margin: 10px 0" @click="classCompile()">分类编辑</el-button>
    <div>
      <el-table
        ref="refTable"
        v-loading="loading"
        class="el-collapse-transition"
        :data="tableData"
        highlight-current-row
        :height="Height"
        style="width: 100%"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(255, 255, 255, 0.8)"
        @current-change="handleCurrent"
      >
        <el-table-column type="expand">
          <template slot-scope="scope">

            <el-row :span="20">

              <el-col v-for="(item,index) in scope.row.goodsImgList" :key="index" :span="1" class="image_wrap" style="margin:20px 10px 20px 0">
                <span v-if="!scope.row.imgMessage" @click="openMask(item.code)">
                  <FsImg :src="item.code" width="35" height="35" />
                </span>
                <img v-else :alt="scope.row.imgMessage">
              </el-col>
            </el-row></template>
        </el-table-column>
        <el-table-column
          label="序号"
          type="index"
          width="50"
          :index="indexMethod"
        />
        <el-table-column label="分类简称" prop="" :formatter="isputaway" />
        <el-table-column label="erp分类名" prop="" :formatter="nummatter" />
        <el-table-column label="erp分类id" prop="" width="130" :formatter="textmatter" :show-overflow-tooltip="true" />
        <el-table-column label="分类图片" prop="" width="120" :formatter="showImageDialog">
          <template slot-scope="scope">
            <!-- <FsImg v-if="!scope.row.imgMessage" :src="scope.row.picture" width="55" height="55" /> -->
            <span v-if="!scope.row.imgMessage"> {{ scope.row.goodsImgList.length }} </span>
            <span v-else :alt="scope.row.imgMessage"> {{ scope.row.imgMessage }}</span>
          </template>
        </el-table-column>
      </el-table>0
      <el-table-column label="图标" prop="" :formatter="nummatter" />
      <el-table-column label="等级" prop="" :formatter="nummatter" />
      <pagination
        :total="goodsTotal"
        @pagination="goodsPagination"
      />
    </div>
  </div>
</template>

<script>
import { _throttle } from '@/utils/public';
import moment from 'moment';
import { statusGlobalData } from '@/filters';
import pagination from '@/components/Pagination';
import FsImg from '@/components/FsImg';
import Screen from './components/screen';
import { imgHost } from '@/config';

export default {
  name: 'Class',
  components: {
    pagination, FsImg, Screen
  },
  data () {
    return {
      dialogVisible: false,
      queryForm: {
        size: 50,
        current: 1,
        classid: '',
        oldclassname: ''
      },
      compile: {
        id: '',
        goodsImg: '',
      },
      isShowImageDialog: false,
      eRole: [],
      tableData: [],
      goodsTotal: 0,
      showImageSrc: '',
      currentRow: null,
      loading: false,
      addEditForms: {},
      addEditVisb: false,
      addEditTitle: '',
      imgMessage: '',
      level: '',
      addEditFormsRef: {},
      disabled: true,
      QuillValue: '',
      picture: [],
      statusGlobalData,
      customerId: '',
      Height: 450
    };
  },
  watch: {
    queryForm(val) {
      if (val.invaliddate === null) {
        this.queryForm.startTime = '';
        this.queryForm.endTime = '';
      }
    }
  },
  created () {
    this.query();
    this.wid();
    this.$nextTick(() => {
      this.Height = window.innerHeight - 300;
      // 后面的50：根据需求空出的高度，自行调整
    });
  },
  methods: {
    // 根据屏幕大小自适应高度
    wid() {
      window.onresize = () => {
        return (() => {
          this.$nextTick(() => {
            this.Height = window.innerHeight - 300;
            // 后面的50：根据需求空出的高度，自行调整
          });
        })();
      };
    },
    query(queryForm) {
      if (queryForm) {
        if (queryForm.invaliddate) {
          this.queryForm.startTime = queryForm.invaliddate[0];
          this.queryForm.endTime = queryForm.invaliddate[1];
          delete this.queryForm.invaliddate;
        }
        this.queryForm.size = 20;
        this.queryForm.current = 1;
        this.queryForm = queryForm;
      }
      this.loading = true;
      this.$http
        .get('/goods/getAdminGoodsClassTypeVoList', {
          params: {
            ...this.queryForm
          }
        })
        .then(data => {
          this.tableData = data.records.map(item => {
            item.picture = item.goodsImgList.filter(item => item.type === 'img').map(item => item.code)[0];
            if (!item.picture) {
              item.imgMessage = '无图片';
            }
            return item;
          });
          this.goodsTotal = data.total;
          this.disabled = true;
        }).finally(() => {
          this.loading = false;
        })
      ;
      this.disabled = true;
    },
    // 选择数据行
    handleCurrent (val) {
      this.currentRow = val;
      this.disabled = false;
    },
    dateFormate (dateVal, pattern = 'YYYY-MM-DD') {
      return moment(dateVal).format(pattern);
    },
    // 分类编辑
    classCompile: _throttle(function(row) {
      if (this.currentRow === null) {
        this.$message({
          type: 'info',
          message: '未选择对应的货品'
        });
        return;
      }
      this.$router.push({ path: 'classCompile', query: { id: this.currentRow.id, goodsImg: this.currentRow.goodsImg, goodsid: this.currentRow.goodsid }});
    }),
    search() {
      if (this.queryForm.createDate) {
        this.queryForm.startTime = this.queryForm.createDate[0];
        this.queryForm.endTime = this.queryForm.createDate[1];
        delete this.queryForm.createDate;
      }
      this.query(this.queryForm);
    },
    // 货品分页
    goodsPagination ({ page: current, limit: size }) {
      this.queryForm.current = current;
      this.queryForm.size = size;
      this.query();
    },
    // 文本格式化
    textmatter (row, column) {
      return row[column.property] ? row[column.property] : '-';
    },
    // 是否上架
    isputaway (row, column) {
      return row[column.property] === 1 ? '是' : '否';
    },
    // 数值格式化
    nummatter (row, column) {
      return row[column.property] ? (row[column.property]) : '0';
    },
    // 金额格式化
    moneymatter (row, column) {
      return row[column.property] ? '￥' + (row[column.property]) : '0';
    },
    // 采购二价取值
    price2 (row, column) {
      console.log(row, column);
      return row[column.property] ? row[column.property] : 0;
    },
    rate (row, column) {
      return row[column.property] / 10 ? row[column.property] / 10 : 0;
    },
    showImageDialog (codes) {
      if (codes && codes.length) {
        this.isShowImageDialog = true;
        this.showImageSrc = `${this.imgHost}/${codes}`;
      }
    },
    // 序号
    indexMethod(index) {
      return (this.queryForm.current - 1) * this.queryForm.size + index + 1;
    },
    goodsExport: _throttle(function() {
      this.$http.get('excel/getNewProductExcel', { params: { ...this.queryForm }}).then(res => {
        window.open(
          `${imgHost + res}`,
          '_blank'
        );
      });
    }),
    openMask(e) {
      this.$alert(`<img src="${imgHost + e}" style="width: 100%"/>`, {
        dangerouslyUseHTMLString: true,
        closeOnPressEscape: true
      }).catch(_ => { return; });
    },
  }
};
</script>

<style scoped lang="less">
/deep/.el-table__body tr.current-row > td {
  background: #b5cbe2 !important;
}
</style>
