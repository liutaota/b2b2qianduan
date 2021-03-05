import http from '@/http';
import { imgHost } from '@/config';
import { Loading } from "element-ui";
const $math = require('mathjs');

export const exportExcel = (url, params) => {
  let loadingInstance = Loading.service({ fullscreen: true });
  http.get(url, { params })
    .then(res => {
      window.open(`${imgHost + res}`, "_blank");
      loadingInstance.close();
    })
    .catch(() => {
      loadingInstance.close();
    });
}

export const removeEmptyVal = obj => {
  if (!obj) return;
  Object.keys(obj).forEach(k => {
    if (obj[k] === null || obj[k] === undefined || obj[k] === '') {
      delete obj[k];
    }
  });
  return obj;
};

import VDistpicker from 'v-distpicker';

// 数值精度
export const math = {
  add() {
    return comp('add', arguments);
  },
  subtract() {
    return comp('subtract', arguments);
  },
  multiply() {
    return comp('multiply', arguments);
  },
  divide() {
    return comp('divide', arguments);
  }
};

function comp(_func, args) {
  let t = $math.chain($math.bignumber(args[0]));
  for (let i = 1; i < args.length; i++) {
    t = t[_func]($math.bignumber(args[i]));
  }
  // 防止超过6位使用科学计数法
  return parseFloat(t.done());
}
/**
 * 四舍五入取两位小数
 */
export const numFilter = function (val, num = 2) {
  const data = parseFloat(Number(val)).toFixed(num);
  return data;
};
/**
 * 商品库存除以最小销售数量 取整
 * @param {String} string
 */
export function goodsqtyFilter(stqy, zxB2bNumLimit) {
  // if(!stqy || !zxB2bNumLimit)return
  // console.log(stqy, zxB2bNumLimit);
  return parseInt(stqy / zxB2bNumLimit) || 0;
}
/**
 * area code 转中文
 * @param {*} code
 */
export const areaCode2Value = code => {
  code = code + '';
  return [/^\d\d/, /^\d\d\d\d/, /^\d\d\d\d\d\d/]
    .filter(reg => reg.test(code))
    .map(reg => '000000'.replace(reg, code.match(reg)[0]))
    .map(code => VDistpicker.methods.getCodeValue(code * 1));
};

export const getAccessToken = function () {
  const tokenStr = sessionStorage.getItem('token');
  if (!tokenStr) return null;
  return tokenStr;
};

let _enumData = null;

export const initEnumData = function () {
  _enumData = http.get('/enumData');
};

export const tokenEnumData = function () {
  if (getAccessToken()) {
    _enumData = http.get('/enumData');
  }
};

export const enumData = _enumData;

/*
*枚举信息
*/
export const getEnumData = (function () {
  let _enumData = null;
  return function (key, val) {
    if (getAccessToken() && !_enumData) {
      _enumData = http.get('/enumData');
    }
    if (_enumData && key) {
      return _enumData.then(data => {
        key = key.split('.');
        if (!data[key[0]]) return;
        if (!data[key[0]][key[1]]) return;
        data = data[key[0]][key[1]];
        if (!val) return data;
        data = data.filter(item => item.val === val).map(item => item.desc);
        if (!data) return;
        return data[0];
      });
    }
    return _enumData;
  };
})();

/**
 * 用户信息
 */
export const getUserInfo = (function () {
  let _memberInfo = '';
  return function () {
    if (getAccessToken()) {
      const role = window.sessionStorage.role;
      let api = '';
      if (role === 'superAdmin') {
        api = '/member/getUser';
      } else {
        api = '/member/getCustomerByCustomerInfo';
      }
      _memberInfo = http.get(api, { params: {} })
        .then(data => {
          return data;
        });
    }
    return _memberInfo;
  };
})();

const titleConfig = {
  'ql-bold': '加粗',
  'ql-color': '字体颜色',
  'ql-font': '字体',
  'ql-code': '插入代码',
  'ql-italic': '斜体',
  'ql-link': '添加链接',
  'ql-background': '背景颜色',
  'ql-size': '字体大小',
  'ql-strike': '删除线',
  'ql-script': '上标/下标',
  'ql-underline': '下划线',
  'ql-blockquote': '引用',
  'ql-header': '标题',
  'ql-indent': '缩进',
  'ql-list': '列表',
  'ql-align': '文本对齐',
  'ql-direction': '文本方向',
  'ql-code-block': '代码块',
  'ql-formula': '公式',
  'ql-image': '图片',
  'ql-video': '视频',
  'ql-clean': '清除字体样式'
};

export function addQuillTitle() {
  const oToolBar = document.querySelector('.ql-toolbar');
  const aButton = oToolBar.querySelectorAll('button');
  const aSelect = oToolBar.querySelectorAll('select');
  const aSpan = oToolBar.querySelectorAll('span');
  aButton.forEach((item) => {
    if (item.className === 'ql-script') {
      item.value === 'sub' ? item.title = '下标' : item.title = '上标';
    } else if (item.className === 'ql-indent') {
      item.value === '+1' ? item.title = '向右缩进' : item.title = '向左缩进';
    } else if (item.className === 'ql-list') {
      item.value === 'ordered' ? item.title = '有序列表' : item.title = '无序列表';
    } else if (item.className === 'ql-header') {
      item.value === '1' ? item.title = '标题H1' : item.title = '标题H2';
    } else {
      item.title = titleConfig[item.classList[0]];
    }
  });
  aSelect.forEach((item) => {
    if (item.className !== 'ql-color' && item.className !== 'ql-background') {
      item.parentNode.title = titleConfig[item.classList[0]];
    }
  });
  aSpan.forEach((item) => {
    if (item.classList[0] === 'ql-color') {
      item.title = titleConfig[item.classList[0]];
    } else if (item.classList[0] === 'ql-background') {
      item.title = titleConfig[item.classList[0]];
    }
  });
}

/**
 * excel导出
 * @param {*} api
 * @param {*} params
 * @param {*} fileName
 */
// export const exportExcel = (api, params, fileName) => {
//   return http.get(api, { params })
//     .then(code => {
//       window.open(
//         `${imgHost}/download/${code}/${fileName}_${new Date() * 1}.xlsx`,
//         `_blank`
//       );
//     });
// };

// 检查权限
export const checkPermission = (arr) => {
  const roles = sessionStorage.getItem('role');
  return (arr.indexOf(roles) !== -1);
};

// 金额转中文大写
export const changeMoney = (n) => {
  if (!/^(0|[1-9]\d*)(\.\d+)?$/.test(n)) {
    return '';
  }

  var unit = '仟佰拾亿仟佰拾万仟佰拾元角分'; var str = '';
  n += '00';
  var p = n.indexOf('.');
  if (p >= 0) { n = n.substring(0, p) + n.substr(p + 1, 2); }

  unit = unit.substr(unit.length - n.length);

  for (var i = 0; i < n.length; i++) { str += '零壹贰叁肆伍陆柒捌玖'.charAt(n.charAt(i)) + unit.charAt(i); }
  return str.replace(/零(仟|佰|拾|角)/g, '零').replace(/(零)+/g, '零').replace(/零(万|亿|元)/g, '$1').replace(/(亿)万|壹(拾)/g, '$1$2').replace(/^元零?|零分/g, '').replace(/元$/g, '元整');
};
