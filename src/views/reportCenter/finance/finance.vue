<template>
  <div style="margin-left: 10px">
    <!-- 筛选 -->
    <el-row>
      <el-col :span="24">
        <div class="row-col" style="margin-top: 10px;font-size:12px" @keyup.enter="query()">
          <el-input
            v-model.trim="TotalList.recId"
            placeholder="请输入B2B收款单ID"
            style="width:145px;margin-right: 10px"
            clearablex
            size="small"
          />
          <el-input
            v-model.trim="TotalList.erpCustomerId"
            placeholder="请输入ERP客户ID"
            style="width:145px;margin-right: 10px"
            clearablex
            size="small"
          />
          <el-input
            v-model.trim="TotalList.erpGoodsId"
            placeholder="请输入ERP商品ID"
            style="width:145px;margin-right: 10px"
            clearablex
            size="small"
          />
          <el-date-picker
            v-model.trim="createDate"
            type="daterange"
            align="right"
            style="width: 340px; margin-right: 13px"
            unlink-panels
            range-separator="至"
            start-placeholder="有效期"
            end-placeholder="有效期"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptions"
          />
          <el-button v-permission="'IntegralRecordLook'" type="primary" icon="el-icon-search" @click="handleSearch">筛选</el-button>
          <el-button type="info" @click="TotalList= {size: 50,current: 1,};createDate=[];query()">重置</el-button>
        </div>
      </el-col>
    </el-row>
    <el-button v-permission="'IntegralRecordReset'" type="primary" style="margin-top:10px" @click="openIntegralMask">导出对账单</el-button>
    <!-- 表单 -->
    <Tabel
      ref="singleTable"
      :columns="columns"
      :table-data="giveRiseList"
      :loading="loading"
      :page-index="TotalList"
      @handleCurrent="handleCurrent"
      @handleSelectionChange="handleSelectionChange"
    />
    <Pagination :total="total" @pagination="totalPagination" @handleSizeChange="handleSizeChange" />

  </div>
</template>

