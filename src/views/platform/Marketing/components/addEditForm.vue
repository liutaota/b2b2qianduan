<template>
  <el-dialog
    :visible.sync="dialogVisible"
    width="800px"
    :before-close="close"
    :close-on-click-modal="false"
    center
  >
    <template slot="title" style="text-align: left;">
      <div class="titleZise">
        <span>{{ title }}优惠卷</span>
        <hr>
      </div>
    </template>
    <el-form ref="ruleForm" :rules="rules" :model="form" label-width="120px" style="width:90%">
      <el-form-item label="优惠卷名称" prop="couponName" style="width:400px">
        <el-input v-model.trim="form.couponName" />
      </el-form-item>
      <el-form-item label="客户集合" prop="customSetType">
        <div class="aggregate">
          <!-- <el-checkbox v-model.trim="form.name">全选</el-checkbox> -->
          <el-select v-model.trim="form.memberType" placeholder="请选择" @change="getMemberList">
            <el-option label="全部可见" value="ALL" />
            <el-option label="部分可见" value="VISIBLE" />
            <el-option label="部分不可见" value="UN_VISIBLE" />
          </el-select>
          <p class="goodsList" style="padding-left:10px;font-size:12px">
            <span
              v-for="(item, indexs) of visibleSet.memberSetList"
              :key="item.memberSetId"
            >{{ item.customerSetName }} {{ indexs === visibleSet.memberSetList.length - 1 ? '':'，' }}</span>
          </p>
          <el-link
            :type="form.memberType === 'ALL'?'info':'primary'"
            :disabled="form.memberType === 'ALL'?true:false"
            style="margin-right:10px"
            @click="customerCollection"
          >选择客户集合</el-link>
        </div>
      </el-form-item>
      <el-form-item label="商品集合" prop="goodsType">
        <div class="aggregate">
          <el-select v-model.trim="form.goodsType" placeholder="请选择" @change="getGoodsList">
            <el-option label="全部可见" value="ALL" />
            <el-option label="部分可见" value="PART" />
            <el-option label="部分不可见" value="UN_VISIBLE" />
          </el-select>
          <!-- <el-checkbox v-model.trim="form.goodsType" border label="全选" @change="getGoodsList" /> -->
          <p class="goodsList" style="padding-left:10px;font-size:12px">
            <span
              v-for="(item, indexs) of goodsSet.goodsSetList"
              :key="item.goodsSetId"
            >{{ item.goodsSetName }} {{ indexs === goodsSet.goodsSetList.length - 1 ? '':'，' }}</span>
          </p>
          <el-link
            :type="form.goodsSetType === 'ALL'?'info':'primary'"
            :disabled="form.goodsSetType === 'ALL'?true:false"
            style="margin-right:10px"
            @click="goodsCollection"
          >选择商品集合</el-link>
        </div>
      </el-form-item>
      <el-form-item label="优惠卷说明" prop="explain" style="width:400px">
        <el-input v-model.trim="form.explain" />
      </el-form-item>
      <el-form-item label="优惠卷类型" prop="type">
        <el-select v-model.trim="form.type" placeholder="请选择优惠卷类型" @change="couponSelect">
          <el-option label="满减卷" value="FULL_REDUCTION_TICKET" />
          <el-option label="折扣卷" value="FULL_PRESENT_TICKET" />
          <el-option label="现金卷" value="CASH_TICKET" />
        </el-select>
      </el-form-item>
      <el-form-item v-if="form.type === 'FULL_REDUCTION_TICKET' || form.type === 'FULL_PRESENT_TICKET'" prop="fullAmounts" label="满足金额" style="width:400px">
        <el-input v-model.trim.number="form.fullAmounts" />
      </el-form-item>
      <el-form-item v-if="form.type === 'FULL_REDUCTION_TICKET' || form.type === 'CASH_TICKET'" prop="reduceAmounts" style="width:400px" label="优惠金额">
        <el-input v-model.trim.number="form.reduceAmounts" />
      </el-form-item>
      <el-form-item v-if="form.type === 'FULL_PRESENT_TICKET'" prop="discounts" label="折扣" style="width:400px">
        <el-input v-model.trim="form.discounts" oninput="value=value.replace(/[^\d.]/g,'')" />
      </el-form-item>
      <el-form-item label="总发放数" prop="couponAccept" style="width:400px">
        <el-input v-model.trim.number="form.couponAccept" />
      </el-form-item>
      <el-form-item label="用户限领数" prop="limitNum" style="width:400px">
        <el-input v-model.trim.number="form.limitNum" />
      </el-form-item>
      <el-form-item label="可领取时间" prop="receiveTime">
        <el-date-picker
          v-model.trim="form.receiveTime"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd HH:mm:ss"
          :default-time="['00:00:00', '23:59:59']"
          @change="getReceiveTime"
        />
      </el-form-item>
      <el-form-item label="可使用天数" prop="useDay" style="width:400px">
        <el-input v-model.trim.number="form.useDay" />
      </el-form-item>
      <el-form-item label="可使用时间" prop="useTime">
        <el-date-picker
          v-model.trim="form.useTime"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd HH:mm:ss"
          :default-time="['00:00:00', '23:59:59']"
          @change="getUseDay"
        />
      </el-form-item>
      <el-form-item label="备注" prop="remark" style="width:600px">
        <el-input v-model.trim="form.remark" rows="5" resize="none" type="textarea" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('ruleForm')">确认</el-button>
        <el-button @click="handleClose('ruleForm')">取消</el-button>
      </el-form-item>
    </el-form>
    <Transfer
      v-if="memberMask"
      :dialog-form-visible="memberMask"
      :goods-list="memberList"
      :aggregate="aggregate"
      @onSubmit="memberSubmit"
      @cancel="cancel"
    />
    <Transfer
      v-if="goodsMask"
      :dialog-form-visible="goodsMask"
      :goods-list="goodsList"
      :aggregate="aggregate"
      @onSubmit="goodsSubmit"
      @cancel="cancel"
    />
  </el-dialog>
