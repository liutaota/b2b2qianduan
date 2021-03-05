<template>
  <div>
    <div class="transfer">
      <div>
        <Tabel
          :columns="columns"
          :fixed="false"
          :table-data="selected"
          :loading="loading"
          :is_height="400"
          :page-index="form"
          @handleSelectionChange="handleSelectionChange"
        >
          <el-table-column slot="index" fixed type="selection" width="40" />
        </Tabel>
        <Pagination
          :total="total"
          :pager-count="5"
          :layout="'total, prev, pager, next, jumper'"
          @pagination="pagination"
          @handleSizeChange="handleSizeChange"
        />
      </div>
<!--      <div style="color: #fff">-->
<!--        <el-button-->
<!--          type="primary"-->
<!--          icon="el-icon-arrow-left"-->
<!--          @click="goodsListLeft"-->
<!--        />-->
<!--        <el-button-->
<!--          type="primary"-->
<!--          icon="el-icon-arrow-right"-->
<!--          @click="goodsListRight"-->
<!--        />-->
<!--      </div>-->
<!--      <div>-->
<!--        <Tabel-->
<!--          :columns="columns"-->
<!--          :fixed="false"-->
<!--          :table-data="choiceList"-->
<!--          :is_height="400"-->
<!--          :page-index="{ size: choiceList.length, current: 1 }"-->
<!--          @handleSelectionChange="handleSelectionChange"-->
<!--        >-->
<!--          <el-table-column slot="index" fixed type="selection" width="55" />-->
<!--        </Tabel>-->
<!--      </div>-->
    </div>
    <div>
      <div class="choice_btn">
        <el-button type="primary" @click="onSubmit">确定</el-button>
        <el-button @click="cancel">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import Tabel from "@/components/Table";
import Pagination from "@/components/Pagination";
export default {
  components: {
    Tabel,
    Pagination,
  },
  props: {
    select: {
      type: Array,
      default: () => [],
    },
    list: {
      type: Array,
      default: () => [],
    },
    columns: {
      type: Array,
      default: () => [],
    },
    form: {
      type: Object,
      default: () => {},
    },
    total: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      loading: false,
      selected: [],
      // 暂存区
      mporaryList: [],
      // 已选中商品
      choiceList: [],
    };
  },
  created() {
    // 选中商品
    this.choiceList = [...this.select];
    this.selected = [...this.list];
    this.choiceList.forEach((data, i) => {
      this.selected.forEach((item, index) => {
        if (item[this.columns[0].prop] === data[this.columns[0].prop]) {
          this.selected.splice(index, 1);
        }
      });
    });
    // 显示表格数据
  },
  methods: {
    onSubmit() {
      this.$emit("onSubmit", this.choiceList);
      this.choiceList = [];
    },
    // 取消
    cancel() {
      this.$emit("cancel");
      this.choiceList = [];
    },
    // 多选选中数据
    handleSelectionChange(row) {
      this.mporaryList = [...row];
    },
    // 数据移除
    goodsListLeft() {
      if (this.mporaryList.length === 0) return;
      const key = this.columns[0].prop;
      // 数组合并
      const list = [...this.selected, ...this.mporaryList];
      const obj = {};
      // 去重
      this.selected = list.reduce((cur, next) => {
        obj[next[key]] ? "" : (obj[next[key]] = true && cur.push(next));
        return cur;
      }, []);
      // 删除选中的数据
      this.mporaryList.forEach((data) => {
        this.choiceList.forEach((item, index) => {
          if (item[key] === data[key]) {
            this.choiceList.splice(index, 1);
          }
        });
      });
    },
    // 数据添加到选中
    goodsListRight() {
      if (this.mporaryList.length === 0) return;
      const key = this.columns[0].prop;
      // 数组合并
      const list = [...this.choiceList, ...this.mporaryList];
      const obj = {};
      // 去重
      this.choiceList = list.reduce((cur, next) => {
        obj[next[key]] ? "" : (obj[next[key]] = true && cur.push(next));
        return cur;
      }, []);
      // 删除待选中商品
      this.mporaryList.forEach((data) => {
        this.selected.forEach((item, index) => {
          if (item[key] === data[key]) {
            this.selected.splice(index, 1);
          }
        });
      });
    },
    // 分页事件
    pagination({ page: current, limit: size }) {
      this.form.current = current;
      this.$emit("query");
    },
    handleSizeChange({ page: current, limit: size }) {
      this.form.size = size;
      this.$emit("query");
    },
  },
};
</script>

<style scoped lang="less">
// 筛选
.search_wrap {
  margin: 10px 0;
}
// 穿梭表单
.transfer {
  display: flex;
  justify-content: space-between;
  margin: 30px 0;
  & > div {
    margin: 0 10px;
    width: 42%;
    &:nth-child(2) {
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
/deep/.pagination-container {
  padding: 16px 0;
}
</style>
