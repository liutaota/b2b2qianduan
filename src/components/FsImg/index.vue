<template>
  <img :src="imgUrl" />
</template>
<script>
import { imgHost } from "@/config";
export default {
  name: "FsImg",
  props: {
    src: {
      type: String,
    },
    code: {
      type: String,
    },
  },
  computed: {
    imgUrl() {
      return `${imgHost}${this.src || this.code}`;
    },
  },
};
</script>

<style lang="less" scoped>
</style>
