<template>
  <div ref="tableCot" style="margin:0 10px">
    <!-- <Screen
      v-permission="'luckDrawScreen'"
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
    </Screen> -->
    <div v-permission="'luckDrawScreen'" style="margin:10px 0">
      <el-input
        v-model.trim="queryForm.goodsname"
        placeholder="请输入商品名称"
        style="width:130px;margin-right: 20px"
        clearablex
      />
      <el-input
        v-model.trim="queryForm.erpGoodsId"
        placeholder="请输入商品ID"
        style="width:130px;margin-right: 20px"
        clearablex
      />
      <el-select
        slot="select"
        v-model.trim="queryForm.status"
        size="small"
        placeholder="是否抽奖"
        style="width:145px;margin-right: 20px"
      >
        <el-option label="全部" value="All" />
        <el-option label="否" value="OFF" />
        <el-option label="是" value="ON" />
      </el-select>
      <el-button type="primary" @click="queryForm.size = 50;queryForm.current = 1;query();">查询</el-button>
      <el-button type="info" @click="queryForm={size:50,current:1};query()">重置</el-button>
    </div>
    <el-button
      v-permission="'GoodsIntegralGoodsAdd'"
      type="primary"
      style="margin: 10px 5px"
      @click="openAddEdit"
      >新增抽奖商品</el-button
    >
    <!-- <el-button
      v-permission="'GoodsIntegralGoodsEdit'"
      type="primary"
      plain
      style="margin: 10px 5px"
      @click="goodsCompile()"
      >货品编辑</el-button
    > -->
    <!-- <el-button
      v-permission="'GoodsIntegralEdit'"
      type="primary"
      style="margin: 10px 5px"
      @click="integralEdit()"
      >积分编辑</el-button
    > -->
    <!-- <el-button
      v-permission="'GoodsIntegralExport'"
      type="primary"
      style="margin: 10px 5px"
      @click="goodsExport()"
      >导出Excel</el-button
    > -->
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
          prop="erpGoodsId"
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
          label="通用名"
          prop="currencyname"
          width="200"
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
          label="规格"
          prop="goodstype"
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
        <el-table-column label="是否抽奖" prop="goodsStatus" />
        <el-table-column
          label="抽奖数量"
          prop="lotNum"
          :formatter="nummatter"
        />
        <el-table-column
          label="备注"
          prop="remark"
          width="120"
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
            <span v-if="!scope.row.imgMessage">
              {{ scope.row.goodsImgList.length }}
            </span>
            <span v-else :alt="scope.row.imgMessage">
              {{ scope.row.imgMessage }}</span
            >
          </template>
        </el-table-column>
        <el-table-column label="库存" prop="goodsqty" :formatter="nummatter" />
        <el-table-column
          label="时间"
          prop="createTime"
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
          label="是否抽奖"
          fixed="right"
          :formatter="showImageDialog"
        >
          <template slot-scope="scope">
            <el-switch
            v-permission="'luckDrawStatus'"
              v-model.trim="scope.row.status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              inactive-value="OFF"
              active-value="ON"
              @change="editGoods(scope.row)"
            />
          </template>
        </el-table-column>
        <!-- <el-table-column
          label="是否上架"
          fixed="right"
          :formatter="showImageDialog"
        >
          <template slot-scope="scope">
            <el-switch
              v-model.trim="scope.row.integralGoods"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :inactive-value="0"
              :active-value="1"
              @change="handleSwith(scope.row)"
            />
          </template>
        </el-table-column> -->
        <el-table-column
          label="操作"
          fixed="right"
          :formatter="showImageDialog"
          
        >
          <template slot-scope="scope">
            <el-button type="primary" @click="openUpdate(scope.row)" v-permission="'luckDrawOperation'"
              >编辑</el-button
            >
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
      :title="title + '商品'"
      :visible.sync="goodsMask"
      width="500px"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <el-form ref="form" :rules="rules" :model="goodsForm" label-width="120px">
        <el-form-item label="商品选择" prop="erpGoodsId">
          <div class="goods_box">
            <div class="goodsList one-hidden">
              <span v-if="currentRow">{{ currentRow.goodsname }}</span>
            </div>
            <el-button
              type="primary"
              @click="selGoodsMask = true"
              v-if="title === '新增'"
              >选择商品</el-button
            >
            <el-button type="info" v-else>选择商品</el-button>
          </div>
        </el-form-item>
        <el-form-item label="抽奖数量" prop="lotNum">
          <el-input v-model.trim.number="goodsForm.lotNum" />
        </el-form-item>
        <el-form-item label="是否参与抽奖">
          <el-switch
            v-model.trim="goodsForm.status"
            active-color="#13ce66"
            inactive-color="#ff4949"
            inactive-value="OFF"
            active-value="ON"
          />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model.trim="goodsForm.remark"
            type="textarea"
            rows="4"
            placeholder="请输入备注"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="addGoods('form')"
            v-if="title === '新增'"
            >确认</el-button
          >
          <el-button type="primary" @click="editGoods()" v-else
            >确认</el-button
          >
          <el-button @click="handleClose('form')">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <ChoiceGoods
      :mask="selGoodsMask"
      :radioObj="radioObj"
      @Submit="
        row => {
          currentRow = row;
          goodsForm.erpGoodsId = row.erpGoodsId;
          selGoodsMask = false;
        }
      "
      @handleClose="selGoodsMask = false"
    />
  </div>
