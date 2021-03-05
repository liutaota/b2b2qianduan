<template>
  <div style="margin: 0 10px">
    <!-- 样式预览 -->
    <Search @handleSubmit="imgPreview" />
    <div class="image_wrap">
      <!-- <el-image fit="contain" :src="dialogImageUrl" /> -->
      <FsImg v-if="form.imageInfoVoList[0].image" :src="form.imageInfoVoList[0].image" :style="{width:imgSize.width +'px',height:imgSize.height +'px',}" />
      <!-- <img :src="dialogImageUrl" alt=""> -->
    </div>
    <div class="EditForm">
      <el-form ref="ruleForm" :rules="rules" :model="form" label-width="120px" style="width:700px">
        <el-form-item label="广告名称" prop="advName" style="width:400px">
          <el-input v-model.trim="form.advName" />
        </el-form-item>
        <el-form-item label="默认图片" style="margin-bottom:15px;">
          <el-upload
            class="upload-demo"
            action=""
            multiple
            :limit="1"
            :show-file-list="false"
            :http-request="uploadImage"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
          <span
            v-if="form.imageInfoVoList[0].image"
            style="color:#13CE66"
          ><i class="el-icon-circle-check" />上传成功</span>
        </el-form-item>
        <el-form-item v-if="imgSize.width !== null" label="图片尺寸:" size="mini" style="color:#1890FF;font-size:12px">
          <p style="color:#1890FF;font-size: 12px;margin:0;">{{ imgSize.width }} * {{ imgSize.height }}</p>
        </el-form-item>
        <el-form-item label="小程序图片" style="margin-bottom:15px;">
          <el-upload
            class="upload-demo"
            action=""
            multiple
            :limit="1"
            :show-file-list="false"
            :http-request="uploadImageWX"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
          <span
            v-if="form.imageInfoVoList[0].imageWx"
            style="color:#13CE66"
          ><i class="el-icon-circle-check" />上传成功</span>
        </el-form-item>
        <el-form-item v-if="imgSize.width !== null" label="图片尺寸:" size="mini" style="color:#1890FF;font-size:12px">
          <p style="color:#1890FF;font-size: 12px;margin:0;">750*106</p>
        </el-form-item>
        <el-form-item label="点击事件" size="mini" prop="clickEvent" style="color:#1890FF;font-size:12px">
          <el-select v-model.trim="form.imageInfoVoList[0].clickEvent" placeholder="跳转网页链接" @change="openClickEvent">
            <el-option label="无点击事件" value="" />
            <el-option label="商品编号" value="erpGoodsId" />
            <el-option label=" 图片链接" value="imageUrl" />
            <el-option label=" 多商品" value="goodsName" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="form.imageInfoVoList[0].clickEvent === 'erpGoodsId'" label="商品编号" size="mini" style="color:#1890FF;font-size:12px">
          <el-input v-model.trim.number="form.imageInfoVoList[0].erpGoodsId" />
        </el-form-item>
        <el-form-item
          v-if="form.imageInfoVoList[0].clickEvent === 'imageUrl'"
          label="图片链接"
        >
          <el-input v-model.trim="form.imageInfoVoList[0].imageUrl" />
        </el-form-item>
        <el-form-item v-if="form.imageInfoVoList[0].clickEvent === 'goodsName'" label="多商品">
          <div style="display:flex;align-items: center;">
            <div class="goodsList">
              <span v-for="(item, indexs) of form.imageInfoVoList[0].goodsList" :key="indexs">{{ item.goodsName }}{{ indexs === form.imageInfoVoList[0].goodsList.length-1?'':'，' }}</span>
            </div>
            <el-button type="primary" @click="isShowGoods">选择</el-button>
          </div>
        </el-form-item>
        <!-- 客户集合 -->
        <el-form-item label="客户集合" prop="memberSetList">
          <div class="aggregate">
            <!-- <el-checkbox v-model.trim="form">全选</el-checkbox> -->
            <el-select v-model.trim="visibleSet[0].type" placeholder="请选择" @change="getMemberList">
              <el-option label="全部可见" value="ALL_VISIBLE" />
              <el-option label="部分可见" value="PARTIALLY_VISIBLE" />
            </el-select>
            <p class="goodsList" style="padding-left:10px;font-size:12px">
              <span
                v-for="(item, indexs) of visibleSet[0].memberSetList"
                :key="item.memberSetId"
              >{{ item.memberSetName }} {{ indexs === visibleSet[0].memberSetList.length - 1 ? '':'，' }}</span>
            </p>
            <el-link
              :type="visibleSet[0].type === 'ALL_VISIBLE'?'info':'primary'"
              :disabled="visibleSet[0].type === 'ALL_VISIBLE'?true:false"
              style="margin-right:10px"
              @click="customerCollection"
            >选择客户集合</el-link>
          </div>
        </el-form-item>
        <el-form-item label="开始时间" style="margin-bottom:15px;width:400px" prop="advStartDate">
          <el-date-picker
            v-model.trim="form.advStartDate"
            type="datetime"
            placeholder="选择时间"
            align="right"
            value-format="yyyy-MM-dd HH:mm:ss"
            :picker-options="pickerOptions"
          />
        </el-form-item>
        <el-form-item label="结束时间" style="margin-bottom:15px;width:400px" prop="advEndDate">
          <el-date-picker
            v-model.trim="form.advEndDate"
            type="datetime"
            placeholder="选择时间"
            align="right"
            value-format="yyyy-MM-dd HH:mm:ss"
            :picker-options="pickerOptions"
          />
        </el-form-item>
        <el-form-item label="是否启用" style="margin-bottom:15px;">
          <el-radio-group v-model.trim="form.isUse">
            <el-radio-button label="ON">是</el-radio-button>
            <el-radio-button label="OFF">否</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark" style="width:400px">
          <el-input v-model.trim="form.remark" type="textarea" />
        </el-form-item>
      </el-form>
    </div>
    <div style="text-align: center;margin:50px 0 0">
      <el-button type="primary" @click="onSubmit('ruleForm')">立即创建</el-button>
      <el-button @click="handleCancel">取消</el-button>
    </div>
    <keep-alive>
      <Popup :dialog-form-visible="popupMask" :goods-list="form.goodsList" @onSubmit="onSubmits" @cancel="cancel" />
    </keep-alive>
    <!-- 客户集合 -->
    <Transfer
      v-if="memberMask"
      :dialog-form-visible="memberMask"
      :goods-list="memberList"
      :aggregate="aggregate"
      @onSubmit="memberSubmit"
      @cancel="cancel"
    />
  </div>
