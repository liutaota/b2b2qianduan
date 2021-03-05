<template>
  <el-dialog :title="title+'起送规则'" :visible.sync="dialogFormVisible" :before-close="handleClose">
    <el-form ref="ruleForm" :rules="rules" :model="form" label-width="100px">
      <el-form-item label="规则名称" prop="daName">
        <el-input v-model.trim="form.daName" placeholder="请输入内容" autocomplete="off" :disabled="disabled" />
      </el-form-item>
      <el-form-item label="金额" prop="daAmount">
        <el-input v-model.trim.number="form.daAmount" placeholder="请输入内容" autocomplete="off" />
      </el-form-item>
      <el-form-item label="请选择地区" prop="areaName">
        <!-- <v-distpicker :province="select.province" :city="select.city" :area="select.area"></v-distpicker> -->
        <el-cascader
          ref="cascaderAddr"
          v-model.trim="form.areaId"
          :options="options"
          :props="{ checkStrictly: true }"
          :disabled="disabled"
          @change="handleChange"
        />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleEdit('ruleForm')">确 定</el-button>
      <el-button @click="handleCancel('ruleForm')">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import RegionData from '@/utils/region-data';
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
    title: {
      type: String,
      default: () => '新增'
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
    return {
      value: [],
      nodeContent: '',
      citydata: '',
      length: null,
      options: [],
      // 表单验证规则
      rules: {
        daName: [
          { required: true, message: '请输入地区名称', trigger: 'blur' },
        ],
        daAmount: [
          { required: true, validator: number, trigger: 'blur' }
        ],
      },
    };
  },
  mounted() {
    this.options = RegionData;
  },
  methods: {
    // 发送请求
    handleEdit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.form);
          // 默认
          if (this.form.id === 0) {
            this.$emit('handleEdit', this.form);
            return;
          }
          if (this.form.areaId === undefined || this.form.areaId === null) {
            this.$message({
              showClose: true,
              message: '请选择地区',
              type: 'warning'
            });
            return;
          }
          this.$emit('handleEdit', this.form);
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    // 地区选择
    handleChange(val) {
      if (val === undefined) return;
      this.$refs.cascaderAddr.dropDownVisible = false;
      const nodeContent = this.$refs['cascaderAddr'].getCheckedNodes();
      this.form.areaId = val;
      this.form.areaName = nodeContent[0].pathLabels.join('');
    },
    // 取消
    handleCancel(formName) {
      this.$refs[formName].resetFields();
      this.$emit('handleCancel');
    },
    // 关闭蒙版
    handleClose(done) {
      // 判断是否取消
      this.$confirm('确认关闭？').then(_ => {
        done(false);
        this.$emit('handleCancel', false);
        this.$refs['ruleForm'].resetFields();
        this.nodeContent = {};
      }).catch(_ => {});
    },
  }
};
</script>

<style scoped>
.distpicker{
  font-size: 12px;
}
</style>
