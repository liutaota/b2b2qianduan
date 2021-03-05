import Axios from 'axios';
/* 引入nprogress */
import { Message } from 'element-ui';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { httpUrl, authUrl, auth } from './config';
import { getToken } from '@/utils/auth';

/**
 * url
 * @param {*} url
 * @param {*} data
 */
Axios.Axios.prototype.postParam = function (url, data) {
  const dataParam = new URLSearchParams();
  for (const k in data) {
    dataParam.append(k, data[k]);
  }
  return this.post(url, dataParam);
};

const axios = Axios.create();

axios.defaults.timeout = 15000;
Message.duration = 1000;
axios.interceptors.request.use(
  config => {
    if (config.url.includes('/oauth/token')) {
      config.baseURL = authUrl;
      config.auth = auth;
      config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    } else {
      config.headers.Authorization = getToken();
      config.baseURL = httpUrl;
    }
    NProgress.start();
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  function (response) {
    const res = response.data;
    NProgress.done();
    if (res.access_token) {
      return Promise.resolve(res);
    }
    if (res.errorCode === '0') {
      return Promise.resolve(res.bizContent);
    } else if (res.errorCode === '401') {
      Message.error('授权超时,请重新登录');
      window.location.pathname = '/login';
      return Promise.reject(res);
    } else {
      Message.error(res.errorMessage);
      return Promise.reject(res);
    }
  },
  function (err) {
    if (err && err.response) {
      switch (err.response.status) {
        case 400:
          err.message = '请求错误(400)';
          break;
        case 401:
          err.message = '授权超时,请重新登录(401)';
          break;
        case 403:
          err.message = err.response.data.error_description || '账号或密码有误(403)';
          break;
        case 404:
          err.message = '请求地址不存在(404)';
          break;
        case 408:
          err.message = '请求超时(408)';
          break;
        default:
          err.message =
            err.response.data.message || err.response.data.error_description;
      }
    } else {
      err.message = '连接服务器失败!';
    }
    NProgress.done();
    Message.error(err.message);
    return Promise.reject(err.response.data);
  }
);

export default axios;
