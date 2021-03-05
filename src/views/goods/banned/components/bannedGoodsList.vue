<template>
  <div style="margin: 0 10px">
    <!-- 筛选 -->
    <el-row>
      <el-col :span="24">
        <div class="row-col" style="margin-top: 10px;font-size:12px" @keyup.enter="query()">
          <el-input
            v-model.trim="TotalList.goodssetname"
            placeholder="请输入货品名称"
            style="width:145px;margin-right: 10px"
            clearablex
            size="small"
            :loading="loading"
          />
          <el-button type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
        </div>
      </el-col>
    </el-row>
    <!-- 集合总单 -->
    <Tabel :table-data="goodsList" :columns="columns" :is_height="250" :loading="loading" :page-index="TotalList" @handleCurrent="handleCurrent" />
    <Pagination :total="total" @pagination="totalPagination" @handleSizeChange="totalSizeChange" />
    <!-- 集合细单 -->
    <Tabel :table-data="goodsFine" :columns="GoodsInfo" :is_height="250" :loading="loadings" :page-index="suborderList" />
    <!-- 分页 -->
    <Pagination :total="suborder" @pagination="suborderPagination" @handleSizeChange="suborderSizeChange" />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination';
import Tabel from '@/components/Table';
export default {
  name: 'BannedGoodsList',
  components: {
    Tabel, Pagination
  },
  data() {
    return {
      loading: true,
      loadings: true,
      // 总单表格显示数据
      columns: [
        {
          prop: 'goodssetid',
          label: '集合ID',
        },
        {
          prop: 'goodssetname',
          label: '货品集合名称'
        },
        {
          prop: 'entryname',
          label: '独立单元'
        },
        {
          prop: 'inputmaname',
          label: '建立人'
        },
        {
          prop: 'usestatus',
          label: '使用状态'
        },
        {
          prop: 'credate',
          label: '建立时间'
        }
      ],
      // 细单表格显示数据
      GoodsInfo: [
        {
          prop: 'setenumdtlid',
          label: '细单ID',
        },
        {
          prop: 'goodsname',
          label: '通用名'
        },
        {
          prop: 'goodsunit',
          label: '基本单位'
        },
        {
          prop: 'goodstype',
          label: '规格'
        },
        {
          prop: 'factoryname',
          label: '厂商'
        },
        {
          prop: 'gspusestatus',
          label: '质量状态'
        }
      ],
      goodsList: [],
      goodsFine: [],
      // 总单页码
      total: 1,
      // 细单页码
      suborder: 1,
      // 总单数据
      TotalList: {
        size: 50,
        current: 1,
        goodssetname: '',
      },
      suborderList: {
        size: 50,
        current: 1,
        goodssetid: null
      },
    };
  },
  watch: {
    TotalList: {
      handler: function(val) {
        if (val.goodssetname === '') {
          this.query();
        }
      },
      deep: true
    }
  },
  mounted() {
    this.TotalList.goodssetname = this.$route.query.goodssetname || null;
    this.query();
  },
  methods: {
    // 总单
    query() {
      this.loading = true;
      this.$http.get('goods/getAdminGoodsList', {
        params: {
          ...this.TotalList
        }
      }).then(res => {
        res.records.map(e => { e.usestatus = e.usestatus === 1 ? '正常' : ''; });
        this.goodsList = res.records;
        this.total = res.total;
        // 判断总单是否有数据
        if (res.records.length === 0) {
          this.goodsFine = [];
          this.suborder = 1;
          return false;
        }
        this.getAdminGoodsInfo(res.records[0].goodssetid);
      }).finally(() => {
        this.loading = false;
      });
    },
    // 筛选
    handleSearch() {
      this.TotalList.size = 10;
      this.TotalList.current = 1;
      this.suborderList.size = 20;
      this.suborderList.current = 1;
      this.query();
    },
    // 细单
    getAdminGoodsInfo(goodssetid) {
      this.loadings = true;
      if (goodssetid) {
        this.suborderList.goodssetid = goodssetid;
      }
      this.$http.get('goods/getAdminGoodsListById', { params: { ...this.suborderList }}).then(res => {
        // 添加 table 高度
        this.goodsFine = res.records;
        this.suborder = res.total;
      }).finally(() => {
        this.loadings = false;
      });
    },
    // 选中行事件
    handleCurrent(val) {
      if (val) this.getAdminGoodsInfo(val.goodssetid);
    },
    // 总单分页事件
    // totalPagination({ page: current, limit: size }) {
    //   this.TotalList.current = current;
    //   this.TotalList.size = size;
    //   this.query();
    // },
    // 分页事件
    totalPagination({ page: current, limit: size }) {
      this.TotalList.current = current;
      this.query();
    },
    totalSizeChange({ page: current, limit: size }) {
      this.TotalList.size = size;
      this.query();
    },
    // 细单分页事件
    suborderPagination({ page: current, limit: size }) {
      this.suborderList.current = current;
      this.getAdminGoodsInfo();
    },
    suborderSizeChange({ page: current, limit: size }) {
      this.suborderList.size = size;
      this.getAdminGoodsInfo();
    },
  }
};
</script>

<style>
</style>
