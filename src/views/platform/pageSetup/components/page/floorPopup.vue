<template>
  <el-dialog :visible.sync="dialogFormVisible" :close-on-click-modal="false" :before-close="cancel" width="65%">
    <!-- 筛选 -->
    <el-row>
      <el-col :span="24">
        <div class="row-col" style="margin-top: 10px;font-size:12px" @keyup.enter="query">
          <el-input
            v-model.trim.number="queryForm.apName"
            placeholder="请输入楼层名称"
            style="width:145px;margin-right: 10px"
            clearablex
            size="small"
          />
          <el-select v-model.trim="queryForm.type" placeholder="请选择活动区域">
            <el-option label="单行样式" value="SINGLE_LINE" />
            <el-option label="多行样式" value="MULTI_LINE" />
            <el-option label="背景样式" value="BG_IMAGE" />
            <el-option label="商品推荐样式" value="SUGGEST_GOODS" />
          </el-select>
          <el-button type="primary" icon="el-icon-search" style="margin-left:10px" @click="query">搜索</el-button>
          <el-button type="info" @click="queryForm = {size: 50,current: 1};query()">重置</el-button>
        </div>
      </el-col>
    </el-row>
    <!-- 楼层 -->
    <Tabel :columns="columns" :table-data="floorList" :loading="loading" :page-index="queryForm" :is_height="330" :is-index="false">
      <el-table-column slot="index" label="选择" width="60" center>
        <template slot-scope="scope">
          <el-radio
            :key="scope.$index"
            v-model.trim="radio"
            :label="scope.$index"
            @change.native="getCurrentRow(scope.$index, scope.row)"
          ><span /> </el-radio>
        </template>
      </el-table-column>
    </Tabel>
    <div class="choice_btn">
      <el-button type="primary" @click="onSubmit">确定</el-button>
      <el-button @click="cancel">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
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
        apName: '',
        type: ''
      },
      floorList: [],
      loading: true,
      columns: [
        {
          prop: 'title',
          label: '楼层名称',
          width: 200
        },
        {
          prop: 'typeName',
          label: '展示样式',
          width: 180
        },
        {
          prop: 'memberPhone',
          label: '分类关联',
        },
        {
          prop: 'goodsNum',
          label: '商品数量',
          width: 140
        }
      ],
      radio: '',
      floor: {},
    };
  },
  watch: {
    pageSetList: {
      handler(val) {
        this.floor = { id: val.floorId, title: val.floorTitle };
        const index = this.floorList.findIndex(item => {
          return val.floorId === item.id;
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
      this.$http.get('advPosition/getFloorList', { params: { ...this.queryForm }}).then(res => {
        res.records.map(item => {
          // 判断类型
          switch (item.type) {
            case 'SINGLE_LINE':
              item.typeName = '单行样式';
              break;
            case 'MULTI_LINE':
              item.typeName = '多行样式';
              break;
            case 'BG_IMAGE':
              item.typeName = '背景样式';
              break;
            case 'SUGGEST_GOODS':
              item.typeName = '商品推荐样式';
              break;
            default:
              break;
          }
        });
        this.total = res.total;
        this.floorList = res.records;
      }).finally(() => {
        this.loading = false;
      });
    },
    getCurrentRow(index, row) {
      this.radio = index;
      this.floor = {
        id: row.id,
        title: row.title
      };
    },
    onSubmit() {
      this.$emit('onSubmit', this.floor);
      this.radio = '';
    },
    cancel() {
      this.$emit('cancel');
      this.radio = '';
    }
  },
};
</script>

<style scoped lang='less'>
// 按钮
.choice_btn {
  text-align: center;
  margin: 20px 0 0;
}
</style>
