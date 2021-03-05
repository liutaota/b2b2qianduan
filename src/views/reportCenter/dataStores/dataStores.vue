<template>
  <div>
    <iframe-index :srcName="srcName"></iframe-index>
  </div>
</template>

<script>
  import iframeIndex from '@/components/Iframe/index';
  import { reportUrl } from "@/config";
  export default {
    name: "DataStores",
    components:{
      iframeIndex
    },
    data() {
      return {
        srcName:'',
        reportUrl:reportUrl
      }
    },
    created() {
      //this.srcName = reportUrl +"ureport/preview?_u=db:%25E9%2587%2587%25E8%25B4%25AD%25E4%25B8%258A%25E6%259E%25B6%25E6%258A%25A5%25E8%25A1%25A8.ureport.xml";
    }
  }
</script>

<style scoped>

</style>
