import axios from './axios';

export function getRequest(getUrl, params) {
  return new Promise((resolve, reject) => {
    axios.get(getUrl, { params: params})
      .then((res) => {
        resolve(res);
      })
      .catch((err)=> reject(err));
  });
}

export function postRequest(postUrl, params) {
  return new Promise((resolve, reject) => {
    console.log(postUrl, params);
    axios.post(postUrl, params)
      .then((res) => {
        // console.log(params, res);
        resolve(res);
      })
      .catch((err)=> reject(err));
  });
}

export function putRequest(putUrl, params) {
  return new Promise((resolve, reject) => {
    console.log(putUrl, params);
    axios.put(putUrl, params)
      .then((res) => {
        resolve(res);
      })
      .catch((err)=> reject(err));
  });
}