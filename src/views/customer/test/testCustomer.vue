<template>
  <!--  父组件-->
  <div style="margin: 0 10px">
    <el-row>
      <el-col :span="24">
        <div
          class="row-col"
          style="margin-top: 10px; font-size: 12px"
          @keyup.enter="clickselect"
        >
          <el-input
            v-model.trim="selectName.id"
            placeholder="请输入查询名称"
            style="width: 145px; margin-right: 10px"
            size="small"
          />
          <el-input
            v-model.trim="selectName.name"
            placeholder="请输入查询名称"
            style="width: 145px; margin-right: 10px"
            size="small"
          />
          <el-input
            v-model.trim="selectName.avg"
            placeholder="请输入查询名称"
            style="width: 145px; margin-right: 10px"
            size="small"
          />
          <el-button
            type="primary"
            icon="el-icon-search"
            @click="clickselect()"
          >查询</el-button>
          <el-button
            type="info"
            @click="selectName = '';
              clickselect();"
          >重置</el-button>
        </div>
      </el-col>
    </el-row>
    <iframe-index :srcName="srcName"></iframe-index>
  </div>
</template>

<script>
  import iframeIndex from '@/components/Iframe/index';
  export default {
    name: "TestCustomer",
    components: {
      iframeIndex
    },
    data() {
      return {
        //搜索条件
        //搜索条件
        id:'',
        selectName: {
          id: '',
          name: '',
          avg: ''
        },
        srcName: ''
      }
    },
    created() {
      this.srcName = reportUrl+"http://report.gdztyy.com/ureport/preview?_u=db:%E9%99%88%E7%8E%89%E8%8E%B2-001.ureport.xml";
    },
    methods:{
      // parentFn(val) {
      //   //搜索条件
      //   this.srcName = "https://www.baidu.com/s?ie=utf-8&f=8&rsv_bp=1&rsv_idx=1&tn=baidu&wd="+this.selectName+"&fenlei=256&oq=iframe&rsv_pq=bd2fbaca00019ecf&rsv_t=1a1e0isXTH72%2FyQTJQYYOUhVubhvsvG2A5Bbl%2Bd0XHX%2B23e4P5IyAPcshf0&rqlang=cn&rsv_dl=tb&rsv_enter=0&rsv_btype=t&rsv_sug3=18&rsv_sug1=17&rsv_sug7=100&rsv_n=2&inputT=1497&rsv_sug4=1428625"
      //   //this.srcName = "https://www.baidu.com/s?ie=utf-8&f=8&rsv_bp=1&rsv_idx=1&tn=baidu&wd=";
      // }
      clickselect(){
        console.log('点击')
        console.log(this.selectName)
        //this.srcname = "https://www.baidu.com/s?ie=utf-8&f=8&rsv_bp=1&rsv_idx=1&tn=baidu&wd="+this.selectName+"&fenlei=256&oq=iframe&rsv_pq=bd2fbaca00019ecf&rsv_t=1a1e0isXTH72%2FyQTJQYYOUhVubhvsvG2A5Bbl%2Bd0XHX%2B23e4P5IyAPcshf0&rqlang=cn&rsv_dl=tb&rsv_enter=0&rsv_btype=t&rsv_sug3=18&rsv_sug1=17&rsv_sug7=100&rsv_n=2&inputT=1497&rsv_sug4=1428625"
        //this.srcName = "https://www.baidu.com/s?ie=utf-8&f=8&rsv_bp=1&rsv_idx=1&tn=baidu&wd="+this.selectName+"&fenlei=256&oq=iframe&rsv_pq=bd2fbaca00019ecf&rsv_t=1a1e0isXTH72%2FyQTJQYYOUhVubhvsvG2A5Bbl%2Bd0XHX%2B23e4P5IyAPcshf0&rqlang=cn&rsv_dl=tb&rsv_enter=0&rsv_btype=t&rsv_sug3=18&rsv_sug1=17&rsv_sug7=100&rsv_n=2&inputT=1497&rsv_sug4=1428625";
        this.srcName = "http://172.16.20.47:9160/ureport/preview?_u=db:%E9%99%88%E7%8E%89%E8%8E%B2-001.ureport.xml&isdel="+this.selectName.id+"&name="+this.selectName.name;
      },
    }
  }
</script>

<style scoped>

</style>
