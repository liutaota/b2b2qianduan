<template>
  <div class="custom-base-info">
    <div class="row1">
      <h2>资质信息</h2>
      <el-table
        ref="multipleTable"
        v-loading="loading"
        :data="tableData"
        style="width: 100%"
        width="100%"
        align="center"
        border
        highlight-current-row
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(255, 255, 255, 0.8)"
        :row-class-name="tableRowClassName"
      ><el-table-column label="序号" type="index" />
        <el-table-column label="资质图片" header-align="center">
          <template slot-scope="scope" style="text-align: center">
            <span>
              <!-- <FsImg :src="scope.row.licenceImages" width="60" height="60" /> -->
              <el-image
                style="width: 100px; height: 100px"
                :src="imgHost + scope.row.licenceImages"
                :preview-src-list="[imgHost + scope.row.licenceImages]"
              />
            </span>
          </template>
        </el-table-column>
        <el-table-column
          label="证照类型"
          prop="licenceName"
          :formatter="textmatter"
        />
        <el-table-column
          label="证件号"
          prop="licenceCode"
          :formatter="textmatter"
        />
        <el-table-column
          label="有效日期"
          prop="sign_time"
          :formatter="textmatter"
        />
        <el-table-column
          label="结束日期"
          prop="valid_endTime"
          :formatter="textmatter"
        />
        <el-table-column label="状态" prop="status" :formatter="textmatter">
          <template slot-scope="scopes">
            <el-select
              v-model.trim="scopes.row.status"
              size="small"
              placeholder="请选择审核状态"
              style="width: 145px; margin-right: 10px"
            >
              <el-option label="驳回" value="NOT_APPROVED" />
              <el-option label="通过" value="APPROVE" />
              <el-option label="审核中" value="IN_REVIEW" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="驳回原因" prop="reason" :formatter="textmatter">
          <template
            v-if="scopes.row.status == 'NOT_APPROVED'"
            slot-scope="scopes"
          >
            <el-input
              v-model.trim="scopes.row.reason"
              placeholder="请输入驳回原因"
              style="width: 150px; margin-right: 25px"
              clearablex
            />
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="row1 row2">
      <h2>基本信息</h2>
      <div class="row2-wrap">
        <p>企业名称：{{ Information.companyName }}</p>
        <p>企业类型：{{ Information.company_type }}</p>
        <p>注册手机：{{ Information.telephone }}</p>
      </div>
      <div class="row2-wrap">
        <p>公司地址：{{ Information.areaName + Information.address }}</p>
        <p>联系人：{{ Information.contactName }}</p>
        <p>联系手机：{{ Information.contactPhone }}</p>
      </div>
      <div class="row2-wrap goodsbusiscope">
        <p>
          经营范围：{{ Information.goodsbusiscope }}
          <el-link
            type="primary"
            style="margin-left: 10px"
            @click="goodsCollection"
          >选择经营范围</el-link>
          <!-- <el-select v-model.trim="type" placeholder="请选择经营范围" style="margin-left:10px">
            <el-option
              v-for="item in businessScopeList"
              :key="item.scopeId"
              :label="item.scopeName"
              :value="item.scopeId"
            />
          </el-select> -->
        </p>
      </div>
    </div>
    <div class="row1 row3">
      <h2>编辑审核</h2>
      <el-form
        ref="addEditForms"
        :model="Information"
        :rules="rules"
        label-width="160px"
      >
        <el-form-item prop="erpCustomId" label="商家ERP客户编码：">
          <el-input
            v-model.trim.number="Information.erpCustomId"
            type="text"
            style="width: 50%"
            placeholder="请输入商家ERP客户编码"
          />
        </el-form-item>
        <el-form-item prop="reason" label="审核意见：">
          <el-input
            v-model.trim="Information.reason"
            type="textarea"
            style="width: 50%"
            placeholder="请输入审核意见"
          />
        </el-form-item>
        <el-form-item prop="remark" label="备注：">
          <el-input
            v-model.trim="Information.remark"
            type="textarea"
            style="width: 50%"
            placeholder="请输入备注"
          />
        </el-form-item>
      </el-form>
      <div class="btn">
        <el-button
          :type="btnType"
          @click="confirm('APPROVE')"
        >审核通过</el-button>
        <el-button @click="confirm('NOT_APPROVED')">驳回</el-button>
        <el-button @click="$router.go(-1)">取消</el-button>
      </div>
    </div>
    <Transfer
      v-if="popupMask"
      :dialog-form-visible="popupMask"
      :goods-list="businessScope"
      :aggregate="aggregate"
      @onSubmit="onSubmit"
      @cancel="cancel"
    />
    <showImage
      :is-show-image-dialog.sync="isShowImageDialog"
      :src="showImageSrc"
    />
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <div v-if="isReject" class="el-icon">
        <i class="el-icon-circle-close" />
        <span> 资料审核不通过，您确认打回客户重新提交资料吗？ </span>
      </div>
      <div v-if="!isReject" class="el-icon">
        <i class="el-icon-circle-check" />
        <span> 资料审核通过，您确认与客户建采吗？ </span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          v-if="isReject"
          type="primary"
          @click="examineEdit('NOT_APPROVED')"
        >确 定</el-button>
        <el-button
          v-else
          type="primary"
          @click="examineEdit('APPROVE')"
        >确 定</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { imgHost } from '@/config.js';
