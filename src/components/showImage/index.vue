<template>
  <el-dialog :visible.sync="isShowImageDialogs">
    <el-image
      v-if="src.length<=40"
      style="max-width: 100%;max-height: 100%;display: block; margin: 0 5%;"
      :src="imgHost + '/' +src"
      fit="contain"
    />
    <el-image
      v-else
      style="max-width: 100%;max-height: 100%;display: block; margin: 0 5%;"
      :src="src"
      fit="contain"
    />
  </el-dialog>
</template>

<script>
import { imgHost } from '@/config';
export default {
  props: {
    isShowImageDialog: Boolean,
    src: String,
  },
  data() {
    return { imgHost: imgHost };
  },
  computed: {
    isShowImageDialogs: {
      get() {
        return this.isShowImageDialog;
      },
      set(val) {
        this.$emit('update:isShowImageDialog', val);
      },
    },
  },
};
</script>

<style lang="less" scoped>
</style>
