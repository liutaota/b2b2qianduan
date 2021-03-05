<template>
  <el-dialog :title="title + '类型'" :visible.sync="dialogFormVisible" :close-on-click-modal="false" :before-close="cancel">
    <el-form ref="ruleForm" :model="form" label-width="100px" :rules="rules">
      <el-form-item label="类型名称" prop="typeName">
        <el-input v-model.trim="form.typeName" placeholder="请输入排序名称" autocomplete="off" style="width: 240px" />
      </el-form-item>
      <el-form-item label="排序" prop="typeSort">
        <el-input v-model.trim.number="form.typeSort" placeholder="默认排序为0" autocomplete="off" style="width: 240px" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="onSubmit('ruleForm')">确 定</el-button>
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
      default: () => {}
    },
    title: {
      type: String,
      default: '新增'
    }
  },
  data() {
    return {
      // 表单验证规则
      rules: {
        typeName: [
          { required: true, message: '请输入排序名称', trigger: 'blur' },
        ],
        typeSort: [
          { required: true, message: '排序不能为空' },
          { type: 'number', message: '排序必须为数字值' }
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
      this.$refs[formName].resetFields();
    },
  }
};
</script>

<style scoped>
</style>
