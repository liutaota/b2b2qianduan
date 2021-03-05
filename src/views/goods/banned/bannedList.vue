<template>
  <div style="margin: 0 10px" class="banned">
    <!-- 筛选 -->
    <Screen @query="query" v-permission="'BannedListLook'" />
    <div class="goodsBtn">
      <el-button v-permission="'BannedListCustomer'" type="primary" @click="MemberList()">客户集合</el-button>
      <el-button v-permission="'BannedListGoods'" type="success" @click="goodsList()">货品集合</el-button>
    </div>
    <Tabel :columns="columns" :table-data="goodsBanList" :loading="loading" :page-index="queryForm" @handleCurrent="handleCurrent" />
    <!-- 分页器 -->
    <pagination
      :total="total"
      @pagination="pagination"
      @handleSizeChange="handleSizeChange"
    />
  </div>
</template>

<script>
import { _throttle } from '@/utils/public';
import Pagination from '@/components/Pagination';
import Tabel from '@/components/Table';
import Screen from './components/screen';
export default {
  name: 'BannedList',
  components: {
    Tabel, Screen, Pagination
  },
  data() {
    return {
      queryForm: {
        size: 50,
        current: 1,
      },
      goodsBanList: [],
      // 表格显示数据
      columns: [
        {
          prop: 'forbidflag',
          label: '禁销类型',
        },
        {
          prop: 'customsetname',
          label: '客户集合'
        },
        {
          prop: 'customsetusestatus',
          label: '客户集合状态'
        },
        {
          prop: 'goodssetname',
          label: '货品集合'
        },
        {
          prop: 'goodssetusestatus',
          label: '货品集合状态'
        },
        {
          prop: 'usestatus',
          label: '使用状态'
        },
        {
          prop: 'memo',
          label: '备注'
        },
        {
          prop: 'credate',
          label: '录入日期'
        }
      ],
      total: 1,
      loading: true,
      // 选中数据行
      currentRow: null
    };
  },
  mounted() {
    this.query();
  },
  methods: {
    query(queryForm) {
      if (queryForm) {
        this.queryForm.size = 20;
        this.queryForm.current = 1;
        this.queryForm = queryForm;
      }
      this.loading = true;
      this.$http.get('goods/getBannedList', {
        params: {
          ...this.queryForm,
        }
      }).then(res => {
        // this.goodsBanList = [];
        res.records.map(e => {
          e.forbidflag = e.forbidflag === 1 ? '禁销' : '限销';
          e.customsetusestatus = e.customsetusestatus === 1 ? '正常' : '停用';
          e.goodssetusestatus = e.goodssetusestatus === 1 ? '正常' : '停用';
          e.usestatus = e.usestatus === 1 ? '正常' : '作废';
        });
        this.total = res.total;
        this.goodsBanList = res.records;
      }).finally(() => {
        this.loading = false;
      });
    },
    // 分页事件
    // pagination ({ page: current, limit: size }) {
    //   this.queryForm.current = current;
    //   this.queryForm.size = size;
    //   this.query();
    // },
    // 分页事件
    pagination({ page: current, limit: size }) {
      this.queryForm.current = current;
      this.query();
    },
    handleSizeChange({ page: current, limit: size }) {
      this.queryForm.size = size;
      this.query();
    },
    // 客户集合
    MemberList: _throttle(function() {
      if (this.currentRow === null || this.currentRow === undefined) {
        this.$message({
          message: '未选中列表',
          type: 'warning'
        });
        return;
      }
      const customsetname = this.currentRow.customsetname || null;
      this.$router.push({ path: 'bannedMemberList', query: { customsetname }});
    }),
    // 货品集合
    goodsList: _throttle(function() {
      if (this.currentRow === null || this.currentRow === undefined) {
        this.$message({
          message: '未选中列表',
          type: 'warning'
        });
        return;
      }
      const goodssetname = this.currentRow.goodssetname;
      this.$router.push({ path: 'bannedGoodsList', query: { goodssetname }});
    }),
    // 选中行事件
    handleCurrent(val) {
      this.currentRow = val;
    },
    // 序号
    indexMethod(index) {
      return (this.queryForm.current - 1) * this.queryForm.size + index + 1;
    }
  },
};
</script>

<style scoped lang='less'>
.search{
  text-align: center;
  margin: 10px 0;
}
.goodsBtn{
  float: left;
  margin:10px 0;
  .el-button{
     font-size: 12px !important;
  }
}
</style>
