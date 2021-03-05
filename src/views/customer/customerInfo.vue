<template>
  <div class="custom-base-info" style="margin-left: 20px">
    <div style="margin: 10px 0 20px; display: flex; align-items: center">
      <span class="returnIcon" @click="$router.push('CustomerList')">
        <i class="el-icon-arrow-left" />
      </span>
      <h4 style="margin-left: 10px; color: #5a5e66">基本信息</h4>
    </div>
    <el-row :gutter="24" class="base">
      <el-col :span="6">
        <div class="grid-content bg-purple">
          客户ID：{{ customer.customid }}
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">税号: {{ customer.taxnumber }}</div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          客户质量类别: {{ customer.gspusestatusname }}
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          开户行: {{ customer.bankname }}
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="24" class="base">
      <el-col :span="6">
        <div class="grid-content bg-purple">
          客户名称: {{ customer.customname }}
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          注册地址: {{ customer.registadd }}
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          药品监管码: {{ customer.medicode }}
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          运输地点: {{ customer.transpsite }}
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="24" class="base">
      <el-col :span="6">
        <div class="grid-content bg-purple">
          客户拼音：{{ customer.custompinyin }}
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          法人代表: {{ customer.legalperson }}
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          医药行业标志: {{ customer.gspflag }}
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          地点序号: {{ customer.siteid }}
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="24" class="base">
      <el-col :span="6">
        <div class="grid-content bg-purple">
          客户性质: {{ customer.customertype }}
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          建立日期: {{ customer.credate }}
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          缺省发票类型: {{ customer.invtype }}
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          联系人: {{ customer.contacts }}
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="24" class="base">
      <el-col :span="6">
        <div class="grid-content bg-purple">
          客户分类编码: {{ customer.customno }}
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          客户操作码: {{ customer.customopcode }}
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          发票要求: {{ customer.invdemand }}
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">建立人ID: {{ customer.creid }}</div>
      </el-col>
    </el-row>
    <el-row :gutter="24" class="base">
      <el-col :span="6">
        <div class="grid-content bg-purple">
          组织代码: {{ customer.corpcode }}
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          使用状态: {{ customer.usestatus }}
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          开票策略: {{ customer.invmethodName }}
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">备注: {{ customer.memo }}</div>
      </el-col>
    </el-row>
    <el-row :gutter="24" class="base">
      <el-col :span="6">
        <div class="grid-content bg-purple">
          客户电话: {{ customer.zxPhone }}
        </div>
      </el-col>
    </el-row>
    <h5>运营信息</h5>
    <el-row :gutter="24" class="base">
      <el-col :span="6">
        <div class="grid-content bg-purple">
          首营日期：{{ customer.firstapprovedate }}
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          结算方式: {{ customer.settletype }}
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          缺省价格类型: {{ customer.pritype }}
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          销售状态: {{ customer.sausestatus }}
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="24" class="base">
      <el-col :span="6">
        <div class="grid-content bg-purple">
          质量状态: {{ customer.gspusestatusname }}
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          客户折扣: {{ customer.telephone }}
        </div>
      </el-col>
    </el-row>
    <div>
      <el-tabs value="liscenseData">
        <el-tab-pane label="证件信息" name="liscenseData">
          <el-table
            v-loading="liscenseLoading"
            :data="liscenseData"
            height="240"
            element-loading-spinner="el-icon-loading"
          >
            <!--<el-table-column label="客户ID" prop="memberId" :formatter="textmatter"/>
            <el-table-column label="客户名称" prop="memberName" min-width="150" :show-overflow-tooltip="true" :formatter="textmatter"/>-->
            <el-table-column
              label="证件ID"
              prop="licenseId"
              :formatter="textmatter"
            />
            <el-table-column
              label="证件名称"
              prop="licenseName"
              min-width="150"
              :show-overflow-tooltip="true"
              :formatter="textmatter"
            />
            <!--<el-table-column label="erp证件编码" prop="erpLicenceCode" min-width="150" :show-overflow-tooltip="true" :formatter="textmatter"/>
            <el-table-column label="b2b证件编码" prop="licenceCode" min-width="150" :show-overflow-tooltip="true" :formatter="textmatter"/>-->
            <el-table-column
              label="签发日期"
              prop="signTime"
              :formatter="dateFormatter"
            />
            <el-table-column
              label="发证日期"
              prop="validEndTime"
              :formatter="dateFormatter"
            />
            <el-table-column
              label="期限至"
              prop="validEndTime"
              :formatter="dateFormatter"
            />
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="协议价" name="agreementPrice">
          <el-table
            v-loading="agreementPriceLoading"
            :data="agreementPriceData"
            height="245"
            element-loading-spinner="el-icon-loading"
          >
            <el-table-column
              label="协议价ID"
              prop="prid"
              :formatter="nummatter"
            />
            <el-table-column
              label="货品名称"
              prop="goodsname"
              :formatter="textmatter"
            />
            <el-table-column
              label="商品名"
              prop="currencyname"
              :formatter="textmatter"
            />
            <el-table-column
              label="规格"
              prop="goodstype"
              :formatter="textmatter"
            />
            <el-table-column
              label="协议价"
              prop="price"
              :formatter="nummatter"
            />
            <el-table-column
              label="生产厂家"
              prop="factoryname"
              :formatter="textmatter"
            />
            <el-table-column
              label="产地"
              prop="prodarea"
              :formatter="textmatter"
            />
            <el-table-column
              label="状态"
              prop="usestatus"
              :formatter="textmatter"
            />
            <el-table-column
              label="结束时间"
              prop="enddate"
              :formatter="dateFormatter"
            />
          </el-table>
          <pagination
            :total="agreementPriceTotal"
            prev-text="上一页"
            next-text="下一页"
            @pagination="agreementPricePagination"
            @handleSizeChange="handleSizeChange"
          />
        </el-tab-pane>
        <el-tab-pane label="发票信息" name="invoiceData">
          <el-table :data="agreementPriceData" height="245">
            <el-table-column label="" prop="" />
            <el-table-column label="" prop="" />
            <el-table-column label="" prop="" />
            <el-table-column label="" prop="" />
            <el-table-column label="" prop="" />
            <el-table-column label="" prop="" />
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import pagination from '@/components/Pagination';

