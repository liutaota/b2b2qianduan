<template>
  <el-dialog :title="title + '指南'" :visible.sync="dialogFormVisible" :close-on-click-modal="false" :before-close="cancel" width="70%">
    <el-form ref="ruleForm" :model="form" label-width="120px" :rules="rules">
      <el-form-item label="指南标题" prop="helpTitle">
        <el-input v-model.trim="form.helpTitle" autocomplete="off" style="width:250px" />
      </el-form-item>
      <el-form-item label="类别" prop="typeId">
        <el-select v-model.trim="form.typeId" placeholder="请选择活动区域" style="width:150px;">
          <el-option v-for="item of helpType" :key="item.id" :label="item.typeName" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="跳转链接" prop="helpUrl">
        <el-input v-model.trim="form.helpUrl" autocomplete="off" style="width:250px" />
      </el-form-item>
      <el-form-item label="指南内容">
        <Tinymce :value="form.helpInfo" :height="200" @input="editor" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="onSubmit('ruleForm')">确 定</el-button>
      <el-button @click="cancel('ruleForm')">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import Tinymce from '@/components/Tinymce';
export default {
  components: {
    Tinymce
  },
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
      helpType: [],
      // 表单验证规则
      rules: {
        helpTitle: [
          { required: true, message: '请输入指南标题', trigger: 'blur' },
        ],
        typeId: [
          { required: true, message: '请选择活动区域', trigger: 'change' }
        ],
        helpUrl: [
          { required: true, message: '请输入跳转链接', trigger: 'blur' },
        ],
      },
    };
  },
  mounted() {
    this.query();
  },
  methods: {
    //   帮助类别
    query() {
      this.$http.get('advPosition/getHelpTypeList').then(res => {
        this.helpType = res;
      });
    },
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.form.helpInfo === undefined || this.form.helpInfo === '') {
            this.$message.error('指南内容不能为空');
            return;
          }
          this.$emit('onSubmit', this.form);
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    cancel() {
      this.$emit('cancel');
      this.$refs['ruleForm'].resetFields();
    },
    editor(e) {
      this.form.helpInfo = e;
    },
  }
};
</script>

<style scoped>
</style>
