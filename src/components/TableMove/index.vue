<template>
    <div>
        <div style="margin-top:10px">
        <el-button type="primary" style="margin-right: 10px" 
        @click="handleTopping"><i class="el-icon-upload2"></i> 置顶</el-button>
        <el-button type="primary" style="margin-right: 10px" 
        @click="handleSetTheBottom"><i class="el-icon-download"></i> 置底</el-button>
        <el-button type="primary" style="margin-right: 10px" 
        @click="handleMoveUp"><i class="el-icon-top"></i> 上移</el-button>
        <el-button type="primary" @click="handleMoveDown"><i class="el-icon-bottom"></i> 下移</el-button>
        </div>
    </div>
</template>

<script>
export default {
  props:{
    queryUrl: {
      type: String,
      default: ''
    },
    queryForm: {
      type: Object,
      default: () => {}
    },
    tableData: {
      type: Array,
      default: () => []
    },
    row: {
      type: Object,
      default: () => {}
    },
    total: {
      type: Number,
      default: 0
    }
  },
  watch:{
    row :{
      handler(val) {
        // console.log(val);
        this.handleCurrent(val);
      },
      deep: true
    }
  },
  data() {
    return {
      rowIndex: null,
      currentRow: {}
    }
  },
  methods:{
    // 置顶
    handleTopping() {
      if (this.judge()) return;
      if (this.queryForm.current === 1 && this.rowIndex === 0) return;
      console.log(this.currentRow);
      const { id } = this.currentRow;
      this.$emit('handleTopping', { id, sortType: 'TOP' });
      this.currentRow = {};
    },
    // 置底
    handleSetTheBottom() {
      if (this.judge()) return;
      if (this.currentRow.id === null) return;
      // 当数据为当前页数最后一条进入该判断
      if (this.rowIndex === this.tableData.length - 1) {
        let prevSort = null;
        const size = this.queryForm.size;
        //   判断是否是所有数据最后一条
        if (this.queryForm.current === Math.ceil(this.total / size)) return;
        const current = this.queryForm.current + 1;
        this.$http.get(this.queryUrl, { params: { size, current}}).then(res => {
          // 获取下一页第一条数据并赋值
          prevSort = res.records[0].factorySort;
        })
        // 判断排序值是否为空
        if (prevSort === null) return;
      }
      //  获取下一条数据排序
      const prevSort = this.tableData[this.rowIndex + 1].factorySort;
       // 判断下一条数据是否为空
      if (prevSort === null) return;
      // 判断是否有id是否为空
      const id = this.currentRow.id;
      // 发送置底请求
      this.$emit('handleSetTheBottom', { id, sortType: 'DOWN' });
      this.currentRow = {};
    },
    // 上移
    handleMoveUp() {
      if (this.judge()) return;
      if (this.currentRow.id === null) return;
      if (this.rowIndex === 0 && this.queryForm.current === 1) return;
       // 获取当前数据
       const { id: nextId } = this.currentRow;
       // 当前数据为第一条切不为第一页时进入该判断
      if (this.rowIndex === 0 && this.queryForm.current !== 1 ) {
        const current = this.queryForm.current - 1;
        if (this.queryUrl === '') return;
           // 获取上一页数据
        this.$http.get(this.queryUrl, {
          params: {
            size: this.queryForm.size,
            current
          }
        }).then(res => {
            const { id: prevId } = res.records[res.records.length - 1];
            this.$emit('handleMoveUp', { nextId, prevId }, true);
        })
        return;
      }
      const { id: prevId } = this.tableData[this.rowIndex - 1];
      this.$emit('handleMoveUp', { nextId, prevId }, false);
    },
    // 下移
    handleMoveDown() {
      if (this.judge()) return;
      const index = this.rowIndex;
      const tableData = this.tableData;
      if (this.currentRow.id === null) return;
      // 获取当前数据
      const { id: prevId } = this.currentRow;
      if (index === tableData.length - 1) {
            // 判断是否最后一页
        if (this.queryForm.current === Math.ceil(this.total / this.queryForm.size)) return;
        const current = this.queryForm.current + 1;
            // 获取上一页数据
        if (this.queryUrl === '') return;
        this.$http.get(this.queryUrl, {
          params: {
            size: this.queryForm.size,
            current
          }
        }).then(res => {
            const { id: nextId } = res.records === undefined ? res[0] : res.records[0];
            if (nextId === null) return;
            this.$emit('handleMoveDown', { nextId, prevId }, true);
        })
        return;
      }
      const { id: nextId } = tableData[index + 1];
      if (nextId === null) return;
      this.$emit('handleMoveDown', { nextId, prevId }, false);
    },
    // 判断表格是否选中
    judge() {
      if (JSON.stringify(this.currentRow) === '{}') {
        this.$message({
          type: 'info',
          message: '未选择对应的列表'
        });
        return true;
      }
      return false;
    },
    // 选中行
    handleCurrent(row) {
      if (row === null || row === undefined) return;
      this.currentRow = { ...row };
      // 获取下标
      this.rowIndex = this.tableData.findIndex(item => {
        return row.id === item.id;
      });
    },
  }
}
</script>

<style scoped>
</style>