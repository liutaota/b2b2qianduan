<template>
  <el-dialog
    title="证照编辑"
    :visible.sync="dialogVisible"
    width="550px"
    :before-close="resetForm"
    :close-on-click-modal="false"
  >
    <el-form ref="ruleForm" :model="form" :rules="rules" label-width="100px" class="demo-ruleForm">
      <el-form-item label="企业名称">
        <el-input v-model.trim="form.customname" disabled />
      </el-form-item>
      <el-form-item label="证照类型" prop="licenceTypeId">
        <!-- <el-input v-model.trim="form.licenceName" placeholder="请输入证件类型"></el-input> -->
        <el-select
          v-model.trim="form.licenceName"
          placeholder="请选择证照类型"
          @change="setlicensetype"
        >
          <el-option
            v-for="(item, index) of licensetype"
            :key="index"
            :label="item.licensename"
            :value="item.licensename"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="证件号" prop="licenceCode">
        <el-input v-model.trim="form.licenceCode" />
      </el-form-item>
      <el-form-item label="发证日期" class="date" prop="signTime">
        <el-date-picker
          v-model.trim="form.signTime"
          type="date"
          placeholder="选择日期"
          style="width: 100%"
          value-format="yyyy-MM-dd HH:mm:ss"
        />
      </el-form-item>
      <el-form-item label="有效日期" class="date" prop="validEndTime">
        <div style="display: flex;">
          <el-checkbox v-model.trim="form.checked" label="永久" border style="margin-right:10px" @change="checkbox" />
          <el-date-picker
            v-model.trim="form.valid_end_time"
            type="date"
            placeholder="选择日期"
            style="width: 100%"
            value-format="yyyy-MM-dd HH:mm:ss"
            :disabled="form.checked"
            @change="picker"
          />
        </div>
      </el-form-item>
      <el-form-item prop="licenceImages">
        <el-upload
          class="avatar-uploader"
          action
          :show-file-list="false"
          style="margin: 20px; float: left"
          :on-success="handleBgImageSuccess"
          :http-request="bgImage"
        >
          <img
            v-if="form.licenceImages"
            :src="imgHost + form.licenceImages"
            class="avatar"
          >
          <i
            v-else
            class="el-icon-plus avatar-uploader-icon"
            style="
                border: 1px dashed #d9d9d9;
                border-radius: 6px;
                cursor: pointer;
                position: relative;
                overflow: hidden;
              "
          />
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">编辑</el-button>
        <el-button @click="resetForm('ruleForm')">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { upload } from '@/fs';
import { imgHost } from '@/config';
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
    licensetype: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      rules: {
        licenceTypeId: [
          { required: true, message: '请选择证照类型', trigger: 'change' },
        ],
        licenceCode: [
          { required: true, message: '请输入证照号', trigger: 'blur' },
        ],
        licenceImages: [
          { required: true, message: '请上传证件照', trigger: 'blur' },
        ],
        signTime: [
          { type: 'string', required: true, message: '请选择日期', trigger: 'change' }
        ],
        validEndTime: [
        //   { type: 'string', required: true, message: '请选择日期' }
          { required: true, message: '请选择日期', trigger: 'change' },
        ],
      },
      imgHost
    };
  },
  created() {
  },
  methods: {
    // 发送编辑请求
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$http.post('member/updateLicenceApply', { ...this.form }).then(res => {
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
    checkbox(e) {
      console.log(2);
      if (e) {
        this.form.validEndTime = '永久';
        delete this.form.valid_end_time;
      } else {
        this.form.validEndTime = '';
      }
    },
    // 取消选中
    resetForm() {
      this.$emit('handleClose');
      this.$refs['ruleForm'].resetFields();
    },
    // 证照类型选中
    setlicensetype(e) {
      const find = this.licensetype.find((item) => {
        return e === item.licensename;
      });
      this.form.licenceTypeId = find.licensetypeid;
    },
    picker(e) {
      this.form.validEndTime = e;
    },
    // 上传图片
    handleBgImageSuccess(res, file) {
      this.licenceImages = URL.createObjectURL(file.raw);
    },
    bgImage(e) {
      return upload(e.file).then((data) => {
        this.$set(this.form, 'licenceImages', data.code);
        // this.form.licenceImages = ;
      });
    },
  }
};
</script>

<style scoped lang="less">
.avatar-uploader {
  width: 150px !important;
  height: 150px !important;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 150px !important;
  height: 150px !important;
  line-height: 150px !important;
}
.avatar {
  width: 150px !important;
  height: 150px !important;
}
</style>
