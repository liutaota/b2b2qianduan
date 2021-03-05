<template>
  <div style="margin: 10px">
    <el-tabs v-model.trim="activeName" type="card">
      <el-tab-pane
        v-permission="'AccountNumberUser'"
        label="账号管理"
        name="user"
      >
        <Screen @query="query" />
        <div>
          <!-- v-permission="apList_add" -->
          <el-button
            v-permission="'AccountNumberUserAdd'"
            type="primary"
            @click="userAddDialogVisible = true"
            >新建账号</el-button
          >
          <el-button
            v-permission="'AccountNumberUserEdit'"
            type="primary"
            @click="userEditBtn"
            >修改账号</el-button
          >
          <el-button
            v-permission="'AccountNumberUserReset'"
            type="primary"
            @click="passwordReset"
            >修改密码</el-button
          >
        </div>
        <Tabel
          :columns="userColumns"
          :table-data="userList"
          :loading="loading"
          :page-index="userQueryForm"
          is_height="450"
          @handleCurrent="userCurrent"
        />
        <pagination
          :total="userTotal"
          @pagination="userPagination"
          @handleSizeChange="userSizeChange"
        />
      </el-tab-pane>
      <el-tab-pane
        v-permission="'AccountNumberRole'"
        label="角色管理"
        name="role"
      >
        <div>
          <el-button
            v-permission="'AccountNumberRoleAdd'"
            type="primary"
            @click="roleAddDialogVisible = true"
            >新建角色</el-button
          >
          <!-- <el-button type="primary" @click="roleEditBtn()"
            >修改角色</el-button
          > -->
        </div>
        <Tabel
          :columns="roleColumns"
          :table-data="roleList"
          :loading="loading"
          :page-index="roleQueryForm"
          @handleCurrent="roleCurrent"
        >
          <el-table-column
            slot="handleColumn"
            label="操作"
            width="320px"
            fixed="right"
          >
            <template slot-scope="scope">
              <el-button
                v-permission="'AccountNumberRoleEdit'"
                size="mini"
                type="primary"
                @click="roleEditBtn(scope.row)"
                >设置权限</el-button
              >
            </template>
          </el-table-column>
        </Tabel>
        <pagination
          :total="roleTotal"
          @pagination="rolePagination"
          @handleSizeChange="roleSizeChange"
        />
      </el-tab-pane>
    </el-tabs>
    <UserForm
      :dialog-visible="userAddDialogVisible"
      :title="'添加'"
      :form="userForm"
      :permission-name-list="permissionNameList"
      @onSubmit="handleUserAdd"
      @cancel="cancel"
    />
    <UserForm
      :dialog-visible="userEditDialogVisible"
      :title="'编辑'"
      :form="userCurrentRow"
      :permission-name-list="permissionNameList"
      @onSubmit="handleUserEdit"
      @cancel="cancel"
    />
    <RoleForm
      :dialog-visible="roleAddDialogVisible"
      :title="'添加'"
      :form="roleForm"
      @onSubmit="handleRoleAdd"
      @cancel="cancel"
    />
    <RoleForm
      :dialog-visible="roleEditDialogVisible"
      :title="'编辑'"
      :form="roleCurrentRow"
      @onSubmit="handleRoleEdit"
      @cancel="cancel"
    />
    <el-dialog
      :title="'密码修改'"
      :visible.sync="passWordMask"
      width="30%"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <el-form
        ref="passWordForm"
        :rules="rules"
        :model="passWordForm"
        label-width="80px"
      >
        <el-form-item label="密码" prop="newPassword">
          <el-input v-model="passWordForm.newPassword"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="passWordEdit()">确 定</el-button>
        <el-button @click="handleClose">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Tabel from "@/components/Table";
