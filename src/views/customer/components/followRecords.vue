<template>
  <div>
    <div @click="EditMemberCancel">
      <el-dialog
        title="跟进记录"
        :show-close="false"
        :visible.sync="addEditVisb"
        :close-on-click-modal="false"
        width="55%"
      >
        <el-table
          v-loading="loading"
          :data="tableData"
          style="width:100%;height:578px"
          highlight-current-row
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(255,255,255,.6)"
        >
          <el-table-column fixed label="公司名称" prop="customerName" :formatter="textmatter" />
          <el-table-column label="跟进内容" width="170px" prop="message" :formatter="textmatter">
            <template slot-scope="props">
              <span
                style="cursor:pointer;color:#0754fe"
                @click.stop="infos(props.row.followContent)"
              >{{ props.row.followContent | answerMatter }}</span>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" prop="createTime" :formatter="textmatter" />
        </el-table>
        <pagination
          :total="total"
          style="margin-bottom:10px"
          @handleCurrentChange="handleCurrentChange"
          @handleSizeChange="handleSizeChange"
        />
      </el-dialog>
    </div>
    <el-dialog title="详情" :visible.sync="dialogDaanVisible2">
      <div style="width:100%;margin:30px 20px;">
        <p class="daan" v-html="dialogDaan" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'FollowRecords',
  components: {},
  filters: {
    answerMatter(val) {
      if (val) {
        return val.length > 15 ? val.substring(0, 15) + '...' : val;
      } else {
        return '-';
      }
    }
  },
  props: {
    addEditVisb: Boolean,
    tableData: Array,
    total: Number
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
        departmentName: [
          {
            validator: this.$rules.noEmpty,
            trigger: 'blur',
            required: true
          }
        ]
      },
      loading: false,

      dialogDaanVisible2: false,
      dialogDaan: '',
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
    }
  },
  created() {},
  methods: {
    EditMemberEvent() {
      this.$refs.addEditFormsRef.validate(valid => {
        if (!valid) return;
        if (this.addEditForms.departmentName) {
          if (this.addEditForm.id) {
            delete this.addEditForm['createTime'];
            this.btnLoading = true;
            this.$http
              .post(`/member/updateDepartment`, {
                ...this.addEditForms
              })
              .then(() => {
                this.btnLoading = false;
                this.$message.success('修改部门成功');
                this.EditMemberCancel();
              })
              .catch(err => {
                console.error(err);
                this.btnLoading = false;
              });
          } else {
            this.btnLoading = true;
            this.$http
              .post(`/member/addDepartment`, {
                ...this.addEditForms
              })
              .then(() => {
                this.$message.success('添加部门成功');
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
    handleSizeChange(val) {
      this.$emit('handleSizeChange', val);
    },
    handleCurrentChange(val) {
      this.$emit('handleCurrentChange', val);
    },
    // 文本格式化
    textmatter(row, column) {
      return row[column.property] ? row[column.property] : '-';
    },
    // 数值格式化
    nummatter(row, column) {
      return row[column.property] ? row[column.property] : 0;
    },
    moneymatter(row, column) {
      return row[column.property] / 100 ? row[column.property] / 100 : 0;
    },
    rate(row, column) {
      return row[column.property] / 10 ? row[column.property] / 10 : 0;
    },
    infos(val) {
      this.dialogDaanVisible2 = true;
      this.dialogDaan = val;
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
/deep/.el-table__body tr.current-row > td {
  background: #b5cbe2 !important;
}
</style>
