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
            v-model.trim="TotalList.erpGoodsId"
            placeholder="请输入商品ID"
            style="width: 145px; margin-right: 10px"
            size="small"
          />
          <el-input
            v-model.trim.number="TotalList.goodsName"
            placeholder="请输入商品名称"
            style="width: 145px; margin-right: 10px"
            size="small"
          />
          <el-button type="primary" icon="el-icon-search" @click="query"
            >查询</el-button
          >
          <el-button
            type="info"
            @click="
              TotalList = { size: 50, current: 1 };
              query();
            "
            >重置</el-button
          >
        </div>
      </el-col>
    </el-row>
    <!-- <div style="margin-top: 10px">
      <el-button type="primary" :loading="deliveryAdd" @click="deliveryAdd = true;">新增规则</el-button>
    </div> -->
    <!-- 表单 -->
    <Tabel
      :columns="columns"
      :table-data="giveRiseList"
      :loading="loading"
      :page-index="TotalList"
    >
    </Tabel>
    <Pagination
      :total="total"
      @pagination="totalPagination"
      @handleSizeChange="handleSizeChange"
    />
  </div>
</template>

<script>
import { _throttle } from "@/utils/public";
import Pagination from "@/components/Pagination";
import { imgHost } from "@/config";
import Tabel from "@/components/Table";
export default {
  name: "ExchangePoints",
  components: {
    Pagination,
    Tabel,
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
      height: 500,
      columns: [
        {
          prop: "orderNo",
          label: "订单号",
        },
        {
          prop: "erpGoodsId",
          label: "商品编号",
        },
        {
          prop: "goodsName",
          label: "商品名称",
        },
        {
          prop: "erpUserId",
          label: "用户id",
        },
        {
          prop: "userName",
          label: "用户名称",
        },
        {
          prop: "goodsNum",
          label: "商品数量",
        },
        {
          prop: "goodsSpec",
          label: "商品规格",
        },
        {
          prop: "goodsScore",
          label: "兑换积分",
        },
        {
          prop: "createTime",
          label: "兑换时间",
        },
      ],
    };
  },
  watch: {
    TotalList: {
      handler(val) {
        if (val.goodsId === "" && val.goodsName === "") {
          this.query();
        }
      },
      deep: true,
    },
  },
  created() {
    this.query();
  },
  mounted() {},
  methods: {
    query() {
      this.loading = true;
      this.$http
        .get("order/getOrderGoodsBy9", { params: { ...this.TotalList } })
        .then((res) => {
          this.total = res.total;
          this.giveRiseList = res.records;
        })
        .finally(() => {
          this.loading = false;
        });
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
    // 文本格式化
    textmatter(row, column) {
      if (row[column.property] === 0) {
        return row[column.property];
      }
      return row[column.property] ? row[column.property] : "-";
    },
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