import Pagination from "@/components/Pagination";
const UserForm = () => import("./components/userForm");
const RoleForm = () => import("./components/roleForm");
const Screen = () => import("./components/screen");
export default {
  components: {
    Tabel,
    Pagination,
    UserForm,
    RoleForm,
    Screen
  },
  data() {
    return {
      loading: false,
      activeName: "user",
      userAddDialogVisible: false, // 新增账号弹窗
      userEditDialogVisible: false, // 编辑账号弹窗
      userTotal: 0,
      userForm: {}, // 账号新增数据
      userQueryForm: {
        size: 50,
        current: 1
      },
      userList: [], // 账号列表数据
      userCurrentRow: {}, // 账号选中行数据
      // 账号表格数据
      userColumns: [
        {
          prop: "erpEmployeeId",
          label: "erpId"
        },
        {
          prop: "userName",
          label: "账号"
        },
        {
          prop: "roleName",
          label: "角色"
        },
        {
          prop: "name",
          label: "名称"
        },
        {
          prop: "translinename",
          label: "送货路线"
        },
        {
          prop: "employeeNo",
          label: "工号"
        },
        {
          prop: "is_use",
          label: "是否启用"
        },
        {
          prop: "endTime",
          label: "最后登陆时间"
        }
      ],
      roleLoading: false,
      roleTotal: 0,
      roleEditDialogVisible: false, // 角色编辑弹窗
      roleAddDialogVisible: false, // 角色新增弹窗
      roleForm: {}, // 角色新增数据
      roleCurrentRow: {}, // 选中行
      roleQueryForm: {
        size: 50,
        current: 1
      },
      roleList: [], // 角色选中行数据
      // 角色列表数据
      roleColumns: [
        {
          prop: "roleName",
          label: "角色名"
        },
        {
          prop: "createTime",
          label: "创建时间"
        }
      ],
      permissionNameList: [],
      passWordMask: false,
      passWordForm: {},
      rules: {
        newPassword: [
          { required: true, message: "请输入密码", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.query();
    this.roleQuery();
    this.getRoleAll();
  },
  methods: {
    passWordEdit() {
      this.$refs["passWordForm"].validate(valid => {
        if (valid) {
          this.$http.get('user/resetPassword',{ params:this.passWordForm}).then(res => {
            this.query();
            this.handleClose();
            this.$message.success('密码修改成功')
          })
        }
      });
    },
    handleClose() {
      this.passWordMask = false;
      this.passWordForm = {};
      this.userCurrentRow = {};
      if (this.$refs["passWordForm"]) {
        this.$refs["passWordForm"].resetFields();
      }
    },
    // 员工账号
    query(form) {
      if (form) {
        this.userQueryForm = form;
      }
      this.loading = true;
      this.$http
        .get("user/getUserList", { params: { ...this.userQueryForm } })
        .then(res => {
          this.userList = res.records.map(item => {
            item.is_use = item.isUse === 'ON'?'启用':'停用'
            if (item.roleList) {
              item.roles = [];
              item.roleList.map(r => {
                item.roles.push(r.roleName);
                item.roleName = item.roles.join(",");
              });
            }
            return item;
          });
          this.userTotal = res.total;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    userEditBtn() {
      if (!this.userCurrentRow.id) {
        this.$message.info("未选中账号");
        return;
      }
      this.userEditDialogVisible = true;
    },
    // 新增账号
    handleUserAdd(val) {
      this.$http.post("user/addUser", { ...val }).then(res => {
        console.log(val);
        this.$message.success("添加成功");
        this.query();
        this.cancel();
      });
    },
    handleUserEdit(val) {
      delete val["createTime"];
      delete val["endTime"];
      if (val.roleList) {
        val.roleList.forEach(item => {
          delete item.createTime;
        });
      }
      this.$http.post("user/updateUser", { ...val }).then(res => {
        this.$message.success("修改成功");
        this.query();
        this.cancel();
      });
    },
    // 重置密码
    passwordReset() {
      if (!this.userCurrentRow.id) {
        this.$message.info("未选中账号");
        return;
      }
      this.passWordMask = true;
      this.passWordForm.userId = this.userCurrentRow.id;
      // this.$confirm('重置初始密码为88888888？, 是否确定？', '提示', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning',
      // })
      //   .then(() => {
      //     this.$http
      //       .get('user/resetUserPassword', {
      //         params: { id: this.userCurrentRow.id },
      //       })
      //       .then((res) => {
      //         this.$message.success('操作成功');
      //         this.query();
      //       });
      //   })
      //   .catch(() => {
      //     this.$message({
      //       type: 'info',
      //       message: '已取消操作',
      //     });
      //   });
    },
    // 角色
    roleQuery() {
      this.roleLoading = true;
      this.$http
        .get("user/getRoleList", { params: { ...this.roleQueryForm } })
        .then(res => {
          this.roleList = res.records;
          this.roleTotal = res.total;
        })
        .finally(() => {
          this.roleLoading = false;
        });
    },
    // 角色编辑
    roleEditBtn(row) {
      if (row) {
        this.roleCurrentRow = row;
      }
      if (!this.roleCurrentRow.id) {
        this.$message.info("未选中角色");
        return;
      }
      this.roleCurrentRow.checkedKeys = [];
      if (this.roleCurrentRow.rolePermissionList[0]) {
        this.roleCurrentRow.rolePermissionList.forEach(item => {
          this.roleCurrentRow.checkedKeys.push(item.permissionPath);
        });
      }
      this.roleEditDialogVisible = true;
    },
    // 角色新增
    handleRoleAdd(val) {
      if (!val.rolePermissionList) {
        return this.$message.warning("请至少选择一个权限");
      }
      this.$http.post("user/addRole", { ...val }).then(res => {
        this.$message.success("添加成功");
        this.roleQuery();
        this.cancel();
      });
    },
    // 角色修改
    handleRoleEdit(val) {
      val.rolePermissionList = val.rolePermissionList.map(item => {
        delete item.createTime;
        return item;
      });
      delete val["createTime"];
      this.$http.post("user/updateRole", { ...val }).then(res => {
        this.$message.success("修改成功");
        this.$store.dispatch("user/getInfo");
        this.query();
        this.roleQuery();
        this.cancel();
      });
    },
    // 选中行
    userCurrent(row) {
      this.userCurrentRow = { ...row };
      this.userCurrentRow.roledIdList = [];
    },
    // 账号管理分页事件
    userPagination({ page: current, limit: size }) {
      this.userQueryForm.current = current;
      this.query();
    },
    userSizeChange({ page: current, limit: size }) {
      this.userQueryForm.size = size;
      this.query();
    },
    // 角色管理
    rolePagination({ page: current, limit: size }) {
      this.roleQueryForm.current = current;
      this.roleQuery();
    },
    roleSizeChange({ page: current, limit: size }) {
      this.roleQueryForm.size = size;
      this.roleQuery();
    },
    // 选中行
    roleCurrent(row) {
      this.roleCurrentRow = row;
    },
    // 取消弹窗
    cancel() {
      this.userAddDialogVisible = false;
      this.userEditDialogVisible = false;
      this.roleEditDialogVisible = false;
      this.roleAddDialogVisible = false;
      this.userCurrentRow = {};
      this.roleCurrentRow = {};
      this.getRoleAll();
    },
    // 角色不分页
    getRoleAll() {
      this.permissionNameList = [];
      this.$http.get("user/getRoleAll", {}).then(res => {
        res.map(item => {
          this.permissionNameList.push({
            roleName: item.roleName,
            id: item.id
          });
        });
      });
    }
  }
};
</script>

<style scoped></style>
