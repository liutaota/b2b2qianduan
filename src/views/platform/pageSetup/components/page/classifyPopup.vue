<template>
  <div>
    <el-dialog :visible.sync="dialogFormVisible" :close-on-click-modal="false" :before-close="cancel" title="一级分类管理">
      <el-table :data="stairClassifyList" style="width: 100%">
        <el-table-column prop="name" label="分类名称" />
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="classifyDel(scope.$index)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="innerVisible = true">新 增</el-button>
        <el-button type="primary" @click="classify">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </span>
      <!-- 新增分类 -->
      <el-dialog width="30%" title="新增分类" :close-on-click-modal="false" :visible.sync="innerVisible" append-to-body>
        <div @keyup.enter="classifyAdd">
          <el-input v-model.trim="name" placeholder="请输入内容" />
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="classifyAdd">确 定</el-button>
          <el-button @click="innerVisible = false;name=''">取 消</el-button>
        </span>
      </el-dialog>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    dialogFormVisible: {
      type: Boolean,
      default: () => false,
    },
    stairClassifyList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      innerVisible: false,
      name: '',
    };
  },
  watch: {
    pageSetList: {
      handler(val) {
        this.adv = { id: this.pageSetList.advId, title: this.pageSetList.advTitle };
        const index = this.apList.findIndex(item => {
          return this.pageSetList.advId === item.id;
        });
        this.radio = index;
      },
      deep: true,
    }
  },
  methods: {
    // 删除分类
    classifyDel(index) {
      this.stairClassifyList.splice(index, 1);
    },
    // 分类添加
    classifyAdd() {
      if (this.name === '') {
        this.$message({
          message: '无内容可添加',
          type: 'warning',
          duration: 1000
        });
        return;
      }
      this.stairClassifyList.push({ name: this.name });
      this.innerVisible = false;
      this.name = '';
    },
    classify() {
      this.$emit('classify', this.stairClassifyList);
    },
    // 取消弹窗
    cancel() {
      this.$emit('cancel');
    },
  },
};
</script>

<style scoped>
</style>
