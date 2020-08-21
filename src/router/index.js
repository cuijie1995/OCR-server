import Vue from 'vue'
import Router from 'vue-router'
import Index from "../views/index"


Vue.use(Router)

const router = new Router({
    mode: 'hash',
    routes: [{
        path: '/',
        name: 'index',
        redirect: '/preview',
        component: Index,
        children: [{
            path: '/preview',
            name: 'preview',
            component: () => import('@/views/preview.vue'),
        },
        ]
    },
    {
        path: '/table',
        name: 'table',
        component: () => import('@/views/table.vue'),
    },
    // {
    //     path: '/home',
    //     name: 'home',
    //     component: () => import('@/views/home.vue'),
    // },
    {
        path: '/TableIndex',
        name: 'TableIndex',
        component: () => import('@/views/TableIndex.vue'),
    },
    {
        path: '/paste',
        name: 'paste',
        component: () => import('@/views/paste.vue'),
    },
    {
        path: '/esc',
        name: 'esc',
        component: () => import('@/views/esc.vue'),
    },

    ],
})



// router.beforeEach((to, from, next) => {
// console.log(to)
// console.log(from)
// if (to.name == "preview" && from.name == "TableIndex") {
//     // to.meta.keepAlive = true
// }
// })




export default router;