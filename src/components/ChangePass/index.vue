<template>
  <div>
    <el-dialog
      close-on-press-escape
      lock-scroll
      :visible.sync="show"
      width="400"
      title="修改密码"
      :show-close="false"
    >
      <el-form ref="subForm" :model="subForm" :rules="rules" label-width="100px" center>
        <el-form-item label="原密码:" prop="oldPass">
          <el-input
            v-model.trim="subForm.oldPassword"
            placeholder="请输入原密码"
            type="password"
            show-password
            clearable
          />
        </el-form-item>
        <el-form-item label="新密码:" prop="newPassword">
          <el-input
            v-model.trim="subForm.newPassword"
            placeholder="请输入新密码"
            type="password"
            show-password
            clearable
          />
        </el-form-item>
        <el-form-item label="确认新密码:" prop="confirmPass">
          <el-input
            v-model.trim="subForm.confirmPass"
            placeholder="请确认密码"
            type="password"
            show-password
            clearable
          />
        </el-form-item>
      </el-form>
      <div class="editFooter">
        <el-button style="margin-left: 200px;" @click="cancel">取消</el-button>
        <el-button type="primary" :loading="loading" @click="confirm">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    close: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    var beWith = (rule, value, callback) => {
      const tink = value.trim() !== "" && value === this.subForm.newPassword;
      tink ? callback() : callback(new Error("上下密码不一致"));
    };
    return {
      subForm: {
        oldPassword: "",
        newPassword: "",
        confirmPass: "",
      },
      loading: false,
      rules: {
        oldPassword: [
          {
            validator: this.$rules.noEmpty,
            trigger: "blur",
          },
        ],
        newPassword: [
          {
            validator: this.$rules.noEmpty,
            trigger: "blur",
          },
        ],
        confirmPass: [
          {
            validator: beWith,
            trigger: "blur",
          },
        ],
      },
    };
  },
  computed: {
    showDialog: {
      get() {
        return this.show;
      },
      set(val) {
        this.show = val;
      },
    },
  },
  watch: {
    show(val, val2) {
      console.log("show", val, val2);
    },
  },
  methods: {
    cancel() {
      this.close();
    },
    confirm() {
      this.$refs.subForm.validate((res) => {
        if (!res) return;
        this.$http.get("/user/resetAdminPassword", {params:{...this.subForm}}).then(() => {
          this.$message.success("修改成功!请重新登录");
          this.$router.go(0);
          // this.$router.replace('/login');
        });
      });
    },
  },
};
</script>

<style>
.specialchangepassForm .el-form-item {
  /* width: 80% !important; */
}

.myPassBox {
  display: flex;
  justify-content: center;
}
.editFooter {
  padding: 0 20px 20px 0;
}
</style>
