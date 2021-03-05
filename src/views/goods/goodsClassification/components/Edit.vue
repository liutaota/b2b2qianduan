<template>
  <el-dialog :title="title+'分类信息编辑'" :visible.sync="dialogFormVisible" :close-on-click-modal="false" :before-close="handleClose">
    <el-form ref="ruleForm" :rules="rules" :model="form" label-width="100px">
      <el-form-item label="简称" prop="classname">
        <el-input v-model.trim="form.classname" placeholder="请输入内容" autocomplete="off" :disabled="disabled" />
      </el-form-item>
      <!-- <el-form-item label="首字母" prop="daAmount">
        <el-input v-model.trim.number="form.daAmount" placeholder="请输入内容" autocomplete="off" />
      </el-form-item> -->
      <el-form-item label="图片上传" prop="areaName">
        <el-upload
          class="avatar-uploader"
          action=""
          :show-file-list="false"
          style="margin-right: 15px"
          :on-success="handleAvatarSuccess"
          :http-request="uploadImage"
        >
          <FsImg v-if="form.classImg" :src="form.classImg" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon" style="border: 1px dashed #d9d9d9;border-radius: 6px;cursor: pointer;position: relative;overflow: hidden;" />
        </el-upload>
        <span class="chicun"> 建议尺寸：120*120px </span>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleEdit('ruleForm')">确 定</el-button>
      <el-button @click="handleCancel('ruleForm')">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
// import { _throttle } from '@/utils/public';
import { upload } from '@/fs';
import RegionData from '@/utils/region-data';
const FsImg = () => import('@/components/FsImg');
export default {
  components: {
    FsImg
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
    return {
      value: [],
      nodeContent: '',
      citydata: '',
      length: null,
      options: [],
      dialogImageUrl: '',
      // 表单验证规则
      rules: {
        classname: [
          { required: true, message: '请输入简称', trigger: 'blur' },
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
          this.$emit('handleEdit', this.form);
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    uploadImage(e) {
      return upload(e.file)
        .then(data => {
          this.form.classImg = data.code;
          this.$message.success('上传成功');
        });
    },
    handleAvatarSuccess(res, file) {
      this.dialogImageUrl = URL.createObjectURL(file.raw);
    },
    // 取消
    handleCancel(formName) {
      this.$refs[formName].resetFields();
      this.$emit('handleCancel');
    },
    // 关闭蒙版
    handleClose(done) {
      this.$emit('handleCancel', false);
      this.$refs['ruleForm'].resetFields();
      this.nodeContent = {};
    },
  }
};
</script>

<style scoped lang="less">
.distpicker{
  font-size: 12px;
}

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 100px;
      height: 100px;
      line-height: 100px;
  }
  .avatar {
      width: 100px;
      height: 100px;
  }
  .chicun {
    color: rgb(0, 223, 11);
  }

</style>
