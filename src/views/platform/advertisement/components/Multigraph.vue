<template>
  <div style="margin: 0 10px">
    <!-- 样式预览 -->
    <keep-alive>
      <Search @handleSubmit="imgPreview" />
    </keep-alive>
    <div class="image_wrap">
      <div v-if="isShowImage">
        <FsImg
          v-for="(item, indexs) of form.imageInfoVoList"
          :key="indexs"
          fit="contain"
          :src="item.image"
          :class="imageStyle"
        />
      </div>
    </div>
    <div class="EditForm">
      <el-form ref="ruleForm" :rules="rules" :model="form" label-width="120px" style="width:50%">
        <el-form-item label="广告名称" prop="advName">
          <el-input v-model.trim="form.advName" />
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
        <el-form-item label="活动时间" style="margin-bottom:15px;" prop="apvStartDate">
          <el-col :span="8">
            <el-form-item prop="advStartDate">
              <el-date-picker
                v-model.trim="form.advStartDate"
                type="date"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="开始时间"
                style="width: 100%;"
              />
            </el-form-item>
          </el-col>
          <el-col :span="9" :offset="2">
            <el-form-item prop="advEndDate">
              <el-date-picker
                v-model.trim="form.advEndDate"
                type="date"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="结束时间"
                style="width: 100%;"
              />
            </el-form-item>
          </el-col>
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
      <el-table
        :data="form.imageInfoVoList"
        border
        stripe
        fit
        highlight-current-row
        default-expand-all
        style="width: 100%;margin-top:10px;font-size:12px;"
        :header-cell-style="{background:'#F3F3F3',color:'#606266'}"
      >
        <!-- <el-table-column
          label="序号"
          type="index"
          width="50"
          :index="indexMethod"
        /> -->
        <el-table-column
          :label="'图片' + imgSize.width || 0 +'*'+imgSize.height || 0"
          prop="goodsImg"
          align="center"
          :formatter="textmatter"
          width="300"
        >
          <template slot-scope="scope">
            <div class="uploadImage">
              <FsImg
                v-if="scope.row.image"
                fit="contain"
                width="50%"
                :src="scope.row.image"
                :class="imageStyle"
              />
              <el-upload class="upload-demo" action :limit="1" :http-request="uploadImage">
                <el-button size="small" type="primary" @click="loadImage(scope.$index)">点击上传</el-button>
              </el-upload>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          :label="'图片' + imgSize.WXwidth +'*'+imgSize.WXheight"
          prop="goodsImg"
          align="center"
          :formatter="textmatter"
          width="300"
        >
          <template slot-scope="scope">
            <div class="uploadImage">
              <FsImg
                v-if="scope.row.imageWx"
                fit="contain"
                width="50%"
                :src="scope.row.imageWx"
                :class="imageStyle"
              />
              <el-upload class="upload-demo" action :limit="1" :http-request="uploadImageWX">
                <el-button size="small" type="primary" @click="loadImage(scope.$index)">点击上传</el-button>
              </el-upload>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="客户集合" prop="goodsImg" width="200" align="center" :formatter="textmatter">
          <template slot-scope="scope">
            <div class="aggregate tabMember">
              <el-select
                v-model.trim="scope.row.visibleSet.type"
                placeholder="请选择"
                @change="getTabMemberList(scope.row,scope.$index)"
              >
                <el-option label="全部可见" value="ALL_VISIBLE" />
                <el-option label="部分可见" value="PARTIALLY_VISIBLE" />
              </el-select>
              <p class="goodsList" style="padding-left:10px;font-size:12px">
                <span
                  v-for="(items, i) of scope.row.visibleSet.memberSetList"
                  :key="items.memberSetId"
                >{{ items.memberSetName }} {{ i === scope.row.visibleSet.memberSetList.length - 1 ? '':'，' }}</span>
              </p>
              <el-link
                :type="scope.row.visibleSet.type === 'ALL_VISIBLE'?'info':'primary'"
                :disabled="scope.row.visibleSet.type === 'ALL_VISIBLE'?true:false"
                style="margin-right:10px;display: inline; width:150px"
                @click="tabCustomerCollection(scope.row, scope.$index)"
              >选择客户集合</el-link>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="点击事件" prop="goodsImg" width="220" align="center" :formatter="textmatter">
          <template slot-scope="scope">
            <div>
              <el-select
                v-model.trim="scope.row.clickEvent"
                placeholder="跳转网页链接"
                style="margin-bottom:10px"
                @change="openClickEvent(scope.$index)"
              >
                <el-option label="无点击事件" value />
                <el-option label="商品编号" value="erpGoodsId" />
                <el-option label=" 图片链接" value="imageUrl" />
                <el-option label=" 多商品" value="goodsName" />
              </el-select>
              <div style="text-align: center;margin:0 auto">
                <el-input
                  v-if="scope.row.clickEvent === 'erpGoodsId'"
                  v-model.trim.number="scope.row.erpGoodsId"
                  placeholder="请输入商品编号"
                />
                <el-input
                  v-if="scope.row.clickEvent === 'imageUrl'"
                  v-model.trim.number="scope.row.imageUrl"
                  placeholder="请输入图片链接"
                />
                <div
                  v-if="scope.row.clickEvent === 'goodsName'"
                  style="display:flex;align-items: center;justify-content: center;"
                >
                  <div class="goodsList">
                    <span
                      v-for="(items, i) of scope.row.goodsList"
                      :key="i"
                    >{{ items.goodsName }}{{ i === scope.row.goodsList.length-1 ? '':'，' }}</span>
                  </div>
                  <el-button type="primary" @click="openGoods(scope.$index)">选择</el-button>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="时间" prop="goodsImg" width="200" align="center" :formatter="textmatter">
          <template slot-scope="scope">
            <p style="display: flex;">
              <span style="width: 70px;">开始：</span>
              <el-date-picker
                v-model.trim="scope.row.imageStartTime"
                type="datetime"
                placeholder="选择时间"
                align="right"
                value-format="yyyy-MM-dd HH:mm:ss"
                :picker-options="pickerOptions"
                style="width:100%;display: inline-block;"
              />
            </p>
            <p style="display: flex;">
              <span style="width: 70px;">结束：</span>
              <el-date-picker
                v-model.trim="scope.row.imageEndTime"
                type="datetime"
                placeholder="选择时间"
                align="right"
                value-format="yyyy-MM-dd HH:mm:ss"
                :picker-options="pickerOptions"
                style="width:100%"
              />
            </p>
          </template>
        </el-table-column>
        <el-table-column label="排序" prop="goodsImg" width="100" align="center" :formatter="textmatter">
          <template slot-scope="scope">
            <!-- 前进一位 -->
            <span
              class="el-icon-caret-top"
              style="font-weight: 900;cursor: pointer;font-size:18px"
              @click="riseClassify(scope.$index,form.imageInfoVoList)"
            />
            <!-- 后退一位 -->
            <span
              class="el-icon-caret-bottom"
              style="font-weight: 900;cursor: pointer;font-size:18px;margin-left:15px"
              @click="dropClassify(scope.$index, form.imageInfoVoList)"
            />
          </template>
        </el-table-column>
        <el-table-column label="是否开启" prop="goodsImg" width="100" align="center" :formatter="textmatter">
          <template slot-scope="scope">
            <el-switch
              v-model.trim="scope.row.imageIsUse"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-value="ON"
              inactive-value="OFF"
            />
          </template>
        </el-table-column>
        <el-table-column label="是否开启" prop="goodsImg" width="100" align="center" :formatter="textmatter">
          <template slot="header">
            <div @click="addImg">
              <i class="el-icon-circle-plus-outline" /> 添加
            </div>
          </template>
          <template slot-scope="scope">
            <span class="del" @click="deleteImage(scope.$index)">
              <i class="el-icon-delete-solid" />
              删除
            </span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="text-align: center;margin:50px 0 20px">
      <el-button type="primary" @click="onSubmit('ruleForm')">立即创建</el-button>
      <el-button @click="handleCancel('ruleForm')">取消</el-button>
    </div>
    <keep-alive>
      <Popup
        :dialog-form-visible="popupMask"
        :goods-list="goodsList"
        @onSubmit="onSubmits"
        @cancel="cancel"
      />
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
    <Transfer
      v-if="tabMemberMask"
      :dialog-form-visible="tabMemberMask"
      :goods-list="tabMemberList"
      :aggregate="aggregate"
      @onSubmit="tabMemberSubmit"
      @cancel="cancel"
    />
  </div>
