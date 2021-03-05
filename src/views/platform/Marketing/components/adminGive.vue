<template>
  <el-dialog
    :visible.sync="dialogVisible"
    width="500px"
    :before-close="handleClose"
    :close-on-click-modal="false"
    center
  >
    <template slot="title" style="text-align: left;">
      <div class="titleZise">
        <span>后台赠送优惠卷</span>
        <hr>
      </div>
    </template>
    <el-form ref="form" :model="form" label-width="120px">
      <!-- <el-form-item v-if="member === 'memberId'" label="客户id">
        <el-input v-model.trim.number="form.customerSetId" />
      </el-form-item> -->
      <!-- 客户集合 -->
      <el-form-item :label="aggregate.tabTitle" prop="memberSetList">
        <div class="aggregate">
          <p class="goodsList" style="padding-left:10px;font-size:12px">
            <span
              v-for="(item, indexs) of visibleSet.memberSetList"
              :key="item.customerSetId"
            >{{ item.customerSetName }} {{ indexs === visibleSet.memberSetList.length - 1 ? '':'，' }}</span>
          </p>
          <span
            :type="visibleSet.type === 'ALL_VISIBLE'?'info':'primary'"
            :disabled="visibleSet.type === 'ALL_VISIBLE'?true:false"
            style="margin-right:10px"
            class="customer"
            @click="customerCollection"
          >选择{{ aggregate.tabTitle }}</span>
        </div>
      </el-form-item>
      <el-form-item label="优惠卷说明">
        <el-select v-model.trim="form.couponId" placeholder="优惠卷名称" filterable>
          <el-option v-for="item of marketingList" :key="item.id" :label="item.couponName" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="赠送数量">
        <el-input v-model.trim.number="form.giveNum" />
      </el-form-item>
      <el-form-item>
        <el-button v-if="member === 'memberId'" type="primary" @click="onSubmit">确认</el-button>
        <el-button v-if="member === 'memberList'" type="primary" @click="handleMembeListSet">确认</el-button>
        <el-button @click="handleClose">取消</el-button>
      </el-form-item>
    </el-form>
    <!-- 客户集合 -->
    <Transfer
      v-if="memberMask"
      :dialog-form-visible="memberMask"
      :goods-list="memberList"
      :aggregate="aggregate"
      @onSubmit="memberSubmit"
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
      default: false
    },
    aggregate: {
      type: Object,
      default: () => {}
    },
    marketingList: {
      type: Array,
      default: () => []
    },
    form: {
      type: Object,
      default: () => {}
    },
    member: {
      type: String,
      default: 'memberId'
    },
    isCoupon: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      memberMask: false, // 客户
      visibleSet: { // 客户集合
        type: '',
        memberSetList: []
      },
    };
  },
  watch: {
    isCoupon(val) {
      if (val) {
        this.visibleSet.memberSetList = [];
        this.$emit('isCoupon', false);
      }
    }
  },
  created() {},
  methods: {
    // 客户集合全部可见清空
    getMemberList(e) {
      if (e === 'ALL') {
        this.form.customSetId = [];
      }
      this.form.customSetType = e;
    },
    // 打开客户集合
    customerCollection() {
      this.memberList = [];
      // 更改获取变量，让其可以再弹窗中接受
      this.visibleSet.memberSetList.forEach((item) => {
        // const { customerSetId: customsetid, customerSetName: customsetname } = item;
        const listKey = {};
        listKey[this.aggregate.listKey.key] = item.customerSetId;
        listKey[this.aggregate.listKey.label] = item.customerSetName;
        this.memberList.push({ ...listKey });
      });
      this.memberMask = true;
    },
    // 确认客户集合
    memberSubmit(e) {
      const memberList = [];
      const customSetId = [];
      // 更改原生变量重新赋值，让其符合后台接受
      e.forEach((item) => {
        const customerSetId = item[this.aggregate.listKey.key];
        const customerSetName = item[this.aggregate.listKey.label];
        memberList.push({ customerSetId, customerSetName });
        customSetId.push(customerSetId);
      });
      this.visibleSet.memberSetList = memberList;
      this.form.customerSetList = memberList;
      this.cancel();
    },
    // 后台赠送客户集合
    handleMembeListSet() {
      const { customerSetList, couponId, giveNum } = this.form;
      if (customerSetList === undefined || customerSetList === null || customerSetList.length === 0) {
        this.$message.warning('请选择客户');
        return;
      }
      if (couponId === undefined || couponId === null || couponId === '') {
        this.$message.warning('请选择优惠卷');
        return;
      }
      if (giveNum === undefined || giveNum === null || giveNum === '') {
        this.$message.warning('请输入数量');
        return;
      }
      this.$emit('handleMembeListSet', this.form);
    },
    // 确认
    onSubmit() {
      const { customerSetList, couponId, giveNum } = this.form;
      if (customerSetList === undefined || customerSetList === null || customerSetList.length === 0) {
        this.$message.warning('请选择客户');
        return;
      }
      if (couponId === undefined || couponId === null || couponId === '') {
        this.$message.warning('请选择优惠卷');
        return;
      }
      if (giveNum === undefined || giveNum === null || giveNum === '') {
        this.$message.warning('请输入数量');
        return;
      }
      this.$emit('onSubmit', this.form);
    },
    handleClose() {
      this.$emit('cancel');
      this.visibleSet.memberSetList = [];
    },
    cancel() {
      this.memberMask = false;
      this.memberList = [];
    },
  }
};
</script>

<style scoped lang="less">
/deep/ .el-dialog__header {
    text-align: left !important;
}
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
  flex-direction: column;
  justify-content: left;
  align-items: left;
  text-align: left;
  p {
    width: 250px;
    height: 30px;
    margin: 5px 0px;
    border: 1px solid #dcdfe6;
    border-radius: 3px;
    overflow: hidden;
  }
  .customer {
    color: #1890FF;
    cursor: pointer;
  }
}
</style>
