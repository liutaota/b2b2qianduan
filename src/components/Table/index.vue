<template>
  <div>
    <el-table
      ref="singleTable"
      :data="tableData"
      v-loading="loading"
      @row-click="handleCurrent"
      :tree-props="treeProps"
      :row-key="'id'"
      border
      stripe
      fit
      highlight-current-row
      :default-expand-all="defaultExpand"
      style="width: 100%; margin-top: 10px; font-size: 12px"
      :header-cell-style="{ background: '#F3F3F3', color: '#606266' }"
      :max-height="is_height || height"
      :height="is_height || height"
      :row-class-name="rowClassName"
      :cell-style="cellStyle"
      @cell-dblclick="cellDblclick"
      size="mini"
      @selection-change="handleSelectionChange"
      @cell-click="cellClick"
      @sort-change="sortChange"
    >
      <el-table-column type="selection" width="55" v-if="isSele"> </el-table-column>
      <el-table-column
        :width="radioObj.width"
        :fixed="fixed"
        :label="radioObj.label"
        v-if="radioObj.isRadio"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <el-radio
            :label="scope.row[radioObj.prop]"
            v-model="radioObj.radioId"
            @change="radioChange(scope.row)"
            >{{ "" }}</el-radio
          >
        </template>
      </el-table-column>
      <!-- <el-table-column
        slot="index"
        type="selection"
        width="55"
      /> -->
      <slot name="index"></slot>
      <!-- 序号 -->
      <el-table-column
        :fixed="fixed"
        label="序号"
        type="index"
        width="50"
        :index="indexMethod"
        v-if="isIndex"
      />
      <el-table-column
        v-for="(item, key) of columns"
        :key="`columns_${key}`"
        :prop="dropCol[key].prop"
        :label="item.label"
        :width="item.width ? item.width : ''"
        :show-overflow-tooltip="item.tooltip === false ? false : true"
        :formatter="formatter(item.formatter)"
        :sortable="item.sortable"
      >
        <!-- :formatter="item.formatter ? item.formatter : textmatter" -->
        <!-- <template slot="header" slot-scope="scope" v-if="item.header">
        <slot :row="scope.row" ></slot>
      </template> -->
      </el-table-column>
      <!--图片-->
      <slot name="picture"></slot>
      <!--状态-->
      <slot name="handleState"></slot>
      <!--操作-->
      <slot name="handleColumn"></slot>
    </el-table>
  </div>
</template>

