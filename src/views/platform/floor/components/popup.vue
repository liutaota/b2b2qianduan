<template>
  <el-dialog :visible.sync="dialogFormVisible" :close-on-click-modal="false" :before-close="cancel" destroy-on-close top="4vh" width="80%">
    <div class="search_wrap" @keyup.enter="query">
      <el-input v-model.trim="form.goodsid" placeholder="请输入货品ID" style="width: 200px;margin-right:10px" />
      <el-input v-model.trim="form.goodsname" placeholder="请输入货品名称" style="width: 200px;margin-right:10px" />
      <el-cascader
        ref="cascaderAddr"
        v-model.trim="form.classnRow3"
        style="margin-right:10px"
        :options="options"
        :props="{ label: 'classname', value: 'classnRow', children: 'subGoodsClassList' }"
        @change="handleChange"
      />
      <el-select v-model.trim="form.setId" filterable placeholder="请选择" style="margin-right:10px">
        <el-option
          v-for="item in BannedGoodsList"
          :key="item.goodssetid"
          :label="item.goodssetid +' - '+item.goodssetname"
          :value="item.goodssetid"
        />
      </el-select>
      <el-button type="primary" @click="query">查询</el-button>
      <el-button @click="reset">重置</el-button>
    </div>
    <div class="transfer">
      <div>
        <Tabel
          :columns="columns"
          :fixed="false"
          :table-data="goodsData"
          :loading="loading"
          :is_height="400"
          :page-index="form"
          @handleSelectionChange="handleSelectionChange"
        >
          <el-table-column
            slot="index"
            fixed
            type="selection"
            width="40"
          />
        </Tabel>
        <pagination
          :total="total"
          :pager-count="5"
          :page-sizes="[100, 200, 500, 1000]"
          @pagination="pagination"
          @handleSizeChange="handleSizeChange"
        />
      </div>
      <div style="color:#fff">
        <el-button type="primary" icon="el-icon-arrow-left" @click="goodsListLeft" />
        <el-button type="primary" icon="el-icon-arrow-right" @click="goodsListRight" />
      </div>
      <div>
        <Tabel
          :columns="columns"
          :fixed="false"
          :table-data="goodsChoice"
          :is_height="400"
          :page-index="goodsChoiceForm"
          @handleSelectionChange="handleSelectionChange"
        >
          <el-table-column
            slot="index"
            fixed
            type="selection"
            width="55"
          />
        </Tabel>
      </div>
    </div>
    <div>
      <div class="choice_btn">
        <el-button type="primary" @click="onSubmit">确定</el-button>
        <el-button @click="cancel">取消</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { _throttle } from '@/utils/public';
