<template>
  <div style="margin-left: 10px">
    <!-- 商品销售计划 -->
    <el-row>
      <el-col :span="24">
        <div class="row-col" style="margin-top: 10px;font-size:12px" @keyup.enter="query()" @reset="isIntegralGoods=null">
          <el-input
            v-model.trim="TotalList.goodsId"
            placeholder="请输入商品ID"
            style="width:145px;margin-right: 10px"
            clearablex
            size="small"
          />
          <el-input
            v-model.trim="TotalList.planName"
            placeholder="请输入计划名称"
            style="width:145px;margin-right: 10px"
            clearablex
            size="small"
          />
          <el-select
            slot="select"
            v-model.trim="useStatus"
            size="small"
            placeholder="选择状态"
            style="width:145px;margin-right: 20px"
          >
            <el-option  label="正式" :value="2" />
            <el-option label="临时" :value="1" />
            <el-option label="全部" aria-selected="true" :value="0" />
          </el-select>
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
          <el-button v-permission="'IntegralRecordLook'" type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
          <el-button type="info" @click="TotalList= {size: 50,current: 1,};createDate=[];query()">重置</el-button>
        </div>
      </el-col>
    </el-row>
    <el-button v-permission="'addGoodsPlan'"  type="primary" @click="addGoodsPlan" style="margin-top:10px" >新增</el-button>
    <!--    变更计划状态-->
    <el-button v-permission="'updatePlanUseStatus'"  type="primary" @click="updatePlanUseStatus" style="margin-top:10px" >确定</el-button>
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
      <el-table-column slot="handleColumn" label="操作" fixed="right" width="170">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="update( form = {...scope.row})"
          >修改</el-button>
<!--          <el-button
            size="mini"
            type="primary"
            @click="selectByPlanId( form = scope.row.planId)"
          >查看</el-button>
              systemDialogVisible = true;  form = {...scope.row}      -->
          <el-button
            size="mini"
            type="danger"
            @click="delSelect(form = {...scope.row})"
          >删除</el-button>

<!--          deletePlanById = true-->
        </template>
      </el-table-column>
    </Tabel>

    <Pagination :total="total" @pagination="totalPagination" @handleSizeChange="handleSizeChange" />

    <!--  商品销售计划修改  -->
    <el-dialog
      :visible.sync="systemDialogVisible"
      width="50%"
      :before-close="updateClose"
      :close-on-click-modal="false"
    >
      <template slot="title">
        <div class="titleZise">
          <span>商品销售计划修改</span>
        </div>
      </template>
      <el-form ref="form" :model="form" label-width="100px">
        <div v-model.trim="updates.id"  hidden="hidden"></div>
        <el-form-item label="计划名称：">
          <el-input v-model.trim="updates.planName"  autocomplete="off" v-if="useStatusUpdate == '正式'" disabled="disabled" />
          <el-input v-model.trim="updates.planName"  autocomplete="off" v-else />
        </el-form-item>
        <el-form-item label="商品：">
          <el-input v-model.trim="jointGoodsName"  type="textarea" rows="4" v-if="useStatusUpdate == '正式'" disabled="disabled" />
          <el-input v-model="jointGoodsName" type="textarea" rows="4" disabled="disabled" v-else></el-input>
          <el-button
            size="mini"
            type="primary"
            @click="updateGoods"
          >编辑商品</el-button>
          <!--          selectByPainId( updates.planId)-->
        </el-form-item>
        <el-form-item label="指标销量：">
          <el-input v-model.trim="updates.planNum"  autocomplete="off" v-if="useStatusUpdate == '正式'" disabled="disabled" />
          <el-input v-model.trim="updates.planNum"  autocomplete="off" v-else />
        </el-form-item>
        <el-form-item label="计划开始日期" label-width="7.5rem">
          <el-date-picker value-format="yyyy-MM-dd" v-model.trim="updates.planStartDate"  autocomplete="off" v-if="useStatusUpdate == '正式'" disabled="disabled" />
          <el-date-picker value-format="yyyy-MM-dd" v-model="updates.planStartDate" type="date" placeholder="选择日期" v-else> </el-date-picker>
        </el-form-item>
        <el-form-item label="计划结束日期" label-width="7.5rem">
          <el-date-picker value-format="yyyy-MM-dd" v-model.trim="updates.planEndDate"  autocomplete="off" v-if="useStatusUpdate == '正式'" disabled="disabled" />
          <el-date-picker value-format="yyyy-MM-dd" v-model="updates.planEndDate" type="date" placeholder="选择日期" v-else> </el-date-picker>
        </el-form-item>
        <el-form-item label="描述" label-width="7.5rem">
          <el-input v-model.trim="updates.remark"  autocomplete="off" v-if="useStatusUpdate == '正式'" disabled="disabled" />
          <el-input v-model="updates.remark" type="textarea" rows="4" v-else></el-input>
        </el-form-item>
        <el-form-item style="margin-left: 300px">
          <el-button size="mini" type="primary" @click="handleSystemReply" v-if="useStatusUpdate == '正式'" disabled="disabled">修改</el-button>
          <el-button size="mini" type="primary" @click="handleSystemReply" v-else>修改</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 删除-->
    <el-dialog
      :visible.sync="deletePlanById"
      width="30%"
      :before-close="closedelConfirm"
      :close-on-click-modal="false"
    >

      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="温馨提示：">
          <span style="font-size: 15px">确定删除 {{form.planName}} 商品销售计划吗？</span>
        </el-form-item>
        <el-form-item >
          <el-button size="mini" type="primary" @click="delConfirm" >确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 变更计划状态-->
    <el-dialog
      :visible.sync="updatePlanUseStatusById"
      width="30%"
      :before-close="closeUpdatePlanUseStatusById"
      :close-on-click-modal="false"
    >
      <template slot="title">
        <div class="titleZise">
          <span>变更计划状态</span>
        </div>
      </template>
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="提示：">
          <span>确定变更计划状态吗？</span>
        </el-form-item>
        <el-form-item >
          <el-button size="mini" type="primary" @click="updatePlanUseStatusByIdConfirm" >确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!--  新增商品销售计划  -->
    <el-dialog :title="formTitle" :visible.sync="addVersions"
               :before-close="closeAdd"
               :close-on-click-modal="false">
      <el-form :model="form">
        <el-form-item label="计划名称" label-width="7.5rem">
          <el-input v-model="form.planName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品名称" label-width="7.5rem">
          <el-input v-model="jointGoodsName" type="textarea" rows="4" disabled="disabled"></el-input>
          <el-button type="primary" @click="addGoodsId()">选择商品</el-button>
