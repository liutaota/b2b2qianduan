<template>
  <div ref="tableCot" style="margin:0 10px">
    <Screen
      v-permission="'GoodsIntegralLook'"
      :is-arction="false"
      @query="query"
      @reset="
        isIntegralGoods = null;
        isLot = null;
      "
    >
      <el-select
        slot="select"
        v-model.trim="isIntegralGoods"
        size="small"
        placeholder="是否上架"
        style="width:145px;margin-right: 20px"
      >
        <el-option label="全部" value />
        <el-option label="未上架" :value="0" />
        <el-option label="已上架" :value="1" />
      </el-select>
      <el-select
        v-model.trim="isLot"
        size="small"
        placeholder="是否抽奖"
        style="width:145px;margin-right: 20px"
      >
        <el-option label="全部" value />
        <el-option label="否" :value="0" />
        <el-option label="是" :value="1" />
      </el-select>
    </Screen>
    <el-button
      v-permission="'GoodsIntegralGoodsEdit'"
      type="primary"
      plain
      style="margin: 10px 5px"
      @click="goodsCompile()"
      >货品编辑</el-button
    >
    <el-button
      v-permission="'GoodsIntegralEdit'"
      type="primary"
      style="margin: 10px 5px"
      @click="integralEdit()"
      >积分编辑</el-button
    >
    <el-button
      v-permission="'GoodsIntegralExport'"
      type="primary"
      style="margin: 10px 5px"
      @click="goodsExport()"
      >导出Excel</el-button
    >
    <div>
      <el-table
        ref="refTable"
        v-loading="loading"
        class="el-collapse-transition"
        :data="tableData"
        highlight-current-row
        :height="Height"
        border
        :header-cell-style="{ background: '#F3F3F3', color: '#606266' }"
        style="width: 100%"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(255, 255, 255, 0.8)"
        @row-click="handleCurrent"
      >
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row :span="20">
              <el-col
                v-for="(item, index) in scope.row.goodsImgList"
                :key="index"
                :span="1"
                class="image_wrap"
                style="margin:20px 10px 20px 0"
              >
                <span v-if="!scope.row.imgMessage" @click="openMask(item.code)">
                  <FsImg :src="item.code" width="35" height="35" />
                </span>
                <img v-else :alt="scope.row.imgMessage" />
              </el-col> </el-row
          ></template>
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
        <el-table-column
          label="货品名"
          prop="goodsname"
          width="180"
          :formatter="textmatter"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="品类"
          prop="classname"
          width="130"
          :formatter="textmatter"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="单位"
          prop="goodsunit"
          :formatter="textmatter"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="最小销售数量"
          width="130"
          prop="zxB2bNumLimit"
          :formatter="textmatter"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="规格"
          prop="goodstype"
          :formatter="textmatter"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="积分"
          prop="convertibleIntegral"
          :formatter="textmatter"
        />
        <el-table-column
          label="是否上架"
          prop="isputaway"
          :formatter="isputaway"
        />
        <!-- <el-table-column label="是否抽奖" prop="isLot" :formatter="isputaway" /> -->
        <!-- <el-table-column label="抽奖数量" prop="lotNum" :formatter="nummatter" /> -->
        <el-table-column
          label="备注"
          prop="remark"
          width="120"
          :formatter="textmatter"
          :show-overflow-tooltip="true"
        />
        <el-table-column label="库存" prop="goodsqty" :formatter="nummatter" />
        <el-table-column
          label="商品条码"
          prop="barcode"
          width="130"
          :formatter="textmatter"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="商品图片"
          prop="goodsImg"
          width="120"
          :formatter="showImageDialog"
        >
          <template slot-scope="scope">
            <!-- <FsImg v-if="!scope.row.imgMessage" :src="scope.row.picture" width="55" height="55" /> -->
            <span v-if="!scope.row.imgMessage">
              {{ scope.row.goodsImgList.length }}
            </span>
            <span v-else :alt="scope.row.imgMessage">
              {{ scope.row.imgMessage }}</span
            >
          </template>
        </el-table-column>
        <el-table-column
          label="厂家"
          prop="factoryname"
          width="280"
          :formatter="textmatter"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="通用名"
          prop="currencyname"
          width="200"
          :formatter="textmatter"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="★剂型"
          prop="medicinetypename"
          width="180"
          :formatter="textmatter"
        />
        <el-table-column
          label="贮藏"
          :formatter="textmatter"
          :show-overflow-tooltip="true"
          width="100"
        >
          <template slot-scope="scope">
            {{
              scope.row.storagecondition !== null
                ? scope.row.storagecondition + ","
                : ""
            }}{{ scope.row.transcondition }}
          </template>
        </el-table-column>
        <el-table-column
          label="作用分类"
          prop="classname"
          width="150"
          :formatter="textmatter"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="批准文号"
          prop="approvedocno"
          width="150"
          :formatter="textmatter"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="有效期"
          prop="invaliddate"
          width="120"
          :formatter="textmatter"
          :show-overflow-tooltip="true"
        />

        <el-table-column
          label="是否上架"
          prop="isputaway"
          fixed="right"
          width="120"
          :formatter="showImageDialog"
        >
          <template slot-scope="scope">
            <el-switch
             v-permission="'GoodsIntegralIsputaway'"
              v-model.trim="scope.row.integralGoods"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :inactive-value="0"
              :active-value="1"
              @change="handleSwith(scope.row)"
            />
          </template>
        </el-table-column>
      </el-table>
      <pagination
        :total="goodsTotal"
        @pagination="goodsPagination"
        @handleSizeChange="handleSizeChange"
      />
    </div>
    <el-dialog
      title="积分编辑"
      :visible.sync="integralMask"
      width="500px"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <el-form
        ref="form"
        :rules="rules"
        :model="integralForm"
        label-width="120px"
      >
        <el-form-item label="可兑换积分" prop="convertibleIntegral">
          <el-input v-model.trim.number="integralForm.convertibleIntegral" />
        </el-form-item>
        <el-form-item label="积分商品上下架">
          <el-switch
            v-model.trim="integralForm.integralGoods"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :inactive-value="0"
            :active-value="1"
          />
        </el-form-item>
        <!-- <el-form-item label="是否参与抽奖">
          <el-switch
            v-model.trim="integralForm.isLot"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :inactive-value="0"
            :active-value="1"
          />
        </el-form-item>
        <el-form-item label="抽奖数量" :prop="integralForm.isLot=== 1?'lotNum':''">
           <el-input v-model.trim.number="integralForm.lotNum" />
        </el-form-item> -->
        <el-form-item label="备注">
          <el-input
            v-model.trim="integralForm.remark"
            type="textarea"
            rows="4"
            placeholder="请输入备注"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="integralSubmit('form')"
            >确认</el-button
          >
          <el-button @click="handleClose('form')">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { _throttle } from "@/utils/public";
