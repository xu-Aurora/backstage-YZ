// https://github.com/github/fetch
// https://travis-ci.org/matthew-andrews/isomorphic-fetch
// https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch

import fetch from 'isomorphic-fetch';
import qs from 'qs';
import { message } from 'antd';

const errorMessages = res => `${res.status} ${res.statusText}`;

function check404(res) {
  if (res.status === 404) {
    return Promise.reject(errorMessages(res));
  }
  return res;
}
function jsonParse(res) {
  // console.log(res)
  return res.json().then(jsonResult => ({ ...res,
    jsonResult
  }));
}

function errorMessageParse(res) {
  // console.log(res)
  const {
    success,
    code,
    successful,
    info
  } = res.jsonResult;
  if (code != '200') {
    //message.error( msg);
    if (code == '401') {
      window.location.hash = '#/login'
      return Promise.reject(res.jsonResult.message || '系统发生错误，未返回错误信息。');
    }
    return Promise.reject(res.jsonResult.message || '系统发生错误，未返回错误信息。');
  }
  return res;
}
function check502(res) {
  if (res.status === 502) {
    return Promise.reject('系统正在部署...');
  }
  return res;
}
function check401(res) {
  if (res.status === 401) {
    // console.log("认证错误！！")
  }
  return res;
}
function xFetch(url2, options) {
  const opts = {
    ...options,
    mode: 'cors',
    'Content-Type': 'application/json'
  };

  if (opts.method && opts.method.toUpperCase() === 'POST') {
    opts.headers = {
      'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
      ...opts.headers
    };
  } else if (!opts.method || (opts.method && opts.method.toUpperCase() === 'GET' && url2.indexOf('?') > -1)) {
    url2 += '&_input_charset=UTF-8';
  }
  return fetch(url2, opts)
    .then(check502)
    .then(check401)
    .then(check404)
    .then(jsonParse)
    .then(errorMessageParse)
    .catch((e) => {
      // fetch失败，多数为登录超时302跳转跨站异常，故此错误当登录超时处理
      // chrome错误：Network request failed
      // Safari错误：Network request failed
      return Promise.reject(`${e}`);
    });
}

export const get = (url, params) => {
  // console.log(params)
  return xFetch(`${url}?${qs.stringify(params)}`);
};  

export const getDownload = (url, params) => {
  // console.log(params)
  return fetch(url2, opts)
  .then(check401)
  .then(check404)
  .then(jsonParse)
  .then(errorMessageParse)
  .catch((e) => {
    // fetch失败，多数为登录超时302跳转跨站异常，故此错误当登录超时处理
    // chrome错误：Network request failed
    // Safari错误：Network request failed
    return Promise.reject(`${e}`);
  });
};

export const uploadFile = (url, params) => {
  // console.log(params)
  return fetch(url2, opts)
  .then(check401)
  .then(check404)
  .then(jsonParse)
  .then(errorMessageParse)
  .catch((e) => {
    // fetch失败，多数为登录超时302跳转跨站异常，故此错误当登录超时处理
    // chrome错误：Network request failed
    // Safari错误：Network request failed
    return Promise.reject(`${e}`);
  });
};

export const post = (url, params) => {
  return xFetch(url, {
    method: 'POST',
    body: qs.stringify(params,{arrayFormat: 'indices', allowDots: true})
  });
};

export default xFetch;
