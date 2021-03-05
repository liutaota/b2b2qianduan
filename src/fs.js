/**
 * by fq
 * 2019-05-24
 */
import { fsHost } from '@/config';
import sha1 from 'js-sha1';

/**
 * 文件上传
 * @param {file} file 文件
 */
var _upload = function (file, url = 'upload',fetchUrl = 'exist') {
  if (file && file.target) {
    file = file.target;
  }
  if (file && file.files) {
    file = file.files[0];
  }
  var reader = new FileReader();
  var p = new Promise(function (ok, error) {
    reader.addEventListener('load', function () {
      var code = sha1(reader.result).toUpperCase();
      if (fetchUrl === 'existPri') {
        code += '.apk'
      }
      fetch(`${fsHost}/${fetchUrl}?code=${code}`)
        .then(res => res.json())
        .then(json => {
          if (json.bizContent && json.bizContent.id) {
            return ok(json.bizContent);
          }
          var data = new FormData();
          data.append('file', file);
          return fetch(`${fsHost}/${url}`, {
            method: 'POST',
            body: data
          });
        })
        .then(res => {
          return res.json();
        })
        .then(json => ok(json.bizContent))
        .catch(err => error(err));
    });
  });
  reader.readAsArrayBuffer(file);
  return p;
};

export const upload = _upload;
