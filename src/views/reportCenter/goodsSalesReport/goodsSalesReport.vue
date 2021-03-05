<template>
  <div style="margin-left: 10px">
    <!-- 商品销售报表 -->
    <!-- 筛选 -->
    <el-row>
      <el-col :span="24">
        <div class="row-col" style="margin-top: 10px;font-size:12px" @keyup.enter="query()">
<!--          <el-input-->
<!--            v-model.trim="TotalList.goodsId"-->
<!--            placeholder="请输入商品ID"-->
<!--            style="width:145px;margin-right: 10px"-->
<!--            clearablex-->
<!--            size="small"-->
<!--          />-->
<!--          <el-input-->
<!--            v-model.trim="TotalList.planId"-->
<!--            placeholder="请输入计划ID"-->
<!--            style="width:145px;margin-right: 10px"-->
<!--            clearablex-->
<!--            size="small"-->
<!--          />-->

<!--          <el-input-->
<!--            v-model.trim="TotalList.factoryId"-->
<!--            placeholder="请输入生产厂商ID"-->
<!--            style="width:145px;margin-right: 10px"-->
<!--            clearablex-->
<!--            size="small"-->
<!--          />-->
<!--          <el-input-->
<!--            v-model.trim="TotalList.factoryName"-->
<!--            placeholder="请输入生产厂商名称"-->
<!--            style="width:200px;margin-right: 10px"-->
<!--            clearablex-->
<!--            size="small"-->
<!--          />-->
<!--          <el-input-->
<!--            v-model.trim="TotalList.extractType"-->
<!--            placeholder="请输入统计类型：1按计划，2按月份"-->
<!--            style="width:250px;margin-right: 10px"-->
<!--            clearablex-->
<!--            size="small"-->
<!--          />-->

          <el-date-picker
            v-model.trim="createDate"
            type="daterange"
            align="right"
            style="width: 340px; margin-right: 13px;"
            unlink-panels
            range-separator="至"
            start-placeholder="有效期"
            end-placeholder="有效期"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptions"
          />
          <el-button v-permission="'IntegralRecordLook'" type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
          <el-button type="info" @click="TotalList= {size: 50,current: 1,};createDate=[];query()">重置</el-button>
          <el-button v-permission="'exportStatement'"  type="primary" @click="exportStatement()" >导出</el-button>
        </div>
      </el-col>
    </el-row>

    <!-- 表单 -->
    <Tabel
      ref="singleTable"
      :columns="columns"
      :table-data="giveRiseList"
      :loading="loading"
      :page-index="TotalList"
      @handleCurrent="handleCurrent"
      @handleSelectionChange="handleSelectionChange"
    >
      <el-table-column slot="handleColumn" label="操作" fixed="right" width="100">
        <template slot-scope="scope">
