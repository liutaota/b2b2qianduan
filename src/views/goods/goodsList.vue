<template>
  <div ref="tableCot" style="margin:0 10px">
    <Screen v-permission="'GoodsLook'" @query="query" />
    <el-button v-permission="'GoodsEdit'" type="primary" plain style="margin: 10px 5px" @click="goodsCompile()">货品编辑</el-button>
    <!-- <el-button type="primary" style="margin: 10px 0 0 10px" @click="integralEdit()">积分编辑</el-button> -->
    <el-button v-permission="'GoodsExport'" type="primary" style="margin: 10px 5px" @click="goodsExport()">导出Excel</el-button>
    <!-- <el-button type="primary" @click="$router.push('/warehouse')">导出</el-button> -->
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
        border
        :header-cell-style="{background:'#F3F3F3',color:'#606266'}"
        @current-change="handleCurrent"
      >
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row :span="20">
              <el-col v-for="(item,index) in scope.row.goodsImgList" :key="index" :span="1" class="image_wrap" style="margin:20px 10px 20px 0">
                <span v-if="!scope.row.imgMessage" @click="openMask(item.code)">
                  <FsImg :src="item.code" width="50" height="50" />
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
        <el-table-column
          label="货品ID"
          prop="goodsid"
          :formatter="textmatter"
          :show-overflow-tooltip="true"
          header-align="center"
        />
        <!-- <el-table-column label="积分商品" prop="accflag" width="180" :formatter="textmatter" :show-overflow-tooltip="true" /> -->
        <el-table-column label="货品名" prop="goodsname" width="180" :formatter="textmatter" :show-overflow-tooltip="true" />
        <el-table-column label="品类" prop="classname" width="130" :formatter="textmatter" :show-overflow-tooltip="true" />
        <el-table-column
          label="单位"
          prop="goodsunit"
          :formatter="textmatter"
          :show-overflow-tooltip="true"
        />
        <el-table-column label="最小销售数量" width="130" prop="zxB2bNumLimit" :formatter="textmatter" :show-overflow-tooltip="true" />
        <el-table-column label="规格" prop="goodstype" :formatter="textmatter" :show-overflow-tooltip="true" />
        <el-table-column label="采购二价" prop="price2" :formatter="moneymatter" />
        <el-table-column label="是否上架" prop="isputaway" :formatter="isputaway" />
        <el-table-column label="库存" prop="goodsqty" :formatter="nummatter" />
        <el-table-column label="商品条码" prop="barcode" width="130" :formatter="textmatter" :show-overflow-tooltip="true" />
        <el-table-column label="商品图片" prop="goodsImg" width="120" :formatter="showImageDialog">
          <template slot-scope="scope">
            <!-- <FsImg v-if="!scope.row.imgMessage" :src="scope.row.picture" width="55" height="55" /> -->
            <span v-if="!scope.row.imgMessage"> {{ scope.row.goodsImgList.length }} </span>
            <span v-else :alt="scope.row.imgMessage"> {{ scope.row.imgMessage }}</span>
          </template>
        </el-table-column>
        <el-table-column label="厂家" prop="factoryname" width="280" :formatter="textmatter" :show-overflow-tooltip="true" />
        <el-table-column label="通用名" prop="currencyname" width="200" :formatter="textmatter" :show-overflow-tooltip="true" />
        <el-table-column label="★剂型" prop="medicinetypename" width="180" :formatter="textmatter" />
        <el-table-column
          label="贮藏"
          :formatter="textmatter"
          :show-overflow-tooltip="true"
          width="100"
        >
          <template slot-scope="scope"> {{ scope.row.storagecondition !== null ? scope.row.storagecondition+',':'' }}{{ scope.row.transcondition }} </template>
        </el-table-column>
        <el-table-column label="作用分类" prop="classname" width="150" :formatter="textmatter" :show-overflow-tooltip="true" />
        <el-table-column label="批准文号" prop="approvedocno" width="150" :formatter="textmatter" :show-overflow-tooltip="true" />
        <el-table-column label="有效期" prop="invaliddate" width="120" :formatter="textmatter" :show-overflow-tooltip="true" />
      </el-table>
      <pagination
        :total="goodsTotal"
        @pagination="goodsPagination"
        @handleSizeChange="handleSizeChange"
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
import { numFilter, goodsqtyFilter } from '@/util.js';
export default {
  name: 'Goods',
  components: {
    pagination, FsImg, Screen
  },
  data () {
    return {
      dialogVisible: false,
      queryForm: {
        size: 50,
        current: 1,
        goodsid: '',
        barcode: '',
        goodsname: '',
        factoryname: '',
        invaliddate: '',
        startTime: '',
        endTime: '',
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
      Height: 450,
      integralForm: {}, // 积分
      integralMask: false, // 积分弹窗
      rules: {
        convertibleIntegral: [
          { required: true, message: '请输入兑换积分', trigger: 'blur' },
        ],
      }
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
        .get('/goods/goodsList', {
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
            if (item.goodsunit === 'g' || item.goodsunit === 'kg') {
              item.packingBox =
          item.zxB2bNumLimit + '' + item.goodsunit + '/包';
            } else {
              item.packingBox = item.zxB2bNumLimit + '/' + item.goodsunit;
            }
            if (item.goodsunit === 'g' || item.goodsunit === 'kg') {
              item.goodsunit = '包';
            }
            item.price = numFilter(this.$math.multiply(item.price, item.zxB2bNumLimit));
            // item.price2 = numFilter(item.price2 * item.zxB2bNumLimit);
            item.price2 = numFilter(this.$math.multiply(item.price2, item.zxB2bNumLimit));
            // console.log(item.price, '------------');
            item.goodsqty = goodsqtyFilter(item.goodsqty, item.zxB2bNumLimit);
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
    // 货品编辑
    goodsCompile: _throttle(function(row) {
      if (this.currentRow === null) {
        this.$message.info('未选择对应的货品');
        return;
      }
      this.$router.push({ path: 'goodsCompile', query: { id: this.currentRow.id, goodsImg: this.currentRow.goodsImg, goodsid: this.currentRow.goodsid }});
    }),
    // 打开积分
    integralEdit() {
      if (this.currentRow === null) {
        this.$message.info('未选择对应的货品');
        return;
      }
      if (this.currentRow.accflag !== 5) {
        this.$message.info('该商品不是积分商品，无法编辑');
        return;
      }
      this.integralMask = true;
    },
    // 积分编辑
    integralSubmit(formName) {
      const { goodsid: erpGoodsId, accflag: erpAccFlag } = this.currentRow;
      const { integralGoods, convertibleIntegral } = this.integralForm;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$http.post('goods/editIntegral', { convertibleIntegral, integralGoods: Number(integralGoods), erpGoodsId, erpAccFlag }).then(res => {
            this.$message.success('编辑成功');
            this.query();
            this.handleClose();
          });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    // 弹窗关闭
    handleClose() {
      this.integralMask = false;
      this.integralForm = {};
    },
    search() {
      if (this.queryForm.createDate) {
        this.queryForm.startTime = this.queryForm.createDate[0];
        this.queryForm.endTime = this.queryForm.createDate[1];
        delete this.queryForm.createDate;
      }
      this.query(this.queryForm);
    },
    // 货品分页
    // goodsPagination ({ page: current, limit: size }) {
    //   this.queryForm.current = current;
    //   this.queryForm.size = size;
    //   this.query();
    // },
    // 分页事件
    goodsPagination({ page: current, limit: size }) {
      this.queryForm.current = current;
      this.query();
    },
    handleSizeChange({ page: current, limit: size }) {
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
      this.$http.get('excel/getGoodsListExcel', { params: { ...this.queryForm }}).then(res => {
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
<style lang="less">
  .search {
    margin-left: 450px;
    margin-top: 20px;
  }

  .demo-table-expand {
    font-size: 0;
  }

  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }

  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
  /deep/.el-table__body tr.current-row > td {
  background: #b5cbe2 !important;
}
</style>
