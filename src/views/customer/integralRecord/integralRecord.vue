<template>
  <div style="margin-left: 10px">
    <!-- 筛选 -->
    <el-row>
      <el-col :span="24">
        <div class="row-col" style="margin-top: 10px;font-size:12px" @keyup.enter="query()">
          <el-input
            v-model.trim="TotalList.telephone"
            placeholder="请输入客户手机号"
            style="width:145px;margin-right: 10px"
            clearablex
            size="small"
          />
          <el-input
            v-model.trim="TotalList.memberId"
            placeholder="请输入客户ID"
            style="width:145px;margin-right: 10px"
            clearablex
            size="small"
          />
          <el-input
            v-model.trim="TotalList.memberName"
            placeholder="请输入客户名称"
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
          <el-button v-permission="'IntegralRecordLook'" type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
          <el-button type="info" @click="TotalList= {size: 50,current: 1,};createDate=[];query()">重置</el-button>
        </div>
      </el-col>
    </el-row>
    <el-button v-permission="'IntegralRecordReset'" type="primary" style="margin-top:10px" @click="openIntegralMask">积分变更</el-button>
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
    <el-dialog
      title="积分变更"
      :visible.sync="integralMask"
      width="500px"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <el-form ref="form" :model="integralForm" :rules="rules" label-width="120px">
        <el-form-item label="内容" prop="content">
          <el-radio-group v-model.trim="integralForm.content">
            <el-radio label="增加" />
            <el-radio label="减少" />
            <el-radio label="奖励" />
            <el-radio label="补扣" />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="变更积分" prop="chanScore">
          <el-input-number v-model.trim="integralForm.chanScore" controls-position="right" :min="1" :max="10" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model.trim="integralForm.remark" rows="4" type="textarea" resize="none" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="integralSubmit('form')">确认</el-button>
          <el-button @click="handleClose('form')">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { _throttle } from '@/utils/public';
import Pagination from '@/components/Pagination';
const Tabel = () => import('@/components/Table');
export default {
  name: 'IntegralRecord',
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
      rowIndex: null,
      columns: [
        {
          prop: 'memberId',
          label: '客户id',
        },
        {
          prop: 'memberName',
          label: '客户名称',
          width: 300
        },
        {
          prop: 'telephone',
          label: '手机号',
          width: 150
        },
        {
          prop: 'content',
          label: '变更内容',
          width: 100
        },
        {
          prop: 'chanScore',
          label: '变更积分',
        },
        {
          prop: 'orignScore',
          label: '原积分',
        },
        {
          prop: 'fromType',
          label: '来源',
        },
        {
          prop: 'fromId',
          label: '来源ID',
        },
        {
          prop: 'createTime',
          label: '添加时间',
          width: 250,
        },
        {
          prop: 'remark',
          label: '备注',
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
      rules: {
        content: [
          { required: true, message: '请选择活动资源', trigger: 'change' }
        ],
        chanScore: [
          { required: true, message: '请输入兑换积分', trigger: 'blur' },
        ],
      },
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
    this.memberId = this.$route.query.memberId;
    this.query(this.memberId);
  },
  methods: {
    query(memberId) {
        this.loading = true;
        if (this.createDate) {
          this.TotalList.startTime = this.createDate[0];
          this.TotalList.endTime = this.createDate[1];
        }
        if (this.TotalList.memberId !== undefined && this.TotalList.memberId !== '') {
          memberId = this.TotalList.memberId;
        }
      this.$http.get('member/getAdminScoreRecordList', { params: { ...this.TotalList, memberId }}).then(res => {
        // console.log(JSON.parse(JSON.stringify(res)));
        res.records.map(item => {
          switch (item.fromType) {
            case 1:
              item.fromType = '订单';
              break;
            case 2:
              item.fromType = '新用户';
              break;
            case 3:
              item.fromType = '后台减少';
              break;
          }
          item.createTime = item.createTime.split(' ')[0];
        });
        //console.log(res);
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
    // 打开编辑
    editUpdata: _throttle(function(row) {
      this.deliveryEdit = true;
      this.current = { ...row };
    }),
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
    openIntegralMask() {
      if (JSON.stringify(this.currentRow) === '{}') {
        this.$message.info('未选中积分记录');
        return;
      }
      this.integralForm.content = '增加';
      this.integralForm.chanScore = this.currentRow.chanScore;
      this.integralForm.remark = this.currentRow.remark;
      this.integralMask = true;
    },
    handleClose() {
      this.$refs['form'].resetFields();
      this.integralMask = false;
      this.integralForm = {
        content: '',
        chanScore: 0,
        remark: '',
      };
    },
    integralSubmit(formName) {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.$http.post('member/updateScoreRecord', { ...this.integralForm, id: this.currentRow.id }).then(res => {
            this.$message.success('编辑成功');
            this.query();
            this.handleClose('form');
          });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
  }
};
</script>

<style>
</style>
