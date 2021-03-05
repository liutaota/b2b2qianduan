<template>
  <el-dialog title="退货原因" :visible.sync="dialogVisible" width="30%" :close-on-click-modal="false" :before-close="handleClose">
    <el-form ref="ruleForm" :model="form" :rules="rules">
      <el-form-item label="退货原因" prop="reasonInfo">
        <el-input v-model.trim="form.reasonInfo" autocomplete="off" />
      </el-form-item>
      <el-form-item label="ERPid" prop="erpReasonId">
        <el-input v-model.trim="form.erpReasonId" autocomplete="off" />
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input v-model.trim.number="form.sort" autocomplete="off" />
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
        reasonInfo: [
          { required: true, message: '请输入退货原因', trigger: 'blur' },
        ],
        reasonInfo: [
          { required: true, message: '请输入ERPid', trigger: 'blur' },
        ],
        sort: [
          { validator: factorySort, trigger: 'blur' }
        ],
      },
    };
  },
  methods: {
    // 发送请求
    handleEdit: _throttle(function (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(1);
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
