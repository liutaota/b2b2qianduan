<template>
  <el-dialog :visible.sync="dialogFormVisible" :close-on-click-modal="false" :before-close="cancel" destroy-on-close top="4vh" width="80%">
    <div class="search_wrap" @keyup.enter="query">
      <el-input v-model.trim="form.goodsId" placeholder="请输入货品ID" style="width: 200px;margin-right:10px" />
      <el-input v-model.trim="form.goodsName" placeholder="请输入货品名称" style="width: 200px;margin-right:10px" />
      <el-input v-model.trim="form.factoryId" placeholder="请输入厂家ID" style="width: 200px;margin-right:10px" />
      <el-input v-model.trim="form.factoryName" placeholder="请输入厂家名称" style="width: 200px;margin-right:10px" />

      <el-button type="primary" @click="query" v-if="str === '正式'" disabled="disabled">查询</el-button>
      <el-button @click="reset" v-if="str === '正式'" disabled="disabled">重置</el-button>
      <span v-else >
        <el-button type="primary" @click="query" >查询</el-button>
        <el-button @click="reset" >重置</el-button>
      </span>

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
      <div style="color:#fff" >
        <el-button type="primary" icon="el-icon-arrow-left" @click="goodsListLeft" v-if="str === '正式'" disabled="disabled"/>
        <el-button type="primary" icon="el-icon-arrow-left" @click="goodsListLeft"  v-else/>
        <el-button type="primary" icon="el-icon-arrow-right" @click="goodsListRight" v-if="str === '正式'" disabled="disabled"/>
        <el-button type="primary" icon="el-icon-arrow-right" @click="goodsListRight"  v-else/>
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
          <el-table-column v-if="str === '正式'" disabled="disabled"
            slot="index"
            fixed
            type="selection"
            width="55"
          />
          <el-table-column v-else
            slot="index"
            fixed
            type="selection"
            width="55"
          />
          <el-table-column slot="handleColumn" label="操作" fixed="right" width="70">
            <template slot-scope="scope">
              <el-button v-if="str === '正式'" disabled="disabled"
                size="mini"
                type="danger"
                @click="delSelect(form = {...scope.row})"
              >删除</el-button>
              <el-button v-else
                size="mini"
                type="danger"
                @click="delSelect(form = {...scope.row})"
              >删除</el-button>
            </template>
          </el-table-column>
        </Tabel>
      </div>
    </div>
    <div>
      <div class="choice_btn">
        <el-button type="primary" @click="onSubmit" v-if="str === '正式'" disabled="disabled">确定</el-button>
        <el-button type="primary" @click="onSubmit" v-else>确定</el-button>
        <el-button @click="cancel" v-if="str === '正式'" disabled="disabled">取消</el-button>
        <el-button @click="cancel" v-else>取消</el-button>
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
    str:String,
  },
  data() {
    return {
      form: {
        size: 100,
        current: 1,
        goodsId: '',
        goodsName: '',
        factoryId:'',
        factoryName:''
      },
      goodsChoiceForm: {
        size: 100,
        current: 1,
      },
      total: 0,
      loading: false,
      // 待选中商品
      goodsData: [],
      // 暂存区
      goodsteMporary: [],
      // 已选中商品
      goodsChoice: [],
      // 商品表格
      lists: [],
      columns: [
        {
          prop: 'goodsId',
          label: '商品ID',
          width: 100
        },
        {
          prop: 'goodsName',
          label: '商品名称',
          width: 200
        },
        {
          prop: 'goodsUnit',
          label: '基本单位',
          width: 100
        },
        {
          prop: 'factoryId',
          label: '厂商ID',
          width: 150
        },
        {
          prop: 'factoryName',
          label: '厂商名称',
          width: 220
        },
        {
          prop: 'prodArea',
          label: '原料产地',
          width: 150
        },
        {
          prop: 'goodsType',
          label: '规格',
          width: 150
        },
        {
          prop: 'medicineTypeName',
          label: '药品类型',
          width: 150
        },
      ],
      // 分类选择器数据
      options: [],
      isActive: false,
      BannedGoodsList: [],
      planId:0,
      goodsId: '',
      goodsName: '',
      factoryId:'',
      factoryName:''
    };
  },
  watch: {
    goodsList(val) {
      //console.log(this.str);//我是字符串
      this.goodsChoice =[]
      val.forEach(item => {
        const { goodsId: goodsId,
          goodsName: goodsName, factoryName :factoryName,factoryId :factoryId,
          currencyName, goodsType, prodArea, goodsUnit, medicineTypeName,planDtlId
        } = item;
        this.goodsChoice.push({
          goodsId, goodsName, factoryName,factoryId,
          currencyName, goodsType, prodArea, goodsUnit, medicineTypeName,planDtlId
        });
      });
    },
    form: {
      handler(val) {
        if (val.goodsid === '' && val.goodsname === '' && val.factoryName === ''  && val.factoryId === '') {
          this.query();
        }
      },
      deep: true
    }
  },
  mounted() {
    this.goodsChoice = [...this.goodsList];
    let obj = [];
    this.goodsChoice = this.goodsChoice.reduce((cur, next) => {
      obj[next.goodsId] ? '' : obj[next.goodsId] = true && cur.push(next);
      return cur;
    }, []);
    this.query();
    this.goodsClassification();
    this.getBannedGoods();
  },
  methods: {
    //移除
    delSelect(forms){
      this.goodsChoice.forEach((item,index) => {
        if(item.goodsId === forms.goodsId){
          this.goodsChoice.splice(index, 1);
        }
      })
      this.reset();
    },
    // 筛选
    query() {
      this.loading = true;
      this.form.current = 1;
      this.$http.get('/report/goods/plan/selectGoodsList', {params: { ...this.form }}).then(res => {
        // 去掉选中商品的数据
        this.goodsChoice.forEach((data, i) => {
          res.records.forEach((item, index) => {
            if (item.goodsId === data.goodsId) {
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
        goodsId:'',
        goodsName: '',
        factoryId:'',
        factoryName:''
      };
      this.query();
    },
    onSubmit() {
      const goodsList = [];
      this.goodsChoice.forEach(item => {
        goodsList.push({
          goodsType: item.goodsType,
          integralGoods: item.integralGoods,
          goodsId: item.goodsId,
          goodsName: item.goodsName,
          factoryId: item.factoryId,
          factoryName: item.factoryName,
          currencyName: item.currencyName,
          goodsUnit: item.goodsUnit,
          medicineTypeName: item.medicineTypeName,
          prodArea : item.prodArea,
          planDtlId : item.planDtlId
        });
      });
      //console.log(goodsList);
      this.$emit('onSubmitAdd', goodsList);
      this.goodsChoice = [];
    },
    // 取消
    cancel() {
      this.goodsChoice = []
      this.$emit('cancelAdd');
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
        obj[next.goodsId] ? '' : obj[next.goodsId] = true && cur.push(next);
        return cur;
      }, []);
      // 删除选中的数据
      this.goodsteMporary.forEach(data => {
        this.goodsChoice.forEach((item, index) => {
          if (item.goodsId === data.goodsId) {
            this.goodsChoice.splice(index, 1);
          }
        });
      });
    }),
    // 数据添加到选中
    goodsListRight: _throttle(function() {
      if (this.goodsteMporary.length === 0) return;
      // 数组合并  ...this.goodsChoice,
      //this.goodsChoice = [];
      const goodsList = [ ...this.goodsChoice,...this.goodsteMporary];
      const obj = {};
      // 去重
      this.goodsChoice = goodsList.reduce((cur, next) => {
        obj[next.goodsId] ? '' : obj[next.goodsId] = true && cur.push(next);
        return cur;
      }, []);
      // 删除待选中商品
      this.goodsteMporary.forEach(data => {
        this.goodsData.forEach((item, index) => {
          if (item.goodsId === data.goodsId) {
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