</template>
<script>
import pagination from "@/components/Pagination";
import FsImg from "@/components/FsImg";
import Screen from "../components/screen";
import ChoiceGoods from "./components/choiceGoods";

import { imgHost } from "@/config";
import { _throttle } from "@/utils/public";
import moment from "moment";
export default {
  name: "LuckDrawGoods",
  components: {
    pagination,
    FsImg,
    Screen,
    ChoiceGoods
  },
  data() {
    return {
      dialogVisible: false,
      queryForm: {
        size: 50,
        current: 1,
      },
      isLot: null,
      isIntegralGoods: null,
      isShowImageDialog: false,
      tableData: [],
      goodsTotal: 0,
      showImageSrc: "",
      currentRow: null,
      loading: false,
      Height: 450,
      goodsForm: {
        convertibleIntegral: null
      }, // 积分
      goodsMask: false, // 积分弹窗
      rules: {
        convertibleIntegral: [
          { required: true, message: "请输入兑换积分", trigger: "blur" }
        ],
        lotNum: [
          { required: true, message: "请输入抽奖数量", trigger: "blur" }
        ],
        erpGoodsId: [{ required: true, message: "请选择商品", trigger: "blur" }]
      },
      selGoodsMask: false,
      radioObj: {
        // 商品选择开启单选
        isRadio: true,
        prop: "goodsid",
        width: "38",
        radioId: null
      },
      title: "新增"
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
    openUpdate(row) {
      this.goodsMask = true;
      this.goodsForm = {
        goodsname: row.goodsname,
        lotNum: row.lotNum,
        status: row.status,
        remark: row.remark,
        erpGoodsId: row.erpGoodsId,
        id: row.id
      };
      this.title = "编辑";
    },
    // 添加抽奖商品
    addGoods() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.$http
            .post("adminLotter/addLotteryGoods", this.goodsForm)
            .then(res => {
              this.$message.success("编辑抽奖商品成功");
              this.query();
              this.handleClose();
            });
        }
      });
    },
    editGoods(row) {
      let isForm = true;
      let message = "";
      if (row) {
        this.goodsForm = {
          goodsname: row.goodsname,
          lotNum: row.lotNum,
          status: row.status,
          remark: row.remark,
          erpGoodsId: row.erpGoodsId,
          id: row.id
        };
        message = "是否抽奖更改成功";
      } else {
        this.$refs["form"].validate(valid => {
          isForm = valid;
        });
        message = "添加抽奖商品成功";
      }
      if (!isForm) return;
      this.$http
        .post("adminLotter/updateLotteryGoods", this.goodsForm)
        .then(res => {
          this.$message.success(message);
          this.query();
          this.handleClose();
        });
    },
    query() {
      console.log(this.queryForm);

      this.loading = true;
      this.$http
        .get("/adminLotter/getLotteryGoodsList", {
          params: this.queryForm
        })
        .then(data => {
          this.tableData = data.records.map(item => {
            if (item.goodsImage) {
              item.goodsImgList = JSON.parse(item.goodsImage);
              item.picture = item.goodsImgList
                .filter(item => item.type === "img")
                .map(item => item.code)[0];
            }

            if (!item.picture) {
              item.imgMessage = "无图片";
            }
            item.goodsStatus = item.status === "OFF" ? "否" : "是";
            return item;
          });
          this.goodsTotal = data.total;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    // 选择数据行
    handleCurrent(val) {
      if (val) {
        this.currentRow = val;
        // this.goodsForm = { ...val };
      }
    },
    openAddEdit() {
      this.goodsMask = true;
      this.title = "新增";
    },
    // 是否上架
    handleSwith(row) {
      const { erpGoodsId, accflag: erpAccFlag, integralGoods } = row;
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
      if (this.$refs["form"]) {
        this.$refs["form"].resetFields();
      }
      this.goodsMask = false;
      this.goodsForm = {};
      this.radioObj.radioId = null;
      this.currentRow = null;
    },
    // 分页事件
    goodsPagination({ page: current, limit: size }) {
      this.queryForm.current = current;
      this.query();
    },
    handleSizeChange({ page: current, limit: size }) {
      console.log(2);
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
.goods_box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.goodsList {
  border: 1px solid #dcdfe6;
  flex: 1;
  height: 28px;
  border-radius: 4px;
  margin-right: 10px;
  padding: 0 10px;
  display: flex;
  align-items: center;
  span {
    width: 225px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
</style>
