<template>
  <div>
    <el-table
      ref="multipleTable"
      v-loading="loading"
      :data="tableData"
      style="width:100%;height:578"
      highlight-current-row
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(255,255,255,.6)"
      @current-change="handleCurrent"
      @selection-change="handleSelectionChange"
    >

      <el-table-column v-if="isAssign" type="selection" width="55" />
      <el-table-column fixed label="员工姓名" prop="realName" :formatter="textmatter" />
      <el-table-column label="手机号" prop="telephone" :formatter="textmatter" />
      <el-table-column label="角色" prop="role" :formatter="textmatter">
        <template slot-scope="props">
          <span
            :class="{ superAdmin: 'pass', zhuguangAdmin: 'confirm', yewuyuanAdmin: 'send' , tuanduiAdmin: 'refund' }[props.row.role]"
          >{{ props.row.role | roleFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="部门" prop="departmentName" :formatter="textmatter" />
      <el-table-column label="职务" prop="duty" :formatter="textmatter" />
      <el-table-column label="入职时间" prop="entryTime" :formatter="timematter" />
      <el-table-column label="转正时间" prop="positiveTime" :formatter="timematter" />
      <el-table-column label="员工编号" prop="employeeNo" :formatter="textmatter" />
      <el-table-column label="状态" fixed="right">
        <template slot-scope="props">
          <span
            :class="{ STAFF: 'pass', DIMISSION: 'lock',PROBATION:'send'}[props.row.status]"
          >{{ props.row.status | memberStatusFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createTime" :formatter="textmatter" />
    </el-table>
  </div>
</template>
<script>
import { imgHost } from '@/config.js';
export default {
  components: {
  },
  filters: {
    answerMatter(val) {
      if (val) {
        return val.length > 15 ? val.substring(0, 15) + '...' : val;
      } else {
        return '-';
      }
    },
  },
  props: {
    tableData: Array,
    loading: Boolean,
    isAssign: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showImageSrc: '',
      dialogDaanVisible2: false,
      dialogDaan: '',
      imgHost,
      isShowImageDialog: false
    };
  },
  methods: {
    handleCurrent(val) {
      this.$emit('handleCurrent', val);
    },
    // 批量上下架
    handleSelectionChange(val) {
      if (val.length > 1) {
        this.$message.warning('只能指派给一个员工');
        this.$refs.multipleTable.clearSelection();
        return;
      }
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
    // 时间格式化
    timematter(row, column) {
      if (row) {
        return (row[column.property]).substring(0, 10);
      }
    },
    moneymatter(row, column) {
      return row[column.property] / 100 ? row[column.property] / 100 : 0;
    },
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
  }
};
</script>
<style lang="less" scoped>
/deep/.el-table__body tr.current-row > td {
  background: #b5cbe2 !important;
}
</style>
