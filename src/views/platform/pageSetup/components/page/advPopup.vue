<template>
  <el-dialog :visible.sync="dialogFormVisible" :close-on-click-modal="false" :before-close="cancel" width="65%">
    <!-- 筛选 -->
    <el-row>
      <el-col :span="24">
        <div class="row-col" style="margin-top: 10px;font-size:12px" @keyup.enter="query">
          <el-input
            v-model.trim.number="queryForm.advName"
            placeholder="请输入广告位名称"
            style="width:145px;margin-right: 10px"
            clearablex
            size="small"
          />
          <el-select v-model.trim="queryForm.apDisplay" placeholder="请选择展示样式">
            <el-option label="顶部广告位" value="TOP_BANNER" />
            <el-option label="轮播广告位" value="CAROUSEL_BANNER" />
            <el-option label="中部单图" value="CENTER_ONLY" />
            <el-option label="中部多图小" value="CENTER_MORE_LITTLE" />
            <el-option label="中部多图大" value="CENTER_MORE_BIG" />
            <el-option label="侧边广告" value="BROADSIDE_BANNER" />
            <el-option label="弹窗广告" value="POPUP_BANNER" />
          </el-select>
          <el-button type="primary" icon="el-icon-search" style="margin-left:10px" @click="query">搜索</el-button>
          <el-button type="info" @click="queryForm = {size: 50,current: 1};query()">重置</el-button>
        </div>
      </el-col>
    </el-row>
    <Tabel :columns="columns" :table-data="apList" :loading="loading" :page-index="queryForm" :is-index="false">
      <el-table-column slot="index" label="选择" width="100" center>
        <template slot-scope="scope">
          <el-radio
            :key="scope.$index"
            v-model.trim="radio"
            :label="scope.$index"
            @change.native="getCurrentRow(scope.$index, scope.row)"
          ><span>{{ scope.$index + 1 }}</span></el-radio>
        </template>
      </el-table-column>
      <el-table-column slot="handleColumn" label="是否启用">
        <template slot-scope="scope">
          <el-switch
            v-model.trim="scope.row.isUse"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-value="ON"
            inactive-value="OFF"
            @change="handleSwith(scope.row,scope.$index)"
          /></template>
      </el-table-column>
    </Tabel>
    <div class="choice_btn">
      <el-button type="primary" @click="onSubmit">确定</el-button>
      <el-button @click="cancel">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { _throttle } from '@/utils/public';
import Tabel from '@/components/Table';
export default {
  components: {
    Tabel,
  },
  props: {
    dialogFormVisible: {
      type: Boolean,
      default: () => false
    },
    pageSetList: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      queryForm: {
        size: 50,
        current: 1,
        advName: '',
        apDisplay: ''
      },
      apList: [],
      loading: true,
      columns: [
        {
          prop: 'advName',
          label: '广告名称',
        },
        {
          prop: 'ap_display',
          label: '展示样式',
        },
        {
          prop: 'advStartDate',
          label: '开始时间',
        },
        {
          prop: 'advEndDate',
          label: '结束时间',
        }
      ],
      radio: '',
      reFresh: true
    };
  },
  watch: {
    pageSetList: {
      handler(val) {
        this.adv = { id: val.advId, title: val.advTitle };
        const index = this.apList.findIndex(item => {
          return val.advId === item.id;
        });
        this.radio = index;
      },
      deep: true,
    }
  },
  mounted() {
    this.query();
  },
  methods: {
    query() {
      this.loading = true;
      this.$http.get('advPosition/getAdvPosition', { params: { ...this.queryForm }}).then(res => {
        res.records.map(item => {
          // 判断类型
          switch (item.apDisplay) {
            case 'TOP_BANNER':
              item.ap_display = '顶部广告位';
              break;
            case 'CAROUSEL_BANNER':
              item.ap_display = '轮播广告位';
              break;
            case 'CENTER_ONLY':
              item.ap_display = '中部单图';
              break;
            case 'CENTER_MORE_LITTLE':
              item.ap_display = '中部多图小';
              break;
            case 'CENTER_MORE_BIG':
              item.ap_display = '中部多图大';
              break;
            case 'BROADSIDE_BANNER':
              item.ap_display = '侧边广告';
              break;
            case 'POPUP_BANNER':
              item.ap_display = '弹窗广告';
              break;
            default:
              break;
          }
        });
        this.apList = res.records;
      }).finally(() => {
        this.loading = false;
      });
    },
    // 单选事件
    getCurrentRow(index, row) {
      this.radio = index;
      this.adv = {
        id: row.id,
        title: row.advName
      };
    },
    // 是否启用
    handleSwith: _throttle(function(e, index) {
      this.$confirm('是否启用, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const { id, isUse } = e;
        this.$http.get('advPosition/updateAdvPositionIsUse', { params: { id, isUse }}).then(res => {
          if (e.isUse === 'ON') {
            this.$message({
              message: '启用成功',
              type: 'success'
            });
          } else if (e.isUse === 'OFF') {
            this.$message({
              message: '关闭成功',
              type: 'success'
            });
          }
          this.query();
        });
      }).catch(() => {
        this.apList[index].isUse === 'OFF' ? this.apList[index].isUse = 'ON' : this.apList[index].isUse = 'OFF';
        this.$message({
          type: 'info',
          message: '已取消启用'
        });
      });
    }, 1000),
    onSubmit() {
      this.$emit('onSubmit', this.adv);
      this.radio = '';
    },
    cancel() {
      this.$emit('cancel');
    },
  }
};
</script>

<style scoped lang='less'>
// 按钮
.choice_btn {
  text-align: center;
  margin: 20px 0 0;
}
</style>
