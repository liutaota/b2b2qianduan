const auth = {
  username: 'admin',
  password: 'admin'
};
const version = 'b_e2d311f';
const CONST_IDS = {
  FLOOR_NEW_ID: 1,
  FLOOR_ID_JIN: 2,
  PAGE_ID_INDEX: 1,
  PAGE_ID_JIFEN: 7,
  ZHUAN_ID_KUAI: 161,
  GIVE_WHOLE_COUNTRY: 1,
  HELPGUIDE_XIEYI: 55,
};
// 开发
//   192.168.1.115  39-ip//
// const httpUrl = 'http://172.16.20.26:9100/api';
// const authUrl = 'http://172.16.20.26:9120';

const httpUrl = 'http://172.16.20.128:9100/api';
const authUrl = 'http://172.16.20.128:9120';
// // dev
// const httpUrl = 'http://b2b-api.223.gdztyy.com/api';
// const authUrl = 'http://b2b-oauth.223.gdztyy.com';

// pro
// const auth = {
//   username: 'admin',
//   password: 'BF24-D03271179E70'
// };
// const httpUrl = 'https://b2b-api.gdztyy.com/api';
// const authUrl = 'https://b2b-oauth.gdztyy.com';

const reportUrl = 'http://report.223.gdztyy.com/';
const imgHost = 'https://gdztyy-b2b.oss-cn-shenzhen.aliyuncs.com/';
const fsHost = 'http://b2b-fs.223.gdztyy.com/';
const ossUrl = 'http://oss.gdztyy.com/b2b/';
export { auth, httpUrl, authUrl, imgHost, fsHost, version, CONST_IDS, reportUrl, ossUrl };