</template>

<script>
import { upload } from '@/fs';
import { _throttle } from '@/utils/public';
// import { imgHost } from '@/config';
// import Popup from './popup';
import FsImg from '@/components/FsImg';
// import Search from './search';
// import Transfer from './Transfer';
const Transfer = () => import('./Transfer');
const Search = () => import('./search');
const Popup = () => import('./popup');
export default {
  components: {
    Search, FsImg, Popup, Transfer
  },
  data() {
    return {
      url: '',
      path: '',
      isShowImage: false,
      popupMask: false,
      memberMask: false,
      upload: false, // pc端图片上传
      uploadWX: false, // 小程序图片上传
      aggregate: '',
      memberList: [],
      visibleSet: [{
        type: 'ALL_VISIBLE',
        memberSetList: []
      }],
      form: {
        advName: '',
        imageInfoVoList: [
          {
            image: '',
            imageUrl: '',
            imageStartTime: '',
            imageEndTime: ''
          }
        ],
        advStartDate: '',
        advEndDate: '',
        isUse: 'OFF'
      },
      imgSize: {
        width: 1920,
        height: 80
      },
      // 日期
      pickerOptions: {
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date());
          }
        }, {
          text: '昨天',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24);
            picker.$emit('pick', date);
          }
        }, {
          text: '一周前',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', date);
          }
        }]
      },
      dialogImageUrl: '',
      // 表单验证规则
      rules: {
        advName: [
          { required: true, message: '请输入广告位名称', trigger: 'blur' },
        ],
        erpGoodsId: [
          { required: true, message: '商品编号不能为空' },
          { type: 'number', message: '商品编号必须为数字值' }
        ],
        imageUrl: [
          { required: true, message: '请填写活动形式', trigger: 'blur' }
        ],
        advStartDate: [
          { type: 'string', required: true, message: '请选择开始时间', trigger: 'change' }
        ],
        advEndDate: [
          { type: 'string', required: true, message: '请选择结束时间', trigger: 'change' }
        ],
      },
    };
  },
  created() {
    const { width, height } = this.$route.query;
    let { id } = this.$route.query;
    const index = this.$route.path.split('/');
    const path = index[index.length - 1];
    this.path = path;
    this.imgSize = {
      width, height
    };
    if (id !== undefined) {
      id = parseInt(id);
    }
    this.id = id || null;
    if (this.id === null) return;
    this.query(id);
  },
  methods: {
    query() {
      this.$http.get('advPosition/getAdvPositionById', { params: { id: this.id }}).then(res => {
        this.form = res;
        if (res.visibleSet === null) {
          res.visibleSet = [{
            type: 'ALL_VISIBLE',
            memberSetList: []
          }];
        }
        this.visibleSet = res.visibleSet;
        this.form.imageInfoVoList = JSON.parse(res.metaData).imageInfoVoList;
        delete this.form.visibleSet;
      });
    },
    // 客户集合全部可见清空
    getMemberList() {
      if (this.visibleSet[0].type === 'ALL_VISIBLE') {
        this.visibleSet[0].memberSetList = [];
      }
    },
    // 打开客户集合
    customerCollection: _throttle(function () {
      if (this.visibleSet[0].type === '') {
        this.$message.warning('请选择客户可见类型');
        return;
      }
      this.memberList = [];
      // 更改获取变量，让其可以再弹窗中接受
      this.visibleSet[0].memberSetList.forEach((item) => {
        const { memberSetId: customsetid, memberSetName: customsetname } = item;
        this.memberList.push({ customsetid, customsetname });
      });
      this.aggregate = {
        path: 'member/getAdminMemberList',
        listKey: {
          key: 'customsetid',
          label: 'customsetname',
        },
      };
      this.memberMask = true;
    }),
    // 确认客户集合
    memberSubmit: _throttle(function (e) {
      const memberList = [];
      // 更改原生变量重新赋值，让其符合后台接受
      e.forEach((item) => {
        const { customsetid: memberSetId, customsetname: memberSetName } = item;
        memberList.push({ memberSetId, memberSetName });
      });
      this.visibleSet[0].memberSetList = memberList;
      this.cancel();
    }),
    // 图片预览
    imgPreview() {
      this.isShowImage = true;
    },
    // 限制图片上传大小
    /**
     * 图片上传
     */
    uploadImage(e) {
      return upload(e.file)
        .then(data => {
          this.form.imageInfoVoList[0].image = data.code;
          this.$message.success('上传成功');
        });
    },
    uploadImageWX(e) {
      return upload(e.file)
        .then(data => {
          this.form.imageInfoVoList[0].imageWx = data.code;
          this.$message.success('上传成功');
          this.uploadWX = false;
        });
    },
    // 提交编辑
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.id === null) {
            this.handleSingleAdd();
          } else {
            console.log(2);
            this.handleSingleEdit();
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    // 页面设置头部拦截
    pageTopIntercept() {
      let message = '';
      if (this.visibleSet[0].type === undefined) {
        message = '请选择集合';
        return message;
      }
      if (
        this.visibleSet[0].memberSetList.length === 0 &&
        this.visibleSet[0].type !== 'ALL_VISIBLE'
      ) {
        message = '请选择客户集合';
        return message;
      }
    },
    judgeEventState(clickEvent, Event, message) {
      let isAticve = false;
      if (this.form.imageInfoVoList[0].clickEvent === clickEvent) {
        if (Event === '' || Event === undefined) {
          if (Event instanceof Array && Event.length !== 0) return;
          this.$message.warning(message);
          isAticve = true;
        }
      }
      return isAticve;
    },
    // 编辑
    handleSingleEdit() {
      const intercept = this.pageTopIntercept();
      if (this.judge() === undefined) return;
      this.form.imageInfoVoList[0].id = 1;
      if (intercept !== undefined) {
        this.$message.warning(intercept);
        return;
      }
      const { imageUrl, clickEvent, erpGoodsId } = this.form.imageInfoVoList[0];
      if (clickEvent === undefined) {
        this.$message.warning('请选择点击事件');
        return;
      }
      if (this.judgeEventState('imageUrl', imageUrl, '请输入图片链接')) return;
      if (this.judgeEventState('erpGoodsId', erpGoodsId, '请输入商品编号')) return;
      if (this.judgeEventState('goodsName', this.form.imageInfoVoList[0].goodsList, '请选择商品')) return;
      // return;
      this.$http.post('advPosition/updateAdvPosition', { ...this.form, apDisplay: this.path, visibleSet: this.visibleSet }).then(res => {
        this.$message.success('编辑成功');
        this.query();
        this.$router.push({ path: 'apList' });
      });
    },
    // 新增
    handleSingleAdd() {
      const intercept = this.pageTopIntercept();
      if (this.judge() === undefined) return;
      this.form.imageInfoVoList[0].id = 1;
      if (intercept !== undefined) {
        this.$message.warning(intercept);
        return;
      }
      const { imageUrl, clickEvent, erpGoodsId } = this.form.imageInfoVoList[0];
      if (clickEvent === undefined) {
        this.$message({
          message: '请选择点击事件',
          type: 'warning'
        });
        return;
      }
      if (this.judgeEventState('imageUrl', imageUrl, '请输入图片链接')) return;
      if (this.judgeEventState('erpGoodsId', erpGoodsId, '请输入商品编号')) return;
      if (this.judgeEventState('goodsName', this.form.imageInfoVoList[0].goodsList, '请选择商品')) return;
      this.$http.post('advPosition/addAdvPosition', { ...this.form, apDisplay: this.path, visibleSet: this.visibleSet }).then(res => {
        this.$message({
          message: '添加成功',
          type: 'success'
        });
        this.$router.push({ path: 'apList' });
      });
    },
    // 点击事件切换
    openClickEvent(e) {
      delete this.form.imageInfoVoList[0].imageUrl;
      delete this.form.imageInfoVoList[0].erpGoodsId;
      delete this.form.imageInfoVoList[0].goodsList;
    },
    // 取消编辑
    handleCancel: _throttle(function(formName) {
      this.$router.push({ path: 'apList' });
    }),
    // 打开弹窗
    isShowGoods: _throttle(function() {
      this.popupMask = true;
      this.form.goodsList = [...this.form.imageInfoVoList[0].goodsList];
    }),
    // 取消弹窗
    cancel() {
      this.popupMask = false;
      this.memberMask = false;
      this.aggregate = {};
    },
    // 接受弹窗数据
    onSubmits(e) {
      this.form.imageInfoVoList[0].goodsList = [...e];
      this.cancel();
    },
    // 判断是否图片
    judge() {
      let isImage = false;
      isImage = this.form.imageInfoVoList.some(item => {
        return item.image === '';
      });
      if (isImage) {
        this.$message({
          message: '图片为空',
          type: 'warning'
        });
        return;
      }
      return { isImage };
    },
  }
};
</script>

<style scoped lang="less">
.image_wrap{
    text-align: center;
    margin: 10px 0;
    padding: 35px 0;
    border-top: 1px solid #D3D3D3;
    border-bottom: 1px solid #D3D3D3;
}
.el-form{
    .el-input{
    width: 80%;

    }
}
.goodsList{
  width:56%;
  height:30px;
  border:1px solid #DCDFE6;
  border-radius: 4px;
  display: inline-block;
  margin-right:10px;
  font-size:12px;
  color: #9a9a9a;
  padding-left: 5px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
// 客户集合
.aggregate {
  display: flex;
  p {
    width: 250px;
    height: 30px;
    margin: 0 10px;
    padding: 0;
    border: 1px solid #dcdfe6;
    border-radius: 3px;
  }
}
</style>
