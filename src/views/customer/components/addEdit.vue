<template>
  <div>
    <el-dialog
      :title="addEditTitle"
      :show-close="false"
      :visible="addEditVisb"
      :close-on-click-modal="false"
      width="55%"
    >
      <el-form ref="addEditFormsRef" :model="addEditForms" :rules="rules">
        <!-- <el-form-item prop="level">
          <el-col :span="5">
            <label>等级：</label>
          </el-col>
          <el-select v-model.trim="level" class="modInput">
            <el-option
              v-for="(item,index) in eType"
              :key="index"
              :label="item.desc"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item prop="realName ">
          <el-col :span="5">
            <label>真实姓名：</label>
          </el-col>
          <el-input
            v-model.trim="addEditForms.realName "
            type="text"
            style="width:50%;"
            placeholder="请输入真实姓名"
          />
        </el-form-item>
        <el-form-item prop="telephone">
          <el-col :span="5">
            <label>手机号：</label>
          </el-col>
          <el-input
            v-model.trim="addEditForms.telephone"
            type="text"
            style="width:50%;"
            placeholder="请输入手机号"
          />
        </el-form-item>
        <el-form-item prop="identity">
          <el-col :span="5">
            <label>身份证：</label>
          </el-col>
          <el-input
            v-model.trim="addEditForms.identity"
            type="text"
            style="width:50%;"
            placeholder="请输入身份证"
          />
        </el-form-item>
        <el-form-item prop="title ">
          <el-col :span="5">
            <label>员工角色：</label>
          </el-col>
          <el-input
            v-model.trim="addEditForms.title "
            type="text"
            style="width:50%;"
            placeholder="请输入员工角色"
          />
        </el-form-item>

        <el-form-item prop="description" style="margin-top:10px;">
          <el-col :span="5">
            <label>简介:</label>
          </el-col>
          <el-row :span="5">
            <el-button type="primary" size="small" @click="editQuill">点击添加员工简介</el-button>
            <span
              style="margin-left:10px;"
              :class="{true:'pass',false:'lock'}[QuillValues?true:false]"
            >{{ QuillValues?'(有编辑内容)':'(无编辑内容)' }}</span>
          </el-row>
        </el-form-item>
        <el-form-item prop="picture">
          <el-col>
            <label>
              员工头像
              <span class="specil">（图片最佳尺寸 170*120）</span>
            </label>
          </el-col>
          <FsImg
            :image-list1.sync="imageList"
            :add-img-btn="imageList.length<1"
            @cancelUpload="cancelUpload"
            @inputChangeFront="inputChangeFront"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="btnLoading" @click="EditMemberEvent()">确 定</el-button>
        <el-button @click="EditMemberCancel">取 消</el-button>
      </div>
    </el-dialog>
    <quillEditor
      :quill-editor="quillEditor"
      :quill-value.sync="QuillValue"
      @quillCancel="quillCancel"
    />
  </div>
</template>

