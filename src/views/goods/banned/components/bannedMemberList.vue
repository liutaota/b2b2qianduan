<template>
  <div style="margin-left: 10px">
    <!-- 集合总单 -->
    <div class="tabs">
      <div class="search-wrap">
        <div class="tabTitle">客户集合</div>
        <!-- 筛选 -->
        <div class="search" style="margin: 10px 0;font-size:12px" @keyup.enter="query()">
          <el-input
            v-model.trim="memberSrach.customsetname"
            placeholder="请输入客户集合名称"
            style="width:145px;margin-right: 10px"
            clearablex
            size="small"
          />
          <el-button type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
        </div>
      </div>
      <Tabel :table-data="memberList" :columns="columns" :is_height="height" :loading="loading" :page-index="memberSrach" @handleCurrent="handleCurrent" />
      <Pagination :total="total" @pagination="totalPagination" @handleSizeChange="totalSizeChange" />
    </div>
    <!-- 集合细单 -->
    <div class="tabs">
      <div class="search-wrap">
        <div class="tabTitle">客户集合</div>
      </div>
      <Tabel :table-data="memberFine" :columns="memberTab" :is_height="height" :loading="loadings" :page-index="suborderList" />
      <div class="pagination">
        <Pagination :total="fineTotal" :page="page" @pagination="suborderPagination" @handleSizeChange="suborderSizeChange" />
      </div>
    <!-- 分页 -->
    </div>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination';
import Tabel from '@/components/Table';
export default {
  name: 'BannedMemberList',
  components: {
    Tabel, Pagination
  },
  data() {
    return {
      loading: true,
      loadings: true,
      page: 2,
      // 总单表格显示数据
      columns: [
        {
          prop: 'customsetid',
          label: '集合ID',
        },
        {
          prop: 'customsetname',
          label: '客户集合名称'
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
      memberTab: [
        {
          prop: 'customid',
          label: '客户ID'
        },
        {
          prop: 'customname',
          label: '客户名称'
        },
        {
          prop: 'customno',
          label: '客户分类码'
        },
        {
          prop: 'gspusestatus',
          label: '质量状态'
        }
      ],
      memberList: [],
      memberFine: [],
      total: 1,
      fineTotal: 1,
      // 总单请求数据
      memberSrach: {
        size: 50,
        current: 1,
        customsetname: null,
      },
      // 细单请求数据
      suborderList: {
        size: 50,
        current: 1,
        setid: null
      },
      // table 高度
      height: 215,
      heights: 215
    };
  },
  watch: {
    memberSrach: {
      handler: function(val) {
        if (val.customsetname === '') {
          this.query();
        }
      },
      deep: true
    }
  },
  mounted() {
    this.memberSrach.customsetname = this.$route.query.customsetname;
    this.query();
  },
  methods: {
    // 总单
    query() {
      this.loading = true;
      this.$http.get('member/getAdminMemberList', {
        params: {
          ...this.memberSrach
        }
      }).then(res => {
        res.records.map(e => { e.usestatus = e.usestatus === 1 ? '正常' : ''; });
        this.memberList = res.records;
        this.total = res.total;
        // 判断总单是否有数据
        if (res.records.length === 0) {
          this.memberFine = [];
          this.suborder = 1;
          return false;
        }
        this.getAdminGoodsInfo(res.records[0].customsetid);
      }).finally(() => {
        this.loading = false;
      });
    },
    // 筛选
    handleSearch() {
      this.memberSrach.size = 20;
      this.memberSrach.current = 1;
      if (this.search === '') {
        this.memberSrach.customsetname = '';
      }
      this.query();
    },
    // 细单
    getAdminGoodsInfo(customsetid) {
      this.loadings = true;
      if (customsetid) {
        this.suborderList.customsetid = customsetid;
      }
      this.$http.get('member/getAdminMemberListById', { params: { ...this.suborderList }}).then(res => {
        res.records.map(e => {
          switch (e.gspusestatus) {
            case 3:
              e.gspusestatus = '质量禁止';
              break;
            case 1:
              e.gspusestatus = '质量可用';
              break;
            default:
              break;
          }
        });
        this.memberFine = res.records;
        this.fineTotal = res.total;
      }).finally(() => {
        this.loadings = false;
      });
    },
    // 选中行事件
    handleCurrent(val) {
      this.suborderList.size = 20;
      this.suborderList.current = 1;
      if (val) this.getAdminGoodsInfo(val.customsetid);
    },
    // 总单分页事件
    totalPagination({ page: current, limit: size }) {
      this.memberSrach.current = current;
      this.query();
    },
    totalSizeChange({ page: current, limit: size }) {
      this.memberSrach.size = size;
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
    // 序号
    indexMethod(index) {
      return (this.suborderList.current - 1) * this.suborderList.size + index + 1;
    }
  }
};
</script>

<style lang="less">
.tabs{
  font-size: 14px;
  padding: 5px 10px;
  padding-left: 0;
  margin-bottom: -10px;
  .tabTitle {
    display: inline-block;
    position: absolute;
    bottom: 0;
    padding: 10px;
    border: 1px solid #ccc;
    border-bottom: 1px solid #fff;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    color: #3894FF;
  }
  .search{
    display: inline-block;
    position: absolute;
    right: 0;
  }
  .search-wrap{
    position: relative;
    height: 50px;
  }
  .el-table{
    margin: 0 !important;;
  }
}
 .pagination-container {
    background: #fff;
    padding: 10px 16px 10px !important;;
    margin-top: 10px !important;
  }
</style>