<script>
import FsImg from "@/components/FsImg";
import Sortable from "sortablejs";
import { imgHost } from "@/config.js";
export default {
  components: {
    FsImg
  },
  watch: {
    rowClassName(val) {
      console.log(val);
    }
  },
  props: {
    // 列表
    columns: {
      type: Array,
      default: () => {
        return [];
      }
    },
    // 是否开启多选
    isSele:{
      type: Boolean,
      default: () => false
    },
    // // 单选绑定值
    // labelRadio: {
    //   type: String,
    //   default: "id"
    // },
    // // 开启单选
    // isRadio: {
    //   type: Boolean,
    //   default: () => false
    // },
    // 开启单选值
    radioObj: {
      type: Object,
      default: () => {
        return { label: "", isRadio: false, width: "38", radioId: null };
      }
    },
    // 开启加载
    loading: {
      type: Boolean,
      default: () => false
    },
    treeProps: {
      type: Object,
      default: () => {}
    },
    // 表格数据
    tableData: {
      type: Array,
      default: () => {
        return [];
      }
    },
    isIndex: {
      type: [Boolean],
      default: () => true
    },
    // 自定义高度
    is_height: {
      type: [String, Boolean, Number],
      default: () => false
    },
    // 序号排序
    pageIndex: {
      type: Object,
      default: () => {
        return {
          current: 1,
          size: 50
        };
      }
    },
    fixed: {
      type: Boolean,
      default: true
    },
    // 展开行是否折叠
    defaultExpand: {
      type: Boolean,
      default: true
    },
    rowClassName: {
      type: Function
    },
    cellStyle: {
      type: Function
    },
    // 行是否拖拽
    isRowDrop: {
      type: Boolean,
      default: () => false
    }
  },
  data() {
    return {
      height: 400,
      dropCol: []
    };
  },
  created() {
    this.dropCol = JSON.parse(JSON.stringify(this.columns));
  },
  mounted() {
    // 高度适应
    this.$nextTick(() => {
      this.height = window.innerHeight - 300;
      // 后面的50：根据需求空出的高度，自行调整
    });
    // 阻止默认行为
    document.body.ondrop = function(event) {
      event.preventDefault();
      event.stopPropagation();
    };
    this.wid();
    if (this.isRowDrop) {
      this.rowDrop();
    }
    // this.columnDrop();
  },
  methods: {
    //行拖拽
    rowDrop() {
      const tbody = document.querySelector(".el-table__body-wrapper tbody");
      const _this = this;
      Sortable.create(tbody, {
        onEnd({ newIndex, oldIndex }) {
          const currRow = _this.tableData.splice(oldIndex, 1)[0];
          _this.tableData.splice(newIndex, 0, currRow);
        }
      });
    },
    //列拖拽
    columnDrop() {
      const wrapperTr = document.querySelector(".el-table__header-wrapper tr");
      this.sortable = Sortable.create(wrapperTr, {
        animation: 180,
        delay: 0,
        filter: ".cannotDrag",
        onEnd: evt => {
          // 因有id值，需将下标减一
          const oldItem = this.columns[evt.oldIndex - 1];
          this.dropCol.splice(evt.oldIndex - 1, 1);
          this.dropCol.splice(evt.newIndex - 1, 0, oldItem);
        }
      });
    },
    // 根据屏幕大小自适应高度
    wid() {
      window.onresize = () => {
        return (() => {
          this.$nextTick(() => {
            this.height = window.innerHeight - 300;
            // 后面的50：根据需求空出的高度，自行调整
          });
        })();
      };
    },
    radioChange(row) {
      this.$emit("radioChange", row);
    },
    // 格式化
    formatter(formatter) {
      if (formatter) {
        return this[formatter];
      }
      return this['textmatter'];
    },
    // 选择行数据
    handleCurrent(val) {
      if (val !== null) {
        this.$emit("handleCurrent", val);
      }
    },
    handleSelectionChange(row) {
      this.$emit("handleSelectionChange", row);
    },
    // 双击
    cellDblclick(row) {
      this.$emit("cellDblclick", row);
    },
    // 时间格式化
    dateFormatter(row, column) {
      let datetime = row[column.property];
      if (datetime) {
        datetime = new Date(datetime);
        const y = datetime.getFullYear() + "-";
        const mon = datetime.getMonth() + 1 + "-";
        const d = datetime.getDate();
        return y + mon + d;
      }
      return "";
    },
    // 文本格式化
    textmatter(row, column) {
      if (row[column.property] === 0) {
        return row[column.property];
      }
      return row[column.property] ? row[column.property] : "-";
    },
    // 金额格式化
    nummatter(row, column) {
      if (row.isPrice) {
        return row[column.property] ? row[column.property] : "0";
      } else {
        return row[column.property] ? "￥" + row[column.property] : "0";
      }
    },
    moneymatter (row, column)  {
      let number, decimals = 0, decPoint = '.', thousandsSep = ',';
      number = (row[column.property] + '').replace(/[^0-9+-Ee.]/g, '')
      let n = !isFinite(+number) ? 0 : +number
      let prec = !isFinite(+decimals) ? 0 : Math.abs(decimals)
      let sep = (typeof thousandsSep === 'undefined') ? ',' : thousandsSep
      let dec = (typeof decPoint === 'undefined') ? '.' : decPoint
      let s = ''
      let toFixedFix = function (n, prec) {
        let k = Math.pow(10, prec)
        return '' + Math.ceil(n * k) / k
      }
      s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.')
      let re = /(-?\d+)(\d{3})/
      while (re.test(s[0])) {
        s[0] = s[0].replace(re, '$1' + sep + '$2')
      }
      if ((s[1] || '').length < prec) {
        s[1] = s[1] || ''
        s[1] += new Array(prec - s[1].length + 1).join('0')
      }
      return s.join(dec)
    },
    toThousandFilter(num) {
      return (+num || 0)
        .toString()
        .replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ","));
    },
    // 序号
    indexMethod(index) {
      return (this.pageIndex.current - 1) * this.pageIndex.size + index + 1;
    },
    // 单元格样式
    cellClick(row, column, cell, event) {
      this.$emit("cellClick", row, column, cell, event);
    },
    // 行样式
    sortChange(column) {
      this.$emit("sortChange", column);
    }
    // clickItem(item)
  }
};
</script>

<style scoped lang="less">
/deep/.el-table .cell {
  overflow: hidden;
  white-space: nowrap;
}
/deep/.el-table__body tr.current-row > td {
  background: #b5cbe2 !important;
}
/deep/.el-table .warning-row td {
  background: #e6a23c !important;
  color: #000;
}
/deep/.el-table .danger-row td {
  background: #fd4036 !important;
  color: #000;
}
/deep/ .el-table .warning-row:hover {
  color: #606266 !important;
  background: #e6a23c !important;
}
/deep/.el-table__body .warning-row.current-row > td {
  background: #e6a23c !important;
  color: blue !important;
}
/deep/ .el-table .danger-row:hover {
  color: #606266 !important;
  background: #ff463c !important;
}
/deep/.el-table__body .danger-row.current-row > td {
  background: #ff463c !important;
  color: blue !important;
}
</style>
