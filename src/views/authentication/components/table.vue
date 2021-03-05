<template>
  <div>
    <el-table
      v-loading="loading"
      :data="tableData"
      style="width:100%"
      height="450"
      width="100%"
      align="center"
      highlight-current-row
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(255, 255, 255, 0.8)"
      @current-change="handleCurrent"
    >
      <el-table-column
        label="序号"
        type="index"
        :index="indexMethod"
      />
      <el-table-column label="企业名称" prop="companyName" header-align="center" :formatter="textmatter" />
      <el-table-column label="类型" prop="company_type" :formatter="textmatter" />
      <el-table-column label="地区" prop="area_name" :formatter="textmatter" />
      <el-table-column
        label="地址"
        :show-overflow-tooltip="true"
        prop="address"
        :formatter="textmatter"
      />
      <el-table-column label="注册时间" prop="createTime" :formatter="textmatter" />
      <el-table-column label="联系人" prop="contactName" :formatter="textmatter" />
      <el-table-column label="注册手机号" prop="telephone" :formatter="textmatter" />
      <el-table-column label="联系手机号" prop="contactPhone" :formatter="textmatter" />
      <!-- <el-table-column label="创建时间" prop="createTime" :formatter="dateFormatter" /> -->
      <el-table-column label="操作" width="95">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="handleClick(scope.row)">编辑审核</el-button>
        </template>
      </el-table-column>
    </el-table>
    <showImage :is-show-image-dialog.sync="isShowImageDialog" :src="showImageSrc" />
  </div>
</template>
<script>
import { imgHost } from '@/config.js';

const showImage = () => import('@/components/showImage');
export default {
  components: {
    showImage
  },
  filters: {
    answerMatter(val) {
      if (val) {
        return val.length > 15 ? val.substring(0, 15) + '...' : val;
      } else {
        return '-';
      }
    },
    companyType(val) {
      switch (val) {
        case 'RETAIL_MONOMER_DRUGSTORE':
          return '零售-单体药店';
        case 'RETAIL_CHAIN_HEADQUARTERS':
          return '零售-连锁总部';
        case 'PROFITABILITY_MEDICAL_ESTABLISHMENT':
          return '盈利性医疗机构';
        case 'NOT_PROFITABILITY_MEDICAL_ESTABLISHMENT':
          return '非盈利性医疗机构';
        case 'WHOLESALE_BUSINESS_COMPANY':
          return '批发-商业公司';
      }
    }
  },
  props: {
    // eslint-disable-next-line vue/require-default-prop
    tableData: Array,
    loading: Boolean,
    queryForm: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      license: {},
      showImageSrc: '',
      dialogDaanVisible2: false,
      dialogDaan: '',
      imgHost,
      isShowImageDialog: false,
    };
  },
  methods: {
    handleClick(row) {
      this.$addTag({ path: 'authenticationInfo', query: { memberId: row.memberId }});
    },
    handleCurrent(val) {
      this.$emit('handleCurrent', val);
    },
    // 批量上下架
    handleSelectionChange(val) {
      this.$emit('handleSelectionChange', val);
    },
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
    // 是否同步ERP
    isErp(row, column) {
      return row[column.property] === 1 ? '是' : '否';
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
    // 费率
    rate(row, column) {
      return row[column.property] / 10 ? row[column.property] / 10 : 0;
    },
    infos(val) {
      this.dialogDaanVisible2 = true;
      this.dialogDaan = val;
    },
    showImageDialog(codes) {
      if (codes && codes.length) {
        this.isShowImageDialog = true;
        this.showImageSrc = `${this.imgHost}/${codes}`;
      }
    },
    // 序号
    indexMethod(index) {
      return (this.queryForm.current - 1) * this.queryForm.size + index + 1;
    }
  }

};
</script>
<style lang="less" scoped>
/deep/.el-table__body tr.current-row > td {
  background: #b5cbe2 !important;
}
</style>
