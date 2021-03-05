<template>
  <div style="margin: 0 10px">
    <div class="tabs">
      <div class="search-wrap">
        <span
          class="tabTitle"
          :class="isArction === 1 ? 'Select' : ''"
          @click="isArction = 1"
        >证照列表</span>
        <span
          class="tabTitle border-right"
          :class="isArction === 2 ? 'Select' : ''"
          @click="isArction = 2"
        >证照申请</span>
        <!-- 筛选 -->
      </div>
    </div>
    <!-- 证照列表 -->
    <div v-show="isArction === 1">
      <el-table
        ref="singleTable"
        v-loading="loading"
        :data="licencepData"
        border
        stripe
        fit
        highlight-current-row
        style="width: 100%; margin-top: 10px; font-size: 12px"
        :header-cell-style="{ background: '#F3F3F3', color: '#606266' }"
        size="mini"
        :height="400"
      >
        <!-- 序号 -->
        <el-table-column
          fixed
          label="序号"
          type="index"
          width="50"
          :index="indexMethod"
        />
        <el-table-column
          prop="customname"
          label="企业名称"
          :show-overflow-tooltip="true"
          :formatter="textmatter"
        />
        <el-table-column
          prop="licenceName"
          label="类型"
          :show-overflow-tooltip="true"
          :formatter="textmatter"
        />
        <el-table-column
          prop="erpCustomerId"
          label="客户id"
          width="150"
          :show-overflow-tooltip="true"
          :formatter="textmatter"
        />
        <el-table-column label="图片" width="150">
          <template slot-scope="scope">
            <div>
              <!-- <FsImg :src="scope.row.licenceImages" width="80" height="80" /> -->
              <el-image
                style="width: 100px; height: 100px"
                :src="imgHost + scope.row.licenceImages"
                :preview-src-list="[imgHost + scope.row.licenceImages]"
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="licenceCode"
          label="证件号"
          width="150"
          :show-overflow-tooltip="true"
          :formatter="textmatter"
        />
        <el-table-column
          prop="createTime"
          label="申请时间"
          width="150"
          :show-overflow-tooltip="true"
          :formatter="textmatter"
        />
        <el-table-column
          prop="signTime"
          label="发证日期"
          width="150"
          :show-overflow-tooltip="true"
          :formatter="textmatter"
        />
        <el-table-column
          prop="validEndTime"
          label="有效时间"
          width="150"
          :show-overflow-tooltip="true"
          :formatter="textmatter"
        />

        <!-- <el-table-column
          prop="createTime"
          label="联系人"
          width="130"
          :show-overflow-tooltip="true"
          :formatter="textmatter"
        /> -->
        <el-table-column
          prop="telephone"
          label="手机"
          width="180"
          :show-overflow-tooltip="true"
          :formatter="textmatter"
        />
        <el-table-column label="操作" fixed="right">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="editLicence(scope.row)"
            >编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <Pagination
        :total="totalList"
        @pagination="totalPagination"
        @handleSizeChange="handleSizeChange"
      />
    </div>
    <!-- 证照申请 -->
    <div v-show="isArction === 2" style="margin: 10px 0">
      <el-table
        ref="singleTable"
        v-loading="applyLoading"
        :data="applyList"
        border
        stripe
        fit
        highlight-current-row
        style="width: 100%; margin-top: 10px; font-size: 12px"
        :header-cell-style="{ background: '#F3F3F3', color: '#606266' }"
        size="mini"
        :height="400"
      >
        <!-- 序号 -->
        <el-table-column
          fixed
          label="序号"
          type="index"
          width="50"
          :index="applyIndex"
        />
        <el-table-column
          prop="customname"
          label="企业名称"
          width="180"
          :show-overflow-tooltip="true"
          :formatter="textmatter"
        />
        <el-table-column
          prop="licenceName"
          label="类型"
          width="150"
          :show-overflow-tooltip="true"
          :formatter="textmatter"
        />
        <el-table-column
          prop="erpCustomerId"
          label="客户id"
          :show-overflow-tooltip="true"
          :formatter="textmatter"
        />
        <el-table-column label="图片" width="150">
          <template slot-scope="scope">
            <div>
              <!-- <FsImg :src="scope.row.licenceImages" width="80" height="80" /> -->
              <el-image
                style="width: 100px; height: 100px"
                :src="imgHost + scope.row.licenceImages"
                :preview-src-list="[imgHost + scope.row.licenceImages]"
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="licenceCode"
          label="证件号"
          width="150"
          :show-overflow-tooltip="true"
          :formatter="textmatter"
        />
        <el-table-column
          prop="createTime"
          label="申请时间"
          width="150"
          :show-overflow-tooltip="true"
          :formatter="textmatter"
        />
        <!-- <el-table-column
          prop="contactName"
          label="联系人"
          width="130"
          :show-overflow-tooltip="true"
          :formatter="textmatter"
        /> -->
        <el-table-column
          prop="telephone"
          label="手机"
          width="100"
          :show-overflow-tooltip="true"
          :formatter="textmatter"
        />
        <el-table-column
          prop="statuCode"
          label="审核状态"
          :show-overflow-tooltip="true"
          :formatter="textmatter"
        />
        <el-table-column
          prop="reason"
          label="驳回原因"
          width="180"
          :show-overflow-tooltip="true"
          :formatter="textmatter"
        />
        <el-table-column label="操作" fixed="right">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="isToExamine=true;formToExamine={id:scope.row.id}"
            >编辑</el-button>
            <!-- <el-button size="mini" type="danger" @click="handleDel(scope.row)">删除</el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <Pagination
        :total="applyTotal"
        @pagination="applyPagination"
        @handleSizeChange="handleApplySizeChange"
      />
    </div>
    <LicenceEdit v-if="isEdit" :licensetype="licensetype" :form="form" :dialog-visible="isEdit" @submitForm="query" @handleClose="handleClose" />
    <ToExamine
      v-if="isToExamine"
      :form="formToExamine"
      :dialog-visible="isToExamine"
      @submitForm="getLicenceApplyVoList"
      @handleClose="handleClose"
    />
  </div>
