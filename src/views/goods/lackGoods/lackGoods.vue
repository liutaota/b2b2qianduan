<template>
  <div style="margin: 0 10px">
    <!-- 筛选 -->
    <el-row>
      <el-col :span="24">
        <div class="row-col" style="margin-top: 10px;font-size:12px" @keyup.enter="query()">
          <el-input
            v-model.trim.number="TotalList.memberId"
            placeholder="请输入客户id"
            style="width:145px;margin-right: 10px"
            clearablex
            size="small"
            :loading="loading"
          />
          <el-input
            v-model.trim.number="TotalList.goodsId"
            placeholder="请输入货品编号"
            style="width:145px;margin-right: 10px"
            clearablex
            size="small"
            :loading="loading"
          />
          <el-select v-model.trim="TotalList.anStatus" placeholder="请选择" style="margin-right: 10px">
            <el-option label="未处理" value="UNTREATED" />
            <el-option label="已发通知" value="SENT_KNOW" />
            <el-option label="已加入购物车" value="ADDED_SHOPPING_CART" />
            <el-option label="已删除" value="HAVE_DELETED" />
          </el-select>
          <el-button v-permission="'LackGoodsLook'" type="primary" icon="el-icon-search" @click="query()">查询</el-button>
          <el-button type="info" @click="toReset">重置</el-button>
          <el-button v-permission="'LackGoodsExcel'" type="primary" @click="goodsExport()">导出Excel</el-button>
        </div>
      </el-col>
    </el-row>
    <!-- 缺货登记列表 -->
    <Tabel :table-data="goodsList" :columns="columns" :loading="loading" :page-index="TotalList" @handleCurrent="handleCurrent" />
    <Pagination :total="total" @pagination="totalPagination" @handleSizeChange="totalSizeChange" />
  </div>
</template>

<script>
import { _throttle } from '@/utils/public';
import { imgHost } from '@/config';
import Pagination from '@/components/Pagination';
import Tabel from '@/components/Table';
export default {
  name: 'LackGoods',
  components: {
    Tabel, Pagination
  },
  data() {
    return {
      loading: true,
      loadings: true,
      // 缺货登记表格
      columns: [
        {
          prop: 'goodsName',
          label: '商品名称',
          width: 140
        },
        {
          prop: 'erpGoodsId',
          label: '商品编号'
        },
        {
          prop: 'goodsNum',
          label: '数量'
        },
        {
          prop: 'memberId',
          label: '会员id'
        },
        {
          prop: 'memberName',
          label: '会员名称',
          width: 350
        },
        {
          prop: 'anMobile',
          label: '手机号',
          width: 150
        },
        {
          prop: 'anStatus',
          label: '状态'
        },
        {
          prop: 'remark',
          label: '备注'
        },
        {
          prop: 'sellTime',
          label: '截止时间',
          width: 180
        },
        {
          prop: 'createTime',
          label: '添加时间',
          width: 180
        }
      ],
      goodsList: [],
      // 页码
      total: 1,
      // 搜索数据
      TotalList: {
        size: 50,
        current: 1,
        goodsId: '',
        anStatus: ''
      },
    };
  },
  watch: {
    TotalList: {
      handler: function(val) {
        if (val.goodsId === '' && val.anStatus === '' && val.erpUserId === '') {
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
      this.$http.get('goods/getArrivalNoticeList', {
        params: {
          ...this.TotalList
        }
      }).then(res => {
        res.records.map(item => {
          // 判断类型
          switch (item.anStatus) {
            case 'UNTREATED':
              item.anStatus = '未处理';
              break;
            case 'SENT_KNOW':
              item.anStatus = '已发通知';
              break;
            case 'ADDED_SHOPPING_CART':
              item.anStatus = '已加入购物车';
              break;
            case 'HAVE_DELETED':
              item.anStatus = '已删除';
              break;
            default:
              break;
          }
        });
        this.goodsList = res.records;
        this.total = res.total;
      }).finally(() => {
        this.loading = false;
      });
    },
    // 筛选
    handleSearch() {
      this.TotalList.size = 20;
      this.TotalList.current = 1;
      if (this.search === '') {
        this.TotalList.goodssetname = '';
      }
      this.query();
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
    totalSizeChange({ page: current, limit: size }) {
      this.TotalList.size = size;
      this.query();
    },
    goodsExport: _throttle(function() {
      this.$http.get('excel/getArrivalNoticeListExcel', { params: { ...this.TotalList }}).then(res => {
        window.open(
          `${imgHost + res}`,
          '_blank'
        );
      });
    }),
  }
};
</script>

<style>
.el-scrollbar__view{
  height: 150px;
}
</style>