<script>
const quillEditor = () => import('@/components/toolCom/quillEditor');
const FsImg = () => import('@/components/FsImg');
import { upload } from '@/fs';
export default {
  name: 'AddEdit',
  components: {
    quillEditor,
    FsImg
  },
  props: {
    addEditVisb: Boolean,
    addEditForm: Object,
    addEditTitle: String,
    QuillValues: String,
    picture: Array,
  },
  data() {
    return {
      btnLoading: false,
      addEditRules: {},
      rules: {
        telephone: [
          {
            validator: this.$rules.telExe,
            trigger: 'blur',
            required: true
          }
        ],
        identity: [
          {
            validator: this.$rules.identity,
            trigger: 'blur',
            required: true
          }
        ]
      },
      quillEditor: false,
    };
  },
  computed: {
    addEditForms: {
      get() {
        return this.addEditForm;
      },
      set(val) {
        this.$emit('update:addEditForm', val);
      }
    },
    level: {
      get() {
        return this.levels;
      },
      set(val) {
        this.$emit('update:levels', val);
      }
    },
    QuillValue: {
      get() {
        return this.QuillValues;
      },
      set(val) {
        this.$emit('update:QuillValues', val);
      }
    },
    imageList: {
      get() {
        return this.picture ? this.picture : [];
      },
      set(val) {
        this.$emit('update:picture', val);
      }
    },
  },
  created() {},
  methods: {
    EditMemberEvent() {
      this.addEditForms.brief = this.QuillValue;
      this.addEditForms.storeId = 1;
      this.$refs.addEditFormsRef.validate(valid => {
        if (!valid) return;
        if (
          this.addEditForms.identity &&
          this.addEditForms.realName &&
          this.addEditForms.telephone &&
          this.addEditForms.title &&
          this.addEditForms.brief
        ) {
          if (this.addEditForm.id) {
            delete this.addEditForm['createTime'];
            this.btnLoading = true;
            this.$http
              .post(`/member/adminUpdateMember`, {
                ...this.addEditForms,
                level: 'SALES',
                picture: this.picture.join(',')
              })
              .then(() => {
                this.btnLoading = false;
                this.$message.success('修改员工成功');
                this.EditMemberCancel();
              })
              .catch(err => {
                console.error(err);
                this.btnLoading = false;
              });
          } else {
            this.btnLoading = true;
            this.$http
              .post(`/member/adminAddMember`, {
                ...this.addEditForms,
                level: 'SALES',
                picture: this.picture.join(',')
              })
              .then(() => {
                this.$message.success('添加员工成功');
                this.EditMemberCancel();
                this.btnLoading = false;
              })
              .catch(err => {
                console.error(err);
                this.btnLoading = false;
              });
          }
        } else {
          return this.$message.warning('请完善表单内容!');
        }
      });
    },
    EditMemberCancel() {
      this.$emit('addEditCancel', false);
      this.addEditForms = {};
      this.QuillValue = '';
    },
    // 富文本--隐藏dialog
    quillCancel(val) {
      this.addEditForms.biref = val;
      this.quillEditor = false;
    },
    // 点击可编辑富文本
    editQuill() {
      this.quillEditor = true;
    },
    // 图片上传
    inputChangeFront(e) {
      upload(e).then(json => {
        this.imageList.push(json.code);
      });
      e.target.value = '';
    },
    // 点X取消已上传的图片
    cancelUpload() {
      this.imageList = [];
    },
  }
};
</script>

<style lang="less" scoped>
.img_list {
  width: 100%;
  height: auto;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  overflow: hidden;
  box-sizing: border-box;
  .upload {
    width: 25%;
    height: 125px;
    padding-top: 20px;
    box-sizing: border-box;
    border: 1px dashed grey;
    margin-top: 5px;
    text-align: center;
    position: relative;
    .icon-jiahao {
      width: 100%;
      height: 100%;
      font-size: 50px !important;
    }
    .file-id-front {
      opacity: 0;
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 5px !important;
    }
  }
  .divimg {
    width: 25%;
    height: 125px;
    position: relative;
  }
  img {
    width: 100%;
    height: 100%;
    padding: 5px 5px 0px 0px;
    box-sizing: border-box;
  }
  .icon-guanbi {
    position: absolute;
    top: 5px;
    right: 0px;
    font-size: 22px;
    color: #000;
  }
}
.red {
  color: #f56c6c;
  font-size: 13px;
}
.pass {
  color: #67c23a;
  font-weight: bold;
}
.lock {
  font-weight: bold;
  color: #f56c6c;
}
.model {
  position: fixed;
  width: 50%;
  height: 50%;
  left: 25%;
  top: 25%;
  z-index: 9999;
  background: rgba(0, 0, 0);
}

.model .croper {
  position: absolute;
  height: 50%;
  top: 50%;
  transform: translateY(-70%);
}

.model button:first-of-type {
  width: 15%;
  height: 8%;
  border: none;
  border-radius: 1vw;
  background: white;
  color: black;
  position: absolute;
  bottom: 10%;
  left: 40%;
  transform: translateX(-50%);
  outline: none;
}
.model button:last-of-type {
  width: 15%;
  height: 8%;
  border: none;
  border-radius: 1vw;
  background: white;
  color: black;
  position: absolute;
  bottom: 10%;
  left: 60%;
  transform: translateX(-50%);
  outline: none;
}
.prompt {
  height: 8%;
  border: none;
  border-radius: 1vw;
  color: white;
  position: absolute;
  top: 6%;
  left: 51%;
  -webkit-transform: translateX(-50%);
  transform: translateX(-50%);
  outline: none;
}
.fileimage {
  display: none;
}
.modelVisble {
  height: 500px;
}
</style>