<!--          <el-button type="primary" @click="isShowGoods">选择</el-button>-->
        </el-form-item>
        <el-form-item label="指标销量" label-width="7.5rem">
          <el-input v-model="form.planNum" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="统计基本单位" label-width="7.5rem" >
          <!--<el-select v-model.trim="form.statisticsUnits" placeholder="请选择" :click="elSelectClick(form.statisticsUnits)">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>-->
          <el-input v-model="goodsUnit" autocomplete="off" disabled="disabled"></el-input>
          <span class="span">*基本单位只做参考，可能与实际有差别</span>
        </el-form-item>
        <el-form-item label="计划开始日期" label-width="7.5rem">
          <el-date-picker value-format="yyyy-MM-dd" v-model="form.planStartDate" type="date" placeholder="选择日期"> </el-date-picker>
        </el-form-item>
        <el-form-item label="计划结束日期" label-width="7.5rem">
          <el-date-picker value-format="yyyy-MM-dd" v-model="form.planEndDate" type="date" placeholder="选择日期"> </el-date-picker>
        </el-form-item>
        <el-form-item label="描述" label-width="7.5rem">
          <el-input v-model="form.remark" autocomplete="off" type="textarea" rows="4"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="sureFormSubmit" >确 定</el-button>
      </div>
    </el-dialog>

    <!--    选择商品 -->
    <el-dialog
      :visible.sync="getaddGoodsId"
      width="70%"
      :before-close="closeGetaddGoodsId"
      :close-on-click-modal="false"
    >
      <template slot="title">
        <div class="titleZise">
          <span>{{select}}</span>
        </div>
      </template>
      <el-row>
        <el-col :span="24">
          <div class="row-col" style="margin-top: 10px;font-size:12px" @keyup.enter="getSelectGoodsList()" @reset="isIntegralGoods=null">
            <el-input
              v-model.trim="TotalList.goodsId"
              placeholder="请输入商品ID"
              style="width:110px;margin-right: 10px"
              clearablex
              size="small"
            />
            <el-input
              v-model.trim="TotalList.goodsName"
              placeholder="请输入商品名称"
              style="width:200px;margin-right: 10px"
              clearablex
              size="small"
            />
            <el-input
              v-model.trim="TotalList.factoryId"
              placeholder="请输入厂家ID"
              style="width:110px;margin-right: 10px"
              clearablex
              size="small"
            />
            <el-input
              v-model.trim="TotalList.factoryName"
              placeholder="请输入厂家名称"
              style="width:200px;margin-right: 10px"
              clearablex
              size="small"
            />
            <el-button v-permission="'IntegralRecordLook'" type="primary" icon="el-icon-search" @click="handleSearchSelectGoodsList">筛选</el-button>
            <el-button type="info" @click="resetSelectGoodsList">重置</el-button>
            <!--     popupMask = true   popupMaskAdd   popupMaskAdd = true addPlanGoods-->
            <el-button type="primary" @click="addPlanGoods" v-if="select == '查看商品'">添加</el-button>
            <Tabel
              ref="singleTable"
              :columns="selectGoodsListColumns"
              :table-data="selectGoodsList"
              :loading="loading"
              :page-index="TotalList"
              @handleCurrent="handleCurrent"
              @handleSelectionChange="handleSelectionChangeByGoodsList"
            >
              <!--       删除商品       -->
              <el-table-column slot="handleColumn" label="操作" fixed="right" width="100" v-if="select === '查看商品'">
                <template slot-scope="scope" v-if="select === '查看商品'">
                  <el-button v-if="select === '查看商品'"
                    size="mini"
                    type="danger"
                    @click="delGetSelectGoodsList(form = {...scope.row})"
                  >删除</el-button>
                </template>
              </el-table-column>

              <el-table-column label="选择" fixed="left" slot="index" type="selection"  width="55" ></el-table-column>
            </Tabel>
            <Pagination :total="total" @pagination="totalPaginationGetSelectGoodsList" @handleSizeChange="handleSizeChangeGetSelectGoodsList" />
          </div>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="selectGoods()" v-if="select === '查看商品'">确 定</el-button>
        <el-button type="primary" @click="sureFormSubmitGetaddGoodsId" v-else>确 定</el-button>
      </div>
    </el-dialog>

    <!--    添加商品-->
    <el-dialog
      :visible.sync="addGoods"
      width="70%"
      :before-close="closeAddGoods"
      :close-on-click-modal="false"
    >
      <template slot="title">
        <div class="titleZise">
          <span>添加商品</span>
        </div>
      </template>
      <el-row>
        <el-col :span="24">
          <div class="row-col" style="margin-top: 10px;font-size:12px" @keyup.enter="getSelectGoodsList()" @reset="isIntegralGoods=null">
            <el-input
              v-model.trim="TotalList.goodsId"
              placeholder="请输入商品ID"
              style="width:110px;margin-right: 10px"
              clearablex
              size="small"
            />
            <el-input
              v-model.trim="TotalList.goodsName"
              placeholder="请输入商品名称"
              style="width:200px;margin-right: 10px"
              clearablex
              size="small"
            />
            <el-input
              v-model.trim="TotalList.factoryId"
              placeholder="请输入厂家ID"
              style="width:110px;margin-right: 10px"
              clearablex
              size="small"
            />
            <el-input
              v-model.trim="TotalList.factoryName"
              placeholder="请输入厂家名称"
              style="width:200px;margin-right: 10px"
              clearablex
              size="small"
            />
            <el-button v-permission="'IntegralRecordLook'" type="primary" icon="el-icon-search" @click="handleSearchSelectGoodsList">筛选</el-button>
            <el-button type="info" @click="TotalList= {size: 50,current: 1,};createDate=[];getSelectGoodsList()">重置</el-button>
            <Tabel
              ref="singleTable"
              :columns="selectGoodsListColumns"
              :table-data="selectGoodsList"
              :loading="loading"
              :page-index="TotalList"
              @handleCurrent="handleCurrent"
              @handleSelectionChange="handleSelectionChangeByGoodsList"
            >
              <el-table-column label="选择" fixed="left" slot="index" type="selection"  width="55" ></el-table-column>
            </Tabel>
            <Pagination :total="total" @pagination="totalPaginationGetSelectGoodsList" @handleSizeChange="handleSizeChangeGetSelectGoodsList" />
          </div>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="sureFormSubmitAddGoods" >确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="selectGetPlanId"
      width="70%"
      :before-close="closeSelectGetPlanId"
      :close-on-click-modal="false"
    >
      <div>
        <iframe-index :srcName="srcName"></iframe-index>
      </div>
    </el-dialog>

    <div>
      <Popup :dialog-form-visible="popupMask" :goods-list="goodsLists" @onSubmit="onSubmits" @cancel="cancel" />
    </div>

    <div>
      <PopupAdd :dialog-form-visible="popupMaskAdd" :goods-list="selectGoodsList" :str="useStatusUpdate" @onSubmitAdd="onSubmitAdd" @cancelAdd="cancelAdd" />
    </div>
  </div>
