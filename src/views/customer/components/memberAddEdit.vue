<template>
  <el-dialog :title="title" :visible.sync="dialogFormVisible" :close-on-click-modal="false" :before-close="cancel">
    <el-form ref="ruleForm" :model="form" label-width="120px" :rules="rules">
      <el-form-item label="erp用户id" prop="erpUserId">
        <el-input v-model.trim="form.customid" style="width:42%" disabled />
      </el-form-item>
      <el-form-item label="手机号" prop="telephone">
        <el-input v-model.trim.number="form.telephone" style="width:42%" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model.trim="form.password" type="password" style="width:42%" />
      </el-form-item>
      <el-form-item label="二次密码" prop="rePassword">
        <el-input v-model.trim="form.rePassword" type="password" style="width:42%" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="onSubmit('ruleForm')">添 加</el-button>
      <el-button @click="cancel('ruleForm')">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    dialogFormVisible: {
      type: Boolean,
      default: () => false
    },
    form: {
      type: Object,
      default: () => {
        return {};
      }
    },
    title: {
      type: String,
      default: '添加'
    }
  },
  data() {
    var telephone = (rule, value, callback) => {
      // let phoneReg = /(^1[3|4|5|6|7|8|9]\d{9}$)|(^09\d{8}$)/;
      if (value === '') {
        callback(new Error('请输入手机号'));
      } else if (!this.isCellPhone(value)) {
        // 引入methods中封装的检查手机格式的方法
        callback(new Error('请输入正确的手机号!'));
      } else {
        callback();
      }
    };
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.form.rePassword !== '') {
          this.$refs.ruleForm.validateField('rePassword');
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.form.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      phone: '',
      // 表单验证规则
      rules: {
        telephone: [{ required: true, validator: telephone, trigger: 'blur' }],
        password: [
          { required: true, validator: validatePass, trigger: 'blur' },
        ],
        rePassword: [
          { required: true, validator: validatePass2, trigger: 'blur' },
        ],
      },
    };
  },
  methods: {
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$emit('onSubmit', this.form);
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    cancel(formName) {
      this.$emit('cancel');
      this.$refs['ruleForm'].resetFields();
    },
    isCellPhone(val) {
      if (!/^1[3456789]\d{9}$/.test(val)) {
        return false;
      } else {
        return true;
      }
    },
  }
};
</script>

<style scoped>
</style>
