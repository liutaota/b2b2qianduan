<template>
    <el-dialog
    title="内容编辑"
    :visible="quillEditor"
    @close="quillEditorCancel"
    :close-on-click-modal="false"
    width="70%">
        <el-row>
            <el-col :span="20" :offset="2">
                <el-form :model="formQuill" ref="formQuill" :rules="formQuillRules">
                    <el-form-item prop="description">
                        <!-- 图片上传组件辅助-->
                        <!-- <el-upload
                            class="avatar-uploaders"
                            :action="upLoadUrl"
                            :on-success="handleSuccess"
                            :on-error="handleError"
                            :http-request="upload"
                            ref="uploadPictures"
                            list-type="picture-card"
                            :fileList="fileList"
                        >
                            <el-button id="upLoadBtn" size="small" type="primary">点击上传</el-button>
                        </el-upload> -->
                    <div class="avatar-uploaders">

                        <div class="img_list">
                            <!-- <div class="divimg" v-for="(item, index) in imageList" :key="index">
                                <img :src="imgHost  + '/' + item + `-750x375.png`" alt="图片" />
                                <i class="iconfont icon-guanbi" @click="cancelUpload(item)"></i>
                            </div> -->
                            <div class="upload">
                                <i class="icon-jiahao iconfont"></i>
                                <input
                                type="file"
                                id="upLoadBtn"
                                class="file-id-front"
                                accept="image/png, image/jpeg, image/jpg"
                                @change="inputChangeFront"
                                />
                            </div>
                        </div>

                    </div>

                        <quill-editor
                            class="quill-editor"
                            id="quiEditor"
                            v-model.trim="description"
                            ref="QuillEditors"
                            :options="editorOption"
                            @blur="onEditorBlur()"
                            @focus="onEditorFocus($event)"
                            @ready="onEditorReady()"
                        ></quill-editor>
                    </el-form-item>
                </el-form>
                
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="4" :offset="20">
                <el-button type="primary" size="medium" @click="sureEditor">确定</el-button>
            </el-col>
        </el-row>
    </el-dialog>
</template>

<script>
// import { addQuillTitle } from '../../util.js';
import "@/components/toolCom/quillAudio.js";

import { upload } from "@/fs";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";


// 富文本工具栏配置
const toolbarOptions = [
  ["bold", "italic", "underline", "strike"], // toggled buttons
  ["blockquote", "code-block"],

  [{ header: 1 }, { header: 2 }], // custom button values
  [{ list: "ordered" }, { list: "bullet" }],
  [{ script: "sub" }, { script: "super" }], // superscript/subscript
  [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
  [{ direction: "rtl" }], // text direction

  [{ size: ["small", false, "large", "huge"] }], // custom dropdown
  [{ header: [1, 2, 3, 4, 5, 6, false] }],

  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  [{ font: [] }],
  [{ align: [] }],
  [ "image", "video","audio"],
//   ['Encode'],
  ["clean"] // remove formatting button
];
export default {
    props:{
        quillEditor:Boolean,
        QuillValue:String
    },
    data() {
        return {
            fileList:[],
            formQuill:{},
            formQuillRules:{
            //     description:[{requred:true,message:'请输入或编辑内容',trigger:'blur'}]
            },
            editorOption: {
                placeholdrer:'请输入编辑内容',
                theme:'snow',
                modules: {
                    toolbar: {
                        container: toolbarOptions, //工具栏
                        handlers: {
                            'image': function (value) {
                                if (value) {
                                    document.querySelector('#upLoadBtn').click()
                                } else {
                                    this.quill.format('image', false);
                                }
                            },
                            // 'Encode':function(value){
                            //     if(value){
                            //         let  qul = document.querySelector('.ql-editor p')
                            //         this.description = qul
                            //         console.log(qul)
                            //         console.log(this.description)
                            //     }
                            // }
                        }
                    }
                }
            }
        }
    },
    mounted(){
        // var encode = document.querySelector('.ql-Encode')
        // var Encode = document.createElement('i')
        // Encode.className = 'iconfont icon-taobaolianmeng'
        // encode.appendChild(Encode)
    },
    methods:{
        quillEditorCancel(){
            this.$emit('quillCancel',this.description)
        },
        sureEditor(){
                this.$emit('quillCancel',this.description)
        },
        upload(req){
            return upload(req.file)
        },
        // 图片上传
        inputChangeFront(e) {
            upload(e).then(json => {
                // this.$data.imageList.push(json.code);
                // 获取富文本组件实例
                let quill = this.$refs.QuillEditors.quill;
                // 如果上传成功
                if (json) {
                    // 获取光标所在位置
                    let length = quill.getSelection().index;
                    // 插入图片，json为服务器返回的图片链接地址
                    quill.insertEmbed(length, "image", this.imgHost + '/' + json.code);
                    // 调整光标到最后
                    quill.setSelection(length + 1);
                } else {
                    // 提示信息，需引入Message
                    this.$message.error("图片插入失败");
                }
                });
            e.target.value = "";
        },
        /**
         * 富文本
         */
        onEditorReady() {}, // 准备编辑器
        onEditorBlur() {}, // 失去焦点事件
        onEditorFocus() {}, // 获得焦点事件
        onEditorChange() {}, // 内容改变事件
        // 上传图片成功
        handleSuccess(res) {
            // 获取富文本组件实例
            let quill = this.$refs.QuillEditors.quill;
            // 如果上传成功
            if (res) {
                // 获取光标所在位置
                let length = quill.getSelection().index;
                // 插入图片，res为服务器返回的图片链接地址
                quill.insertEmbed(length, "image", this.imgHost + '/' + res.code);
                // 调整光标到最后
                quill.setSelection(length + 1);
            } else {
                // 提示信息，需引入Message
                this.$message.error("图片插入失败");
            }
        },
        // 上传图片失败
        handleError() {
            this.$message.error('图片插入失败')
        },
    },
        computed:{
            description:{
                get (){
                    return this.QuillValue
                },
                set(val){
                    this.$emit('update:QuillValue',val)
                }
            }
        }
}
</script>

<style lang="less" >
.avatar-uploaders{
	display: none;
}
.quill-editor{
    .ql-audio{
        font-family: element-icons!important;
        speak: none;
        font-style: normal;
        font-weight: 400;
        font-variant: normal;
        text-transform: none;
        line-height: 1;
        vertical-align: baseline;
        display: inline-block;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        font-size: 20px;
        &::before {
            content: "\e76f";
        }
    }
}
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