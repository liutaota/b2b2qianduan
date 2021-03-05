<template>
    <div class="img_list">
        <div class="divimg" v-for="(item, index) in imageList" :key="index">
        <img :src="item + `-750x375.png`" alt="图片" v-if="item.length>40"/>
        <img :src="imgHost  + '/' + item + `-750x375.png`" alt="图片" v-else/>
        <i class="iconfont icon-guanbi" @click="cancelUpload(item)"></i>
        </div>
        <div class="upload" v-show="imageList.length != 4">
        <i class="icon-jiahao iconfont"></i>
        <input
            type="file"
            class="file-id-front"
            accept="image/*"
            @change="inputChangeFront"
        />
        </div>
    </div>
</template>

<script>
import { imgHost } from "@/config";
export default {
    name:'fsImg',
    props:{
        imageList1:Array
    },
    data(){
        return {
            imgHost:imgHost
        }
    },
    methods:{
        cancelUpload(val){
            this.$emit('cancelUpload',val)
        },
        inputChangeFront(e){
            this.$emit('inputChangeFront',e)
        }
    },
    computed:{
        imageList:{
            get(){
                return this.imageList1
            },
            set(val){
                this.$emit('update:imageList1',val)
            }
        }
    }
}
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
</style>