<script>
  import { _throttle } from '@/utils/public';
  import Pagination from '@/components/Pagination';
  const Tabel = () => import('@/components/Table');
  export default {
    name: "Finance",
    components: {
      Pagination, Tabel
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
        currentRow: {},
        erpCustomerId: null,
        recId: null,
        erpGoodsId: null,
        columns: [
          {
            prop: 'salesId',
            label: 'ERP销售发货单ID',
            width: 110
          },
          {
            prop: 'recId',
            label: 'B2B收款单ID',
            width: 100
          },
          {
            prop: 'OrderId',
            label: 'B2B订单ID',
            width: 100
          },
          {
            prop: 'orderNo',
            label: 'B2B订单编号',
            width: 180
          },
          {
            prop: 'recId',
            label: '变更积分',
          },
          {
            prop: 'expenseDate',
            label: '费用发生时间',
            width: 180
          },
          {
            prop: 'wmsBackDate',
            label: '出库时间',
            width: 180
          },
          {
            prop: 'billDate',
            label: '账单日期',
            width: 180
          },
          {
            prop: 'balanceDate',
            label: '结算时间',
            width: 180

          },
          {
            prop: 'userName',
            label: '买家名称',
            width: 230,
          },
          {
            prop: 'salesId',
            label: 'ERP客户编号',
            width: 100
          },

          {
            prop: 'recTotal',
            label: '收款单金额',
            width: 100
          },
          {
            prop: 'goodsAmount',
            label: '订单应付金额',
            width: 100
          },
          {
            prop: 'salesId',
            label: '订单实付金额',
            width: 100
          },
          {
            prop: 'erpGoodsId',
            label: 'ERP商品ID',
            width: 100
          },
          {
            prop: 'goodsName',
            label: '商品名称',
            width: 200,
          },
          {
            prop: 'goodsSpec',
            label: '规格',
            width: 120
          },
          {
            prop: 'goodsNum',
            label: '商品数量',
          },
          {
            prop: 'sellNum',
            label: 'ERP实际发货数量',
            width: 100
          },
          {
            prop: 'amountNum',
            label: '小计',
            width: 100
          },
          {
            prop: 'amountPay',
            label: '小计后价格',
            width: 100
          },
          {
            prop: 'entryName',
            label: '独立单元',
            width: 200
          },
          {
            prop: 'entryId',
            label: '独立单元Id',
            width: 100
          },
          // {
          //   prop: 'amountNum',
          //   label: '小计',
          // },
          {
            prop: 'settleTypeId',
            label: 'ERP结算方式',
            width: 100
          },
          {
            prop: 'orderFrom',
            label: 'B2B订单来源',
            width: 100
          },
        ],
        // 日期
        pickerOptions: {
          shortcuts: [
            {
              text: '最近一周',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit('pick', [start, end]);
              },
            },
            {
              text: '最近一个月',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                picker.$emit('pick', [start, end]);
              },
            },
            {
              text: '最近三个月',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                picker.$emit('pick', [start, end]);
              },
            },
          ],
        },
        ids: '',
        integralMask: false,
        integralForm: {
          content: '',
          chanScore: 0,
          remark: '',
        },
        memberId: null,
        createDate: [],
      };
    },
    created() {
      this.erpCustomerId = this.$route.query.erpCustomerId;
      this.recId = this.$route.query.recId;
      this.erpGoodsId = this.$route.query.erpGoodsId;
      console.log(this.recId,this.erpCustomerId,this.erpGoodsId)
      this.query(this.recId,this.erpCustomerId,this.erpGoodsId);
    },
    methods: {
      query(recId,erpCustomerId,erpGoodsId) {
        this.loading = true;
        if (this.createDate) {
          this.TotalList.startTime = this.createDate[0];
          this.TotalList.endTime = this.createDate[1];
        }
        if (this.TotalList.erpCustomerId !== undefined && this.TotalList.erpCustomerId !== '') {
          erpCustomerId = this.TotalList.erpCustomerId;
        }
        if (this.TotalList.erpGoodsId !== undefined && this.TotalList.erpGoodsId !== '') {
          erpGoodsId = this.TotalList.erpGoodsId;
        }
        if (this.TotalList.recId !== undefined && this.TotalList.recId !== '') {
          recId = this.TotalList.recId;
        }
        console.log(recId,erpCustomerId,erpGoodsId,this.TotalList.startTime,this.TotalList.endTime);
        this.$http.get('statement/list', { params: { ...this.TotalList, recId,erpCustomerId,erpGoodsId }}).then(res => {
           //console.log(JSON.parse(JSON.stringify(res)));
          console.log(res);
          this.giveRiseList = res.records;
          this.total = res.total;
        }).finally(() => {
          this.loading = false;
        });
      },
      // 设置状态
      setStaet(item, stateArr) {
        let state = null;
        stateArr.forEach(e => {
          if (item === e.val) {
            state = e.desc;
            return;
          }
        });
        return state;
      },
      // 筛选
      handleSearch() {
        this.TotalList.size = 10;
        this.TotalList.current = 1;
        this.query();
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
      // 选中行事件
      handleCurrent(val) {
        if (val === null) return;
        this.currentRow = { ...val };
      },
      handleSelectionChange(val) {
        let ids = '';
        val.map(item => {
          ids += item.id;
        });
        this.ids = ids;
      },
      //导出对账单
      openIntegralMask() {
        if (this.createDate) {
          this.TotalList.startTime = this.createDate[0];
          this.TotalList.endTime = this.createDate[1];
        }
        console.log(this.TotalList.startTime,this.TotalList.endTime)
        if(this.TotalList.startTime < '2020-12-01'){
          this.$message.error('开始时间不能小于2020-12-1');
          console.log('开始时间小于----------------2020-12-01')
        }else{
          console.log('开始时间大于2020-12-01')
          this.$http.get('statement/exportStatementXls', { params: {
              startDate:this.TotalList.startTime ,
              endDate :this.TotalList.endTime
            }}).then(res => {
            console.log(res);
            console.log('成功');
          }).finally(() => {
            this.loading = false;
          }).catch((err) =>{
            console.log(err);
            console.log('失败');
          });
        }

      },

    }
  }
</script>

<style scoped>

</style>
