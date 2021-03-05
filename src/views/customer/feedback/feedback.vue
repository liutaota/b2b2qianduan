<template>
  <div style="margin: 10px">
    <!-- <Screen @query="query" /> -->
    <el-tabs type="card">
      <el-tab-pane label="商品咨询">
        <Tabel
          :columns="goodsColumns"
          :table-data="goodsList"
          :loading="goodsLoading"
          :page-index="goodsForm"
          @handleCurrent="goodsCurrent"
        >
          <el-table-column slot="handleColumn" label="操作" fixed="right">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="dialogVisible = true; form.type='GOODS'; form.id = scope.row.id"
              >回复</el-button>
            </template>
          </el-table-column>
        </Tabel>
        <Pagination
          :total="goodsTotal"
          @pagination="goodsPagination"
          @handleSizeChange="handleGoodsSizeChange"
        />
      </el-tab-pane>
      <el-tab-pane label="平台建议">
        <Tabel
          :columns="platformColumns"
          :table-data="platformList"
          :loading="platformLoading"
          :page-index="platformForm"
          @handleCurrent="platformCurrent"
        >
          <el-table-column slot="handleColumn" label="操作" fixed="right">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="dialogVisible = true; form.type='PLATFROM'; form.id = scope.row.id"
              >回复</el-button>
            </template>
          </el-table-column>
        </Tabel>
        <Pagination
          :total="platformTotal"
          @pagination="platformPagination"
          @handleSizeChange="handlePlatformSizeChange"
        />
      </el-tab-pane>
    </el-tabs>
    <el-dialog
      :visible.sync="dialogVisible"
      width="40%"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <template slot="title">
        <div class="titleZise">
          <span>商品咨询回复</span>
        </div>
      </template>
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="回复内容：">
          <el-input v-model.trim="form.replyContent" type="textarea" rows="4" resize="none" />
        </el-form-item>
        <el-form-item>
          <el-button
            size="mini"
            type="primary"
            @click="handleGoodsReply"
          >回复</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import Tabel from '@/components/Table';
// import pagination from '@/components/Pagination';
// const Screen = () => import('./components/screen');
const Pagination = () => import('@/components/Pagination');
export default {
  name: 'Feedback',
  components: {
    // Screen,
    Tabel,
    Pagination,
  },
  data() {
    return {
      // 商品咨询
      goodsLoading: false,
      goodsForm: {
        size: 50,
        current: 1,
      },
      goodsColumns: [
        {
          prop: 'content',
          label: '内容',
        },
        {
          prop: 'replyContent',
          label: '平台回复',
        },
        {
          prop: 'erpGoodsId',
          label: '商品编号',
        },
        {
          prop: 'erpGoodsName',
          label: '商品名称',
        },
        {
          prop: 'createTime',
          label: '咨询时间',
        },
        {
          prop: 'query_status',
          label: '状态',
        },
        {
          prop: 'memberPhone',
          label: '手机',
        },
      ],
      goodsList: [],
      goodsTotal: 0,
      // 平台建议
      platformLoading: false,
      platformForm: {
        size: 50,
        current: 1,
      },
      platformColumns: [
        {
          prop: 'content',
          label: '内容',
        },
        {
          prop: 'replyContent',
          label: '平台回复',
        },
        {
          prop: 'createTime',
          label: '咨询时间',
        },
        {
          prop: 'query_status',
          label: '状态',
        },
        {
          prop: 'memberPhone',
          label: '手机',
        },
      ],
      platformList: [],
      platformTotal: 0,
      // 弹窗
      dialogVisible: false,
      form: {
        type: 'GOODS'
      },
    };
  },
  created() {
    this.query();
  },
  methods: {
    // 商品咨询请求
    query() {
      this.$http.get('feedback/getAdminFeedbackVoList', { params: { ...this.goodsForm, type: 'GOODS' }}).then(res => {
        res.records.map(item => {
          switch (item.status) {
            case 'UNTREATED':
              item.query_status = '未处理';
              break;
            case 'REPLIED':
              item.query_status = '已回复';
              break;
          }
        });
        this.goodsList = res.records;
        this.goodsTotal = res.total;
      });
      this.$http.get('feedback/getAdminFeedbackVoList', { params: { ...this.platformForm, type: 'PLATFROM' }}).then(res => {
        res.records.map(item => {
          switch (item.status) {
            case 'UNTREATED':
              item.query_status = '未处理';
              break;
            case 'REPLIED':
              item.query_status = '已回复';
              break;
          }
        });
        this.platformList = res.records;
        this.platformTotal = res.total;
      });
    },
    // 商品咨询回复
    handleGoodsReply() {
      this.$http.post('feedback/updateFeedbackVo', { ...this.form, }).then(() => {
        this.$message.success('提交成功');
        this.handleClose();
        this.query();
        this.form = {};
      });
    },
    // 商品咨询选中行
    goodsCurrent() {},
    // 商品咨询分页
    goodsPagination({ page: current, limit: size }) {
      this.goodsForm.current = current;
      this.query();
    },
    handleGoodsSizeChange({ page: current, limit: size }) {
      this.goodsForm.size = size;
      this.query();
    },
    // 平台建议回复
    handlePlatformReply() {},
    // 平台建议选中行
    platformCurrent() {},
    // 平台建议分页
    platformPagination({ page: current, limit: size }) {
      this.platformForm.current = current;
      this.query();
    },
    handlePlatformSizeChange({ page: current, limit: size }) {
      this.platformForm.size = size;
      this.query();
    },
    // 取消弹窗
    handleClose() {
      this.dialogVisible = false;
    },
  },
};
</script>

<style scoped lang="less">
.titleZise {
    padding: 10px 0;
    border-bottom: 1px solid #C0C4CC;
    color: #606266;
}
</style>