</template>

<script>
  import Pagination from '@/components/Pagination';
  const Tabel = () => import('@/components/Table');
  import Tinymce from '@/components/Tinymce';
  import FsImg from '@/components/FsImg';
  import Transfer from '@/components/Transfer';
  import iframeIndex from '@/components/Iframe/index';
  import { reportUrl } from "@/config";
  import qs from "qs";
  const Popup = () => import('./popup');
  const PopupAdd = () => import('./popupAdd');

  export default {
    name: "GoodsMarketingPlan",
    components: {
      Pagination, Tabel,Tinymce, FsImg,Transfer,iframeIndex,Popup,PopupAdd
    },
    data() {
      return {
        goodsUnit:'',
        popupMaskAdd:false,
        forms: {
          title: '选择商品',
          type: '',
          goodsLists: [],
        },
        srcName:'',
        selectGetPlanId:false,
        reportUrl:reportUrl,
        //选择商品 的标题
        select:'',
        //状态
        useStatus:0,
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
        //删除
        deletePlanById:false,
        formTitle: '新增商品销售计划',//表单标题
        //新增版本
        addVersions: false,
        //新增对话框表单
        form: {
          planName:'',
          goodsId:'',
          planNum:'',
          goodsType:'',
          goodsUnit:'',
          planStartDate:'',
          planEndDate:'',
          remark:'',
          statisticsUnits:''
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
            width: 300
          },
          {
            prop: 'confirmId',
            label: '确认人员ID',
            width: 150
          },
          {
            prop: 'confirmDate',
            label: '确认时间',
            width: 300
          },
          {
            prop: 'unConfirmId',
            label: '回退人员ID',
            width: 150
          },
          {
            prop: 'unConfirmDate',
            label: '回退日期',
            width: 300
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
        planName:'',
        //删除时的主键id
        plan_id:'',
        //确定变更计划状态弹窗
        updatePlanUseStatusById:false,
        //新增选择商品
        getaddGoodsId:false,
        //选择商品集合
        selectGoodsList:[],
        goodsName:'',
        goodsId:'',
        //显示商品列表
        selectGoodsListColumns:[
            {
              prop: 'goodsId',
              label: '商品ID',
              width: 120
            },
            {
              prop: 'goodsName',
              label: '商品名称',
              width: 250
            },
            {
              prop: 'factoryId',
              label: '厂商ID',
              width: 150
            },
            {
              prop: 'factoryName',
              label: '厂商名称',
              width: 220
            },
          {
            prop: 'prodArea',
            label: '原料产地',
            width: 150
          },
            {
              prop: 'goodsType',
              label: '规格',
              width: 150
            },
          {
            prop: 'goodsUnit',
            label: '基本单位',
            width: 150
          },
          {
            prop: 'medicineTypeName',
            label: '药品类型',
            width: 150
          },
          //
        ],
        //多选商品数组
        goodsList:[],
        //计划id
        planId:0,
        addGoods:false,
        //拼接添加商品id
        jointGoodsID:'',
        //拼接添加商品名称
        jointGoodsName:'',
        UseStatus:0,
        //根据
        updates:{},
        //新增选这基本单位
        options: [{
          value: 'kg',
          label: 'kg'
        }, {
          value: 'g',
          label: 'g'
        }, {
          value: '盒',
          label: '盒'
        }],
        //基本销售单位
        elSelectClickStatisticsUnits:'',
        selGoodsList: [],
        isSel:false, // 监听选中事件是否完成
        planStartDateForm:'',
        planEndDateForm:'',
        //选择商品的商品id
        goodsIdList:[],
        popupMask: false,
        popupGoodsList:[],
        goodsLists:[],
        useStatusUpdate:''
      };
    },
    created() {
      //查询条件
      this.goodsId = this.$route.query.goodsId;
      this.planName = this.$route.query.planName;
    },
    mounted() {
      this.query(this.goodsId,this.planName,this.useStatus);
    },
    methods: {
      updateGoods(){
        this.selectGoodsList = [];
        this.jointGoodsName = ''
        this.getUpdateGoodsList(this.planId);
        this.popupMaskAdd = true;
      },
      // 编辑商品添加取消弹窗
      cancelAdd() {
        this.popupMaskAdd = false;
        this.selectGoodsList = [];
      },
      //编辑商品添加确定
      onSubmitAdd(e){
        //console.log(e)
        //给数组对象添加计划ID
        this.selectGoodsList = e;
        this.selectGoodsList.forEach(item => {
          item['planId'] = this.planId;
        })
        let goodsList = this.selectGoodsList;
        this.jointGoodsName = '';
        goodsList.forEach(item => {
          this.jointGoodsName += item['goodsName']+'，';
        })
        this.$http.post('/report/goods/plan/addPlanGoods',goodsList
        ).then((res) => {
          //console.log(res)
        }).catch((err) => {
          console.log(err)
        }).finally(() => {
          this.cancelAdd();
        })
      },
      //获取编辑商品列表
      getUpdateGoodsList(planId){
        this.selectGoodsList = [];
        this.$http.get('/report/goods/plan/selectPlanGoodsListPage',{
            params: { ...this.TotalList,planId}
          }
        ).then((res) => {
          console.log(res)
          //let ress = res.records;
          this.selectGoodsList = res.records;
          res.records.forEach(item => {
            this.jointGoodsName += item['goodsName']+'，';
          })
        }).catch((err) => {
          console.log(err);
        });
      },
      // 取消弹窗
      cancel() {
        this.popupMask = false;
        //this.jointGoodsName = '';
      },
      // 接受弹窗数据
      onSubmits(e) {
        this.forms.goodsLists = [...e];
        this.forms.goodsLists.forEach(item => {
          this.jointGoodsID += item.goodsId +',';
          this.jointGoodsName += item.goodsName +'，';
          this.goodsIdList.push(item.goodsId);
        })
        let formGoodsList = this.forms.goodsLists;
        this.$http.post('/report/goods/plan/checkGoods',formGoodsList
        ).then((res) => {
          if(res.result == "failed"){
            this.$message.error(res.massage);
            this.jointGoodsName = '';
          }else if(res.result == "success"){
            this.popupGoodsList.push(...this.forms.goodsLists);
            this.goodsUnit = res.statisticsUnits;
          }
        }).catch((err) => {
          console.log(err);
          //this.$message.error('错误');
        }).finally((fin) =>{
          this.selectGoodsList = [];
        })
        this.cancel();
      },
      //点击新增销售计划按钮
      addGoodsPlan(){
        this.form = {};
        this.jointGoodsName = '';
        this.goodsList = [];
        this.addVersions= true
      },
      //选择基本销售单位的点击事件
      elSelectClick(e){
        this.elSelectClickStatisticsUnits = e;
      },
      //关闭查看完成计划
      closeSelectGetPlanId(){
        this.selectGetPlanId = false;
      },
      //查看完成计划
      selectByPlanId(e){
        let plan_id = e;
        //console.log(plan_id);
        this.selectGetPlanId = true;
        this.srcName = reportUrl+"ureport/preview?_u=db:统计计划的完成量.ureport.xml";
      },
      //添加商品时给选中的商品进行默认选中
      checked(){
        this.isSel = true;
        this.$nextTick(() => {
          // console.log(this.goodsList,this.selGoodsList)
          this.selectGoodsList.forEach((item) => {
            this.goodsList.map(data => {
              if (item.goodsId === data.goodsId) {
                this.$refs.singleTable.$refs.singleTable.toggleRowSelection(item, true);
              }
            })
          });
          this.isSel = false; // 数据添加选中完毕后改为false
        });
      },
      //关闭修改弹窗
      updateClose(){
        this.systemDialogVisible = false;
        //this.selectGoodsList = [];
      },
      //查看商品确定按钮
      selectGoods(){
        let form = this.updates;
        this.update(form)
        this.getaddGoodsId = false;
      },
      priceFormat(num) {
        let value=String(num);
        if (!value) return '0.00';
        let intPart = Number(value).toFixed(0); //获取整数部分
        let intPartFormat = intPart.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,'); //将整数部分逢三一断
        let floatPart = ".00"; //预定义小数部分
        let value2Array = value.split(".");
        //=2表示数据有小数位
        if (value2Array.length == 2) {
          floatPart = value2Array[1].toString(); //拿到小数部分
          if (floatPart.length == 1) { //补0,实际上用不着
            return intPartFormat + "." + floatPart + '0';
          } else {
            return intPartFormat + "." + floatPart;
          }
        } else {
          return intPartFormat + floatPart;
        }
      },
      //查看选择商品重置按钮
      resetSelectGoodsList(){
        this.TotalList= {size: 50,current: 1,};
        this.createDate=[];
        if(this.select === '查看商品'){
          this.selectByPainId(this.planId)
        }else{
          this.getSelectGoodsList();
        }
      },
      //修改销售计划
      update(e){
        this.planId = e.planId;
        this.useStatusUpdate = e.useStatus;
        //console.log('--------',this.useStatusUpdate)
        let planId = e.planId;
        let names = '';
        this.$http.get('/report/goods/plan/selectPlanGoodsListPage',{
            params: { planId }
          }
        ).then((res) => {
          this.jointGoodsName = '';
          res.records.forEach(item => {
            this.jointGoodsName += item['goodsName']+'，';
          })
        }).catch((err) => {
          console.log(err);
        });
        this.updates = e;
        this.planStartDateForm = e.planStartDate;
        this.planEndDateForm = e.planEndDate;
        this.systemDialogVisible = true;
      },
      //添加销售计划添加商品
      sureFormSubmitGetaddGoodsId(){
        this.jointGoodsID = '';
        this.jointGoodsName = '';
        this.goodsList.forEach(item => {
          this.jointGoodsID += item.goodsId +',';
          this.jointGoodsName += item.goodsName +'，';
          this.goodsIdList.push(item.goodsId);
        })
        this.getaddGoodsId = false;
        this.TotalList= {size: 50,current: 1,};
        //console.log(this.jointGoodsID)
        //console.log(this.goodsIdList)
        //qs.stringify JSON.param({"goodsIds" : this.goodsIdList})  qs.stringify({"goodsIds" : this.goodsIdList}),
        let goodsIds = qs.stringify({goodsIds : this.goodsIdList}, { arrayFormat: 'repeat' })
        //console.log(goodsIds);
        this.$http.get('/report/goods/plan/checkGoods',
          {
            params: {goodsIds:goodsIds}
          }
        ).then((res) => {
          console.log(res);
        }).catch((err) => {
          console.log(err);
          this.$message.error('错误');
        })
      },
      //确定添加商品
      sureFormSubmitAddGoods(){
        //给数组对象添加计划ID
        this.goodsList.forEach(item => {
          item['planId'] = this.planId;
        })
        console.log(...this.goodsList)
        let goodsList = this.goodsList;
        this.$http.post('/report/goods/plan/addPlanGoods',goodsList
        ).then((res) => {
          console.log(res)
          this.addGoods = false;
          this.TotalList= {size: 50,current: 1,}
          this.selectByPainId(this.planId);
          this.$message.success('添加成功');
        }).catch((err) => {
          console.log(err)
          this.$message.error('添加错误');
        }).finally(() => {
          this.loading = false;
        })

      },
      //关闭添商品弹框
      closeAddGoods(){
        this.addGoods = false;
        this.goodsIdList = [];
        this.TotalList= {size: 50,current: 1,}
        this.selectByPainId(this.planId);
      },
      //查看添加商品
      addPlanGoods(){
        let planId = this.planId;
        this.$http.get('/report/goods/plan/getPlanUseStatus',{
            params: { planId }
          }
        ).then((res) => {
          let bizContent = res;
          if(bizContent == 2){
            this.$message.error('此商品销售计划为正式状态不可以添加');
          }else{
            this.popupMaskAdd = true;
            this.getSelectGoodsList();
          }
        }).catch((err) => {
          this.$message.error('查询状态错误');
        })

      },
      //查看删除商品
      delGetSelectGoodsList(e){
        //console.log(e)
        let planDtlId = e.planDtlId;
        this.$http.get('/report/goods/plan/getPlanUseStatus',{
            params: {
              planId:this.planId
            },
          }
        ).then((res) => {
          //console.log(res);
          if (res === 1){
            this.$http.get('/report/goods/plan/deleteGoodsByPlanDtlId',{
                params: { planDtlId }
              }
            ).then((res) => {
              this.$message.success('删除成功');
            }).catch((err) => {
              console.log(err);
            }).finally((fil) =>{
              //console.log(this.planId);
              this.selectByPainId(this.planId);
            });
          }else{
            this.$message.error('此商品销售计划为正式状态不可以删除');
          }
        }).catch((err) => {
          console.log(err);
          this.$message.error('根据id查询状态错误');
        });

      },
      //查看事件
      selectByPainId(planId,goodsId,goodsName,factoryId,factoryName){
        this.planId = planId;
        if (this.TotalList.goodsId !== undefined && this.TotalList.goodsId !== '') {
          goodsId = this.TotalList.goodsId;
        }
        if (this.TotalList.goodsName !== undefined && this.TotalList.goodsName !== '') {
          goodsName = this.TotalList.goodsName;
        }
        if (this.TotalList.factoryId !== undefined && this.TotalList.factoryId !== '') {
          factoryId = this.TotalList.factoryId;
        }
        if (this.TotalList.factoryName !== undefined && this.TotalList.factoryName !== '') {
          factoryName = this.TotalList.factoryName;
        }
        this.$http.get('/report/goods/plan/selectPlanGoodsListPage',{
            params: { ...this.TotalList,planId,goodsId,goodsName,factoryId,factoryName }
          }
        ).then((res) => {
          //console.log(res);
          this.select = "查看商品";
          this.getaddGoodsId = true;
          this.selectGoodsList = res.records;
          this.total = res.total;
        }).catch((err) => {
          console.log(err);
        });
      },
      //多选商品
      handleSelectionChangeByGoodsList(val){
        //console.log(val)
        if (this.goodsList.length > val.length && !this.isSel) {
          this.goodsList = [...val]
        } else  {
          this.goodsList.push(...val);
        }
        //去重
        let obj = {};
        this.goodsList = this.goodsList.reduce(function (a, b) {
          obj[b.goodsId] ? "" : (obj[b.goodsId] = true && a.push(b));
          return a;
        }, []);
        this.goodsList.forEach(item => item.isSel = true)
        //console.log(this.goodsList);
      },
      //筛选选择商品
      handleSearchSelectGoodsList(){
        this.TotalList.size = 10;
        this.TotalList.current = 1;
        if(this.select === '查看商品'){
          this.selectByPainId(this.planId)
        }else{
          this.checked();
          this.getSelectGoodsList();
        }
      },
      //新增选择商品
      addGoodsId(){
        // if(this.elSelectClickStatisticsUnits !== undefined && this.elSelectClickStatisticsUnits !== ''){
          //console.log(this.jointGoodsID);
          if(this.jointGoodsName !== undefined && this.jointGoodsName !== ''){
            // this.checked()
          }
          this.select = "选择商品"
          //this.getaddGoodsId = true;
          this.goodsList = [];
          this.popupMask = true;
          this.getSelectGoodsList();

        // }else{
        //   this.$message.error('请先选择基本销售单位');
        // }
        //selectGoodsList商品集合
        // this.addGoods = true;
        // this.getSelectGoodsList();
      },
      //获取商品列表
      getSelectGoodsList(goodsId,goodsName,factoryId,factoryName){
        if (this.TotalList.goodsId !== undefined && this.TotalList.goodsId !== '') {
          goodsId = this.TotalList.goodsId;
        }else{
          goodsId = -1;
        }
        if (this.TotalList.goodsName !== undefined && this.TotalList.goodsName !== '') {
          goodsName = this.TotalList.goodsName;
        }
        if (this.TotalList.factoryId !== undefined && this.TotalList.factoryId !== '') {
          factoryId = this.TotalList.factoryId;
        }
        if (this.TotalList.factoryName !== undefined && this.TotalList.factoryName !== '') {
          factoryName = this.TotalList.factoryName;
        }
        this.$http.get('/report/goods/plan/selectGoodsList',{
            params: { ...this.TotalList,goodsId,goodsName,factoryId,factoryName }
          }
        ).then((res) => {
          //console.log(this.jointGoodsID)
          //console.log(res);
          this.selectGoodsList = res.records;
          this.total = res.total;
          //筛选商品时把已经选中的商品进行显示出来
          this.selectGoodsList.push(...this.goodsList);
          let obj = {};
          this.selectGoodsList = this.selectGoodsList.reduce(function (a, b) {
            obj[b.goodsId] ? "" : (obj[b.goodsId] = true && a.push(b));
            return a;
          }, []);
          this.$nextTick(() => {
            this.selectGoodsList.forEach(item => {
              if (item.isSel) {
                this.$refs.singleTable.$refs.singleTable.toggleRowSelection(item, true);
              }
            })
          })
          if(this.jointGoodsName !== undefined && this.jointGoodsName !== ''){
            this.checked();
          }
        }).catch((err) => {
          console.log(err);
        }).finally(() => {
          this.loading = false;
        })
      },
      // 获取商品分页
      totalPaginationGetSelectGoodsList({ page: current, limit: size }) {
        this.TotalList.current = current;
        this.getSelectGoodsList();
      },
      handleSizeChangeGetSelectGoodsList({ page: current, limit: size }) {
        this.TotalList.size = size;
        this.getSelectGoodsList();
      },
      //关闭选择商品
      closeGetaddGoodsId(){
        this.getaddGoodsId = false;
        this.goodsIdList = [];
        this.TotalList= {size: 50,current: 1,}
      },
      //确定变更计划状态事件
      updatePlanUseStatusByIdConfirm(){
        let planId = this.currentRow.planId;
        let useStatus = 0;
        if (this.currentRow.useStatus == "临时"){
            useStatus = 1
        }else{
          useStatus = 2
        }
        this.$http.get('/report/goods/plan/updatePlanUseStatusById',{
            params: {
              planId: planId,
              useStatus : useStatus
            },
          }
        ).then((res) => {
          console.log(res);
          this.$message.success('变更的数据成功！');
          this.updatePlanUseStatusById = false;
          this.query();
        }).catch((err) => {
          console.log(err);
        });
      },
      //关闭变更计划状态弹窗
      closeUpdatePlanUseStatusById(){
        this.updatePlanUseStatusById = false;
      },
      //变更计划状态事件
      updatePlanUseStatus(){
        if (JSON.stringify(this.currentRow) === '{}') {
          this.$message.error('请选中你要变更的数据！');
        }else{
          if(this.currentRow.useStatus === '正式'){
            this.$message.error('正式状态不能确定');
          }else{
            this.updatePlanUseStatusById = true;
          }
        }
      },
      //新增输入商品id鼠标离开时事件
      leave(e){
        console.log('新增输入商品id鼠标离开时事件',e)
        this.$http.get('/report/goods/plan/getGoodsById',{
            params: {
              goodsId:e
            },
          }
        ).then((res) => {
          console.log(res);
          this.form.goodsType = res.goodsType;
          this.form.goodsUnit = res.goodsUnit;
        }).catch((err) => {
          console.log(err);
        });
      },
      //删除前查询
      delSelect(e){
        let plan_id = e.planId;
        this.$http.get('/report/goods/plan/getPlanUseStatus',{
            params: {
              planId:plan_id
            },
          }
        ).then((res) => {
          //console.log(res);
          if(res == 1){
            //可以删除
            //console.log('可以删除')
            this.deletePlanById = true;
          }else{
            //不可以删除
            //console.log('不可以删除')
            this.$message.error('此商品销售计划为正式状态不能被删除');
          }
          this.query();
        }).catch((err) => {
          console.log(err);
          this.$message.error('根据id查询是否正式错误');
        });
      },
      //确定删除
      delConfirm(){
        let plan_id = this.form.planId;
        this.$http.get('/report/goods/plan/deletePlanById',{
            params: {
              planId:plan_id
            },
          }
        ).then((res) => {
          console.log(res);
          this.$message.success('删除成功');
          this.deletePlanById = false;
          this.query();
        }).catch((err) => {
          console.log(err);
          this.$message.error('删除错误');
        });
      },
      //关闭确定删除弹框
      closedelConfirm(){
        this.deletePlanById = false;
      },
      //关闭新增弹框
      closeAdd(){
        this.form.remark = "";
        this.form.planNum = "";
        this.form.planNum = "";
        this.form.goodsId = "";
        this.jointGoodsName = "";
        this.form.planStartDate = "";
        this.form.planEndDate = "";
        this.form.statisticsUnits = "";
        this.goodsList = [];
        this.goodsIdList = [];
        this.popupGoodsList = [];
        this.addVersions = false;
        this.jointGoodsName = '';
        this.goodsUnit = '';
      },
      //新增提交表单
      sureFormSubmit() {
        this.form.statisticsUnits = this.goodsUnit;
        //this.goodsList
        this.form.goodsSalesPlanDtlVoList = this.popupGoodsList;
        //console.log(this.form,'--------------------');
        this.$http.post('/report/goods/plan/addPlan',this.form
        ).then((res) => {
          //console.log(res);
          this.$message.success('新增版本成功');
          this.addVersions = false;
          this.query();
        }).catch((err) => {
          console.log(err);
          this.$message.error('新增版本错误');
        }).finally((fil) =>{
          this.closeAdd()
        });
      },
      // 取消修改弹窗
      handleSystemClose() {
        this.systemDialogVisible = false;
        this.update(this.updates);
      },
      // 修改
      handleSystemReply() {
          let useStatus = this.form.useStatus;
          if(useStatus == '临时'){
            useStatus = 1;
          }else{
            useStatus = 2;
          }
          this.$http.post('/report/goods/plan/modifyPlanById',
              {
                planId: this.updates.planId,
                useStatus: useStatus,
                planName: this.updates.planName,
                planNum: this.updates.planNum,
                planStartDate: this.updates.planStartDate,
                planEndDate: this.updates.planEndDate,
                remark: this.updates.remark,
              }
          ).then(() => {
            this.$message.success('修改成功');
            this.updateClose();
            this.query();
            this.form = {};
          }).finally(() => {
            this.loading = false;
          }).catch((err) =>{
            console.log(err);
          });
      },
      query(goodsId,planName,useStatus) {
        this.loading = true;
        if (this.createDate) {
          this.TotalList.startDate = this.createDate[0];
          this.TotalList.endDate = this.createDate[1];
        }
        if (this.TotalList.goodsId !== undefined && this.TotalList.goodsId !== '') {
          goodsId = this.TotalList.goodsId;
        }
        if (this.TotalList.planName !== undefined && this.TotalList.planName !== '') {
          planName = this.TotalList.planName;
        }
        if (this.useStatus !== undefined && this.useStatus !== '') {
          useStatus = this.useStatus;
        }
        //console.log(this.TotalList)
        this.$http.get('/report/goods/plan/list', { params:
            { ...this.TotalList,goodsId,planName,useStatus }}).then(res => {
          //console.log(res);
          res.records.map((item) => {
            //item.planNum=this.priceFormat(item.planNum);
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
        console.log(val);
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
.span{
  margin-left: 10px;
  color: red;
  font-size: 13px;
}
</style>