export default {
  name: 'CustomerInfo',
  components: {
    pagination,
  },
  data() {
    return {
      queryForm: {
        size: 50,
        current: 1,
      },
      disabled: true,
      liscenseLoading: false,
      agreementPriceLoading: false,
      // 证件信息
      license: {},
      liscenseData: [],
      // 客户详情信息
      customer: {},
      agreementPriceData: [],
      agreementPriceTotal: 0,
      // 发票信息
      invoice: {},
      invoiceData: [],
      invoiceTotal: 0,
    };
  },
  mounted() {
    const title = `证件信息-${this.$route.query.customid || ''}`;
    this.$setTitle(title);
    this.getCustomerInfo();
    this.getMemberLicenseInfo();
    this.getAgreementPrice();
  },
  methods: {
    // 文本格式化
    textmatter(row, column) {
      return row[column.property] ? row[column.property] : '-';
    },
    // 数值格式化
    nummatter(row, column) {
      return row[column.property] ? row[column.property] : 0;
    },
    // 金额格式化
    moneymatter(row, column) {
      return row[column.property] / 100 ? row[column.property] / 100 : 0;
    },
    // 时间格式化
    dateFormatter(row, column) {
      let datetime = row[column.property];
      if (datetime) {
        datetime = new Date(datetime);
        const y = datetime.getFullYear() + '-';
        const mon = datetime.getMonth() + 1 + '-';
        const d = datetime.getDate();
        return y + mon + d;
      }
      return '';
    },
    // 获取客户详情信息
    getCustomerInfo() {
      let id = this.$route.query.id;
      if (id === null) {
        id = this.$route.query.customid;
      }
      this.$http
        .get('member/getCustomerListInfoById', {
          params: {
            id,
          },
        })
        .then((data) => {
          console.log(data);
          this.customer = data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 获取当前客户证照信息
    getMemberLicenseInfo(queryForm) {
      if (queryForm) {
        this.queryForm.size = 20;
        this.queryForm.current = 1;
        this.queryForm = queryForm;
      }
      this.liscenseLoading = true;
      let id = this.$route.query.id;
      if (id === null) {
        id = this.$route.query.customid;
      }
      this.$http
        .get('/member/getAdminMemberLicenceList', {
          params: {
            ...this.queryForm,
            id,
          },
        })
        .then((data) => {
          // console.log(JSON.parse(JSON.stringify(data)));
          this.liscenseData = data;
          this.disabled = true;
          this.liscenseData.map((item) => {
            item.picture = item.picture ? item.picture : [];
          });
        })
        .finally(() => {
          this.liscenseLoading = false;
        });
      this.disabled = true;
    },
    // 协议价
    getAgreementPrice(queryForm) {
      if (queryForm) {
        this.queryForm.size = 20;
        this.queryForm.current = 1;
        this.queryForm = queryForm;
      }
      this.agreementPriceLoading = true;
      let id = this.$route.query.customid;
      if (id === null) {
        id = this.$route.query.customid;
      }
      this.$http
        .get('/member/getMemberPubGoodsPriceList', {
          params: {
            ...this.queryForm,
            id,
          },
        })
        .then((data) => {
          this.agreementPriceData = data.records;
          this.agreementPriceTotal = data.total;
          this.disabled = true;
          this.agreementPriceData.map((item) => {
            item.picture = item.picture ? item.picture : [];
          });
        })
        .finally(() => {
          this.agreementPriceLoading = false;
        });
      this.disabled = true;
    },
    // // 协议价分页
    // agreementPricePagination({ page: current, limit: size }) {
    //   this.queryForm.current = current;
    //   this.queryForm.size = size;
    //   this.getAgreementPrice();
    // },
    // 分页事件
    agreementPricePagination({ page: current, limit: size }) {
      this.queryForm.current = current;
      this.query();
    },
    handleSizeChange({ page: current, limit: size }) {
      this.queryForm.size = size;
      this.query();
    },
  },
};
</script>

<style lang="less">
.base {
  margin: -20px 0;
  font-size: 13px;
  color: #8c939d;
  height: 50px;
}

.returnIcon {
  display: inline-block;
  height: 30px;
  width: 30px;
  border: 5px solid #9a9a9a;
  border-radius: 50%;
  position: relative;
  cursor: pointer;

  i {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    font-weight: 900;
    color: #9a9a9a;
  }
}
/deep/.el-table__body tr.current-row > td {
  background: #b5cbe2 !important;
}
</style>
