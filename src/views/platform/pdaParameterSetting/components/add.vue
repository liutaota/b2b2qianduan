<template>
  <el-dialog :title="titles + 'pda版本'" :visible.sync="dialogFormVisible" :close-on-click-modal="false" :before-close="handleClose">
    <el-form ref="ruleForm" :rules="rules" :model="form" label-width="100px">
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入内容" autocomplete="off" :disabled="disabled" />
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="form.remark" placeholder="请输入内容" autocomplete="off" />
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input v-model.number="form.sort" placeholder="请输入内容" autocomplete="off" />
      </el-form-item>
      <el-form-item label="key" prop="key">
        <el-input v-model="form.key" placeholder="请输入内容" autocomplete="off" :disabled="disabled" />
      </el-form-item>
      <el-form-item label="value" prop="value">
        <el-input v-model="form.value" placeholder="请输入内容" autocomplete="off" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleEdit('ruleForm')">确 定</el-button>
      <el-button @click="handleCancel('ruleForm')">取 消</el-button>
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
      default: () => {}
    },
    disabled: {
      type: Boolean,
      default: () => false
    },
    titles: {
      type: String,
      default: () => '新增'
    },
    type: {
      type: String,
      default: () => 'STORE'
    }
  },
  data() {
    const number = (rule, value, callback) => {
      if (/[^\d]/g.test(value) || value === '') {
        callback(new Error('请输入数字'));
      } else {
        callback();
      }
    };
    // const values = (rule, value, callback) => {
    //   if (!(/^[A-Z]+$/g.test(value)) || value === '') {
    //     callback(new Error('请输入大写字母'));
    //   } else {
    //     callback();
    //   }
    // };
    return {
      // 表单验证规则
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
        ],
        sort: [
          { required: true, validator: number, trigger: 'blur' }
        ],
        key: [
          { required: true, message: '请输入key值', trigger: 'blur' },
        ],
        value: [
          { required: true, validator: '请输入value', trigger: 'blur' }
        ],
      },
    };
  },
  methods: {
    // 发送请求
    handleEdit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.form.type = this.type;
          this.$emit('handleEdit', this.form);
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    // 取消
    handleCancel(formName) {
      this.$emit('handleCancel');
      this.$refs[formName].resetFields();
    },
    // 关闭蒙版
    handleClose(done) {
      this.$refs['ruleForm'].resetFields();
      this.$emit('handleCancel');
    },
  }
};
</script>

<style scoped>
.distpicker{
  font-size: 12px;
}
</style>
