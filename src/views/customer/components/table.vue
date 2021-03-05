<template>
  <div>
    <el-table
      ref="multipleTable"
      v-loading="loading"
      :data="tableData"
      style="width:100%;"
      height="450"
      width="100%"
      align="center"
      highlight-current-row
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(255, 255, 255, 0.8)"
      border
      :header-cell-style="{background:'#F3F3F3',color:'#606266'}"
      @selectable="handleSelectionChange"
      @row-click="rowClick"
    >
      <el-table-column
        label="序号"
        type="index"
        :index="indexMethod"
      />
      <el-table-column label="id" prop="id" header-align="center" :formatter="textmatter" />
      <el-table-column label="头像" prop="headImg" header-align="center" :formatter="showImageDialog" />
      <el-table-column label="账号" prop="telephone" :formatter="nummatter" width="110" />
      <el-table-column label="客户手机" prop="zxPhone" :formatter="nummatter" width="110" />
      <el-table-column label="ERP" prop="isErp" :formatter="isErp" />
      <el-table-column label="ERP客户ID" prop="customid" width="110" :formatter="textmatter" />
      <el-table-column
        label="客户名称"
        :show-overflow-tooltip="true"
        header-align="center"
        prop="customname"
        :formatter="textmatter"
        width="200"
      />
      <el-table-column
        label="注册地址"
        :show-overflow-tooltip="true"
        header-align="center"
        prop="registadd"
        :formatter="textmatter"
        width="350"
      />
      <el-table-column
        label="税号"
        :show-overflow-tooltip="true"
        header-align="center"
        prop="taxnumber"
        :formatter="textmatter"
        width="150"
      />
      <el-table-column label="开票策略" prop="invmethodName" width="110" :formatter="textmatter" />
      <el-table-column label="法人代表" prop="legalperson" :formatter="textmatter" />
      <el-table-column label="质量状态" prop="gspusestatusname" :formatter="textmatter" />
      <el-table-column label="创建时间" prop="credate" :formatter="dateFormatter" width="110" />
      <el-table-column label="积分" prop="integral" :formatter="nummatter" width="110" />
      <el-table-column label="详情" width="95" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="handleClick(scope.row)">查看</el-button>
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
    rowClick(row, column, event) {
      this.$emit('handleCurrent', row);
    },
    handleClick(row) {
      const title = `证件信息-${row.customid}`;
      this.$addTag({ path: 'customerInfo', title, query: { id: row.id, customid: row.customid }});
      // this.$router.push({ path: 'customerInfo', query: { id: row.erpUserId, customid: row.customid }});
      // this.$root.$emit("getPath", {path: "/customerInfo?id="+ row.id, title: "证件信息", name: "customer"+row.id});
    },
    // handleCurrent(val) {
    //   this.$emit('handleCurrent', val);
    // },
    // 批量上下架
    handleSelectionChange(row) {
      console.log(row);
      // this.goodsteMporary = [...row];
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
