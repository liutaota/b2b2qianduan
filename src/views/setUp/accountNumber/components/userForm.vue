<template>
  <el-dialog
    :visible.sync="dialogVisible"
    width="600px"
    :close-on-click-modal="false"
    :before-close="cancel"
  >
    <template slot="title">
      <div class="titleZise">
        <span>账号设置 - {{ title }}账号</span>
      </div>
    </template>
    <el-form
      ref="form"
      :model="form"
      label-width="100px"
      :rules="rules"
      style="width: 80%"
    >
      <el-form-item label="角色" prop="rolesIdList">
        <el-select
          v-model.trim="rolesIdList"
          placeholder="角色"
          multiple
          filterable
          style="width: 100%"
          @change="getRoleList"
        >
          <el-option
            v-for="item of permissionNameList"
            :key="item.id"
            :label="item.roleName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="线路" prop="zxPhOrder">
        <el-select
          v-model.trim="zxPhOrder"
          placeholder="线路"
          multiple
          filterable
          style="width: 100%"
        >
          <el-option
            v-for="item of zxPhOrderList"
            :key="item.zxPhOrder"
            :label="item.zxPhOrder"
            :value="item.zxPhOrder"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="ERP编号" prop="erpEmployeeId">
        <el-input
          v-model.trim="form.erpEmployeeId"
          :disabled="title === '编辑' ? true : false"
        />
      </el-form-item>
      <el-form-item label="ERP工号" prop="employeeNo">
        <el-input v-model.trim="form.employeeNo" />
      </el-form-item>
      <el-form-item label="账号" prop="userName">
        <el-input v-model.trim="form.userName" />
      </el-form-item>
      <el-form-item v-if="!form.id" label="密码" prop="password">
        <el-input v-model.trim="form.password" />
      </el-form-item>
      <el-form-item v-if="!form.id" label="确认密码" prop="rePassword">
        <el-input v-model.trim="form.rePassword" />
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input v-model.trim="form.name" />
      </el-form-item>
      <el-form-item label="手机号" prop="telephone">
        <el-input v-model.trim="form.telephone" />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model.trim="form.email" />
      </el-form-item>
      <el-form-item label="是否启用">
        <el-switch
          v-model="form.isUse"
          active-color="#13ce66"
          inactive-color="#ff4949"
          active-value="ON"
          inactive-value="OFF"
        >
        </el-switch>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="onSubmit('form')">确 定</el-button>
      <el-button @click="cancel('form')">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    form: {
      type: Object,
      default: () => {}
    },
    title: {
      type: String,
      default: "添加"
    },
    permissionNameList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.form.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      rules: {
        // rolesIdList: [
        //   { required: true, message: "请选择角色", trigger: "change" },
        // ],
        erpEmployeeId: [
          { required: true, message: "请输入ERP编号", trigger: "blur" }
        ],
        userName: [{ required: true, message: "请输入账号", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        rePassword: [
          { required: true, validator: validatePass2, trigger: "blur" }
        ],
        name: [{ required: true, message: "请输入名称", trigger: "blur" }]
        // telephone: [
        //   { required: true, message: "请输入手机号", trigger: "blur" },
        // ],
        // email: [{ required: true, message: "请输入邮箱", trigger: "blur" }],
      },
      rolesIdList: [],
      zxPhOrderList: [],
      zxPhOrder: []
    };
  },
  watch: {
    form() {
      if (this.form.roleList) {
        this.rolesIdList = [];
        this.form.roleList.map(m => {
          this.rolesIdList.push(m.id);
        });
      }
      if (this.form.translinename) {
        this.zxPhOrder = [];
        let arr = [];
        arr = this.form.translinename.split(",");
        arr.map(item => {
          this.zxPhOrder.push(item);
        });
      }
    }
  },
  created() {
    this.selectAllTransline();
  },
  methods: {
    selectAllTransline() {
      this.$http.get("user/selectAllTransline").then(res => {
        this.zxPhOrderList = res.map(item => {
          item.zxPhOrder = item.translinename;
          return item;
        });
      });
    },
    onSubmit(form) {
      this.$refs[form].validate(valid => {
        if (!this.rolesIdList[0]) {
          return this.$message.warning("角色不能为空");
        }
        this.form.translinename = this.zxPhOrder.join(",");
        if (valid) {
          this.zxPhOrder = [];
          this.$emit("onSubmit", this.form);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    cancel(form) {
      this.zxPhOrder = [];
      this.$emit("cancel");
      this.$refs["form"].resetFields();
    },
    getRoleList(val) {
      console.log(val, this.permissionNameList);
      const roleList = [];
      val.map(v => {
        this.permissionNameList
          .filter(p => p.id === v)
          .map(m => {
            roleList.push(m);
          });
      });
      this.form.roleList = roleList;
    }
  }
};
</script>

<style scoped></style>
