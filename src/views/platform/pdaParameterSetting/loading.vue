<template>
  <el-dialog title="文件上传" :visible.sync="uploadVisible" width="650px">
    <el-form ref="ruleForm" :model="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="上传附件" prop="annexFile">
        <el-upload
          ref="upload"
          class="upload-demo"
          action="/api/boAnnex/addBoAnnex"
          :http-request="httpRequest"
          :before-remove="beforeRemove"
          :on-exceed="handleExceed"
          multiple
          :limit="10"
          :auto-upload="false"
          :on-change="getFile"
          :data="ruleForm"
          :file-list="fileList"
          name="annexFile"
        >
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
      </el-form-item>
      <el-form-item label="备注信息" prop="remark">
        <el-input v-model="ruleForm.remark" type="textarea" rows="5"
                  placeholder="请输入内容" maxlength="300" show-word-limit style="width: 400px;" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="resetForm('ruleForm')">取 消</el-button>
      <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>

  export default {
    name:"Loading",
    data() {
      return {
        uploadVisible: true,
        ruleForm: {
          remark: ''
        },
        fileList: [],
        fd: {}
      }
    },
    methods: {
      getFile(file, fileList) {
        const fd = new FormData()// FormData 对象
        this.fd = fd
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 10 个文件，本次选择了
        ${files.length} 个文件，共选择了
        ${files.length + fileList.length} 个文件`)
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${file.name}？`)
      },
      resetForm(formName) {
        this.uploadVisible = false
        this.$refs[formName].resetFields()
        this.$refs.upload.clearFiles()
      },
      httpRequest(param) {
        const fileObj = param.file // 相当于input里取得的files
        this.fd.append('annexFileArray', fileObj)// 文件对象
      },
      submitForm(file) {
        this.$refs.upload.submit()
        this.fd.append('remark', this.ruleForm.remark)
        this.fd.append('boId', this.businessId)
        console.log('这个数据',data.get("remark"))
        uploadAnnex(this.fd).then(res => {
          this.uploadVisible = false
          this.$message({
            message: '上传成功',
            type: 'success'
          })
        })
      },
    }
  }
</script>

<style lang="scss" scoped>

</style>