<!--          <el-button-->
<!--            size="mini"-->
<!--            type="primary"-->
<!--            @click="systemDialogVisible = true;  form = {...scope.row}"-->
<!--          >查看</el-button>-->
          <el-button
            size="mini"
            type="primary"
            @click="selectByPlanId( form = {...scope.row})"
          >查看</el-button>

        </template>
      </el-table-column>
    </Tabel>

    <Pagination :total="total" @pagination="totalPagination" @handleSizeChange="handleSizeChange" />

    <el-dialog
      :visible.sync="systemDialogVisible"
      width="40%"
      :before-close="handleSystemClose"
      :close-on-click-modal="false"
    >
      <template slot="title">
        <div class="titleZise">
          <span>商品销售报表修改</span>
        </div>
      </template>
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="ID：">
          <el-input v-model.trim="form.id" type="textarea" rows="4" resize="none" />
        </el-form-item>
        <el-form-item label="备注：">
          <el-input v-model.trim="form.remark" type="textarea" rows="4" resize="none" />
        </el-form-item>
        <el-form-item>
          <el-button size="mini" type="primary" @click="handleSystemReply">修改</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog :title="formTitle" :visible.sync="addVersions">
      <el-form :model="form">
        <el-form-item label="版本号" label-width="7.5rem">
          <el-input v-model="form.chinese" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注" label-width="7.5rem">
          <el-input v-model="form.english" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="sureFormSubmit">确 定</el-button>
      </div>
    </el-dialog>

    <!--    查看-->
    <el-dialog
      :visible.sync="selectGetPlanId"
      width="50%"
      :before-close="closeSelectGetPlanId"
      :close-on-click-modal="false"
    >
      <template slot="title">
        <div class="titleZise">
          <span>统计计划的指标完成量</span>
        </div>
      </template>
      <el-form :model="form" class="form">
        <div class="formDiv">
          <el-form-item label="计划名称" label-width="7.5rem">
            <el-input v-model="form.planName" autocomplete="off" disabled="disabled" style="width: 300px"></el-input>
          </el-form-item>
          <el-form-item label="指标销量" label-width="7.5rem">
            <el-input v-model="form.planNum" autocomplete="off" disabled="disabled" style="width: 300px"></el-input>
          </el-form-item>
        </div>
        <div class="formDiv">
          <el-form-item label="已完成数量" label-width="7.5rem">
            <el-input v-model="form.completeGoodsQty" autocomplete="off" disabled="disabled" style="width: 300px"></el-input>
          </el-form-item>
          <el-form-item label="未完成数量" label-width="7.5rem">
            <el-input v-model="form.notCompleteGoodsQty" autocomplete="off" disabled="disabled" style="width: 300px"></el-input>
          </el-form-item>
        </div>

        <div class="formDiv">
          <el-form-item label="计划开始日期" label-width="7.5rem">
            <el-input v-model="form.planStartDate"  disabled="disabled" style="width: 300px"></el-input>
          </el-form-item>
          <el-form-item label="计划结束日期" label-width="7.5rem">
            <el-input v-model="form.planEndDate"  disabled="disabled" style="width: 300px"></el-input>
          </el-form-item>
        </div>
        <div class="formDiv">
          <el-form-item label="销售单位" label-width="7.5rem">
            <el-input v-model="form.statisticsUnits" autocomplete="off" disabled="disabled" style="width: 300px"></el-input>
          </el-form-item>
          <el-form-item label="描述" label-width="7.5rem">
            <el-input v-model="form.remark" autocomplete="off" disabled="disabled" style="width: 300px"></el-input>
          </el-form-item>
        </div>
        <el-form-item label="商品ID及名称" label-width="7.5rem">
          <el-input v-model="goodsStr" autocomplete="off" type="textarea" rows="7" disabled="disabled" style="width: 715px"></el-input>
        </el-form-item>
      </el-form>
      <div>
        <div ref="chart" style="width: 600px;margin:0px auto; height: 500px;margin-top: 20px;"></div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="closeSelectGetPlanId">确 定</el-button>
      </div>
    </el-dialog>

  </div>

</template>

