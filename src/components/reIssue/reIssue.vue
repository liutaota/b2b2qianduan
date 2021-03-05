<template>
  <el-dialog
    title="重新下发"
    :visible.sync="reErpMask"
    width="500px"
    :before-close="handleClose"
    :close-on-click-modal="false"
  >
    <el-form
      ref="reErpForm"
      :rules="rules"
      :model="reErpForm"
      label-width="120px"
    >
      <el-form-item label="重新下发备注" prop="reErpRemark">
        <el-input v-model="reErpForm.reErpRemark" type="textarea" rows="3" />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleReErp()">确 定</el-button>
      <el-button @click="handleClose">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    reErpMask: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    reErpMask(val) {
      if (!val) {
        this.reErpForm = {};
      }
    },
  },
  data() {
    return {
      reErpForm: {},
      reErpLoading: false,
      rules: {
        reErpRemark: [
          { required: true, message: "请输入重新下发备注", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    handleReErp() {
      this.$refs["reErpForm"].validate((valid) => {
        if (valid) {
          this.$emit("handleReErp", this.reErpForm);
        }
      });
    },
    handleClose() {
      this.$refs["reErpForm"].resetFields();
      this.reErpForm = {};
      this.$emit("handleClose");
    },
  },
};
</script>

<style scoped>
</style>