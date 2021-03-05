<template>
  <div>
    <el-select v-model="value" placeholder="请选择" class="select" @change="handleJump">
      <el-option label="单行样式" value="ROLL_LINE" />
      <el-option label="多行样式" value="SINGLE_LINE" />
      <el-option label="标签样式" value="MULTI_LINE" />
      <el-option label="背景样式" value="BG_IMAGE" />
    </el-select>
    <span class="btn" @click="handleSubmit"><i class="el-icon-refresh-right" />样式预览</span>
  </div>
</template>

<script>
export default {
  data() {
    return {
      input: '',
      value: '',
      imgSize: {
        width: 1180,
        height: 100
      },
      advList: []
    };
  },
  mounted() {
    const index = this.$route.path.split('/');
    const path = index[index.length - 1];
    this.value = path;
  },
  methods: {
    handleSubmit() {
      this.$emit('handleSubmit');
    },
    handleJump() {
      this.$router.push({ path: this.value });
      return;
    }
  }
};
</script>

<style scoped>
.select {
    margin: 10px 10px 0 0;
}
.btn{
    color: #409EFF;
    font-size: 14px;
}
</style>