const Transfer = () => import('./components/Transfer');
// import FsImg from '@/components/FsImg';
const showImage = () => import('@/components/showImage');
export default {
  name: 'AuthenticationInfo',
  components: {
    showImage,
    // FsImg,
    Transfer,
  },
  data() {
    return {
      tableData: [{ url: '', name: '食品经营证' }],
      addEditForms: {},
      showImageSrc: '',
      imgHost,
      isShowImageDialog: false,
      rules: {
        erpCustomId: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
        ],
        reason: [
          { required: true, message: '请输入审核意见', trigger: 'blur' },
        ],
      },
      aggregate: {},
      managementList: [],
      popupMask: false,
      loading: false,
      status: '',
      type: '',
      memberId: null,
      businessScopeList: [],
      businessScope: [],
      Information: {},
      certificationType: [
        { val: 'RETAIL_MONOMER_DRUGSTORE', desc: '零售-单体药店' },
        { val: 'RETAIL_CHAIN_HEADQUARTERS', desc: '零售-连锁总部' },
        { val: 'PROFITABILITY_MEDICAL_ESTABLISHMENT', desc: '盈利性医疗机构' },
        {
          val: 'NOT_PROFITABILITY_MEDICAL_ESTABLISHMENT',
          desc: '非盈利性医疗机构',
        },
        { val: 'WHOLESALE_BUSINESS_COMPANY', desc: '批发-商业公司' },
      ],
      btnType: 'primary',
      dialogVisible: false,
      isReject: false,
    };
  },
  watch: {
    tableData: {
      handler(val) {
        const every = val.every((item) => {
          return item.status === 'APPROVE';
        });
        if (!every) {
          this.btnType = 'info';
        } else {
          this.btnType = 'primary';
        }
      },
      deep: true,
    },
  },
  created() {
    this.memberId = this.$route.query.memberId;
    this.query(this.memberId);
    this.essentialInformation(this.memberId);
  },
  methods: {
    query(id) {
      this.$http
        .get('member/getLicenceApplyInfo', { params: { id }})
        .then((res) => {
          res.forEach((item) => {
            if (item.validEndTime) {
              item.valid_endTime = item.validEndTime.split(' ')[0];
              item.sign_time = item.signTime.split(' ')[0];
            }
          });
          this.tableData = res;
        });
    },
    essentialInformation(id) {
      this.$http
        .get('member/getMemberApplyInfo', { params: { id }})
        .then((res) => {
          switch (res.companyType) {
            case 'RETAIL_MONOMER_DRUGSTORE':
              res.company_type = '零售-单体药店';
              break;
            case 'RETAIL_CHAIN_HEADQUARTERS':
              res.company_type = '零售-连锁总部';
              break;
            case 'PROFITABILITY_MEDICAL_ESTABLISHMENT':
              res.company_type = '盈利性医疗机构';
              break;
            case 'NOT_PROFITABILITY_MEDICAL_ESTABLISHMENT':
              res.company_type = '非盈利性医疗机构';
              break;
            case 'WHOLESALE_BUSINESS_COMPANY':
              res.company_type = '批发-商业公司';
              break;
          }
          if (res.areaName) {
            res.areaName = res.areaName.split(',').join('');
          }
          this.Information = res;
          res.goodsbusiscope.split(',').forEach((item, index) => {
            const scopeId = Number(res.goodsbusiscopeids.split(',')[index]);
            this.managementList.push({ scopeName: item, scopeId });
          });
        });
    },
    // 获取药品经营范围
    // getBusinessScope() {
    //   this.$http.get('pcMember/getDrugBusinessScope').then((res) => {
    //     this.businessScopeList = res;
    //   });
    // },
    // 表格行颜色更改
    tableRowClassName({ row, rowIndex }) {
      if (row.status === 'NOT_APPROVED') {
        return 'danger-row';
      }
      return '';
    },
    goodsCollection() {
      this.businessScope = [];
      // 更改获取变量，让其可以再弹窗中接受
      this.managementList.forEach((item) => {
        const { scopeId, scopeName } = item;
        this.businessScope.push({ scopeId, scopeName });
      });
      this.aggregate = {
        path: 'pcMember/getDrugBusinessScope',
        listKey: {
          key: 'scopeId',
          label: 'scopeName',
        },
      };
      this.popupMask = true;
    },
    onSubmit(e) {
      const memberList = [];
      let goodsbusiscope = '';
      let goodsbusiscopeids = '';
      // 更改原生变量重新赋值，让其符合后台接受
      e.forEach((item) => {
        const { scopeId, scopeName } = item;
        memberList.push({ scopeId, scopeName });
      });
      this.managementList = memberList;
      this.Information.goodsbusiscope = '';
      memberList.forEach((item) => {
        goodsbusiscope += item.scopeName + ',';
        goodsbusiscopeids += item.scopeId + ',';
      });
      goodsbusiscope = goodsbusiscope.slice(0, goodsbusiscope.length - 1);
      this.Information.goodsbusiscopeids = goodsbusiscopeids;
      this.Information.goodsbusiscope = goodsbusiscope;
      this.cancel();
    },
    cancel() {
      this.popupMask = false;
      this.aggregate = {};
    },
    // 查看图片
    // openMask(e) {
    //   // `<img src="${imgHost + e}" id="flip" style="width: 100%"/>`;
    //   this.$alert(`<el-image style="width: 100px; height: 100px" :src="${imgHost + e}" :preview-src-list="srcList"</el-image>`, {
    //     dangerouslyUseHTMLString: true,
    //     closeOnPressEscape: true,
    //   }).catch((_) => {
    //     return;
    //   });
    // },
    // 弹窗关闭
    handleClose() {
      this.dialogVisible = false;
    },
    // 审核确认
    confirm(status) {
      if (status === 'APPROVE' && this.btnType !== 'info') {
        this.isReject = false;
        this.dialogVisible = true;
      } else if (status === 'NOT_APPROVED') {
        this.isReject = true;
        this.dialogVisible = true;
      }
    },
    // 编辑
    examineEdit(status) {
      const memberApply = {
        ...this.Information,
        status,
      };
      this.tableData.forEach((item) => {
        delete item.createTime;
      });
      delete memberApply.erpCustomId;
      this.$refs['addEditForms'].validate((valid) => {
        if (valid) {
          this.$http
            .post('member/editors', {
              licenceApplyList: this.tableData,
              memberApply,
              erpCustomId: this.Information.erpCustomId,
            })
            .then((res) => {
              this.$router.replace('/customer/authentication');
            });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    // 文本格式化
    textmatter(row, column) {
      return row[column.property] ? row[column.property] : '-';
    },
    setStaet(item, stateArr) {
      let state = null;
      stateArr.forEach((e) => {
        if (item === e.val) {
          state = e.desc;
          return;
        }
      });
      return state;
    },
  },
};
</script>

<style lang="less">
.custom-base-info {
  background: #f0f0f0;
  .row1 {
    background: #fff;
    padding: 20px;
    padding-top: 0;
    box-sizing: border-box;
    margin-bottom: 10px;
  }
  h2 {
    border-bottom: 2px solid #1790e6;
    padding-bottom: 10px;
    display: inline-block;
  }
  .row2 {
    .row2-wrap {
      width: 100%;
      & > p {
        display: inline-block;
        width: 33.3%;
        margin-bottom: 20px;
        font-size: 14px;
        color: #606266;
      }
    }
    .goodsbusiscope {
      p {
        width: 100%;
      }
    }
  }
  .row3 {
    .el-col {
      text-align: right;
    }
  }
  .btn {
    padding-left: 400px;
    margin-top: 30px;
  }
}
.el-table .cell {
  text-align: center;
}
.el-icon {
  display: flex;
  align-items: center;
  flex-direction: column;
}
.el-icon-circle-close {
  color: red;
  font-size: 60px;
  margin-bottom: 10px;
}
.el-icon-circle-check {
  font-size: 60px;
  margin-bottom: 10px;
  color: #67c23a;
}
/deep/.el-table .warning-row td {
  background: #e6a23c !important;
  color: #000;
}
/deep/.el-table .danger-row td {
  background: #fd4036 !important;
  color: #000;
}
/deep/ .el-table .warning-row:hover {
  color: #606266 !important;
  background: #e6a23c !important;
}
/deep/.el-table__body .warning-row.current-row > td {
  background: #e6a23c !important;
  color: blue !important;
}
/deep/ .el-table .danger-row:hover {
  color: #606266 !important;
  background: #ff463c !important;
}
/deep/.el-table__body .danger-row.current-row > td {
  background: #ff463c !important;
  color: blue !important;
}
</style>
