<!--  -->
<template>
  <el-dialog
    title="商品搜索"
    :visible.sync="mask"
    width="1200px"
    :before-close="handleClose"
    :close-on-click-modal="false"
  >
    <Screen @query="query" @reset="query" />
    <Tabel
      :columns="columns"
      :radioObj="radioObj"
      :table-data="goodsList"
      :loading="loading"
      :page-index="queryForm"
      @radioChange="radioChange"
    />
    <pagination
      :total="goodsTotal"
      @pagination="goodsPagination"
      @handleSizeChange="handleSizeChange"
    />
    <div class="btn">
      <el-button type="primary" @click="Submit">确认</el-button>
      <el-button @click="handleClose">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import Tabel from "@/components/Table";
import pagination from "@/components/Pagination";
import Screen from "../../components/screen";
export default {
  components: {
    Tabel,
    pagination,
    Screen
  },
  props: {
    mask: {
      type: Boolean,
      default: false
    },
    radioObj: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      loading: false,
      goodsList: [],
      currentRow: {},
      goodsTotal: 0,
      queryForm: {
        size: 50,
        current: 1
      },
      // 表格显示数据
      columns: [
        {
          prop: "goodsid",
          label: "货品ID"
        },
        {
          prop: "goodsname",
          label: "货品名",
          width: 150
        },
        {
          prop: "classname",
          label: "品类",
          width: 150
        },
        {
          prop: "goodsunit",
          label: "单位"
        },
        {
          prop: "zxB2bNumLimit",
          label: "最小销售数量"
        },
        {
          prop: "goodstype",
          label: "规格"
        },
        {
          prop: "convertibleIntegral",
          label: "积分"
        },
        {
          prop: "isputaway",
          label: "是否上架"
        },
        {
          prop: "isLot",
          label: "是否抽奖"
        },
        {
          prop: "remark",
          label: "备注"
        },
        {
          prop: "goodsqty",
          label: "库存"
        },
        {
          prop: "barcode",
          label: "商品条码",
          width: 150
        },
        {
          prop: "factoryname",
          label: "厂家",
          width: 180
        },
        {
          prop: "currencyname",
          label: "通用名",
          width: 150
        },
        {
          prop: "medicinetypename",
          label: "★剂型"
        },
        {
          prop: "storagecondition",
          label: "贮藏"
        },
        {
          prop: "classname",
          label: "作用分类",
          width: 180
        },
        {
          prop: "approvedocno",
          label: "批准文号"
        },
        {
          prop: "invaliddate",
          label: "有效期",
          width: 150
        }
      ]
    };
  },
  created() {
    this.query();
  },
  watch: {
    mask(val) {
      console.log(val);
    }
  },
  methods: {
    query(queryForm) {
      if (queryForm) {
        this.queryForm = queryForm;
      }
      this.loading = true;
      this.$http
        .get("/goods/goodsList", { params: this.queryForm })
        .then(data => {
          this.loading = false;
          this.goodsList = data.records.map(item => {
            // item.zxB2bNumLimit /= 10000;
            item.picture = item.goodsImgList
              .filter(item => item.type === "img")
              .map(item => item.code)[0];
            if (!item.picture) {
              item.imgMessage = "无图片";
            }
            item.isputaway = item.isputaway === 1 ? "是" : "否";
            item.isLot = item.isLot === 1 ? "是" : "否";
            item.Storage = item.storagecondition + "," + item.transcondition;
            return item;
          });
          this.goodsTotal = data.total;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    radioChange(row) {
      this.currentRow = row;
    },
    Submit() {
      console.log(this.currentRow);
      this.$emit("Submit", this.currentRow);
    },
    goodsPagination({ page: current, limit: size }) {
      this.queryForm.current = current;
      this.query();
    },
    handleSizeChange({ page: current, limit: size }) {
      this.queryForm.size = size;
      this.query();
    },
    handleClose() {
      this.currentRow = {};
      this.radioObj.radioId = null;
      this.$emit("handleClose");
    }
  }
};
</script>

<style lang="less" scoped>
.btn {
  text-align: center;
}
</style>
