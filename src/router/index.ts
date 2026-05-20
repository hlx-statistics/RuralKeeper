import { createRouter, createWebHashHistory } from 'vue-router'
import { AppRoute } from '@/constants'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', redirect: { name: AppRoute.Goods } },
    {
      path: '/goods',
      name: AppRoute.Goods,
      component: () => import('@/views/GoodsView.vue'),
    },
    {
      path: '/sale',
      name: AppRoute.Sale,
      component: () => import('@/views/SaleView.vue'),
    },
    {
      path: '/profile',
      name: AppRoute.Profile,
      component: () => import('@/views/ProfileView.vue'),
    },
  ],
})

export default router
