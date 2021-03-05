<template>
  <div style="margin: 10px">
    <!-- <Screen @query="query" /> -->
    <el-tabs type="card">
      <el-tab-pane v-permission="'ParameterListSet'" label="商城设置">
        <el-button
          v-permission="'ParameterListAdd'"
          type="primary"
          @click="
            storeDeliveryAdd = true;
            type = 'SYSTEM';
          "
          >新增数据</el-button
        >
        <Tabel
          :columns="storeColumns"
          :table-data="storeList"
          :loading="storeLoading"
          :page-index="storeForm"
          @handleCurrent="storeCurrent"
        >
          <el-table-column slot="handleColumn" label="操作" fixed="right">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="
                  storeDialogVisible = true;
                  form.type = 'STORE';
                  form = { ...scope.row };
                "
                >修改</el-button
              >
            </template>
          </el-table-column>
        </Tabel>
        <Pagination
          :total="storeTotal"
          @pagination="storePagination"
          @handleSizeChange="handleStoreSizeChange"
        />
      </el-tab-pane>
      <el-tab-pane v-permission="'ParameterList'" label="系统参数">
        <div
          class="screen"
          style="margin-bottom:10px"
          v-permission="'ParameterListScreen'"
        >
          <el-input
            v-model.trim="systemForm.name"
            placeholder="请输入名称"
            style="width: 140px; margin-right: 13px"
            clearablex
          />
          <el-button type="primary" style="margin-top: 10px" @click="query()"
            >查询</el-button
          >
          <el-button
            type="info"
            @click="
              systemForm = {
                size: 50,
                current: 1,
                type: null
              };
              query();
            "
            >重置</el-button
          >
        </div>
        <el-button
          v-permission="'ParameterListAdd'"
          type="primary"
          @click="
            type = 'SYSTEM';
            systemDeliveryAdd = true;
          "
          >新增数据</el-button
        >
        <Tabel
          :columns="systemColumns"
          :table-data="systemList"
          :loading="systemLoading"
          :page-index="systemForm"
          @handleCurrent="systemCurrent"
        >
          <el-table-column slot="handleColumn" label="操作" fixed="right">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="
                  systemDialogVisible = true;
                  form.type = 'SYSTEM';
                  form = { ...scope.row };
                "
                >修改</el-button
              >
            </template>
          </el-table-column>
        </Tabel>
        <Pagination
          :total="systemTotal"
          @pagination="systemPagination"
          @handleSizeChange="handleSystemSizeChange"
        />
      </el-tab-pane>

      <el-tab-pane v-permission="'ParameterList'" label="APP版本更新">
        <Tabel
          :columns="APPColumns"
          :table-data="APPList"
          :loading="APPLoading"
          :page-index="APPQueryFrom"
          @handleCurrent="systemCurrent"
        >
          <el-table-column slot="handleColumn" label="操作" fixed="right">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="
                  addVersions = true;
                  form = { ...scope.row };
                  form.value = '';
                "
                v-if="scope.row.key === 'APP_LINK'"
                >上传</el-button
              >
              <el-button
                size="mini"
                type="primary"
                v-else
                @click="
                  systemDialogVisible = true;
                  form.type = 'SYSTEM';
                  form = { ...scope.row };
                "
                >修改</el-button
              >
            </template>
          </el-table-column>
        </Tabel>
      </el-tab-pane>
    </el-tabs>
    <el-dialog
      :visible.sync="storeDialogVisible"
      width="40%"
      :before-close="handleStoreClose"
      :close-on-click-modal="false"
    >
      <template slot="title">
        <div class="titleZise">
          <span>商城设置修改</span>
        </div>
      </template>
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="键：">
          <el-input v-model.trim="form.key" disabled resize="none" />
        </el-form-item>
        <el-form-item label="值：">
          <el-input v-model.trim="form.value" resize="none" />
        </el-form-item>
        <el-form-item label="备注：">
          <el-input v-model.trim="form.remark" resize="none" />
        </el-form-item>
        <el-form-item>
          <el-button size="mini" type="primary" @click="handleStoreReply"
            >修改</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog
      :visible.sync="systemDialogVisible"
      width="40%"
      :before-close="handleSystemClose"
      :close-on-click-modal="false"
    >
      <template slot="title">
        <div class="titleZise">
          <span>系统参数修改</span>
        </div>
      </template>
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="修改内容：">
          <el-input
            v-model.trim="form.value"
            type="textarea"
            rows="4"
            resize="none"
          />
        </el-form-item>
        <el-form-item label="备注：">
          <el-input
            v-model.trim="form.remark"
            type="textarea"
            rows="4"
            resize="none"
          />
        </el-form-item>
        <el-form-item>
          <el-button size="mini" type="primary" @click="handleSystemReply"
            >修改</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="APP上传" :visible.sync="addVersions" width="600px">
      <el-form :model="form">
        <el-form-item label="版本文件" label-width="7.5rem">
          <el-upload
            class="upload-demo"
            drag
            action=""
            :http-request="uploadImage"
            :limit="1"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              将文件拖到此处，或<em>点击上传</em>
            </div>
          </el-upload>

          <el-progress
            v-show="progressFlag"
            :text-inside="true"
            :stroke-width="14"
            :percentage="progressPercent"
            status="success"
          ></el-progress>
        </el-form-item>
        <el-form-item label="版本号" label-width="7.5rem">
          <el-input v-model="form.version" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="value"  label-width="7.5rem">
          <el-input v-model="form.value" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注" label-width="7.5rem">
          <el-input v-model="form.remark" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSystemReply">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 新增 -->
    <Edit
      :dialog-form-visible="systemDeliveryAdd"
      :type="type"
      :titles="'新增'"
      :form="addForm"
      @handleCancel="systemHandleCancel"
      @handleEdit="handleEdit"
    />
  </div>