import moment from "moment";
import { statusGlobalData } from "@/filters";
import pagination from "@/components/Pagination";
import FsImg from "@/components/FsImg";
import Screen from "../components/screen";
import { imgHost } from "@/config";
export default {
  name: "GoodsIntegral",
  components: {
    pagination,
    FsImg,
    Screen
  },
  data() {
    return {
      dialogVisible: false,
      queryForm: {
        size: 50,
        current: 1,
        goodsid: "",
        barcode: "",
        goodsname: "",
        factoryname: "",
        invaliddate: "",
        startTime: "",
        endTime: ""
      },
      isLot: null,
      isIntegralGoods: null,
      compile: {
        id: "",
        goodsImg: ""
      },
      isShowImageDialog: false,
      eRole: [],
      tableData: [],
      goodsTotal: 0,
      showImageSrc: "",
      currentRow: null,
      loading: false,
      addEditForms: {},
      addEditVisb: false,
      addEditTitle: "",
      imgMessage: "",
      level: "",
      addEditFormsRef: {},
      disabled: true,
      QuillValue: "",
      picture: [],
      statusGlobalData,
      customerId: "",
      Height: 450,
      integralForm: {
        convertibleIntegral: null
      }, // 积分
      integralMask: false, // 积分弹窗
      rules: {
        convertibleIntegral: [
          { required: true, message: "请输入兑换积分", trigger: "blur" }
        ],
        lotNum: [{ required: true, message: "请输入抽奖数量", trigger: "blur" }]
      }
    };
  },
  watch: {
    queryForm(val) {
      if (val.invaliddate === null) {
        this.queryForm.startTime = "";
        this.queryForm.endTime = "";
      }
    }
  },
  created() {
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
        this.queryForm.isLot = this.isLot;
        this.queryForm.isIntegralGoods = this.isIntegralGoods;
      }
      this.loading = true;
      this.$http
        .get("/goods/goodsList", {
          params: {
            ...this.queryForm,
            isAccFlag: true
          }
        })
        .then(data => {
          this.tableData = data.records.map(item => {
            // item.zxB2bNumLimit /= 10000;
            item.picture = item.goodsImgList
              .filter(item => item.type === "img")
              .map(item => item.code)[0];
            if (!item.picture) {
              item.imgMessage = "无图片";
            }
            return item;
          });
          this.goodsTotal = data.total;
          this.disabled = true;
        })
        .finally(() => {
          this.loading = false;
        });
      this.disabled = true;
    },
    // 选择数据行
    handleCurrent(val) {
      if (val) {
        this.currentRow = val;
        this.integralForm = { ...val };
      }
      this.disabled = false;
    },
    dateFormate(dateVal, pattern = "YYYY-MM-DD") {
      return moment(dateVal).format(pattern);
    },
    // 货品编辑
    goodsCompile: _throttle(function(row) {
      if (this.currentRow === null) {
        this.$message.info("未选择对应的货品");
        return;
      }
      this.$router.push({
        path: "goodsCompile",
        query: {
          id: this.currentRow.id,
          goodsImg: this.currentRow.goodsImg,
          goodsid: this.currentRow.goodsid
        }
      });
    }),
    // 打开积分
    integralEdit() {
      console.log(this.currentRow);
      if (this.currentRow === null) {
        this.$message.info("未选择对应的货品");
        return;
      }
      if (this.currentRow.accflag !== 5) {
        this.$message.info("该商品不是积分商品，无法编辑");
        return;
      }
      this.integralMask = true;
    },
    // 积分编辑
    integralSubmit(formName) {
      const { goodsid: erpGoodsId, accflag: erpAccFlag } = this.currentRow;
      const {
        integralGoods,
        convertibleIntegral,
        isLot,
        lotNum,
        remark
      } = this.integralForm;
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$http
            .post("goods/editIntegral", {
              convertibleIntegral,
              isLot,
              lotNum,
              remark,
              integralGoods: Number(integralGoods),
              erpGoodsId,
              erpAccFlag
            })
            .then(res => {
              this.$message.success("编辑成功");
              this.query();
              this.handleClose("form");
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 是否上架
    handleSwith(row) {
      const { goodsid: erpGoodsId, accflag: erpAccFlag, integralGoods } = row;
      this.$http
        .post("goods/editIntegral", {
          integralGoods: Number(integralGoods),
          erpGoodsId,
          erpAccFlag
        })
        .then(res => {
          if (integralGoods) {
            this.$message.success("上架成功");
          } else {
            this.$message.success("下架成功");
          }
          this.query();
        });
    },
    // 弹窗关闭
    handleClose() {
      this.$refs["form"].resetFields();
      this.integralMask = false;
      this.integralForm = {
        convertibleIntegral: null,
        integralGoods: 0
      };
      this.currentRow = null;
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
    textmatter(row, column) {
      return row[column.property] ? row[column.property] : "-";
    },
    // 是否上架
    isputaway(row, column) {
      return row[column.property] === 1 ? "是" : "否";
    },
    // 数值格式化
    nummatter(row, column) {
      return row[column.property] ? row[column.property] : "0";
    },
    // 金额格式化
    moneymatter(row, column) {
      return row[column.property] ? "￥" + row[column.property] : "0";
    },
    // 采购二价取值
    price2(row, column) {
      return row[column.property] ? row[column.property] : 0;
    },
    rate(row, column) {
      return row[column.property] / 10 ? row[column.property] / 10 : 0;
    },
    showImageDialog(codes) {
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
      this.$http
        .get("excel/getGoodsListExcel", {
          params: { ...this.queryForm, isAccFlag: true }
        })
        .then(res => {
          window.open(`${imgHost + res}`, "_blank");
        });
    }),
    openMask(e) {
      this.$alert(`<img src="${imgHost + e}" style="width: 100%"/>`, {
        dangerouslyUseHTMLString: true,
        closeOnPressEscape: true
      }).catch(_ => {
        return;
      });
    }
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
