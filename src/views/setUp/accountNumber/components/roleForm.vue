<template>
  <el-dialog
    :visible.sync="dialogVisible"
    width="80%"
    :close-on-click-modal="false"
    :before-close="cancel"
  >
    <template slot="title">
      <div class="titleZise">
        <span>账号设置 - {{ title }}角色</span>
      </div>
    </template>
    <el-form
      ref="form"
      :model="form"
      label-width="100px"
      :rules="rules"
      style="width: 80%"
    >
      <el-form-item label="角色名" prop="roleName">
        <el-input v-model.trim="form.roleName" />
        <span>为角色设置特定名称，便于添加管理员时选择使用。</span>
      </el-form-item>
    </el-form>
    <p>
      <span>权限操作设置详情</span>
      <span>勾选后选中全部操作功能，可根据需要从设置详情中进行分组设置。</span>
    </p>
    <el-tree
      ref="resourceTree"
      :data="role"
      show-checkbox
      node-key="name"
      default-expand-all
      :default-checked-keys="checkedKeys"
      @check="getCheckedNodes"
    >
      <span slot-scope="{ data }" class="resource-tree-node">
        <span v-if="data && data.meta && data.meta.title">{{
          data.meta.title
        }}</span>
      </span>
    </el-tree>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="onSubmit('form')">确 定</el-button>
      <el-button @click="cancel('form')">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import router from '@/router/modules/menus';
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    form: {
      type: Object,
      default: () => {},
    },
    title: {
      type: String,
      default: '添加',
    },
  },
  data() {
    return {
      role: [],
      defaultProps: { children: 'children', label: 'label' },
      checkAll: false,
      isIndeterminate: true,
      rulnform: {
        PRcheckAll: [], // 一级路由全选
        PRList: [],
        SRcheckList: [],
        SRList: [],
        rolePermissionList: [],
      },
      checkList: '',
      rules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'change' },
        ],
      },
      checkedKeys: [],
    };
  },
  watch: {
    form() {
      this.checkedKeys = [];
      if (this.form.checkedKeys) {
        this.checkedKeys = this.form.checkedKeys;
        this.$nextTick(() => {
          const leafKeys = Object.values(this.$refs.resourceTree.store.nodesMap || {}).filter(item => item.isLeaf).map(item => item.key);
          this.$refs.resourceTree.setCheckedKeys(this.checkedKeys.filter(id => leafKeys.includes(id)));
        });
      } else {
        this.checkedKeys = [];
      }
    }
  },
  created() {
    this.role = router;
    this.role.map(a => {
      if (a.children) {
        a.children.map(b => {
          if (b.roleList) {
            b.children = b.roleList;
          }
          if (b.children) {
            b.children.map(c => {
              if (c.roleList) {
                c.children = c.roleList;
              }
              if (c.children) {
                c.children.map(d => {
                  if (d.roleList) {
                    d.children = d.roleList;
                  }
                });
              }
            });
          }
        });
      }
    });
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    routerQuery() {},
    getCheckedNodes(val) {
      const name = this.$refs.resourceTree.getCheckedNodes(false, true).map(item => item.name);
      const title = this.$refs.resourceTree.getCheckedNodes(false, true).map(item => item.meta.title);
      let rolePermissionList = [];
      rolePermissionList = name.map((item, index) => ({ permissionPath: item, permissionName: title[index] }));
      this.form.rolePermissionList = rolePermissionList;
    },
    onSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$emit('onSubmit', this.form);
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    cancel() {
      this.checkedKeys = [];
      this.roleName = '';
      this.$refs.resourceTree.setCheckedKeys([]);
      this.$emit('cancel');
      // this.$refs.form.resetFields();
    },
  },
};
</script>

<style scoped lang="less">
.jurisdictionSet {
  margin: 0;
  padding: 0;
  list-style: none;
  li {
    border-bottom: 1px solid #9a9a9a;
    padding: 5px 0;
    display: flex;

    & > div {
      width: 100%;
    }
    & > div:first-child {
      width: 150px;
    }
  }
}
.pageList-wrap {
  display: flex;
  // flex-direction:column;
  flex-wrap: wrap;
  .pageList {
    width: 170px;
  }
}
</style>
