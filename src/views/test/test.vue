<template>
  <div style="margin: 0 10px">
    <el-row>
      <el-col :span="24">
        <div
          class="row-col"
          style="margin-top: 10px; font-size: 12px"
          @keyup.enter="clickselect"
        >
          <el-input
            v-model.trim="selectName"
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
    <iframe :src="srcname"/>
  </div>
</template>

<script>
export default {
  name: 'Test',
  data() {
    return {
      selectName:'',
      srcname:''
    }
  },
  created() {
    this.clickselect();
  },
  methods:{
    clickselect(){
      console.log('点击')
      console.log(this.selectName)
      //this.srcname = "https://www.baidu.com/s?ie=utf-8&f=8&rsv_bp=1&rsv_idx=1&tn=baidu&wd="+this.selectName+"&fenlei=256&oq=iframe&rsv_pq=bd2fbaca00019ecf&rsv_t=1a1e0isXTH72%2FyQTJQYYOUhVubhvsvG2A5Bbl%2Bd0XHX%2B23e4P5IyAPcshf0&rqlang=cn&rsv_dl=tb&rsv_enter=0&rsv_btype=t&rsv_sug3=18&rsv_sug1=17&rsv_sug7=100&rsv_n=2&inputT=1497&rsv_sug4=1428625"
      this.srcname="http://172.16.20.47:4008/ureport/preview?_u=db:信息部:全类别金额统计报表.ureport.xml"
    },

  }
};
</script>

<style scoped>
  iframe{
    margin-top: 10px;
    width: 100%;
    height: 800px;
  }
</style>
