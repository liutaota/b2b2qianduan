/**
 * by lcs
 * 2020-09-21
 */

import { Message } from 'element-ui';

import { parseTime } from '@/utils';
// import { filters } from '@/filters/enum';

export default {
  methods: {
    /**
     * 提示接口没有对接
     */
    notImpl() {
      Message({
        message: 'not impl',
        type: 'error',
        duration: 5 * 1000
      });
    },
    $formatDate (row, column, value, index) { return value ? parseTime(value, '{y}-{m}-{d}') : '-'; },
    $formatDateTime (row, column, value, index) { return value ? parseTime(value) : '-'; },
    $formatMomey (row, column, value, index) { return (value || row || 0).toFixed(0); },
    /**
       * 添加 tab
       * @see Router.prototype.addTag
       * @param {*} param
       */
    $addTag(param) {
      const { route } = this.$router.resolve(param);
      route.meta.title = param.title || route.meta.title;
      return this.$router.push({ ...route });
    },
    /**
     * 设置 tag title
     * @param {*} title
     */
    $setTitle(title) {
      this.$store.dispatch('tagsView/updateVisitedView', { path: this.$route.path, title });
    },
    /**
     * 关闭 tag
     * @param {*} path
     */
    $closeTag(path) {
      path = path || this.$route.path;
      this.$store.dispatch('tagsView/delView', { path }).then(({ visitedViews }) => {
        const lastView = visitedViews.pop();
        this.$router.push(lastView || '/');
      });
    },
    /**
     * el-table enum formater
     * @param {*} enumName
     */
    // $formatEnum(enumName) {
    //   return (row, col, val) => {
    //     return filters[`\$${enumName}`](val);
    //   };
    // },
  }
};