<script>
  import Pagination from '@/components/Pagination';
  const Tabel = () => import('@/components/Table');
  import  {ossUrl} from '@/config.js'
  import Tinymce from '@/components/Tinymce';
  import FsImg from '@/components/FsImg';
  import { imgHost } from '@/config';

  export default {
    name: "GoodsSalesReport",
    components: {
      Pagination, Tabel,Tinymce, FsImg
    },
    data() {
      return {
        eChartsData:[10,50],
        srcName:'',
        selectGetPlanId:false,
        loading: true,
        //表单绑定数据data
        giveRiseList: [],
        // 页码
        total: 1,
        // 搜索
        TotalList: {
          size: 50,
          current: 1,
        },
        current: {},
        //选中行数据
        currentRow: {},
        //选中行的id
        ids: '',
        //修改弹窗
        systemDialogVisible: false,
        formTitle: '新增商品销售报表',//表单标题
        //新增版本
        addVersions: false,
        //新增对话框表单
        form: {
          chinese: '',
          english: '',
        },
        //表单显示列
        columns: [
          {
            prop: 'planId',
            label: '主键',
            width: 120
          },
          {
            prop: 'planName',
            label: '计划名称',
            width: 250
          },
          {
            prop: 'planNum',
            label: '指标销量',
            width: 150,
            formatter: 'moneymatter',
          },
          {
            prop: 'completeGoodsQty',
            label: '已完成指标销量',
            width: 150,
            formatter: 'moneymatter',
          },
          {
            prop: 'notCompleteGoodsQty',
            label: '未完成指标销量',
            width: 150,
            formatter: 'moneymatter',
          },
          {
            prop: 'statisticsUnits',
            label: '基本单位',
            width: 150,
          },
          {
            prop: 'completePercent',
            label: '已完成率',
            width: 150,
          },
          {
            prop: 'notCompletePercent',
            label: '未完成率',
            width: 150,
          },
        {
            prop: 'planStartDate',
            label: '计划开始日期',
            width: 200
          },
          {
            prop: 'planEndDate',
            label: '计划结束日期',
            width: 200
          },
          {
            prop: 'useStatus',
            label: '状态',
            width: 150
          },
          {
            prop: 'remark',
            label: '描述',
            width: 200
          },
          {
            prop: 'inputId',
            label: '录入人员ID',
            width: 150
          },
          {
            prop: 'createDate',
            label: '创建日期',
            width: 200
          },
          {
            prop: 'confirmId',
            label: '确认人员ID',
            width: 150
          },
          {
            prop: 'confirmDate',
            label: '确认时间',
            width: 200
          },
          {
            prop: 'unConfirmId',
            label: '回退人员ID',
            width: 150
          },
          {
            prop: 'unConfirmDate',
            label: '回退日期',
            width: 200
          }
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
        //筛选时间
        createDate: [],
        //查询条件
        goodsId:'',
        planId:'',
        extractType:'',
        factoryId:'',
        factoryName:'',
        plan_num:0,
        //拼接商品名称及id
        goodsStr:'',
        goodStatisticsUnits:''
      };
    },
    mounted() {
      this.drawLine();
    },
    created() {
      //查询条件goodsId,planId,extractType,factoryId
      this.goodsId = this.$route.query.goodsId;
      this.planId = this.$route.query.planId;
      this.extractType = this.$route.query.extractType;
      this.factoryId = this.$route.query.factoryId;
      //console.log(this.goodsId,this.planId,this.extractType,this.factoryId)
      this.query(this.goodsId,this.planId,this.extractType,this.factoryId);
    },
    methods: {
      //关闭查看完成计划
      closeSelectGetPlanId(){
        this.selectGetPlanId = false;
      },
      //查看完成计划
      selectByPlanId(e){
        //console.log(e);
        this.$http.get('/report/goods/statistics/getGoodsStrById',
          { params:{ planId : e.planId }}
        ).then(res => {
          //console.log(res)
          this.goodsStr = res.goodsStr ;
        }).finally(() => {
          this.loading = false;
        }).catch((err) =>{
          console.log(err);
          this.$message.error('获取商品ID和名称异常');
        });
        if(e.statisticsUnits != null){
          this.goodStatisticsUnits = e.statisticsUnits;
        }else{
          this.goodStatisticsUnits = ''
        }
        this.plan_num = e.planNum;
        this.eChartsData = [e.completeGoodsQty,e.notCompleteGoodsQty];
        setTimeout(() => {
          //  执行echarts画图方法
          this.drawLine();
        }, 0);
        this.selectGetPlanId = true;
      },
      //echarts图表
      drawLine() {
        // 基于准备好的dom，初始化echarts实例
        var chart = this.$refs.chart;
        if (chart) {
          let myChart = this.$echarts.init(chart);
          // 绘制图表
          myChart.setOption({
            color:['#426ab3','#f15b6c'],
            title: {
              text: '统计计划的指标完成量',
              subtext: '指标销量:'+this.plan_num,
              left: 'left'
            },
            tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b}: {c} ({d}%)'
            },
            legend: {
              orient: 'vertical',
              right : 10,
              data: ['已完成 数量:'+this.eChartsData[0]+this.goodStatisticsUnits, '未完成 数量:'+this.eChartsData[1]+this.goodStatisticsUnits,]
            },
            series: [{
              name: '访问来源',
              type: 'pie',
              radius: ['50%', '70%'],
              avoidLabelOverlap: false,
              label: {
                show: false,
                position: 'center'
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: '30',
                  fontWeight: 'bold'
                }
              },
              labelLine: {
                show: false
              },
              data: [{
                value: this.eChartsData[0],
                name: '已完成 数量:'+this.eChartsData[0]+this.goodStatisticsUnits
              },
                {
                  value: this.eChartsData[1],
                  name: '未完成 数量:'+this.eChartsData[1]+this.goodStatisticsUnits
                }
              ]
            }]
          });
        }
      },
      //导出数据
      exportStatement(goodsId,planId,extractType,factoryId,factoryName){
        this.loading = true;
        if (this.createDate) {
          this.TotalList.startDate = this.createDate[0];
          this.TotalList.endDate = this.createDate[1];
        }
        if (this.TotalList.goodsId !== undefined && this.TotalList.goodsId !== '') {
          goodsId = this.TotalList.goodsId;
        }
        if (this.TotalList.planId !== undefined && this.TotalList.planId !== '') {
          planId = this.TotalList.planId;
        }
        if (this.TotalList.extractType !== undefined && this.TotalList.extractType !== '') {
          extractType = this.TotalList.extractType;
        }
        if (this.TotalList.factoryId !== undefined && this.TotalList.factoryId !== '') {
          factoryId = this.TotalList.factoryId;
        }
        if (this.TotalList.factoryName !== undefined && this.TotalList.factoryName !== '') {
          factoryName = this.TotalList.factoryName;
        }
        console.log(this.TotalList);
        this.$http.get('/report/goods/statistics/exportPlanReportXls', {
          params: {...this.TotalList },
        })
          .then(res => {
            window.open(`${ossUrl + res}`, "_blank");
            this.query()
          }).catch(() => {
          this.$message.error('下载失败')
        })
      },
      /**
       * 文件导出
       */
      downloadFile(res) {
        if (!data) {
          return
        }
        const link = document.createElement('a');
        let blob = new Blob([data], {type: 'application/vnd.ms-excel'});
        link.style.display = 'none';
        link.href = URL.createObjectURL(blob);

        link.setAttribute('download', '记录信息' + '.xls');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      },
      //新增提交表单
      sureFormSubmit() {
        console.log(this.form.chinese,this.form.english,this.addFilePath);
        this.$http.get('',{
            params: {
              version:this.form.chinese,
              filePath: this.addFilePath,
              remark: this.form.english
            },
          }
        ).then((res) => {
          console.log(res);
          this.$message.success('新增版本成功');
          this.addVersions = false;
          this.query();
        }).catch((err) => {
          console.log(err);
          this.$message.error('新增版本错误');
        });
      },
      // 取消修改弹窗
      handleSystemClose() {
        this.systemDialogVisible = false;
      },
      // 修改
      handleSystemReply() {
        //console.log('---------------------------',this.form.remark,this.form.id)
        if(this.form.remark !== undefined && this.form.remark !== '' ){
          this.$http.get('', { params: { id:this.form.id, newRemark: this.form.remark }}
          ).then(() => {
            this.$message.success('修改成功');
            this.handleSystemClose();
            this.query();
            this.form = {};
          });
        }else {
          this.$message.error('备注信息不能为空');
        }
      },
      query(goodsId,planId,extractType,factoryId,factoryName) {
        this.loading = true;
        if (this.createDate) {
          this.TotalList.startDate = this.createDate[0];
          this.TotalList.endDate = this.createDate[1];
        }
        if (this.TotalList.goodsId !== undefined && this.TotalList.goodsId !== '') {
          goodsId = this.TotalList.goodsId;
        }
        if (this.TotalList.planId !== undefined && this.TotalList.planId !== '') {
          planId = this.TotalList.planId;
        }
        if (this.TotalList.extractType !== undefined && this.TotalList.extractType !== '') {
          extractType = this.TotalList.extractType;
        }
        if (this.TotalList.factoryId !== undefined && this.TotalList.factoryId !== '') {
          factoryId = this.TotalList.factoryId;
        }
        //factoryName
        if (this.TotalList.factoryName !== undefined && this.TotalList.factoryName !== '') {
          factoryName = this.TotalList.factoryName;
        }
        //console.log(this.TotalList,goodsId,planId,extractType,factoryId,factoryName)
        this.$http.get('/report/goods/statistics/list/v2', { params:
            { ...this.TotalList,goodsId,planId,extractType,factoryId }}).then(res => {
          console.log(res)
          res.records.map((item) => {
            // 将图片json格式转为对象
            if (item.useStatus == 1) {
              item.useStatus = "临时";
            } else {
              item.useStatus = "正式";
            }
          });
          this.giveRiseList = res.records;
          this.total = res.total;
        }).finally(() => {
          this.loading = false;
        }).catch((err) =>{
          console.log(err);
        });
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
        //console.log(this.currentRow)
      },
      handleSelectionChange(val) {
        let ids = '';
        val.map(item => {
          ids += item.id;
        });
        this.ids = ids;
      },

    }
  }
</script>

<style scoped>
.formDiv{
  display: flex;
}

</style>