</template>

<script>
// import { _throttle } from '@/utils/public';
// const FsImg = () => import('@/components/FsImg');
const Pagination = () => import('@/components/Pagination');
const LicenceEdit = () => import('./components/licenceEdit');
const ToExamine = () => import('./components/toExamine');
import { imgHost } from '@/config';
// import Tabel from '@/components/Table';
export default {
  name: 'Licence',
  components: {
    // Tabel,
    // FsImg,
    Pagination,
    LicenceEdit,
    ToExamine
  },
  data() {
    return {
      queryForm: {
        size: 50,
        current: 1,
      },
      isArction: 1,
      loading: true,
      totalList: 1,
      licencepData: [], // 证照列表
      applyList: [],
      applyLoading: false,
      applyTotal: 0,
      applyQueryForm: {
        size: 50,
        current: 1,
      },
      imgHost,
      isEdit: false, // 证件照编辑
      form: {}, // 证件照列表选中信息
      licensetype: [], // 证照类型
      formToExamine: {}, // 证照审核数据
      isToExamine: false, // 证照申请弹窗
    };
  },
  created() {
    this.query();
    this.getLicenceApplyVoList();
    this.getLicenceType();
  },
  methods: {
    query() {
      this.loading = true;
      this.$http
        .get('member/getLicenceVoList', { params: { ...this.queryForm }})
        .then((res) => {
          this.licencepData = res.records;
          this.totalList = res.total;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    // 证件照申请列表
    getLicenceApplyVoList() {
      this.applyLoading = true;
      this.$http.get('member/getLicenceApplyVoList', { params: { ...this.applyQueryForm }}).then(res => {
        this.applyList = res.records.map(item => {
          switch (item.status) {
            case 'NOT_APPROVED':
              item.statuCode = '驳回';
              break;
            case 'APPROVE':
              item.statuCode = '通过';
              break;
            case 'IN_REVIEW':
              item.statuCode = '未审核';
              break;
          }
          return item;
        });
        this.applyTotal = res.total;
      }).finally(() => {
        this.applyLoading = false;
      });
    },
    // 证件照列表编辑审核
    editLicence(row) {
      if (row.validEndTime === '永久') {
        row.checked = true;
      } else {
        row.valid_end_time = row.validEndTime;
      }
      this.form = { ...row };
      this.isEdit = true;
    },
    // 更新状态
    setStaet(item, stateArr) {
      let state = null;
      stateArr.forEach((e) => {
        if (item === e.id) {
          state = e.typeName;
          return;
        }
      });
      return state;
    },
    openMask(e) {
      this.$alert(`<img src="${imgHost + e}" style="width: 100%"/>`, {
        dangerouslyUseHTMLString: true,
        closeOnPressEscape: true,
      }).catch((_) => {
        return;
      });
    },
    // 编辑取消
    cancel() {
      this.addMask = false;
      this.editMask = false;
      this.current = {};
    },
    handleClose() {
      // 证照编辑关闭
      this.isEdit = false;
      this.form = {};
      // 证照申请关闭
      this.isToExamine = false;
      this.formToExamine = {};
    },
    // 获取证件照类型
    getLicenceType() {
      this.$http.get('pcMember/getLicenceType').then((res) => {
        this.licensetype = res;
      });
    },
    // 分页
    totalPagination({ page: current, limit: size }) {
      this.queryForm.current = current;
      this.query();
    },
    handleSizeChange({ page: current, limit: size }) {
      this.queryForm.size = size;
      this.query();
    },
    // 申请列表分页
    applyPagination({ page: current, limit: size }) {
      this.applyQueryForm.current = current;
      this.getLicenceApplyVoList();
    },
    handleApplySizeChange({ page: current, limit: size }) {
      this.applyQueryForm.size = size;
      this.getLicenceApplyVoList();
    },
    // 序号
    indexMethod(index) {
      return (this.queryForm.current - 1) * this.queryForm.size + index + 1;
    },
    // 序号
    applyIndex(index) {
      return (this.applyQueryForm.current - 1) * this.applyQueryForm.size + index + 1;
    },
    // 文本格式化
    textmatter(row, column) {
      if (row[column.property] === 0) {
        return row[column.property];
      }
      return row[column.property] ? row[column.property] : '-';
    },
  },
};
</script>

<style scoped lang="less">
.orderBtn {
  float: right;
  margin: 0 10px 10px;
}
// 头部切换
.tabs {
  margin-top: 15px;
  font-size: 14px;
  padding: 0px 10px;
  padding-left: 0;
  border-bottom: 1px solid #eef0f4;
  position: relative;
  .tabTitle {
    display: inline-block;
    padding: 10px;
    border: 1px solid #eef0f4;
    border-right: none;
    z-index: 12;
    margin-bottom: -1px;
    background: #f3f6f9;
    cursor: pointer;
  }
  .border-right {
    border: 1px solid #eef0f4;
  }
  .Select {
    border-bottom: 1px solid #fff;
    color: #3894ff;
    background: #fff;
  }
  .search {
    display: inline-block;
    position: absolute;
    right: 0;
  }
  .search-wrap {
    position: relative;
  }
  .el-table {
    margin: 0 !important;
  }
}
// 订单详细
ul {
  list-style: none;
  margin: 0;
  padding-left: 20px;
  li {
    line-height: 30px;
    span {
      display: inline-block;
      height: 100%;
      &:nth-child(2) {
        width: 400px;
      }
    }
  }
}
/deep/.el-table__body tr.current-row > td {
  background: #b5cbe2 !important;
}
</style>