import Tabel from '@/components/Table';
import Pagination from '@/components/Pagination';
export default {
  components: {
    Tabel, Pagination
  },
  props: {
    dialogFormVisible: {
      type: Boolean,
      default: () => true
    },
    goodsList: {
      type: Array,
      default: () => []
    },
  },
  data() {
    return {
      form: {
        size: 100,
        current: 1,
        goodsid: '',
        goodsname: ''
      },
      goodsChoiceForm: {
        size: 100,
        current: 1,
      },
      total: 0,
      loading: false,
      // 待选中商品
      goodsData: [
      ],
      // 暂存区
      goodsteMporary: [],
      // 已选中商品
      goodsChoice: [],
      // 商品表格
      lists: [],
      columns: [
        {
          prop: 'goodsid',
          label: '货品Id',
          width: 70
        },
        {
          prop: 'currencyname',
          label: '通用名',
          width: 200
        },
        {
          prop: 'goodstype',
          label: '规格',
          width: 150
        },
        {
          prop: 'factoryname',
          label: '厂家',
          width: 200
        },
        {
          prop: 'busiscopeName',
          label: '分类',
          width: 200
        },
      ],
      // 分类选择器数据
      options: [],
      isActive: false,
      BannedGoodsList: [],
    };
  },
  watch: {
    goodsList(val) {
      val.forEach(item => {
        const { goodsId: goodsid,
          goodsName: goodsname, factoryname,
          currencyname, goodstype, accflag, integralGoods, convertibleIntegral
        } = item;
        this.goodsChoice.push({
          goodsid, goodsname, factoryname,
          currencyname, goodstype, accflag,
          integralGoods, convertibleIntegral
        });
      });
    },
    form: {
      handler(val) {
        if (val.goodsid === '' && val.goodsname === '') {
          this.query();
        }
      },
      deep: true
    }
  },
  mounted() {
    this.goodsChoice = [...this.goodsList];
    this.query();
    this.goodsClassification();
    this.getBannedGoods();
  },
  methods: {
    // 筛选
    query() {
      this.loading = true;
      this.$http.get('goods/goodsList', { params: { ...this.form }}).then(res => {
        // 去掉选中商品的数据
        this.goodsChoice.forEach((data, i) => {
          res.records.forEach((item, index) => {
            if (item.goodsid === data.goodsid) {
              res.records.splice(index, 1);
            }
          });
        });
        this.goodsData = res.records;
        this.total = res.total;
      }).finally(_ => {
        this.loading = false;
      });
    },
    // 总单
    getBannedGoods() {
      this.loading = true;
      this.$http.get('goods/getAdminGoodsList', {
        params: {
          size: 10000
        }
      }).then(res => {
        this.BannedGoodsList = res.records;
      });
    },
    goodsClassification() {
      this.$http.get('goods/getAdminGoodsClassTypeVoList').then(res => {
        this.options = res;
      });
    },
    reset() {
      this.form = {
        size: 50,
        current: 1,
      };
      this.query();
    },
    onSubmit() {
      const goodsList = [];
      this.goodsChoice.forEach(item => {
        goodsList.push({
          accflag: item.accflag,
          integralGoods: item.integralGoods,
          goodsId: item.goodsid,
          goodsName: item.goodsname,
          factoryname: item.factoryname,
          currencyname: item.currencyname,
          goodstype: item.goodstype,
          convertibleIntegral: item.convertibleIntegral
        });
      });
      this.$emit('onSubmit', goodsList);
      this.goodsChoice = [];
    },
    // 取消
    cancel() {
      this.$emit('cancel');
    },
    // 多选选中数据
    handleSelectionChange(row) {
      this.goodsteMporary = [...row];
    },
    // 数据移除
    goodsListLeft: _throttle(function() {
      if (this.goodsteMporary.length === 0) return;
      // 数组合并
      const goodsList = [...this.goodsData, ...this.goodsteMporary];
      const obj = {};
      // 去重
      this.goodsData = goodsList.reduce((cur, next) => {
        obj[next.goodsid] ? '' : obj[next.goodsid] = true && cur.push(next);
        return cur;
      }, []);
      // 删除选中的数据
      this.goodsteMporary.forEach(data => {
        this.goodsChoice.forEach((item, index) => {
          if (item.goodsid === data.goodsid) {
            this.goodsChoice.splice(index, 1);
          }
        });
      });
    }),
    // 数据添加到选中
    goodsListRight: _throttle(function() {
      if (this.goodsteMporary.length === 0) return;
      // 数组合并
      const goodsList = [...this.goodsChoice, ...this.goodsteMporary];
      const obj = {};
      // 去重
      this.goodsChoice = goodsList.reduce((cur, next) => {
        obj[next.goodsid] ? '' : obj[next.goodsid] = true && cur.push(next);
        return cur;
      }, []);
      // 删除待选中商品
      this.goodsteMporary.forEach(data => {
        this.goodsData.forEach((item, index) => {
          if (item.goodsid === data.goodsid) {
            this.goodsData.splice(index, 1);
          }
        });
      });
    }),
    handleChange(val) {
      if (val === undefined) return;
      this.$refs.cascaderAddr.dropDownVisible = false;
      const nodeContent = this.$refs['cascaderAddr'].getCheckedNodes();
      this.form.classnRow3 = nodeContent[0].value;
    },
    // 分页事件
    pagination ({ page: current, limit: size }) {
      this.form.current = current;
      this.query();
    },
    handleSizeChange({ page: current, limit: size }) {
      this.form.size = size;
      this.query();
    },
  }
};
</script>

<style scoped lang="less">
// 筛选
.search_wrap{
  margin: 10px 0;
}
// 穿梭表单
.transfer {
  display: flex;
  justify-content: space-between;
  margin: 30px 0;
  &>div {
    margin: 0 10px;
    width: 42%;
    &:nth-child(2){
      width: 10%;
      display: flex;
      // text-align: center;
      justify-content: center;
      align-items: center;
    }
  }
}
// 按钮
.choice_btn {
  text-align: center;
  margin: 20px 0 0;
}
/deep/.el-transfer-panel {
      width: 280px !important;
}
/deep/.pagination-container{
  padding: 16px 0;
}
</style>
