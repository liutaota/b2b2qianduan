<template>
  <div style="margin-left: 10px">
    <el-button v-permission="'IntegralRecordReset'"  type="primary" @click="addVersions= true" style="margin-top:10px" >新增版本</el-button>
    <!-- 表单 -->
    <Tabel
      ref="singleTable"
      :columns="columns"
      :table-data="giveRiseList"
      :loading="loading"
      :page-index="TotalList"
      @handleCurrent="handleCurrent"
      @handleSelectionChange="handleSelectionChange"
    >
    <el-table-column slot="handleColumn" label="操作" fixed="right">
      <template slot-scope="scope">
        <el-button
          size="mini"
          type="primary"
          @click="systemDialogVisible = true; form.type='SYSTEM'; form = {...scope.row}"
        >修改</el-button>
      </template>
    </el-table-column>
    </Tabel>

    <Pagination :total="total" @pagination="totalPagination" @handleSizeChange="handleSizeChange" />

    <el-dialog
      :visible.sync="systemDialogVisible"
      width="40%"
      :before-close="handleSystemClose"
      :close-on-click-modal="false"
    >
    <template slot="title">
      <div class="titleZise">
        <span>PDA版本修改</span>
      </div>
    </template>
    <el-form ref="form" :model="form" label-width="100px">
