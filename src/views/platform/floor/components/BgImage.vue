<template>
  <!-- 背景楼层 -->
  <div style="margin: 0 10px">
    <!-- 样式预览 -->
    <keep-alive>
      <Search @handleSubmit="imgPreview" />
    </keep-alive>
    <div class="image_wrap">
      <div>
        <el-image v-for="(item, indexs) of imageList" :key="indexs" fit="contain" :src="item.code" />
      </div>
    </div>
    <div class="EditForm">
      <el-form ref="ruleForm" :rules="rules" :model="form" label-width="120px" style="width:50%;">
        <el-form-item label="楼层名称" prop="title">
          <el-input v-model.trim="form.title" />
        </el-form-item>
        <el-form-item label="楼层KEY" prop="floorKey">
          <el-input v-model.trim="form.floorKey" />
        </el-form-item>
        <el-form-item label="显示商品数量" prop="goodsNum">
          <el-input v-model.trim.number="form.goodsNum" />
          <!-- <el-input v-model.trim="form.goodsNum" disabled /> -->
          <!-- <div
            style="width:80%;padding: 0 15px ;border:1px solid #DCDFE6;height:27px;line-height: 27px;margin-right:10px;border-radius: 3px;color:#606266"
          >{{ form.goodsNum }}</div> -->
        </el-form-item>
        <el-form-item label="备注" prop="remark" style="width:400px">
          <el-input v-model.trim="form.remark" type="textarea" />
        </el-form-item>
        <!-- 楼层背景图片 -->
        <el-form-item label="楼层背景">
          <p style="color:#13CE66;margin:0">尺寸：1180*712px（两行商品高度），每增加一行商品高增加290px</p>
          <el-upload
            class="avatar-uploader"
            action
            :show-file-list="false"
            style="margin: 20px;float: left;"
            :on-success="handleBgImageSuccess"
            :http-request="bgImage"
          >
            <!-- <img v-if="bgImages" :src="from.backgroundImage" class="avatar"> -->
            <FsImg v-if="form.backgroundImage" :src="form.backgroundImage" class="avatar" />
            <i
              v-else
              class="el-icon-plus avatar-uploader-icon"
              style="border: 1px dashed #d9d9d9;border-radius: 6px;cursor: pointer;position: relative;overflow: hidden;"
            />
          </el-upload>
        </el-form-item>
        <el-form-item label="小程序楼层背景">
          <p style="color:#13CE66;margin:0">尺寸：700*860px</p>
          <el-upload
            class="avatar-uploader"
            action
            :show-file-list="false"
            style="margin: 20px;float: left;"
            :on-success="handleBgImageSuccessWX"
            :http-request="bgImageWX"
          >
            <!-- <img v-if="bgImages" :src="from.backgroundImage" class="avatar"> -->
            <FsImg v-if="form.backgroundImageWx" :src="form.backgroundImageWx" class="avatar" />
            <i
              v-else
              class="el-icon-plus avatar-uploader-icon"
              style="border: 1px dashed #d9d9d9;border-radius: 6px;cursor: pointer;position: relative;overflow: hidden;"
            />
          </el-upload>
        </el-form-item>
        <!-- 楼层图片 -->
        <!-- <el-form-item label="楼层图片" prop="floorImage">
          <p style="color:#13CE66;margin:0">尺寸：长图：560*152px，短图：270*152px</p>
          <div
            v-for="(item, indexs) of form.floorImage"
            :key="indexs"
            class="commodity_image_wrap"
            @click="loadImage(indexs)"
          >
            <div class="commodity_image">
              <el-upload
                class="avatar-uploader"
                action
                :show-file-list="false"
                style="margin-right: 15px"
                :http-request="uploadImage"
              >
                <FsImg v-if="item.image" :src="item.image" class="avatar" />
                <i
                  v-else
                  class="el-icon-plus avatar-uploader-icon"
                  style="border: 1px dashed #d9d9d9;border-radius: 6px;cursor: pointer;position: relative;overflow: hidden;"
                />
              </el-upload>
            </div>
            <div class="clickEvent">
              <el-select
                v-model.trim="item.clickEvent"
                placeholder="跳转网页链接"
                style="margin-bottom:10px"
                @change="openClickEvent(indexs)"
              >
                <el-option label="无点击事件" value="" />
                <el-option label="商品编号" value="erpGoodsId" />
                <el-option label=" 图片链接" value="url" />
                <el-option label=" 多商品" value="goodsName" />
              </el-select>
              <div style="text-align: center;margin:0 auto">
                <el-input
                  v-if="item.clickEvent === 'erpGoodsId'"
                  v-model.trim.number="item.erpGoodsId"
                  placeholder="请输入商品编号"
                />
                <el-input
                  v-if="item.clickEvent === 'url'"
                  v-model.trim.number="item.url"
                  placeholder="请输入图片链接"
                />
                <div v-if="item.clickEvent === 'goodsName'" class="goodsList" style>
                  <div>
                    <span
                      v-for="(items, i) of item.goodsList"
                      :key="i"
                    >{{ items.goodsName }}{{ i === item.length-1?'':'，' }}</span>
                  </div>
                  <el-button type="primary" @click="openGoods(item,indexs)">选择</el-button>
                </div>
              </div>
            </div>
          </div>
        </el-form-item> -->
      </el-form>
      <!-- 商品选择 -->
      <el-form :model="form" label-width="80px" style="width:50%;">
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
        <el-form-item label="选择商品">
          <el-button type="primary" @click="popupMask = true ">选择</el-button>
        </el-form-item>
        <el-form-item>
          <div class="floor_commodity">
            <div class="commodity_title">已选择商品</div>
            <div class="commodity_wrap">
              <span
                v-for="(item, indexs) of form.goodsList"
                :key="item.goodsId"
              >{{ item.goodsName }}{{ indexs===form.goodsList-1?'':'，' }}</span>
            </div>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <div style="text-align: center;margin:50px 0 20px">
      <el-button type="primary" @click="onSubmit('ruleForm')">{{ title }}</el-button>
      <el-button @click="handleCancel('ruleForm')">取消</el-button>
    </div>
    <Popup
      :dialog-form-visible="popupMask"
      :goods-list="form.goodsList"
      @onSubmit="onSubmits"
      @cancel="cancel"
    />
    <Popup
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
import { _throttle } from '@/utils/public';
import { upload } from '@/fs';
// import Search from './search';
// import Popup from './popup';
const Popup = () => import('./popup');
const Search = () => import('./search');
const Transfer = () => import('./Transfer');
// import FsImg from '@/components/FsImg';
const FsImg = () => import('@/components/FsImg');
export default {
  components: {
    Search,
    Popup,
    FsImg,
    Transfer
  },
  data() {
    return {
      url: '',
      id: null,
      path: '',
      form: {
        title: '',
        goodsList: [],
        backgroundImage: '',
        backgroundImageWx: '',
        floorImage: [
          { image: '', url: '', imgPath: '' },
          { image: '', url: '', imgPath: '' },
          { image: '', url: '', imgPath: '' },
        ],
        s: 8
      },
      imageList: [],
      bgImages: '',
      popupMask: false,
      goodsMask: false,
      index: null,
      goodsindex: null,
      title: '立即创建',
      goodsList: [],
      visibleSet: [{ // 客户数据
        type: 'ALL_VISIBLE',
        memberSetList: []
      }],
      memberMask: false, // 客户集合弹窗
      aggregate: '',
      bgImagesWX: '',
      memberList: [], // 客户集合数据
      // 表单验证规则
      rules: {
        title: [{ required: true, message: '请输入楼层名称', trigger: 'blur' }],
        floorKey: [
          { required: true, message: '请输入楼层KEY', trigger: 'blur' },
        ],
        goodsNum: [
          { required: true, message: '请输入商品数量', trigger: 'blur' },
        ],
        floorImage: [
          { required: true, message: '请输入图片链接', trigger: 'blur' },
        ],
        floorSort: [
          { required: true, message: '排序不能为空' },
          { type: 'number', message: '排序必须为数字值' },
        ],
      },
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
    this.query();
  },
  methods: {
    query() {
      this.$http
        .get('advPosition/getFloorById', { params: { id: this.id }})
        .then((res) => {
          // 拼接显示图片
          const {
            floorImage,
            backgroundImage,
            goodsList,
            title,
            goodsNum,
            floorKey,
            backgroundImageWx,
          } = res;

          this.form = {
            floorImage,
            backgroundImage,
            goodsList,
            title,
            goodsNum,
            floorKey,
            backgroundImageWx,
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
      // this.imageList = JSON.parse(JSON.stringify(this.form.advImg));
      // this.imageList.map(item => {
      //   if (/^http/g.test(item.code)) return;
      //   if (item.code === '') return;
      //   item.code = imgHost + item.code;
      // });
    },
    // 背景图片
    handleBgImage(file) {
      this.form.backgroundImageWx = file.url;
    },
    handleBgImageSuccess(res, file) {
      this.bgImages = URL.createObjectURL(file.raw);
    },
    handleBgImageSuccessWX(res, file) {
      this.bgImagesWX = URL.createObjectURL(file.raw);
    },
    /**
     * 图片上传
     */
    uploadImage(e) {
      return upload(e.file).then((data) => {
        this.$set(this.form.floorImage, this.index, { image: data.code });
        this.$message.success('上传成功');
      });
    },
    bgImage(e) {
      return upload(e.file).then((data) => {
        this.form.backgroundImage = data.code;
      });
    },
    bgImageWX(e) {
      return upload(e.file).then((data) => {
        this.form.backgroundImageWx = data.code;
      });
    },
    // 获取点击下标
    loadImage(i) {
      this.index = i;
    },
    openClickEvent(index) {
      delete this.form.floorImage[index].url;
      delete this.form.floorImage[index].erpGoodsId;
      delete this.form.floorImage[index].goodsList;
    },
    openGoods(item, index) {
      this.goodsMask = true;
      this.goodsindex = index;
      this.goodsList = item.goodsList;
    },
    // 提交
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let isArction = false;
          let isTitle = '';
          if (this.form.goodsList.length === 0) {
            isArction = true;
            isTitle = '请选择商品';
          }
          this.form.floorImage.forEach((item) => {
            if (item.image === '') {
              // 判断图片是否上传
              isArction = true;
              isTitle = '请上传图片';
              return;
            }
          });
          if (this.form.backgroundImage === '') {
            isArction = true;
            isTitle = '请上传背景图';
          }
          // 阻止
          if (isArction) {
            this.$message({
              message: isTitle,
              type: 'warning',
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
    },
    // 编辑
    handlemManyEdit: _throttle(function () {
      // const { url, clickEvent, erpGoodsId } = this.form;
      // if (clickEvent === undefined) {
      //   this.$message({
      //     message: '请选择点击事件',
      //     type: 'warning'
      //   });
      //   return;
      // }
      // if (this.judgeEventState('url', url, '请输入图片链接')) return;
      // if (this.judgeEventState('erpGoodsId', erpGoodsId, '请输入商品编号')) return;
      // if (this.judgeEventState('goodsName', this.form.goodsList, '请选择商品')) return;
      const judgeEventState = this.judgeEventState();
      if (judgeEventState !== undefined) {
        this.$message({
          message: judgeEventState,
          type: 'warning'
        });
        return;
      }
      this.form.floorImage.map((item) => {
        delete item.imgPath;
      });
      this.form.goodNum = this.form.goodsNum;
      this.$http
        .post('advPosition/updateFloor', {
          ...this.form,
          type: this.path,
          id: this.id,
          visibleSet: this.visibleSet
        })
        .then((res) => {
          this.$message({
            message: '编辑成功',
            type: 'success',
          });
          this.$router.push({ path: 'floor' });
        });
    }),
    // 新增
    handlemManyAdd: _throttle(function () {
      const judgeEventState = this.judgeEventState();
      if (judgeEventState !== undefined) {
        this.$message({
          message: judgeEventState,
          type: 'warning'
        });
        return;
      }
      this.form.floorImage.map((item) => {
        delete item.imgPath;
      });
      this.form.goodNum = this.form.goodsNum;
      this.$http
        .post('advPosition/addFloor', { ...this.form, type: this.path, visibleSet: this.visibleSet })
        .then((res) => {
          this.$message({
            message: '添加成功',
            type: 'success',
          });
          this.$router.push({ path: 'floor' });
        });
    }),
    // 判断图片
    judge() {
      let advImg = '';
      let advUrl = '';
      let isPost = false;
      // advImg 数组位空，阻断请求
      if (this.form.advImg.length === 0) return;
      this.form.advImg.forEach((item) => {
        // 图片为空将 isPost 更改位 true
        if (item.code === '') {
          isPost = true;
        }
      });
      // 判断图片是否为空
      if (isPost) {
        this.$message({
          message: '图片为空',
          type: 'warning',
        });
        return;
      }
      // 图片链接与图片转为 json
      advImg = JSON.stringify(this.form.advImg);
      advUrl = JSON.stringify(this.form.advUrl);
      return { advImg, advUrl };
    },
    judgeEventState() {
      let message;
      this.form.floorImage.forEach(item => {
        if (item.clickEvent === undefined || item.clickEvent === null) {
          message = '请选择事件';
          return message;
        } else if (item.clickEvent === 'erpGoodsId' && item.erpGoodsId === undefined || item.erpGoodsId === '') {
          message = '请输入商品编号';
          return message;
        } else if (item.clickEvent === 'url' && (item.url === undefined || item.url === '')) {
          message = '请输入图片链接';
          return message;
        } else if (item.clickEvent === 'goodsName' && (item.goodsList === undefined || item.goodsList.length === 0)) {
          message = '请选择商品';
          return message;
        }
      });
      return message;
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
    // 取消弹窗
    cancel() {
      this.popupMask = false;
      this.goodsMask = false;
      this.memberMask = false;
      this.memberList = [];
    },
    // 接受商品数据
    onSubmits: _throttle(function (e) {
      this.form.goodsList = e;
      // this.form.goodsNum = e.length;
      this.cancel();
    }),
    // 接受楼层商品数据
    onGoodsSubmits(e) {
      this.form.floorImage[this.goodsindex].goodsList = e;
      this.cancel();
    },
    handleCancel: _throttle(function () {
      this.$router.push({ path: 'floor' });
    }),
  },
};
</script>

<style scoped lang="less">
.image_wrap {
  text-align: center;
  margin: 10px 0;
  padding: 35px 0;
  border-top: 1px solid #d3d3d3;
  border-bottom: 1px solid #d3d3d3;
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
.el-form {
  .el-input {
    width: 80%;
  }
}
.EditForm {
  display: flex;
}
// 图片上传
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 150px;
  height: 150px;
  line-height: 150px;
}
.avatar {
  width: 150px;
  height: 150px;
}
// 楼层图片盒子
.commodity_image_wrap {
  display: flex;
  .el-input {
    margin-top: 30px;
  }
  .clickEvent {
    width: 100%;
    text-align: center;
    .goodsList {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;

      div {
        width: 300px;
        margin: 4px 0;
        border: 1px solid #DCDFE6;
        height: 30px;
        padding: 0 5px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: #9a9a9a;
      }
    }
  }
}
// 楼层图片上传
.commodity_image {
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
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
// 商品选择
.floor_commodity {
  width: 100%;
  height: 200px;
  font-size: 12px;
  .commodity_title {
    color: #4e514e;
  }
  .commodity_wrap {
    width: 80%;
    border: 1px solid #dcdfe6;
    border-radius: 3px;
    height: 100%;
    padding: 5px 0;
    overflow: hidden;
    // text-overflow: ellipsis;
    // white-space: nowrap;
    span {
      display: inline-block;
      padding-left: 3px;
      color: #a8acaf;
    }
  }
}
// 客户集合
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
