<template>
  <div>
    <iframe-index :srcName="srcName"></iframe-index>
  </div>
</template>

<script>
  import iframeIndex from '@/components/Iframe/index';
  import { reportUrl } from "@/config";

  export default {
    name: "WantBook",
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
      this.srcName = reportUrl+"ureport/preview?_u=db:缺货登记.ureport.xml";
    }
  }
</script>

<style scoped>

</style>