<!--      <el-form-item label="修改内容：">-->
<!--        <el-input v-model.trim="form.value" type="textarea" rows="4" resize="none" />-->
<!--      </el-form-item>-->
      <div v-model.trim="form.id"  hidden="hidden"></div>
      <el-form-item label="备注：">
        <el-input v-model.trim="form.remark" type="textarea" rows="4" resize="none" />

      </el-form-item>
      <el-form-item>
        <el-button
          size="mini"
          type="primary"
          @click="handleSystemReply"
        >修改</el-button>
      </el-form-item>
    </el-form>
    </el-dialog>

    <el-dialog :title="formTitle" :visible.sync="addVersions">
      <el-form :model="form">
        <el-form-item label="版本文件" label-width="7.5rem">

          <el-upload class="upload-demo" drag action=""
                     :http-request="uploadSectionFile"
                     :limit="1" >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          </el-upload>

          <el-progress v-show="progressFlag" :text-inside="true" :stroke-width="14" :percentage="progressPercent" status="success"></el-progress>
        </el-form-item>
        <el-form-item label="版本号" label-width="7.5rem">
          <el-input v-model="form.chinese" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注" label-width="7.5rem">
          <el-input v-model="form.english" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="sureFormSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  // import { _throttle } from '@/utils/public';
  import Pagination from '@/components/Pagination';
  const Tabel = () => import('@/components/Table');
  const Add = () => import('./components/add');
  import { upload } from '@/fs';
  import Tinymce from '@/components/Tinymce';
  import FsImg from '@/components/FsImg';

  export default {
    name: "PdaParameterSetting",
    components: {
      Pagination, Tabel,Add,Tinymce, FsImg
    },
    data() {
      return {
        //新增版本
        addVersions: false,
        addForm: {},
        loading: true,
        giveRiseList: [],
        // 页码
        total: 1,
        // 搜索
        TotalList: {
          size: 50,
          current: 1,
        },
        current: {},
        currentRow: {},
        erpCustomerId: null,
        recId: null,
        erpGoodsId: null,
        //修改弹窗
        systemDialogVisible: false,
        formTitle: '新增pda版本',//表单标题
        //对话框表单
        form: {
          chinese: '',
          english: '',
        },
        file: [],
        progressFlag: false,//进度条初始值隐藏
        progressPercent: 0,//进度条初始值
        uploadPercent:0,

        isShowImageDialog: false,
        showImageSrc: '',
        dialogImageUrl: '',
        dialogVisible: false,
        goodsInfo: {},
        loading: false,
        addFilePath:'',  //上传文件的返回路径


        columns: [
          {
            prop: 'version',
            label: '版本号',
            width: 200
          },
          {
            prop: 'createTime',
            label: '创建时间',
            width: 200
          },
          {
            prop: 'filePath',
            label: '文件路径',
            width: 600
          },
          {
            prop: 'remark',
            label: '备注信息',
            width: 300
          },
        ],

        ids: '',
        integralMask: false,
        integralForm: {
          content: '',
          chanScore: 0,
          remark: '',
        },
        memberId: null,
        createDate: [],
      };
    },
    created() {
      this.erpCustomerId = this.$route.query.erpCustomerId;
      this.recId = this.$route.query.recId;
      this.erpGoodsId = this.$route.query.erpGoodsId;
      console.log(this.recId,this.erpCustomerId,this.erpGoodsId)
      this.query();
    },
    methods: {
      uploadSectionFile (param) {
        //创建formdata对象，然后放文件进去
        let form = new FormData()
        form.append('file', param.file);
        //修改progressFlag值
        this.progressFlag = true;
        //axios的post提交，发送文件上传
        this.$http.post('pda/upload', form, {
          //请求头文件
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          onUploadProgress: progressEvent => {
            // progressEvent.loaded:已上传文件大小
            // progressEvent.total:被上传文件的总大小
            //进度条
            this.progressPercent = ((progressEvent.loaded / progressEvent.total) * 100) | 0;
          }
        }).then((res) => {
          //上传成功的方法
          console.log('上传结束')
          console.log(res)
          this.addFilePath = res.pdaPath;
          if(this.progressPercent == 100){
            this.progressFlag = false;
          }
          console.log(this.addFilePath)
          this.$message.success('上传成功');
        }).catch((err) => {
          console.log('上传错误')
          console.log(err);
          this.$message.error('上传错误');
        }).finally((res) => {

        })
      },

      //提交表单
      sureFormSubmit() {
        console.log(this.form.chinese,this.form.english,this.addFilePath);
        this.$http.get('pda/saveVersionDes',{
            params: {
              version:this.form.chinese,
              filePath: this.addFilePath,
              remark: this.form.english
            },
          }
        ).then((res) => {
          console.log(res);
          this.$message.success('新增版本成功');
          this.addVersions = false;
          this.query();
        }).catch((err) => {
          console.log(err);
          this.$message.error('新增版本错误');
        });
      },
      // 取消修改弹窗
      handleSystemClose() {
        this.systemDialogVisible = false;
      },
      // 修改
      handleSystemReply() {
        console.log(this.form.remark,this.form.id)
        if(this.form.remark !== undefined && this.form.remark !== '' ){
          this.$http.get('pda/updateRemark', { params: { id:this.form.id, newRemark: this.form.remark }}
          ).then(() => {
            this.$message.success('修改成功');
            this.handleSystemClose();
            this.query();
            this.form = {};
          });
        }else {
          this.$message.error('备注信息不能为空');
        }
      },
      //recId,erpCustomerId,erpGoodsId
      query() {
        this.loading = true;
         this.$http.get('pda/list', { params: { ...this.TotalList }}).then(res => {
          console.log(JSON.parse(JSON.stringify(res)));
          //console.log(res);
          this.giveRiseList = res.records;
          this.total = res.total;
        }).finally(() => {
          this.loading = false;
        });
      },

      // 分页
      totalPagination({ page: current, limit: size }) {
        this.TotalList.current = current;
        this.query();
      },
      handleSizeChange({ page: current, limit: size }) {
        this.TotalList.size = size;
        this.query();
      },

      // 选中行事件
      handleCurrent(val) {
        if (val === null) return;
        this.currentRow = { ...val };
      },
      handleSelectionChange(val) {
        let ids = '';
        val.map(item => {
          ids += item.id;
        });
        this.ids = ids;
      },
      systemHandleCancel() {
        this.addVersions = false;
        this.addForm = {};
      },
      handleEdit(form) {
        this.$http.post('setting/addSetting', { ...form }).then(res => {
          this.$message('新增pda版本成功');
          this.query();
          this.addVersions = false;
          this.addForm = {};
        });
      }
    }
  }
</script>

<style scoped>

</style>
