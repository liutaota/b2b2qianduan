<template>
  <el-dialog :title="title+'公告'" :visible.sync="dialogFormVisible" :close-on-click-modal="false" :before-close="cancel">
    <el-form ref="ruleForm" :model="form" label-width="120px" :rules="rules">
      <el-form-item label="公告类型" prop="noticeType">
        <el-input v-model.trim="form.noticeType" style="width:42%" />
      </el-form-item>
      <el-form-item label="提示色号" prop="noticeColor">
        <div style="display:flex;align-items: center;">
          <el-color-picker v-model.trim="form.noticeColor" size="medium" /><span style="margin-left:10px">{{ form.hue }}</span>
        </div>
      </el-form-item>
      <el-form-item label="公告内容" prop="content">
        <el-input
          v-model.trim="form.content"
          type="textarea"
          style="width:70%"
          :rows="5"
          resize="none"
        />
      </el-form-item>
      <el-form-item label="开始时间" style="margin-bottom:15px;" prop="startTime">
        <el-date-picker
          v-model.trim="form.startTime"
          type="datetime"
          placeholder="选择时间"
          style="width:42%"
          align="right"
          value-format="yyyy-MM-dd HH:mm:ss"
          :picker-options="pickerOptions"
        />
      </el-form-item>
      <el-form-item label="结束时间" style="margin-bottom:15px;" prop="endTime">
        <el-date-picker
          v-model.trim="form.endTime"
          type="datetime"
          placeholder="选择时间"
          style="width:42%"
          align="right"
          value-format="yyyy-MM-dd HH:mm:ss"
          :picker-options="pickerOptions"
        />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="onSubmit('ruleForm')">保 存</el-button>
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
      // 日期
      pickerOptions: {
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date());
          }
        }, {
          text: '昨天',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24);
            picker.$emit('pick', date);
          }
        }, {
          text: '一周前',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', date);
          }
        }]
      },
      // 表单验证规则
      rules: {
        content: [
          { required: true, message: '请输入公告内容', trigger: 'blur' },
        ],
        noticeColor: [
          { required: true, message: '请选择色号', trigger: 'blur' },
        ],
        noticeType: [
          { required: true, message: '请输入类型', trigger: 'blur' },
        ],
        startTime: [
          { type: 'string', required: true, message: '请选择开始时间', trigger: 'change' }
        ],
        endTime: [
          { type: 'string', required: true, message: '请选择结束时间', trigger: 'change' }
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
