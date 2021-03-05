<template>
  <video :src="url" />
</template>

<script>
import { imgHost } from '@/config';
export default {
  name: "FsVideo",
  props: {
    code: { type: String },
  },
  data() {
    return {};
  },
  created() {},
  mounted() {},
  methods: {},
  computed: {
    url() {
      return `${imgHost}${this.code}`;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
