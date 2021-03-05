<template>
  <div :class="{'hidden':hidden}" class="pagination-container">
    <el-pagination
      :background="background"
      :current-page.sync="currentPage"
      :page-size.sync="pageSize"
      :layout="layout"
      :page-sizes="pageSizes"
      :total="total"
      :pager-count="pagerCount"
      :hide-on-single-page="hidePage"
      v-bind="$attrs"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange" 
      small
      prev-text="上一页"
      next-text="下一页"
    />
  </div>
</template>

<script>
import { scrollTo } from '@/utils/scroll-to'

export default {
  name: 'Pagination',
  props: {
    total: {
      required: true,
      type: Number
    },
    page: {
      type: Number,
      default: 1
    },
    limit: {
      type: Number,
      default: 20
    },
    pageSizes: {
      type: Array,
      default() {
        return [50, 100, 200, 500]
      }
    },
    layout: {
      type: String,
      default: 'total, sizes, prev, pager, next, jumper'
    },
    background: {
      type: Boolean,
      default: true
    },
    autoScroll: {
      type: Boolean,
      default: true
    },
    hidden: {
      type: Boolean,
      default: false
    },
    pagerCount: {
      type: Number,
      default: 9
    },
    hidePage: {
      type: Boolean,
      default: false
    },
  },
  computed: {
    currentPage: {
      get() {
        return this.page
      },
      set(val) {
        this.$emit('update:page', val)
      }
    },
    pageSize: {
      get() {
        return this.limit
      },
      set(val) {
        this.$emit('update:limit', val)
      }
    }
  },
  methods: {
    handleSizeChange(val) {
      // console.log(val);
      this.$emit('handleSizeChange', { page: this.currentPage, limit: val,size: this.pageSize })
      if (this.autoScroll) {
        scrollTo(0, 800)
      }
    },
    handleCurrentChange(val) {
      this.$emit('pagination', { page: val, limit: this.pageSize , size: this.pageSize})
      if (this.autoScroll) {
        scrollTo(0, 800)
      }
    }
  }
}
</script>

<style scoped>
.pagination-container {
  background: #fff;
  padding: 20px 16px;
  font-size: 12px;
  margin: 0;
}
.el-input--mini .el-input__inner {
    height: 23px !important;
    line-height: 28px;
}
.pagination-container.hidden {
  display: none;
}
</style>
