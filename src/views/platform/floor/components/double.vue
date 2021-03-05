<template>
  <!-- 标签楼层 -->
  <div style="margin: 0 10px">
    <!-- 样式预览 -->
    <keep-alive>
      <Search @handleSubmit="imgPreview" />
    </keep-alive>
    <div class="image_wrap">
      <div v-for="(item,indexs) of form.tabs" :key="indexs">
        <FsImg v-if="item.code" fit="contain" :src="item.code" :class="imageStyle" />
      </div>
    </div>
    <div class="EditForm">
      <el-form ref="ruleForm" :rules="rules" :model="form" label-width="100px" style="width:45%">
        <el-form-item label="楼层名称" prop="title">
          <el-input v-model.trim="form.title" />
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
        <el-form-item label="广告图片">
          <p style="color:#13CE66;margin:0">尺寸：240*600px</p>
          <div class="commodity_image_wrap">
            <div class="commodity_image">
              <el-upload
                class="avatar-uploader"
                action=""
                :show-file-list="false"
                style="margin-right: 15px"
                :on-success="handleAvatarSuccess"
                :http-request="uploadImage"
              >
                <FsImg v-if="form.advImage" :src="form.advImage" class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon" style="border: 1px dashed #d9d9d9;border-radius: 6px;cursor: pointer;position: relative;overflow: hidden;" />
              </el-upload>
            </div>
            <div class="clickEvent">
              <el-select
                v-model.trim="form.clickEvent"
                placeholder="跳转网页链接"
                style="margin-bottom:10px"
                @change="openClickEvent"
              >
                <el-option label="无点击事件" value />
                <el-option label="商品编号" value="erpGoodsId" />
                <el-option label="图片链接" value="advImageUrl" />
                <el-option label="多商品" value="goodsName" />
              </el-select>
              <div style="margin:0 auto">
                <el-input
                  v-if="form.clickEvent === 'erpGoodsId'"
                  v-model.trim.number="form.erpGoodsId"
                  placeholder="请输入商品编号"
                />
                <el-input
                  v-if="form.clickEvent === 'advImageUrl'"
                  v-model.trim.number="form.advImageUrl"
                  placeholder="请输入图片链接"
                />
                <div v-if="form.clickEvent === 'goodsName'" style="margin:4px 0">
                  <div class="goodsList">
                    <span
                      v-for="(items, i) of form.goodsList"
                      :key="i"
                    >{{ items.goodsName }}{{ i === items.length-1?'':'，' }}</span>
                  </div>
                  <br>
                  <el-button type="primary" @click="openGoods">选择</el-button>
                </div>
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="小程序图片">
          <p style="color:#13CE66;margin:0">尺寸：700*240px</p>
          <div class="commodity_image_wrap">
            <div class="commodity_image">
              <el-upload
                class="avatar-uploader"
                action=""
                :show-file-list="false"
                style="margin-right: 15px"
                :on-success="handleAvatarSuccessWX"
                :http-request="uploadImageWX"
              >
                <FsImg v-if="form.advImageWx" :src="form.advImageWx" class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon" style="border: 1px dashed #d9d9d9;border-radius: 6px;cursor: pointer;position: relative;overflow: hidden;" />
              </el-upload>
            </div>
          </div></el-form-item>
        <el-form-item label="楼层色号" prop="hue">
          <div style="display:flex;align-items: center;">
            <el-color-picker v-model.trim="form.hue" size="medium" /><span style="margin-left:10px">{{ form.hue }}</span>
          </div>
        </el-form-item>
        <el-form-item label="楼层KEY" prop="floorKey">
          <el-input v-model.trim="form.floorKey" />
        </el-form-item>
        <el-form-item label="备注" prop="remark" style="width:400px">
          <el-input v-model.trim="form.remark" type="textarea" />
        </el-form-item>
      </el-form>
      <table style="width:100%;font-size:14px;text-align: center;color:#606266" border="0" cellspacing="0" cellpadding="10">
        <thead style="background: #F3F3F3">
          <td style="width:60px">序号</td>
          <td>页签名称</td>
          <td>商品选择</td>
          <td style="width:200px">排序</td>
          <td style="width:200px" @click="addImg"><i class="el-icon-circle-plus-outline" /> 添加</td>
        </thead>
        <tr v-for="(item,indexs) of form.tabs" :key="indexs">
          <td>{{ indexs + 1 }}</td>
          <td style="width:50%">
            <el-input v-model.trim="item.title" style="width:50%" />
          </td>
          <td>
            <div style="display:flex;justify-content: center;align-items: center;">
              <div class="goodsList">
                <span v-for="(items,i) of item.goodsList" :key="items.goodsId">{{ items.goodsName }}{{ i === item.goodsList.length-1?'':',' }}</span>
              </div>
              <el-button type="primary" @click="openGoodsTransfer(item.goodsList, indexs)">选择</el-button>
            </div>
          </td>
          <td>
            <!-- 前进一位 -->
            <span
              class="el-icon-caret-top"
              style="font-weight: 900;cursor: pointer;font-size:18px"
              @click="riseClassify(indexs,form.tabs)"
            />
            <!-- 后退一位 -->
            <span
              class="el-icon-caret-bottom"
              style="font-weight: 900;cursor: pointer;font-size:18px;margin-left:15px"
              @click="dropClassify(indexs,form.tabs)"
            />
          </td>
          <td style="color:red">
            <span @click="deleteImage(indexs)">
              <i class="el-icon-delete-solid" />
              删除
            </span>
          </td>
        </tr>
      </table>
    </div>
    <div style="text-align: center;margin:50px 0 20px">
      <el-button type="primary" @click="onSubmit('ruleForm')">{{ title }}</el-button>
      <el-button @click="handleCancel('ruleForm')">取消</el-button>
    </div>
    <Popup :dialog-form-visible="popupMask" :goods-list="goodsList" @onSubmit="onSubmits" @cancel="cancel" />
    <Popup
      v-if="goodsMask"
      :dialog-form-visible="goodsMask"
      :goods-list="goodsList"
      @onSubmit="onGoodsSubmits"
      @cancel="cancel"
    />
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
// import { imgHost } from '@/config';
import { _throttle } from '@/utils/public';
import { upload } from '@/fs';
const Popup = () => import('./popup');
const Search = () => import('./search');
const Transfer = () => import('./Transfer');
const FsImg = () => import('@/components/FsImg');
export default {
  components: {
    Search, Popup, FsImg, Transfer
  },
  data() {
    return {
      url: '',
      id: null,
      path: '',
      form: {
        advImage: '',
        advImageUrl: '',
        advImageWx: '',
        hue: '',
        title: '',
        tabs: [],
      },
      title: '立即创建',
      index: 0,
      imageList: [],
      dialogImageUrl: '',
      // 表单验证规则
      rules: {
        title: [
          { required: true, message: '请输入楼层名称', trigger: 'blur' },
        ],
        floorKey: [
          { required: true, message: '请输入楼层KEY', trigger: 'blur' },
        ],
        advImageUrl: [
          { required: true, message: '此项必填', trigger: 'blur' },
        ],
        hue: [
          { required: true, message: '请选择色号', trigger: 'blur' },
        ],
        tabsName: [
          { required: true, message: '请输入页签名称', trigger: 'blur' },
        ],
        floorSort: [
          { required: true, message: '排序不能为空' },
          { type: 'number', message: '排序必须为数字值' }
        ]
      },
      imageStyle: 'more_little',
      popupMask: false,
      goodsList: [],
      goodsMask: false,
      visibleSet: [{ // 客户数据
        type: 'ALL_VISIBLE',
        memberSetList: []
      }],
      memberMask: false, // 客户集合弹窗
      aggregate: '',
      memberList: [], // 客户集合数据
      dialogImageUrlWX: '',
    };
  },
  mounted() {
    let { id } = this.$route.query;
    const pathArr = this.$route.path.split('/');
    const path = pathArr[pathArr.length - 1];
    this.path = path;
    if (id !== undefined) {
      id = parseInt(id);
    }
    this.id = id || null;
    if (this.id === null) return;
    this.title = '编辑';
    this.query(id);
  },
  methods: {
    query() {
      this.$http.get('advPosition/getFloorById', { params: { id: this.id }}).then(res => {
        const { tabs, title, advImage, hue, advImageUrl, advImageWx, floorKey, clickEvent, goodsList, erpGoodsId } = res;
        this.form.advImage = res.advImage;
        this.dialogImageUrl = res.advImage;
        this.form = {
          tabs, title, advImage, hue, advImageUrl, floorKey, clickEvent, goodsList, erpGoodsId, advImageWx
        };
        if (res.visibleSet === null) {
          res.visibleSet = [{ // 客户数据
            type: 'ALL_VISIBLE',
            memberSetList: []
          }];
        }
        this.visibleSet = res.visibleSet;
      });
    },
    // 图片预览
    imgPreview() {
      if (this.form.advImage) {
        this.dialogImageUrl = this.form.advImage;
      }
    },
    handleAvatarSuccess(res, file) {
      this.dialogImageUrl = URL.createObjectURL(file.raw);
    },
    handleAvatarSuccessWX(res, file) {
      this.dialogImageUrlWX = URL.createObjectURL(file.raw);
    },
    /**
     * 图片上传
     */
    uploadImage(e) {
      return upload(e.file)
        .then(data => {
          this.form.advImage = data.code;
          this.$message.success('上传成功');
        });
    },
    uploadImageWX(e) {
      return upload(e.file)
        .then(data => {
          this.form.advImageWx = data.code;
          this.$message.success('上传成功');
        });
    },
    // 打开商品选择
    openGoodsTransfer: _throttle(function(e, i) {
      this.index = i;
      this.goodsList = this.form.tabs[i].goodsList;
      this.popupMask = true;
    }),
    // 删除
    deleteImage: _throttle(function(i) {
      this.$confirm('确认删除？').then(_ => {
        this.form.tabs.splice(i, 1);
      }).catch(_ => {
        return;
      });
    }),
    // 提交
    onSubmit: _throttle(function(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let isAtcion = false;
          let isTitle = '';
          // 判断图片
          if (this.form.advImage === '') {
            isAtcion = true;
            isTitle = '请选择图片';
          }
          // 判断页签
          if (this.form.tabs.length !== 0) {
            this.form.tabs.forEach(item => {
              // 判断商品
              if (item.goodsList.length === 0) {
                isAtcion = true;
                isTitle = '请选择商品';
              }
              // 判断页签标题
              if (item.title === '') {
                isAtcion = true;
                isTitle = '请输入页签名称';
              }
            });
          } else if (this.form.tabs.length === 0) {
            // 判断页签是否为空
            isAtcion = true;
            isTitle = '请添加页签';
          }
          // 阻止
          if (isAtcion) {
            this.$message({
              message: isTitle,
              type: 'warning'
            });
            return;
          }
          if (this.id === null) {
            this.handlemManyAdd();
          } else {
            this.handlemManyEdit();
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    }),
    // 编辑
    handlemManyEdit() {
      const { advImageUrl, clickEvent, erpGoodsId } = this.form;
      if (clickEvent === undefined) {
        this.$message({
          message: '请选择点击事件',
          type: 'warning'
        });
        return;
      }
      if (this.judgeEventState('advImageUrl', advImageUrl, '请输入图片链接')) return;
      if (this.judgeEventState('erpGoodsId', erpGoodsId, '请输入商品编号')) return;
      if (this.judgeEventState('goodsName', this.form.goodsList, '请选择商品')) return;
      this.$http.post('advPosition/updateFloor', { ...this.form, type: this.path, id: this.id, visibleSet: this.visibleSet }).then(res => {
        this.$message({
          message: '编辑成功',
          type: 'success'
        });
        this.$router.push({ path: 'floor' });
      });
    },
    // 新增
    handlemManyAdd() {
      const { advImageUrl, clickEvent, erpGoodsId } = this.form;
      if (clickEvent === undefined) {
        this.$message({
          message: '请选择点击事件',
          type: 'warning'
        });
        return;
      }
      if (this.judgeEventState('advImageUrl', advImageUrl, '请输入图片链接')) return;
      if (this.judgeEventState('erpGoodsId', erpGoodsId, '请输入商品编号')) return;
      if (this.judgeEventState('goodsName', this.form.goodsList, '请选择商品')) return;
      this.$http.post('advPosition/addFloor', { ...this.form, type: this.path, visibleSet: this.visibleSet }).then(res => {
        this.$message({
          message: '添加成功',
          type: 'success'
        });
        this.$router.push({ path: 'floor' });
      });
    },
    // 判断点击事件是否选中
    judgeEventState(clickEvent, Event, message) {
      let isAticve = false;
      if (this.form.clickEvent === clickEvent) {
        if (Event === '' || Event === undefined) {
          if (Event instanceof Array && Event.length !== 0) return;
          this.$message({
            message,
            type: 'warning'
          });
          isAticve = true;
        }
      }
      return isAticve;
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
    // 前进
    riseClassify(index, el) {
      if (index === 0) return;
      const arrList = el[index];
      this.$set(el, index, el[index - 1]);
      this.$set(el, index - 1, arrList);
    },
    // 后退
    dropClassify(index, el) {
      if (index === el.length - 1) return;
      const arrList = el[index];
      this.$set(el, index, el[index + 1]);
      this.$set(el, index + 1, arrList);
    },
    // 点击事件
    openClickEvent() {
      delete this.form.advImageUrl;
      delete this.form.erpGoodsId;
      delete this.form.goodsList;
    },
    // 商品选择
    openGoods() {
      this.goodsMask = true;
      this.goodsList = this.form.goodsList;
    },
    // 接受楼层商品数据
    onGoodsSubmits(e) {
      this.form.goodsList = e;
      this.cancel();
    },
    // 取消编辑
    handleCancel: _throttle(function(formName) {
      this.$refs[formName].resetFields();
      this.$router.push({ path: 'floor' });
    }),
    addImg() {
      this.form.tabs.push({ title: '', goodsList: [] });
    },
    // 取消弹窗
    cancel() {
      this.popupMask = false;
      this.goodsMask = false;
      this.memberMask = false;
      this.memberList = [];
      this.goodsList = [];
    },
    // 接受弹窗数据
    onSubmits(e) {
      this.form.tabs[this.index].goodsList = [...e];
      this.cancel();
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
    display: flex;
    flex-wrap: wrap;
    div {
      margin: 0 auto;
      .more_little {
        width: 140px;
        margin: 3px 5px;
      }
      .more_big {
        width: 32%;
        margin: 3px 5px;
      }
    }
}
.el-form{
    .el-input{
    width: 80%;
    }
}
// 楼层图片盒子
.commodity_image_wrap {
  display: flex;
  .el-input {
    margin-top: 30px;
  }
}
// 楼层图片上传
.commodity_image {
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
}
.goodsList{
    width:250px;
    border:1px solid #DCDFE6;
    height:27px;
    line-height: 27px;
    margin-right:10px;
    padding-left: 5px;
    border-radius: 3px;color:#606266;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
// 客户集合

.aggregate {
  display: flex;
  .goodsList{
  width:40%;
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
