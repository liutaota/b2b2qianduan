import request from '@/utils/request';

export function login(data) {
  return request({
    url: '/vue-element-admin/user/login',
    method: 'post',
    data
  });
}

export function getInfo(token) {
  return request.get('/user/getUserInfo').then(userInfo => {
    const avatar = 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif';
    const permissions = (userInfo.rolePermissionList || []).map(item => item.permissionPath);
    const roles = (userInfo.roleList || []).map(item => item.roleName);
    if (roles.length === 0)roles.push('');
    // console.log('user info ', permissions);
    return { avatar, roles, permissions, ...userInfo };
  });
}

export function logout() {
  return Promise.resolve();
}
