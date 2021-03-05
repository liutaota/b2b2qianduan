<template>
  <el-dialog title="货品添加" :visible.sync="dialogVisible" width="80%" :close-on-click-modal="false" :before-close="handleClose">
    <div @keyup.enter="getGoods()">
      <el-input
        v-model.trim.number="queryForm.goodspinyin"
        placeholder="请输入商品"
        style="width: 140px; margin-right: 13px"
        clearablex
      />
      <el-input
        v-model.trim="queryForm.goodsname"
        placeholder="请输入商品名"
        style="width:130px;margin-right: 20px"
        clearablex
      />
      <el-input
        v-model.trim="queryForm.factoryname"
        placeholder="请输入生产厂商"
        style="width:130px;margin-right: 20px"
        clearablex
      />
      <el-cascader
        v-model.trim="region"
        :options="goodsClass"
        collapse-tags
        :props="{
          label: 'classname',
          value: 'classnRow',
          children: 'subGoodsClassList',
          checkStrictly: true }"
        clearable
        style=" margin-right: 13px"
      />
      <el-button
        type="primary"
        style="margin-top: 10px"
        @click="getGoods()"
      >搜索</el-button>
      <el-button type="info" @click="reset">重置</el-button>
    </div>
    <Tabel
      :columns="columns"
      :table-data="goodsList"
      :loading="loading"
      :page-index="queryForm"
    >
      <el-table-column
        slot="handleColumn"
        label="数量"
        width="160"
      >
        <template slot-scope="scope">
          <el-input-number v-model.trim="scope.row.goodsNum" :min="1" :max="scope.row.goodsqty" />
        </template>
      </el-table-column>
      <el-table-column
        slot="handleColumn"
        label="操作"
        width="200"
        fixed="right"
      >
        <template slot-scope="scope">
          <el-button type="primary" @click.stop="(e) => addCar(scope.row, e)">
            <i v-if="scope.row.isCar" class="el-icon-loading" />
            添加购物车
          </el-button>
        </template>
      </el-table-column>
    </Tabel>
  </el-dialog>
</template>

<script>
const Tabel = () => import('@/components/Table');
import { numFilter, goodsqtyFilter } from '@/util.js';
export default {
  components: {
    Tabel,
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    memberId: {
      type: Number,
      default: 0
    },
    carList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      loading: false,
      columns: [
        {
          prop: 'goodsname',
          label: '商品名称',
        },
        {
          prop: 'factoryname',
          label: '厂家名称',
        },
        {
          prop: 'goodsid',
          label: '商品编码',
        },
        {
          prop: 'goodstype',
          label: '规格',
        },
        {
          prop: 'goodsqty',
          label: '库存',
        },
        {
          prop: 'price2',
          label: '单价',
          formatter: 'nummatter',
        },
        {
          prop: 'customname',
          label: '活动',
        },
        {
          prop: 'lotno',
          label: '批号',
        },
      ],
      goodsList: [],
      goodsClass: [],
      queryForm: {
        size: 50,
        current: 1,
      },
      region: []
    };
  },
  created() {
    // this.getGoods();
    this.getGoodsClass();
    document.addEventListener('keydown', this.handleKeyDown);
  },
  destroyed() {
    document.removeEventListener('keydown', this.handleKeyDown);
  },
  methods: {
    getGoods() {
      this.loading = true;
      const region = this.region;
      this.queryForm.classnRow1 = null;
      this.queryForm.classnRow2 = null;
      this.queryForm.classnRow3 = null;
      if (region.length > 0) {
        region.forEach((item, index) => {
          this.queryForm['classnRow' + (index + 1)] = item;
        });
      }
      this.$http.get('/pcGoods/getGoodsInfoList', { params: {
        ...this.queryForm,
        fromSearch: 'validity',
        memberId: this.memberId,
        busiscopeName: 'busiscopeName'
      }}).then(res => {
        this.goodsList = res.records.map(item => {
          item.goodsNum = 0;
          if (item.goodsunit === 'g' || item.goodsunit === 'kg') {
            item.packingBox =
          item.zxB2bNumLimit + '' + item.goodsunit + '/包';
          } else {
            item.packingBox = item.zxB2bNumLimit + '/' + item.goodsunit;
          }
          if (item.goodsunit === 'g' || item.goodsunit === 'kg') {
            item.goodsunit = '包';
          }
          item.price = numFilter(this.$math.multiply(item.price, item.zxB2bNumLimit));
          // item.price2 = numFilter(item.price2 * item.zxB2bNumLimit);
          item.price2 = numFilter(this.$math.multiply(item.price2, item.zxB2bNumLimit));
          // console.log(item.price, '------------');
          item.goodsqty = goodsqtyFilter(item.goodsqty, item.zxB2bNumLimit);
          return item;
        });
        this.goodsTotal = res.total;
        this.disabled = true;
      }).finally(() => {
        this.loading = false;
      });
    },
    getGoodsClass() {
      this.$http.get('pcGoods/getGoodsClassTypeVoList').then(res => {
        this.goodsClass = res;
      });
    },
    handleClose() {
      this.$emit('handleClose');
    },
    // 添加购物车
    addCar(item, e) {
      // 加入购物车动画开始
      item.isCar = true;
      let content = null;
      let asId = null;
      let gifId = null;
      let goodsType = null;
      if (item.activityStrategy != null) {
        ({ content, asId, gifId, goodsType } = item.activityStrategy[0]);
      }
      const list = [];
      list.push({
        goodsNum: item.goodsNum,
        goodsPrice: item.price,
        goodsImage: item.goodsImg,
        goodsName: item.goodsname,
        erpGoodsId: item.goodsid,
        storageId: item.storageid,
        priceId: item.priceid,
        gcId: item.classnRow3,
        accflag: item.accflag,
        lotNo: item.lotno,
        lotId: item.lotid,
        content,
        asId,
        gifId,
        goodsType,
        memberId: this.memberId,
      });
      const carList = this.carList;
      let isAddCar = false;
      list.forEach(item => {
        carList.forEach(code => {
          isAddCar = code.list.some((data) => {
            return data.erpGoodsId === item.erpGoodsId;
          });
        });
        if (isAddCar) return;
      });
      if (isAddCar) {
        this.$confirm('购物车已有该商品，是否添加', '提示', {
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          type: 'warning',
        })
          .then(() => {
            this.addCarGoods(item, list, e);
          })
          .catch(() => {
            item.isCar = false;
            return;
          });
      } else {
        this.addCarGoods(item, list, e);
      }
    },
    addCarGoods(item, list, e) {
      this.$http.post('/goods/addAdminMemberCart', list).then(() => {
        this.$emit('getCar');
        item.isCar = false;
      });
    },
    reset() {
      this.queryForm = {
        size: 50,
        current: 1,
      };
      this.region = [];
      this.getGoods();
    },
    handleKeyDown(e) {
      var key = window.event.keyCode ? window.event.keyCode : window.event.which;
      if (key === 116) {
        this.getGoods();
        e.preventDefault(); // 取消浏览器原有的ctrl+s操作
      }
    },
  },
};
</script>

<style scoped>
</style>
