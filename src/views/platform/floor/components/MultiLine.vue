<template>
  <!-- 多行样式 -->
  <div style="margin: 0 10px">
    <!-- 样式预览 -->
    <Search @handleSubmit="previewImg" />
    <div class="image_wrap">
      <!-- <el-image fit="contain" :src="dialogImageUrl" /> -->
      <!-- <FsImg :src="dialogImageUrl" alt="" /> -->
    </div>
    <div class="EditForm">
      <el-form ref="ruleForm" :rules="rules" :model="form" label-width="120px" style="width:400px">
        <el-form-item label="楼层名称" prop="title">
          <el-input v-model.trim="form.title" style="width:100%" />
        </el-form-item>
        <el-form-item label="楼层KEY" prop="floorKey">
          <el-input v-model.trim="form.floorKey" style="width:100%" />
        </el-form-item>
        <!-- 客户集合 -->
        <el-form-item label="客户集合" prop="memberSetList">
          <div class="aggregate">
            <!-- <el-checkbox v-model.trim="form">全选</el-checkbox> -->
            <el-select v-model.trim="visibleSet[0].type" placeholder="请选择" @change="getMemberList">
              <el-option label="全部可见" value="ALL_VISIBLE" />
              <el-option label="部分可见" value="PARTIALLY_VISIBLE" />
            </el-select>
            <el-link
              :type="visibleSet[0].type === 'ALL_VISIBLE'?'info':'primary'"
              :disabled="visibleSet[0].type === 'ALL_VISIBLE'?true:false"
              style="margin-left:10px"
              @click="customerCollection"
            >选择客户集合</el-link>
            <p class="goodsList" style="padding-left:10px;font-size:12px">
              <span
                v-for="(item, indexs) of visibleSet[0].memberSetList"
                :key="item.memberSetId"
              >{{ item.memberSetName }} {{ indexs === visibleSet[0].memberSetList.length - 1 ? '':'，' }}</span>
            </p>

          </div>
        </el-form-item>
        <el-form-item label="备注" prop="remark" style="width:400px">
          <el-input v-model.trim="form.remark" type="textarea" />
        </el-form-item>
        <el-form-item label="楼层商品">
          <el-button type="primary" @click="isShowGoods">选择</el-button>
        </el-form-item>
        <el-form-item>
          <div class="floor_commodity">
            <div class="commodity_title">已选择商品</div>
            <div class="commodity_wrap" style="overflow: auto;">
              <span v-for="(item, indexs) of form.goodsList" :key="indexs">{{ item.goodsName }}{{ indexs === form.goodsList.length-1?'':'，' }}</span>
            </div>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <div style="text-align: center;margin:50px 0 0">
      <el-button type="primary" @click="onSubmit('ruleForm')">{{ title }}</el-button>
      <el-button @click="handleCancel">取消</el-button>
    </div>
    <keep-alive>
      <Popup :dialog-form-visible="popupMask" :goods-list="goodsList" @onSubmit="onSubmits" @cancel="cancel" />
    </keep-alive>
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
// import { imgHost } from '@/config';
const Popup = () => import('./popup');
const Search = () => import('./search');
const Transfer = () => import('./Transfer');
// import FsImg from '@/components/FsImg';
export default {
  components: {
    Search, Popup, Transfer
  },
  data() {
    return {
      url: '',
      path: '',
      popupMask: false,
      form: {
        title: '',
        type: '',
        goodsList: [],
      },
      dialogImageUrl: '',
      title: '立即创建',
      // 表单验证规则
      rules: {
        title: [
          { required: true, message: '请输入楼层名称', trigger: 'blur' },
        ],
        floorKey: [
          { required: true, message: '请输入楼层KEY', trigger: 'blur' },
        ],
        floorSort: [
          { required: true, message: '排序不能为空' },
          { type: 'number', message: '排序必须为数字值' }
        ]
      },
      goodsList: [],
      visibleSet: [{ // 客户数据
        type: 'ALL_VISIBLE',
        memberSetList: []
      }],
      memberMask: false, // 客户集合弹窗
      aggregate: '',
      memberList: [], // 客户集合数据
    };
  },
  created() {
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
        const { goodsList, title, floorKey } = res;
        this.form = {
          goodsList, title, floorKey
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
    previewImg() {
      const homeUrl = this.$router.resolve('/previewImg');
      window.open(homeUrl.href, '_blank');
      // this.$router.push({ path: 'previewImg' });
    },
    // 提交编辑
    onSubmit: _throttle(function(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.form.goodsList.length === 0) {
            this.$message({
              message: '请选择商品',
              type: 'warning'
            });
            return;
          }
          if (this.id === null) {
            this.handleSingleAdd();
          } else {
            this.handleSingleEdit();
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    }),
    // 编辑
    handleSingleEdit() {
      this.$http.post('advPosition/updateFloor', { ...this.form, type: this.path, id: this.id, visibleSet: this.visibleSet }).then(res => {
        this.$message({
          message: '编辑成功',
          type: 'success'
        });
        this.$router.push({ path: 'floor' });
      });
    },
    // 新增
    handleSingleAdd() {
      this.$http.post('advPosition/addFloor', { ...this.form, type: this.path, visibleSet: this.visibleSet }).then(res => {
        this.$message({
          message: '添加成功',
          type: 'success'
        });
        this.$router.push({ path: 'floor' });
      });
    },
    isShowGoods: _throttle(function() {
      this.goodsList = this.form.goodsList;
      this.popupMask = true;
    }),
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
    // 取消编辑
    handleCancel: _throttle(function(formName) {
      this.$router.push({ path: 'floor' });
    }),
    // 取消弹窗
    cancel() {
      this.popupMask = false;
      this.memberMask = false;
      this.memberList = [];
      this.goodsList = [];
    },
    // 接受弹窗数据
    onSubmits(e) {
      this.form.goodsList = [...e];
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
}
.el-form{
    .el-input{
    width: 80%;
    }
}
.floor_commodity{
  width: 100%;
  height: 200px;
    font-size: 12px;
  .commodity_title {
      color: #717471;
  }
  .commodity_wrap{
    width: 100%;
    border: 1px solid #DCDFE6;
    border-radius: 3px;
    height: 100%;
    padding: 5px 0;
    span {
      display: inline-block;
      padding-left: 3px;
      color: #6a6d6e;
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
  p {
    width: 250px;
    height: 30px;
    margin:10px 0;
    padding: 0;
    border: 1px solid #dcdfe6;
    border-radius: 3px;
  }
}
</style>
