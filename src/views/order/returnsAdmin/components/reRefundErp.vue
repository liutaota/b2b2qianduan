<template>
  <el-dialog title="重新下发" :visible.sync="dialogVisible" width="30%" :close-on-click-modal="false" :before-close="handleClose">
    <el-form ref="ruleForm" :model="form" :rules="rules">
      <el-form-item label="原单单号" prop="sort">
        <p>{{ form.orderNo }}</p>
      </el-form-item>
      <el-form-item label="下发原因" prop="reErpRemark">
        <el-input v-model="form.reErpRemark" autocomplete="off" />
      </el-form-item>
    </el-form>
    <!-- 按钮 -->
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleEdit('ruleForm')">确 定</el-button>
      <el-button @click="handleCancel">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { _throttle } from '@/utils/public';
export default {
  name: 'Dashboard',
  props: {
    dialogVisible: {
      type: Boolean,
      default: () => false,
    },
    form: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    const factorySort = (rule, value, callback) => {
      if (/[^\d]/g.test(value) || value === '') {
        callback(new Error('请输入数字'));
      } else {
        callback();
      }
    };
    return {
      rules: {
        reErpRemark: [
          { required: true, message: '请输入下发原因', trigger: 'blur' },
        ],
        sort: [
          { validator: factorySort, trigger: 'blur' }
        ],
      },
    };
  },
  methods: {
    // 发送请求
    handleEdit: _throttle(function (ruleForm) {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.$emit('handleEdit', this.form);
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    }, 1000),
    // 取消
    handleCancel: _throttle(function (formName) {
      this.$refs['ruleForm'].resetFields();
      this.$emit('handleCancel');
    }, 1000),
    // 关闭蒙版
    handleClose: _throttle(function (formName) {
      this.$refs['ruleForm'].resetFields();
      this.$emit('handleCancel');
    }, 1000),
  },
};
</script>
