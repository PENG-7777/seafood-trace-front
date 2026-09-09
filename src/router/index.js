import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/admin/login/Login.vue'),
    meta: { requiresAuth: false }
  },
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
    path: '/node/fishBatch/confirmList',
    name: 'FishBatchConfirm',
    component: () => import('@/views/node/fishBatch/confirmList.vue'),
    meta: { requiresAuth: true, role: 'node' }
  },
  {
    path: '/node/farmSeaBatch/confirmList',
    name: 'FarmSeaBatchConfirm',
    component: () => import('@/views/node/farmSeaBatch/confirmList.vue'),
    meta: { requiresAuth: true, role: 'node' }
  },
  {
    path: '/node/processBatch/confirmList',
    name: 'ProcessBatchConfirm',
    component: () => import('@/views/node/processBatch/confirmList.vue'),
    meta: { requiresAuth: true, role: 'node' }
  },
  {
    path: '/node/wholBatch/confirmList',
    name: 'WholBatchConfirm',
    component: () => import('@/views/node/wholBatch/confirmList.vue'),
    meta: { requiresAuth: true, role: 'node' }
  },
  {
    path: '/node/password',
    name: 'NodePassword',
    component: () => import('@/views/node/password/index.vue'),
    meta: { requiresAuth: true, role: 'node' }
  },
  {
    path: '/node',
    redirect: '/node/home'
  },
  {
    path: '/customer/trace',
    name: 'CustomerTrace',
    component: () => import('@/views/customer/trace/index.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/customer/trace/detail',
    name: 'CustomerTraceDetail',
    component: () => import('@/views/customer/trace/detail.vue'),
    meta: { requiresAuth: false }
  },
  { path: '/', redirect: '/login' },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/customer/trace'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 工具函数：读取localStorage中pinia持久化的admin用户token
function getAdminToken() {
  const str = localStorage.getItem('user')
  if (!str) return ''
  try {
    const obj = JSON.parse(str)
    return obj.token || ''
  } catch (e) {
    return ''
  }
}

// 工具函数：读取localStorage中pinia持久化的node用户token
function getNodeToken() {
  const str = localStorage.getItem('nodeUser')
  if (!str) return ''
  try {
    const obj = JSON.parse(str)
    return obj.token || ''
  } catch (e) {
    return ''
  }
}

router.beforeEach((to, from, next) => {
  const adminToken = getAdminToken()
  const nodeToken = getNodeToken()

  // 不需要登录的页面
  if (!to.meta.requiresAuth) {
    // 访问管理员登录页，管理员已有token，跳dashboard
    if (to.path === '/login' && adminToken.trim()) {
      return next('/dashboard')
    }
    // 访问节点登录页，节点已有token，跳node/home
    if (to.path === '/node/login' && nodeToken.trim()) {
      return next('/node/home')
    }
    return next()
  }

  // 需要鉴权的页面
  if (to.meta.role === 'node') {
    if (!nodeToken.trim()) {
      return next('/node/login')
    }
  } else if (to.meta.role === 'admin') {
    if (!adminToken.trim()) {
      return next('/login')
    }
  }

  next()
})

export default router
