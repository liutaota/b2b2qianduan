import { asyncRoutes, constantRoutes } from '@/router';

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(permissions, route) {
  if (route) {
    return permissions.some(p => p.permissionPath === route.name);
  } else {
    return false;
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
function filterAsyncRoutes(routes, permissions) {
  const res = [];
  // console.log('routes', routes, permissions);
  routes.forEach(route => {
    const tmp = { ...route };
    if (hasPermission(permissions, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, permissions);
      }
      res.push(tmp);
    }
  });
  return res;
}

const state = {
  routes: [],
  addRoutes: []
};

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes;
    state.routes = constantRoutes.concat(routes);
  }
};

const actions = {
  generateRoutes({ commit }, rolePermissionList) {
    return new Promise(resolve => {
      // TODO 开放权限过滤
      // console.log(JSON.parse(JSON.stringify(asyncRoutes)), 'asyncRoutes');

      const accessedRoutes = filterAsyncRoutes(asyncRoutes, rolePermissionList);
      // console.log(rolePermissionList, 'accessedRoutes');
      // if (roles.includes('admin')) {
      //   accessedRoutes = asyncRoutes;
      // } else {
      //   accessedRoutes = filterAsyncRoutes(asyncRoutes, roles, permissions);
      // }
      commit('SET_ROUTES', accessedRoutes);
      resolve(accessedRoutes);
    });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
