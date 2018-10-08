import Vue from 'vue';
import Router from 'vue-router';
import applist from 'views/applist';
import course from 'views/course';
import { getLocalStorage } from '../assets/js/storage';
import store from '@/store';
import $ from 'jquery';

Vue.use(Router);

const router = new Router({
    routes: [
        {
            path: '/',
            name: 'home',
            redirect: '/course'
        },
        {
            path: '/login',
            name: 'login',
            meta: { requiredLoading: true, requiredAuth: false },
            component: ()=> import ('views/login/login'),
            children: [{
                path: 'reset',
                name: 'reset',
                meta: { requiredLoading: true, requiredAuth: false },
                component:()=> import ('views/login/reset')
            }]
        },
        {
            path: '/userCenter',
            name: 'userCenter',
            meta: { requiredLoading: true, requiredAuth: true },
            component: ()=> import ('views/userCenter/userCenter')
        },
        {
            path: '/taskCenter',
            name: 'taskCenter',
            meta: { requiredLoading: true, requiredAuth: true },
            component: () =>
                import ('views/taskCenter/taskCenter.vue')
        },
        {
            path: '/applist',
            name: 'applist',
            meta: { requiredLoading: true, requiredAuth: true },
            component: applist
        },
        {
            path: '/course',
            name: 'course',
            meta: { requiredLoading: true, requiredAuth: true },
            component: () =>
                import ('views/course/index.vue')

        },
        {
            path: "/interactiveStudy",
            name: "interactiveStudy",
            meta: { requiredLoading: false, requiredAuth: true },
            component: () =>
                import ('views/interactiveStudy')
        },
        {
            path: "/taskList",
            name: "taskList",
            meta: { requiredLoading: true, requiredAuth: true },
            component: () =>
                import ('views/taskList/taskList.vue')
        }
    ]
});

router.beforeEach((to, from, next) => {
    if(to.meta.requiredLoading) {
      store.dispatch('toggleLoadShowFullScreen', true);
    }
    if(to.matched.some(record => record.meta.requiredAuth)) {
      if(!getLocalStorage('token')) {
        next({
          path: '/login',
          query: { redirect: to.fullPath }
        })
      }else {
        next();
      }
    }else {
      next();
    }
});

router.afterEach((to, from) => {
    store.dispatch('toggleLoadShowFullScreen', false);
})

export default router;