</template>

<script>
import { _throttle } from '@/utils/public';
import FsImg from '@/components/FsImg';
import { upload } from '@/fs';
import Popup from './popup';
import Search from './search';
import Transfer from './Transfer';
export default {
  components: {
    Search, FsImg, Popup, Transfer
  },
  data() {
    return {
      url: '',
      id: null,
      popupMask: false, // 商品弹窗
      advIndex: null,
      isShowImage: false,
      memberMask: false, // 客户集合弹窗
      memberList: [], // 客户集合数据
      tabMemberMask: false, // 表格客户集合弹窗
      tabMemberIndex: null, // 表格客户下标
      tabMemberList: [], // 表格客户集合数据
      imageStyle: 'more_little',
      dialogImageUrl: '',
      path: '',
      goodsList: [], // 商品列表
      form: { // 页面数据
        advName: '',
        imageInfoVoList: [
          {
            image: '',
            clickEvent: null,
            imageStartTime: '',
            imageEndTime: '',
            imageIsUse: 'OFF',
            visibleSet: {
              type: 'ALL_VISIBLE',
              memberSetList: []
            },
          }
        ],
        advStartDate: '',
        advEndDate: '',
        isUse: 'OFF'
      },
      // 客户集合
      visibleSet: [{
        type: 'ALL_VISIBLE',
        memberSetList: []
      }],
      index: 0,
      imgSize: {
        width: 1180,
        height: 100
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
      // 表单验证规则
      rules: {
        advName: [
          { required: true, message: '请输入广告位名称', trigger: 'blur' },
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
    this.imgSize.height = height;
    this.imgSize.width = width;
    if (id !== undefined) {
      id = parseInt(id);
    }
    switch (path) {
      case 'CAROUSEL_BANNER':
        this.imgSize.WXheight = 320;
        this.imgSize.WXwidth = 750;
        break;
      case 'CENTER_MORE_BIG':
        this.imgSize.WXheight = 180;
        this.imgSize.WXwidth = 320;
        break;
      default:
        this.imgSize.WXheight = 0;
        this.imgSize.WXwidth = 0;
        break;
    }
    this.id = id || null;
    if (this.id === null) return;
    this.query();
  },
  methods: {
    query() {
      this.$http.get('advPosition/getAdvPositionById', { params: { id: this.id }}).then(res => {
        this.form = res;
        // 判断客户集合是否存在
        if (res.visibleSet === null) {
          res.visibleSet = [{
            type: 'ALL_VISIBLE',
            memberSetList: []
          }];
        }
        // 判断表格客户集合是否存在
        res.imageInfoVoList.map(item => {
          if (item.visibleSet === undefined || item.visibleSet === null) {
            item.visibleSet = {
              type: 'ALL_VISIBLE',
              memberSetList: []
            };
            return item;
          }
        });
        this.visibleSet = res.visibleSet;
        delete this.form.visibleSet;
      });
    },
    // 图片预览
    imgPreview() {
      this.isShowImage = true;
    },
    /**
     * 图片上传
     */
    uploadImage(e) {
      // const fileName = e.file.fileName || e.file.name;
      // let type = 'img';
      // if (/(mp4|rmvb|avi|ts)$/i.test(fileName)) {
      //   type = 'video';
      // }
      return upload(e.file)
        .then(data => {
          this.form.imageInfoVoList[this.index].image = data.code;
          this.$message.success('上传成功');
        });
    },
    uploadImageWX(e) {
      return upload(e.file)
        .then(data => {
          this.form.imageInfoVoList[this.index].imageWx = data.code;
          this.$message.success('上传成功');
        });
    },
    // 获取点击下标
    loadImage(i) {
      this.index = i;
    },
    // 点击事件切换
    openClickEvent(index) {
      const { clickEvent } = this.form.imageInfoVoList[index];
      delete this.form.imageInfoVoList[index].imageUrl;
      delete this.form.imageInfoVoList[index].erpGoodsId;
      delete this.form.imageInfoVoList[index].goodsList;
      if (clickEvent === 'goodsName') {
        this.form.imageInfoVoList[index].goodsList = [];
      } else if (clickEvent === 'imageUrl') {
        this.form.imageInfoVoList[index].imageUrl = '[]';
      } else if (clickEvent === 'erpGoodsId') {
        this.form.imageInfoVoList[index].erpGoodsId = '';
      }
    },
    // 打开商品选择
    openGoods(index) {
      this.popupMask = true; this.index = index;
      this.goodsList = this.form.imageInfoVoList[index].goodsList;
    },
    // 接受商品数据
    onSubmits(e) {
      // this.form.imageInfoVoList[this.index].goodsList = [...e];
      this.$set(this.form.imageInfoVoList, this.index, { ...this.form.imageInfoVoList[this.index], goodsList: [...e] });
      this.cancel();
    },
    // 取消弹窗
    cancel() {
      this.popupMask = false;
      this.memberMask = false;
      this.tabMemberMask = false;
      this.goodsList = [];
      this.aggregate = {};
      this.tabMemberList = [];
    },
    // 提交
    onSubmit: _throttle(function(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
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
      if (this.judge() === undefined) return;
      // 客户集合拦截
      const intercept = this.pageTopIntercept();
      if (intercept !== undefined) {
        this.$message.warning(intercept);
        return;
      }
      this.$http.post('advPosition/updateAdvPosition', { ...this.form, apDisplay: this.path, visibleSet: this.visibleSet }).then(res => {
        this.$message({
          message: '编辑成功',
          type: 'success'
        });
        this.query();
        this.$router.push({ path: 'apList' });
      });
    },
    // 新增
    handlemManyAdd() {
      // return;
      if (this.judge() === undefined) return;
      // 客户集合拦截
      const intercept = this.pageTopIntercept();
      console.log(intercept);
      if (intercept !== undefined) {
        this.$message.warning(intercept);
        return;
      }
      this.$http.post('advPosition/addAdvPosition', { ...this.form, apDisplay: this.path, visibleSet: this.visibleSet }).then(res => {
        this.$message({
          message: '添加成功',
          type: 'success'
        });
        this.$router.push({ path: 'apList' });
      });
    },
    // 判断是否图片
    judge() {
      const isImage = this.form.imageInfoVoList.some(item => {
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
    // 客户集合全部可见清空
    getMemberList() {
      if (this.visibleSet[0].type === 'ALL_VISIBLE') {
        this.visibleSet[0].memberSetList = [];
      }
    },
    getTabMemberList(item, index) {
      if (item.visibleSet.type === 'ALL_VISIBLE') {
        item.visibleSet.memberSetList = [];
      }
      this.$set(this.form.imageInfoVoList, index, { ...item });
      // this.form.imageInfoVoList[index] = item;
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
    // 打开表格客户集合
    tabCustomerCollection: _throttle(function (item, index) {
      if (item.visibleSet.type === '') {
        this.$message.warning('请选择客户可见类型');
        return;
      }
      this.tabMemberList = [];
      // 更改获取变量，让其可以再弹窗中接受
      item.visibleSet.memberSetList.forEach((data) => {
        const { memberSetId: customsetid, memberSetName: customsetname } = data;
        this.tabMemberList.push({ customsetid, customsetname });
      });
      this.aggregate = {
        path: 'member/getAdminMemberList',
        listKey: {
          key: 'customsetid',
          label: 'customsetname',
        },
      };
      this.tabMemberIndex = index;
      this.tabMemberMask = true;
    }),
    // 确认表格客户集合
    tabMemberSubmit: _throttle(function (e) {
      const memberList = [];
      // 更改原生变量重新赋值，让其符合后台接受
      e.forEach((item) => {
        const { customsetid: memberSetId, customsetname: memberSetName } = item;
        memberList.push({ memberSetId, memberSetName });
      });
      this.form.imageInfoVoList[this.tabMemberIndex].visibleSet.memberSetList = [...memberList];
      this.cancel();
    }),
    // 客户集合拦截
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
    // 取消编辑
    handleCancel: _throttle(function(formName) {
      this.$refs[formName].resetFields();
      this.$router.push({ path: 'apList' });
    }),
    // 添加
    addImg: _throttle(function() {
      // 判断新增类型
      if (this.path === 'CENTER_MORE_LITTLE') {
        this.imageStyle = 'more_little';
      } else if (this.path === 'CENTER_MORE_BIG') {
        this.imageStyle = 'more_big';
      }
      this.form.imageInfoVoList.push({
        image: '',
        imageUrl: '',
        imageStartTime: '',
        imageEndTime: '',
        imageIsUse: 'OFF',
        visibleSet: {
          type: 'ALL_VISIBLE',
          memberSetList: []
        }
      });
    }, 300),
    // 删除
    deleteImage: _throttle(function(i) {
      this.$confirm('确认删除？').then(_ => {
        this.form.imageInfoVoList.splice(i, 1);
      }).catch(_ => {
        return;
      });
    }, 500),
    // 升序
    riseClassify(index, el) {
      if (index === 0) return;
      const arrList = el[index];
      this.$set(el, index, el[index - 1]);
      this.$set(el, index - 1, arrList);
    },
    // 降序
    dropClassify(index, el) {
      if (index === el.length - 1) return;
      const arrList = el[index];
      this.$set(el, index, el[index + 1]);
      this.$set(el, index + 1, arrList);
    },
    // 文本格式化
    textmatter (row, column) {
      return row[column.property] ? row[column.property] : '-';
    },
    // 是否开启
    // handleSwith(row) {
    //   const { id, isUse } = row;
    //   this.$http.get('advPosition/updateFloorIsUse', { params: { id, isUse }}).then(res => {
    //     this.query();
    //   });
    // }
  }
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
.uploadImage {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.upload-demo {
  float: right;
}
.select_wrap {
  margin-bottom: 10px;
}
.goodsList {
  width: 150px;
  height: 30px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  display: inline-block;
  margin-right: 10px;
  font-size: 12px;
  color: #9a9a9a;
  padding-left: 5px;
  line-height: 30px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
// 客户集合
.aggregate {
  display: flex;
  p {
    height: 30px;
    margin: 0 10px;
    padding: 0;
    border: 1px solid #dcdfe6;
    border-radius: 3px;
  }
}
// 表格客户
.tabMember {
  flex-direction: column;
  align-items: center;
  & > p {
    margin: 10px 0;
  }
}
.del {
  color: red;
  font-size: 16px;
  cursor: pointer;
}
/deep/.el-table__body tr.current-row > td {
  background: #b5cbe2 !important;
}
</style>