</template>

<script>
import Tabel from "@/components/Table";
const Pagination = () => import("@/components/Pagination");
const Edit = () => import("./components/Edit");
import { upload } from '@/fs';
import { ossUrl } from '@/config';
export default {
  name: "Parameter",
  components: {
    Tabel,
    Pagination,
    Edit
  },
  data() {
    return {
      // 系统参数
      systemLoading: false,
      queryUrl: "setting/getSettingList",
      updateUrl: "setting/updateSetting",
      addUrl: "setting/addSetting",
      systemForm: {
        size: 50,
        current: 1,
        type: null
      },
      systemColumns: [
        {
          prop: "name",
          label: "名称"
        },
        {
          prop: "key",
          label: "key"
        },
        {
          prop: "value",
          label: "value"
        },
        {
          prop: "remark",
          label: "备注"
        }
      ],
      systemList: [],
      systemTotal: 0,
      // 商城设置
      storeLoading: false,
      storeForm: {
        size: 50,
        current: 1,
        type: null
      },
      storeColumns: [
        {
          prop: "key",
          label: "键"
        },
        {
          prop: "value",
          label: "值"
        },
        {
          prop: "remark",
          label: "备注"
        }
      ],
      storeList: [],
      storeTotal: 0,
      // 弹窗
      storeDialogVisible: false,
      systemDialogVisible: false,
      storeDeliveryAdd: false,
      systemDeliveryAdd: false,
      storeDeliveryEdit: false,
      systemDeliveryEdit: false,
      form: {
        type: null
      },
      addForm: {},
      type: "", // 新增参数类型
      APPColumns: [
        {
          prop: "name",
          label: "名称"
        },
        {
          prop: "key",
          label: "key"
        },
        {
          prop: "value",
          label: "value"
        },
        {
          prop: "remark",
          label: "备注"
        }
      ],
      APPList: [],
      APPLoading: false,
      APPForm: {},
      progressFlag: false, //进度条初始值隐藏
      progressPercent: 0, //进度条初始值
      APPQueryFrom: { size: 50, current: 1 },
      addFilePath: null,
      addVersions: false
    };
  },
  created() {
    this.query();
  },
  methods: {
    uploadImage(e) {
      const fileName = e.file.fileName || e.file.name;
      return upload(e.file,'uploadPri','existPri')
        .then(data => {
          this.form.value = 'http://oss.gdztyy.com/b2b/' + data.code;
          this.$message.success('上传成功');
        });
    },
    uploadSectionFile(param) {
      //创建formdata对象，然后放文件进去
      let form = new FormData();
      form.append("file", param.file);
      //修改progressFlag值
      this.progressFlag = true;
      //axios的post提交，发送文件上传
      this.$http
        .post("app/uploadFile", form, {
          //请求头文件
          headers: {
            "Content-Type": "multipart/form-data"
          },
          onUploadProgress: progressEvent => {
            // progressEvent.loaded:已上传文件大小
            // progressEvent.total:被上传文件的总大小
            //进度条
            this.progressPercent =
              ((progressEvent.loaded / progressEvent.total) * 100) | 0;
          }
        })
        .then(res => {
          //上传成功的方法
          this.form.value = ossUrl + res.code;
          if (this.progressPercent == 100) {
            this.progressFlag = false;
          }
          this.$message.success("上传成功");
        })
        .catch(err => {
          this.$message.error("上传错误");
        })
        .finally(res => {});
    },
    //提交表单
    sureFormSubmit() {
      console.log(this.form.chinese, this.form.english, this.addFilePath);
      this.$http
        .get("pda/saveVersionDes", {
          params: {
            version: this.form.chinese,
            filePath: this.addFilePath,
            remark: this.form.english
          }
        })
        .then(res => {
          this.$message.success("新增版本成功");
          this.addVersions = false;
          this.query();
        })
        .catch(err => {
          this.$message.error("新增版本错误");
        });
    },
    // 系统设置
    query() {
      this.$http
        .get(this.queryUrl, { params: { ...this.storeForm, type: "STORE" } })
        .then(res => {
          this.storeList = res.records;
          this.storeTotal = res.total;
        });
      this.$http
        .get(this.queryUrl, { params: { ...this.systemForm, type: "SYSTEM" } })
        .then(res => {
          // 过滤app版本上传数据
          this.systemList = res.records.filter(
            item => item.key !== "APP_LINK" && item.key !== "APP_VERSION"
          );
          // 筛选app上传数据
          this.APPList = res.records.filter(
            item => item.key === "APP_LINK" || item.key === "APP_VERSION"
          );
          this.systemTotal = res.total;
        });
    },
    // 商城设置修改
    handleStoreReply() {
      this.form.type = "STORE";
      this.$http.post(this.updateUrl, { ...this.form }).then(() => {
        this.$message.success("修改成功");
        this.handleStoreClose();
        this.query();
        this.form = {};
      });
    },
    APPUpdate() {},
    // 商城设置选中行
    storeCurrent() {},
    // 商城设置分页
    storePagination({ page: current, limit: size }) {
      this.goodsForm.current = current;
      this.query();
    },
    handleStoreSizeChange({ page: current, limit: size }) {
      this.goodsForm.size = size;
      this.query();
    },
    // 系统参数修改
    handleSystemReply() {
      this.form.type = "SYSTEM";
      this.$http.post(this.updateUrl, { ...this.form }).then(() => {
        this.$message.success("修改成功");
        this.handleSystemClose();
        this.query();
        this.form = {};
        this.addVersions = false;
      });
    },
    // 系统参数选中行
    systemCurrent() {},
    // 系统参数分页
    systemPagination({ page: current, limit: size }) {
      this.platformForm.current = current;
      this.query();
    },
    handleSystemSizeChange({ page: current, limit: size }) {
      this.platformForm.size = size;
      this.query();
    },
    // 取消商城设置弹窗
    handleStoreClose() {
      this.storeDialogVisible = false;
    },
    // 取消系统参数弹窗
    handleSystemClose() {
      this.systemDialogVisible = false;
    },
    // 取消
    storeHandleCancel() {
      this.storeDeliveryEdit = false;
      this.storeDeliveryAdd = false;
      this.current = {};
    },
    systemHandleCancel() {
      this.systemDeliveryEdit = false;
      this.systemDeliveryAdd = false;
      this.current = {};
      this.addForm = {};
    },
    handleEdit(form) {
      this.$http.post("setting/addSetting", { ...form }).then(res => {
        this.$message("新增参数成功");
        this.query();
        this.systemDeliveryAdd = false;
        this.addForm = {};
      });
    }
  }
};
</script>

<style>
.titleZise {
  padding: 10px 0;
  border-bottom: 1px solid #c0c4cc;
  color: #606266;
}
</style>
