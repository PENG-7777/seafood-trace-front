import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  // ========== 管理员后台路由 ==========
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/admin/login/Login.vue'),
    meta: { requiresAuth: false }
  },
  // 管理员大屏首页
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/admin/node/NodeManage.vue'),
    meta: { requiresAuth: true, role: 'admin' }
  },
  {
    path: '/node/manage',
    name: 'NodeManage',
    component: () => import('@/views/admin/node/NodeManage.vue'),
    meta: { requiresAuth: true, role: 'admin' }
  },

  // ========== 流通结点端路由 ==========
  {
    path: '/node/login',
    name: 'NodeLogin',
    component: () => import('@/views/node/login/NodeLogin.vue'),
    meta: { requiresAuth: false, role: 'node' }
  },
  {
    path: '/node/home',
    name: 'NodeHome',
    component: () => import('@/views/node/home/index.vue'),
    meta: { requiresAuth: true, role: 'node' }
  },
  {
    path: '/node/fishBatch/list',
    name: 'FishBatchList',
    component: () => import('@/views/node/fishBatch/list.vue'),
    meta: { requiresAuth: true, role: 'node' }
  },
  {
    path: '/node/fishBatch/add',
    name: 'FishBatchAdd',
    component: () => import('@/views/node/fishBatch/add.vue'),
    meta: { requiresAuth: true, role: 'node' }
  },
  {
    path: '/node/farmSeaBatch/list',
    name: 'farmSeaBatchList',
    component: () => import('@/views/node/farmSeaBatch/list.vue'),
    meta: { requiresAuth: true, role: 'node' }
  },
  {
    path: '/node/farmSeaBatch/add',
    name: 'farmSeaBatchAdd',
    component: () => import('@/views/node/farmSeaBatch/add.vue'),
    meta: { requiresAuth: true, role: 'node' }
  },
  {
    path: '/node/processBatch/list',
    name: 'ProcessBatchList',
    component: () => import('@/views/node/processBatch/list.vue'),
    meta: { requiresAuth: true, role: 'node' }
  },
  {
    path: '/node/processBatch/add',
    name: 'ProcessBatchAdd',
    component: () => import('@/views/node/processBatch/add.vue'),
    meta: { requiresAuth: true, role: 'node' }
  },
  {
    path: '/node/wholBatch/list',
    name: 'WholBatchList',
    component: () => import('@/views/node/wholBatch/list.vue'),
    meta: { requiresAuth: true, role: 'node' }
  },
  {
    path: '/node/wholBatch/add',
    name: 'WholBatchAdd',
    component: () => import('@/views/node/wholBatch/add.vue'),
    meta: { requiresAuth: true, role: 'node' }
  },
  {
    path: '/node/retaBatch/list',
    name: 'RetailBatchList',
    component: () => import('@/views/node/retaBatch/list.vue'),
    meta: { requiresAuth: true, role: 'node' }
  },
  {
    path: '/node/retaBatch/add',
    name: 'RetailBatchAdd',
    component: () => import('@/views/node/retaBatch/add.vue'),
    meta: { requiresAuth: true, role: 'node' }
  },
  {
    path: '/node/audit',
    name: 'AuditBatch',
    component: () => import('@/views/node/audit/index.vue'),
    meta: { requiresAuth: true, role: 'node' }
  },
  {
    path: '/node',
    redirect: '/node/home'
  },
  // ========== 消费者溯源公开页面 ==========
  {
    path: '/customer/trace',
    name: 'CustomerTrace',
    component: () => import('@/views/customer/trace/index.vue'),
    meta: { requiresAuth: false }
  },
  // 根路径默认跳管理员登录，登录状态的判断全部交给beforeEach守卫处理
  { path: '/', redirect: '/login' }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

/**
 * 全局路由前置守卫
 * ✅ useStore 必须写在守卫回调函数内部，不要写在模块顶层，不要写在routes.redirect回调中
 */
router.beforeEach((to, from, next) => {
  // 每次导航触发，在守卫内部获取store实例
  const userStore = useUserStore()
  const nodeStore = useNodeUserStore()

  // 免登录页面直接放行
  if (!to.meta.requiresAuth) {
    // 已登录状态，禁止再次进入登录页，自动跳转到对应首页
    if (to.path === '/login' && userStore.isLoggedIn()) {
      return next('/dashboard')
    }
    if (to.path === '/node/login' && nodeStore.isLoggedIn()) {
      return next('/node/home')
    }
    return next()
  }

  // 流通节点权限判断
  if (to.meta.role === 'node') {
    if (nodeStore.isLoggedIn()) {
      next()
    } else {
      next('/node/login')
    }
  } else if (to.meta.role === 'admin') {
    // 管理员权限判断
    if (userStore.isLoggedIn()) {
      next()
    } else {
      next('/login')
    }
  } else {
    next()
  }
})

// 注意！import 要放在守卫外面，不能写在routes数组内部
import { useUserStore } from '@/store/user'
import { useNodeUserStore } from '@/store/nodeUser'

export default router
