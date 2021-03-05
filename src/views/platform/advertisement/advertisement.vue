<template>
  <div style="margin: 0 10px" class="banned">
    <!-- 筛选 -->
    <Screen v-permission="'ApListLook'" @query="query" />
    <div class="goodsBtn">
      <el-button
        v-permission="'ApListAdd'"
        type="primary"
        @click="
          $router.push({
            path: 'TOP_BANNER',
            query: { width: 1920, height: 80 },
          })
        "
      >新增</el-button>
      <el-button
        v-permission="'ApListEdit'"
        type="warning"
        @click="handleModify"
      >编辑</el-button>
      <el-button
        v-permission="'ApListDel'"
        type="danger"
        @click="handleDel"
      >删除</el-button>
    </div>
    <Tabel
      :columns="columns"
      :table-data="apList"
      :loading="loading"
      :page-index="queryForm"
      @handleCurrent="handleCurrent"
    >
      <el-table-column slot="handleColumn" label="是否启用">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.isUse"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-value="ON"
            inactive-value="OFF"
            @change="handleSwith(scope.row)"
          /></template>
      </el-table-column>
    </Tabel>
    <!-- 分页器 -->
    <pagination
      :total="total"
      @pagination="pagination"
      @handleSizeChange="handleSizeChange"
    />
  </div>
</template>

<script>
import { _throttle } from '@/utils/public';
import Pagination from '@/components/Pagination';
import Tabel from '@/components/Table';
import Screen from './components/screen';
export default {
  name: 'ApList',
  components: {
    Screen,
    Tabel,
    Pagination,
  },
  data() {
    return {
      queryForm: {
        size: 50,
        current: 1,
        advName: '',
      },
      apList: [],
      total: 1,
      loading: true,
      // 选中数据行
      currentRow: {
        isUse: 'IS_USE',
      },
      editMask: false,
      addMask: false,
      Height: 450,
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
          prop: 'imgNum',
          label: '图片数量',
        },
        {
          prop: 'advStartDate',
          label: '开始时间',
        },
        {
          prop: 'advEndDate',
          label: '结束时间',
        },
        {
          prop: 'remark',
          label: '备注',
        },
      ],
    };
  },
  created() {
    this.query();
    this.wid();
    this.$nextTick(() => {
      this.Height = window.innerHeight - 300;
      // 后面的50：根据需求空出的高度，自行调整
    });
  },
  methods: {
    // 根据屏幕大小自适应高度
    wid() {
      window.onresize = () => {
        return (() => {
          this.$nextTick(() => {
            this.Height = window.innerHeight - 300;
            // 后面的50：根据需求空出的高度，自行调整
          });
        })();
      };
    },
    query(queryForm) {
      if (queryForm) {
        this.queryForm = queryForm;
      }
      this.loading = true;
      this.$http
        .get('advPosition/getAdvPosition', { params: { ...this.queryForm }})
        .then((res) => {
          res.records.map((item) => {
            // 判断类型
            switch (item.apDisplay) {
              case 'TOP_BANNER':
                item.ap_display = '顶部广告位';
                item.imgSize = {
                  width: 1920,
                  height: 80,
                };
                break;
              case 'CAROUSEL_BANNER':
                item.ap_display = '轮播广告位';
                item.imgSize = {
                  width: 1920,
                  height: 520,
                };
                break;
              case 'CENTER_ONLY':
                item.ap_display = '中部单图';
                item.imgSize = {
                  width: 1180,
                  height: 100,
                };
                break;
              case 'CENTER_MORE_LITTLE':
                item.ap_display = '中部多图小';
                item.imgSize = {
                  width: 170,
                  height: 100,
                };
                break;
              case 'CENTER_MORE_BIG':
                item.ap_display = '中部多图大';
                item.imgSize = {
                  width: 375,
                  height: 218,
                };
                break;
              case 'BROADSIDE_BANNER':
                item.ap_display = '侧边广告';
                item.imgSize = {
                  width: null,
                  height: null,
                };
                break;
              case 'POPUP_BANNER':
                item.ap_display = '弹窗广告';
                item.imgSize = {
                  width: null,
                  height: null,
                };
                break;
              default:
                break;
            }
            switch (item.apClass) {
              case 'SINGLE_PIC':
                item.apClass = '单张';
                break;
              case 'MANY_PIC':
                item.apClass = '多张';
                break;
              case 'CAROUSEL':
                item.apClass = '轮播';
                break;
              default:
                break;
            }
          });
          this.total = res.total;
          this.apList = res.records;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    // 删除
    handleDel: _throttle(function () {
      // 是否选中广告位
      if (this.currentRow.id === undefined) {
        this.$message({
          message: '未选中对应的广告位',
          type: 'warning',
        });
        return;
      }
      // 判断是否删除文件
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          const { id } = this.currentRow;
          this.$http
            .get('advPosition/updateAdvPositionIsDel', { params: { id }})
            .then((res) => {
              this.$message({
                type: 'success',
                message: '删除成功!',
              });
              this.query();
            });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          });
        });
    }),
    // 打开修改
    handleModify: _throttle(function () {
      if (this.currentRow.id === undefined) {
        this.$message({
          message: '未选中对应的广告位',
          type: 'warning',
        });
        return;
      }
      const { width, height } = this.currentRow.imgSize;
      this.$router.push({
        path: this.currentRow.apDisplay,
        query: { id: this.currentRow.id, width, height },
      });
    }),
    // 选中行事件
    handleCurrent(val) {
      this.currentRow = { ...val };
    },
    // 是否启用
    handleSwith: _throttle(function (e) {
      const { id, isUse } = e;
      this.$http
        .get('advPosition/updateAdvPositionIsUse', { params: { id, isUse }})
        .then((res) => {
          if (e.isUse === 'ON') {
            this.$message({
              message: '启用成功',
              type: 'success',
            });
          } else if (e.isUse === 'OFF') {
            this.$message({
              message: '关闭成功',
              type: 'success',
            });
          }
          this.query();
        });
    }),
    // 序号
    indexMethod(index) {
      return (this.queryForm.current - 1) * this.queryForm.size + index + 1;
    },
    // 分页事件
    pagination({ page: current, limit: size }) {
      this.queryForm.current = current;
      this.query();
    },
    handleSizeChange({ page: current, limit: size }) {
      this.queryForm.size = size;
      this.query();
    },
  },
};
</script>

<style scoped lang='less'>
.search {
  text-align: center;
  margin: 10px 0;
}
.goodsBtn {
  float: left;
  margin: 10px 0;
  .el-button {
    font-size: 12px !important;
  }
}
</style>
