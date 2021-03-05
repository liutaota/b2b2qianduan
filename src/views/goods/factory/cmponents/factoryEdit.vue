<template>
  <el-dialog :visible.sync="dialogFormVisible" :close-on-click-modal="false" :before-close="handleClose" top="50px" style="padding:0" :title="'厂家信息编辑 - ' + manufactor.factoryname">
    <div>
      <el-form ref="ruleForm" :model="manufactor" :rules="rules" label-width="80px" style="font-weight: 100;" size="medium">
        <el-form-item label="简称" prop="factoryShort">
          <el-input v-model.trim="manufactor.factoryShort" />
        </el-form-item>
        <el-form-item label="首字母" prop="factoryInitial">
          <el-input v-model.trim="manufactor.factoryInitial" />
        </el-form-item>
        <el-form-item label="图片上传">
          <p style="color:#13CE66;margin:0">品牌尺寸：196*100</p>
          <el-upload
            class="avatar-uploader"
            action=""
            :show-file-list="false"
            style="margin: 20px;"
            :http-request="uploadImage"
          >
            <FsImg v-if="manufactor.factoryPic" :src="manufactor.factoryPic" width="50%" style="text-align: left;" />
            <i v-else class="el-icon-plus avatar-uploader-icon" style="border: 1px dashed #d9d9d9;border-radius: 6px;cursor: pointer;position: relative;overflow: hidden;" />
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleEdit('ruleForm')">提交编辑</el-button>
        <el-button @click="handleCancel('ruleForm')">取 消</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { _throttle } from '@/utils/public';
import { upload } from '@/fs';
import FsImg from '@/components/FsImg';
export default {
  components: {
    FsImg
  },
  props: {
    dialogFormVisible: {
      type: Boolean,
      default: () => false
    },
    manufactor: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    const factoryInitial = (rule, value, callback) => {
      if (/[^\a-\z\A-\Z]/g.test(value) || value === '') {
        callback(new Error('请输入字母'));
      } else {
        callback();
      }
    };
    const factorySort = (rule, value, callback) => {
      if (/[^\d]/g.test(value) || value === '') {
        callback(new Error('请输入数字'));
      } else {
        callback();
      }
    };
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      goodsInfo: {
        goodsImgList: [],
      },
      rules: {
        factoryShort: [
          { required: true, message: '请输入厂家名称', trigger: 'blur' },
        ],
        factoryInitial: [
          { validator: factoryInitial, trigger: 'blur' }
        ],
        factorySort: [
          { validator: factorySort, trigger: 'blur' }
        ],
      }
    };
  },
  methods: {
    /**
     * 图片上传
     */
    uploadImage(e) {
      return upload(e.file)
        .then(data => {
          this.manufactor.factoryPic = data.code;
          this.$message.success('上传成功');
        });
    },
    // 提交编辑
    handleEdit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          delete this.manufactor.factoryImg;
          this.$emit('handleFactoryEdit', this.manufactor);
          this.dialogImageUrl = '';
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    // 取消编辑
    handleCancel(formName) {
      this.$refs[formName].resetFields();
      this.$emit('handleCancel', false);
      this.dialogImageUrl = '';
    },
    handleClose: _throttle(function(done) {
      this.$emit('handleCancel', false);
    })
  }
};
</script>

<style scoped lang="less">
.editTitle-wrap {
  border-bottom: 1px solid #D5D5D5;
}
// 图片上传样式

.avatar-uploader .el-upload:hover {
    border-color: #409EFF;
}
.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
}
.avatar {
    width: 178px;
    height: 178px;
    display: block;
}
</style>
