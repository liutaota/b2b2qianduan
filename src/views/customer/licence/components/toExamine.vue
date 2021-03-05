<template>
  <el-dialog
    title="证照审核"
    :visible.sync="dialogVisible"
    width="550px"
    :before-close="resetForm"
    :close-on-click-modal="false"
  >
    <el-form
      ref="ruleForm"
      :model="form"
      :rules="rules"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="结果" prop="status">
        <el-radio-group v-model.trim="form.status">
          <el-radio label="APPROVE">通过</el-radio>
          <el-radio label="NOT_APPROVED">驳回</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="form.status !== 'APPROVE'" label="驳回原因" prop="remark">
        <el-input v-model.trim="form.remark" rows="4" type="textarea" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">审核</el-button>
        <el-button @click="resetForm('ruleForm')">取消</el-button>
      </el-form-item>
    </el-form>
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
  },
  data() {
    return {
      rules: {
        remark: [
          { required: true, message: '请输入驳回原因', trigger: 'change' },
        ],
        status: [
          { required: true, message: '请选择结果', trigger: 'change' },
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$http.get('member/checkLicenceApplyVoStatus', { params: { ...this.form }}).then(res => {
            this.$message.success('编辑成功');
            this.resetForm();
            this.$emit('submitForm');
          });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm() {
      this.$refs['ruleForm'].resetFields();
      this.$emit('handleClose');
    }
  },
};
</script>

<style scoped>
</style>
