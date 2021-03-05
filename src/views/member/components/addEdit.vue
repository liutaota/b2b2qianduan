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
        <el-form-item prop="role">
          <el-col :span="5">
            <label><span class="lock">*</span>角色权限：</label>
          </el-col>
          <el-select v-model.trim="role" class="modInput">
            <el-option
              v-for="(item,index) in eRole"
              :key="index"
              :label="item.desc"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="departmentId">
          <el-col :span="5">
            <label><span class="lock">*</span>归属部门：</label>
          </el-col>
          <el-select v-model.trim="departmentId" class="modInput">
            <el-option
              v-for="(item,index) in eDepartment"
              :key="index"
              :label="item.desc"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="realName ">
          <el-col :span="5">
            <label><span class="lock">*</span>用户名称：</label>
          </el-col>
          <el-input
            v-model.trim="addEditForms.realName "
            type="text"
            style="width:250px;"
            placeholder="请输入用户名称"
          />
        </el-form-item>
        <el-form-item prop="telephone">
          <el-col :span="5">
            <label><span class="lock">*</span>手机号（登录账户）：</label>
          </el-col>
          <el-input
            v-model.trim="addEditForms.telephone"
            type="text"
            style="width:250px;"
            placeholder="请输入手机号"
          />
          <span class="red">初始密码默认为手机号</span>
        </el-form-item>
        <el-form-item prop="duty ">
          <el-col :span="5">
            <label><span class="lock">*</span>职务：</label>
          </el-col>
          <el-input v-model.trim="addEditForms.duty " type="text" style="width:250px;" placeholder="请输入职务" />
        </el-form-item>
        <el-form-item prop="entryTime">
          <el-col :span="5">
            <label><span class="lock">*</span>入职日期：</label>
          </el-col>
          <el-date-picker
            v-model.trim="addEditForms.entryTime"
            type="date"
            align="right"
            placeholder="入职日期"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptions"
            style="margin-right:13px ;width: 250px;"
            @change="changeTime"
          />
        </el-form-item>

        <el-form-item prop="positiveTime">
          <el-col :span="5">
            <label><span class="lock">*</span>转正日期：</label>
          </el-col>
          <el-date-picker
            v-model.trim="addEditForms.positiveTime"
            type="date"
            align="right"
            placeholder="转正日期"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptionss"
            style="margin-right:13px ;width: 250px;"
            @change="changeTimes"
          />
        </el-form-item>
        <!-- <el-form-item prop="description" style="margin-top:10px;">
          <el-col :span="5">
            <label>简介:</label>
          </el-col>
          <el-row :span="5">
            <el-button type="primary" size="small" @click="editQuill">点击添加员工简介</el-button>
            <span
              style="margin-left:10px;"
              v-bind:class="{true:'pass',false:'lock'}[QuillValues?true:false]"
            >{{QuillValues?'(有编辑内容)':'(无编辑内容)'}}</span>
          </el-row>
        </el-form-item>-->
        <!-- <el-form-item prop="picture">
          <el-col>
            <label>
              员工头像
              <span class="specil">（图片最佳尺寸 170*120）</span>
            </label>
          </el-col>
          <fsImg
            :imageList1.sync="imageList"
            @cancelUpload="cancelUpload"
            @inputChangeFront="inputChangeFront"
            :addImgBtn="imageList.length<1"
          ></fsImg>
        </el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="btnLoading" @click="EditMemberEvent()">确 定</el-button>
        <el-button @click="EditMemberCancel">取 消</el-button>
      </div>
    </el-dialog>
    <!-- <quillEditor
      :quillEditor="quillEditor"
      :QuillValue.sync="QuillValue"
      @quillCancel="quillCancel"
    ></quillEditor>-->
  </div>
</template>

<script>
// const quillEditor = () => import("@/components/toolCom/quillEditor");
// const fsImg = () => import("@/components/fsImg");
import { statusGlobalData } from '@/filters';
// import { upload } from "@/fs";
export default {
  name: 'AddEdit',
  components: {
    // quillEditor
    // fsImg
  },
  props: {
    addEditVisb: Boolean,
    addEditForm: Object,
    addEditTitle: String,
    departmentIds: String,
    roles: String
  },
  data() {
    return {
      btnLoading: false,
      addEditRules: {},
      rules: {},
      quillEditor: false,
      eDepartment: [],
      eRole: [],
      statusGlobalData,
      pickerOptions: {
        shortcuts: [
          {
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date());
            }
          },
          {
            text: '昨天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', date);
            }
          },
          {
            text: '一周前',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', date);
            }
          }
        ]
      },
      pickerOptionss: {
        shortcuts: [
          {
            text: '一个月',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 30);
              picker.$emit('pick', date);
            }
          },
          {
            text: '两个月',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 60);
              picker.$emit('pick', date);
            }
          },
          {
            text: '三个月',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 90);
              picker.$emit('pick', date);
            }
          }
        ]
      }
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
    departmentId: {
      get() {
        return this.departmentIds;
      },
      set(val) {
        this.$emit('update:departmentIds', val);
      }
    },
    role: {
      get() {
        return this.roles;
      },
      set(val) {
        this.$emit('update:roles', val);
      }
    }
  },
  created() {
    this.eRole = this.statusGlobalData.role;
    this.getDepartment();
  },
  methods: {
    EditMemberEvent() {
      this.$refs.addEditFormsRef.validate(valid => {
        if (!valid) return;
        if (
          this.addEditForms.duty &&
          this.addEditForms.realName &&
          this.addEditForms.telephone &&
          this.departmentId &&
          this.role &&
          this.addEditForms.positiveTime &&
          this.addEditForms.entryTime
        ) {
          if (this.addEditForm.id) {
            delete this.addEditForm['createTime'];
            this.btnLoading = true;
            this.$http
              .post(`/member/updateMember`, {
                ...this.addEditForms,
                role: this.role,
                departmentId: Number(this.departmentId)
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
              .post(`/member/addMember`, {
                ...this.addEditForms,
                role: this.role,
                departmentId: Number(this.departmentId),
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

    // 获取所有部门
    getDepartment() {
      this.$http
        .get('/member/getDepartmentList', {
          params: {}
        })
        .then(data => {
          const departmentList = data.records;
          departmentList.map(item => {
            this.eDepartment.push({
              desc: item.departmentName,
              value: String(item.id)
            });
          });
        })
        .catch(err => {
          console.error(err);
        });
    },
    // 选择时间
    changeTime() {
      this.addEditForms.entryTime = this.addEditForms.entryTime + ' ' + '00:00:00';
    },
    // 选择时间
    changeTimes() {
      this.addEditForms.positiveTime = this.addEditForms.positiveTime + ' ' + '00:00:00';
    }
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
