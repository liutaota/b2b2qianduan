import Vue from 'vue';
import Router from 'vue-router';
// import { getToken } from '@/utils/auth';
import Layout from '@/layout';
import menus from './modules/menus';

Vue.use(Router);

// 首页和登录页
// import Home from '@/views/home.vue'
import Login from '@/views/login.vue';

// 404页面
import Error404 from '@/views/error-page/404';

// // 开发中
// const UnderConstruction = () => import('@/views/error-page/UnderConstruction')
export const asyncRoutes = [].concat(menus);
export const constantRoutes = [{
  path: '/',
  component: Layout,
  redirect: '/home',
  children: [{
    path: 'home',
    name: 'Home',
    redirect: '/dashboard',
    hidden: true
  }, {
    path: 'dashboard',
    name: 'Dashboard',
    component: () => import('@/views/dashboard'),
    meta: { title: '首页', icon: 'dashboard', affix: true }
  }
  ]
},
{ path: '/login', name: 'login', component: Login },
{
  path: '/redirect',
  component: Layout,
  hidden: true,
  children: [{
    path: '/redirect/:path(.*)',
    component: () => import('@/views/redirect/index')
  }
  ]
}, {
  path: '/error404',
  name: 'error404',
  hidden: true,
  component: Layout,
  redirect: 'index',
  hildren: [{
    path: 'index',
    component: Error404
  }]
},
// fixme 导致无限跳转
// { path: '*', name: '404', redirect: '/error404' }
].concat([]);

const createRouter = () => new Router({
  mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
});

const router = createRouter();

// router.beforeEach((to, from, next) => {
//   console.log(to.path)
//   if (to.path === '/login') return next()
//   if (to.path.includes('/redirect/')) return next()
//   const tokenStr = getToken()
//   if (!tokenStr) return next('/login')
//   next()
// })

export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;

// export const subRouter = _subRouter
