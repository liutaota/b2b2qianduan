<template>
  <!--  子组件  -->
  <div style="margin: 20px 10px">
    <iframe :src="srcName"/>
  </div>
</template>

<script>
  export default {
    name: "index",
    //父组件传过来的值
    props: {
      srcName: {
        type: String,
        default: 'https://www.baidu.com/'
      },
    },
    data() {
      return {

      }
    },
    created() {
      // this.clickselect();
    },
    mounted() {
      // console.log("00000000000000000")
      // console.log(this.srcName)
    },
    methods:{
      //点击时子组件把搜索条件传递给父组件
      // clickselect(){
      //   console.log('点击')
      //   //把搜索条件传递给父组件
      //   this.$emit('childFn', this.selectName);
      // },
    }
  }
</script>

<style scoped>
  iframe{
    margin-top: 10px;
    width: 100%;
    height: 800px;
  }
</style>