</template>

<script>
const Transfer = () => import('./Transfer');
export default {
  components: {
    Transfer
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: true
    },
    form: {
      type: Object,
      default: () => {}
    },
    title: {
      type: String,
      default: '新增'
    },
  },
  data() {
    return {
      memberMask: false, // 客户
      memberList: [],
      goodsMask: false,
      goodsList: [],
      aggregate: {},
      receiveTime: [], // 可领取时间
      useTime: [], // 可使用时间
      visibleSet: { // 客户集合
        type: '',
        memberSetList: []
      },
      goodsSetType: false,
      goodsSet: {
        type: '',
        goodsSetList: []
      },
      rules: {
        couponName: [
          { required: true, message: '请输入优惠卷名称', trigger: 'blur' },
        ],
        customSetType: [
          { required: true, message: '请选择客户集合类型', trigger: 'change' }
        ],
        explain: [
          { required: true, message: '请输入优惠卷说明', trigger: 'blur' },
        ],
        goodsType: [
          { required: true, message: '请选择商品类型', trigger: 'change' },
        ],
        type: [
          { required: true, message: '请选择优惠卷类型', trigger: 'blur' },
        ],
        fullAmounts: [
          { required: true, message: '满足金额不能为空' },
          { type: 'number', message: '满足金额必须是数字' }
        ],
        reduceAmounts: [
          { required: true, message: '优惠金额不能为空' },
          { type: 'number', message: '优惠金额必须是数字' }
        ],
        discounts: [
          { required: true, message: '折扣不能为空', trigger: 'blur' },
        ],
        couponAccept: [
          { required: true, message: '总发放数不能为空' },
          { type: 'number', message: '总发放数必须是数字' }
        ],
        limitNum: [
          { required: true, message: '用户限领数不能为空' },
          { type: 'number', message: '用户限领数必须是数字' }
        ],
        receiveTime: [
          { type: 'array', required: true, message: '请选择开始时间', trigger: 'change' }
        ],
        useDay: [
          { required: true, message: '总发放数不能为空' },
          { type: 'number', message: '总发放数必须是数字' }
        ],
        useTime: [
          { type: 'array', required: true, message: '请选择开始时间', trigger: 'change' }
        ],
      },
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
    };
  },
  watch: {
    form: {
      handler(val) {
        if (val.customerSetList !== undefined && val.customerSetList !== null) {
          this.visibleSet.memberSetList = JSON.parse(JSON.stringify(val.customerSetList));
        }
        if (val.goodsSetList !== undefined && val.goodsSetList !== null) {
          this.goodsSet.goodsSetList = JSON.parse(JSON.stringify(val.goodsSetList));
        }
      },
      deep: true,
    }
  },
  created() {},
  methods: {
    // 客户集合全部可见清空
    getMemberList(e) {
      if (e === 'ALL') {
        this.form.customerSetList = [];
        this.visibleSet.memberSetList = [];
      }
      this.form.customSetType = e;
    },
    // 打开客户集合
    customerCollection() {
      if (this.form.memberType === '') {
        this.$message.warning('请选择客户可见类型');
        return;
      }
      this.memberList = [];
      // 更改获取变量，让其可以再弹窗中接受
      this.visibleSet.memberSetList.forEach((item) => {
        const { customerSetId: customsetid, customerSetName: customsetname } = item;
        this.memberList.push({ customsetid, customsetname });
      });
      this.aggregate = {
        path: 'member/getAdminMemberList',
        listKey: {
          key: 'customsetid',
          label: 'customsetname',
        },
        tabTitle: '集合',
        search: {
          key: 'customsetid',
          label: 'customsetname'
        },
      };
      this.memberMask = true;
    },
    // 确认客户集合
    memberSubmit(e) {
      const memberList = [];
      // 更改原生变量重新赋值，让其符合后台接受
      e.forEach((item) => {
        const { customsetid: customerSetId, customsetname: customerSetName } = item;
        memberList.push({ customerSetId, customerSetName });
      });
      this.visibleSet.memberSetList = memberList;
      this.form.customerSetList = memberList;
      this.cancel();
    },
    // 选择商品类型
    getGoodsList(e) {
      if (e === 'ALL') {
        this.goodsSet.goodsSetList = [];
        this.form.goodsSetList = [];
      }
      this.form.goodsSetType = e;
    },
    // 打开商品选择
    goodsCollection() {
      this.goodsList = [];
      // 更改获取变量，让其可以再弹窗中接受
      this.goodsSet.goodsSetList.forEach((item) => {
        const { goodsSetId: goodssetid, goodsSetName: goodssetname } = item;
        this.goodsList.push({ goodssetid, goodssetname });
      });
      this.aggregate = {
        path: 'goods/getAdminGoodsList',
        listKey: {
          key: 'goodssetid',
          label: 'goodssetname',
        },
        tabTitle: '商品集合',
        search: {
          key: 'goodssetid',
          label: 'goodssetname'
        },
      };
      this.goodsMask = true;
    },
    // 确认商品集合
    goodsSubmit(e) {
      const goodsList = [];
      // 更改原生变量重新赋值，让其符合后台接受
      e.forEach((item) => {
        const { goodssetid: goodsSetId, goodssetname: goodsSetName } = item;
        goodsList.push({ goodsSetId, goodsSetName });
      });
      this.goodsSet.goodsSetList = goodsList;
      this.form.goodsSetList = goodsList;
      this.cancel();
    },
    // 可领取时间
    getReceiveTime(time) {
      if (time) {
        this.form.receiveStartTime = time[0];
        this.form.receiveEndTime = time[1];
      } else {
        this.form.receiveStartTime = '';
        this.form.receiveEndTime = '';
      }
    },
    // 可使用时间
    getUseDay(time) {
      if (time) {
        this.form.useEndTime = time[1];
        this.form.useStartTime = time[0];
      } else {
        this.form.useEndTime = '';
        this.form.useStartTime = '';
      }
    },
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const { discounts, fullAmounts, reduceAmounts, goodsSetList, customerSetList, memberType, goodsSetType } = this.form;
          if (memberType !== 'ALL' && (customerSetList === null || customerSetList.length === 0)) {
            this.$message.warning('请选择客户集合');
            return;
          }
          if (goodsSetType !== 'ALL' && (goodsSetList === null || goodsSetList.length === 0)) {
            this.$message.warning('请选择商品集合');
            return;
          }
          // 删除多余的数据
          delete this.form.useTime;
          delete this.form.receiveTime;
          delete this.form.memberType;
          if (discounts !== undefined && discounts !== '') {
            this.form.discount = parseFloat(discounts);
          }
          if (fullAmounts !== undefined && fullAmounts !== '') {
            this.form.fullAmount = fullAmounts;
          }
          if (reduceAmounts !== undefined && reduceAmounts !== '') {
            this.form.reduceAmount = reduceAmounts;
          }
          this.$emit('onSubmit', this.form);
          this.memberList = [];
          this.goodsList = [];
          this.visibleSet = {
            type: '',
            memberSetList: []
          };
          this.goodsSet = {
            type: '',
            goodsSetList: []
          };
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    // 编辑弹窗关闭
    handleClose(formName) {
      this.$emit('cancel');
      this.$refs[formName].resetFields();
      this.visibleSet = {
        type: '',
        memberSetList: []
      };
      this.goodsSet = {
        type: '',
        goodsSetList: []
      };
    },
    close() {
      this.$emit('cancel');
    },
    // 商品与客户选择弹窗关闭
    cancel() {
      this.memberMask = false;
      this.goodsMask = false;
      this.memberList = [];
      this.goodsList = [];
    },
    // 优惠卷选择
    couponSelect() {
      // this.form.reduceAmount = '';
      // this.form.fullAmount = '';
      // this.form.discounts = '';
      this.$emit('couponSelect');
    },
  }
};
</script>

<style scoped lang="less">
// 客户集合
.goodsList{
  width:56%;
  height:30px;
  border:1px solid #DCDFE6;
  border-radius: 4px;
  display: inline-block;
  margin-right:10px;
  font-size:12px;
  color: #9a9a9a;
  padding-left: 5px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.aggregate {
  display: flex;
  p {
    width: 250px;
    height: 30px;
    margin: 0 10px;
    padding: 0;
    border: 1px solid #dcdfe6;
    border-radius: 3px;
    overflow: hidden;
  }
}
/deep/ .el-tabs__content {padding: 0 !important;}
.el-tabs {
  margin: 0 0 20px;
}
/deep/ .el-dialog__header {
    text-align: left !important;
}
</style>
