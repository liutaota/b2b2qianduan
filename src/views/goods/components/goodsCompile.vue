<template>
  <div style="margin-left:10px;">
    <p style="margin:10px 10px 0;font-size: 16px;color:#409EFF;">货品编辑 - {{ goodsInfo.goodsname }}</p>
    <el-row :span="20" style="padding:10px 10px;">
      <el-col v-for="(item,index) in goodsInfo.goodsImgList" :key="index" :span="4" class="image_wrap" style="margin:20px 10px 20px 0;width:220px">
        <i class="el-icon-error icon_delete" @click="handleDelImag(index)" />
        <FsImg width="200" height="150" :src="item.code" alt="" class="image" />
      </el-col>
      <el-upload
        action=""
        list-type="picture-card"
        :show-file-list="false"
        style="margin: 20px;"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :http-request="uploadImage"
      >
        <i class="el-icon-plus" />
      </el-upload>
      <el-dialog>
        <img width="100%" alt="">
      </el-dialog>
    </el-row>
    <div style="height: 450px; width: 97%;margin: 20px;">
      <Tinymce :value="goodsInfo.description" @input="editor" />
    </div>
    <div class="upload">
      <el-button type="primary" :loading="loading" @click="upload">上传</el-button>
    </div>
  </div>
</template>

<script>
import { upload } from '@/fs';
import Tinymce from '@/components/Tinymce';
import FsImg from '@/components/FsImg';
export default {
  name: 'GoodsCompile',
  components: {
    Tinymce, FsImg
  },
  data() {
    return {
      isShowImageDialog: false,
      showImageSrc: '',
      dialogImageUrl: '',
      dialogVisible: false,
      goodsInfo: {},
      loading: false
    };
  },
  created() {
    this.query();
  },
  methods: {
    query() {
      const goodsid = this.$route.query.goodsid;
      this.$http
        .get('/goods/getAdminGoodsInfo', {
          params: {
            goodsid
          }
        })
        .then(data => {
          this.goodsInfo = data;
        });
    },
    showImageDialog(codes) {
      if (codes && codes.length) {
        this.isShowImageDialog = true;
        this.showImageSrc = `${this.imgHost}/${codes}`;
      }
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = false;
    },
    /**
     * 图片上传
     */
    uploadImage(e) {
      const fileName = e.file.fileName || e.file.name;
      let type = 'img';
      if (/(mp4|rmvb|avi|ts)$/i.test(fileName)) {
        type = 'video';
      }
      return upload(e.file)
        .then(data => {
          const { code } = data;
          this.goodsInfo.goodsImgList.push({ type, code });
          this.goodsInfo = { ...this.goodsInfo };
          this.$message.success('上传成功');
        });
    },
    editor(e) {
      this.goodsInfo.description = e;
    },
    upload() {
      const { description, goodsid: erpGoodsId, goodsImgList, accflag } = this.goodsInfo;
      this.loading = true;
      this.$http
        .post('goods/editGoods', {
          description,
          erpGoodsId,
          goodsImgList,
          erpAccFlag: accflag
        }).then(res => {
          this.$message({
            message: '上传成功',
            type: 'success'
          });
          this.loading = false;
          this.$router.back(-1);
        });
    },
    // 删除图片
    handleDelImag(index) {
      this.goodsInfo.goodsImgList.splice(index, 1);
    }
  }
};
</script>

<style scoped lang='less'>
.image_wrap{
  position: relative;
  .icon_delete{
    position: absolute;
    right: 15px;
    top: 10px;
    font-size: 20px;
    display: none;
    color: #F26161;
  }
  &:hover{
     .icon_delete{
       display: inline-block;
     }
  }
}
.upload {
  margin: 60px 20px 10px;
  text-align: right;
  /* padding-right: 20px; */
}
</style>
