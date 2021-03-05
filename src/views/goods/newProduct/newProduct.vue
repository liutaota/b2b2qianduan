<template>
  <div style="margin: 0 10px">
    <!-- 筛选 -->
    <el-row>
      <el-col :span="24">
        <div class="row-col" style="margin-top: 10px;font-size:12px" @keyup.enter="query()">
          <el-input
            v-model.trim.number="TotalList.goodsName"
            placeholder="请输入商品名称"
            style="width:145px;margin-right: 10px"
            clearablex
            size="small"
            :loading="loading"
          />
          <el-input
            v-model.trim.number="TotalList.approvedocno"
            placeholder="请输入批准文号"
            style="width:145px;margin-right: 10px"
            clearablex
            size="small"
            :loading="loading"
          />
          <el-button type="primary" icon="el-icon-search" @click="query()">查询</el-button>
          <el-button type="info" @click="toReset">重置</el-button>
        </div>
      </el-col>
    </el-row>
    <!-- 新品登记列表 -->
    <Tabel
      :table-data="NewProductList"
      :columns="columns"
      :loading="loading"
      :page-index="TotalList"
      @handleCurrent="handleCurrent"
    />
    <Pagination :total="total" @pagination="totalPagination" @handleSizeChange="handleSizeChange" />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination';
import Tabel from '@/components/Table';
export default {
  name: 'NewProductVue',
  components: {
    Tabel, Pagination
  },
  data() {
    return {
      loading: true,
      loadings: true,
      // 新品登记表格
      columns: [
        {
          prop: 'goodsName',
          label: '商品名称',
        },
        {
          prop: 'spec',
          label: '规格'
        },
        {
          prop: 'num',
          label: '数量'
        },
        {
          prop: 'memberName',
          label: '会员名称'
        },
        {
          prop: 'telephone',
          label: '手机号',
        },
        {
          prop: 'approvedocno',
          label: '批准文号'
        },
        {
          prop: 'price',
          label: '建议价格'
        },
        {
          prop: 'channel',
          label: '货源渠道'
        },
        {
          prop: 'imageNum',
          label: '图片',
        },
        {
          prop: 'companyName',
          label: '厂家',
        },
        {
          prop: 'remark',
          label: '备注',
        },
        {
          prop: 'createTime',
          label: '添加时间',
        }
      ],
      NewProductList: [],
      // 页码
      total: 1,
      // 搜索数据
      TotalList: {
        current: 1,
        size: 50,
        goodsName: '',
        approvedocno: ''
      }
    };
  },
  watch: {
    TotalList: {
      handler: function(val) {
        if (val.goodsName === '' && val.approvedocno === '') {
          this.query();
        }
      },
      deep: true
    }
  },
  mounted() {
    this.query();
  },
  methods: {
    query() {
      this.loading = true;
      this.$http.get('goods/getNewProductList', {
        params: {
          ...this.TotalList
        }
      }).then(res => {
        this.NewProductList = res.records;
        this.total = res.total;
      }).finally(() => {
        this.loading = false;
      });
    },
    toReset() {
      this.TotalList = { size: 50, current: 1 };
      this.query();
    },
    // 选中行事件
    handleCurrent(val) {},
    // 分页事件
    totalPagination({ page: current, limit: size }) {
      this.TotalList.current = current;
      this.query();
    },
    handleSizeChange({ page: current, limit: size }) {
      this.TotalList.size = size;
      this.query();
    },
  }
};
</script>

<style scoped>

</style>
