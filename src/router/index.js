// import Vue from 'vue'
// import Router from 'vue-router'
import {createRouter, createWebHistory} from "vue-router";
import HomePage from '@/components/Home'
import MatTemp from '@/components/views/matFile'
import SiiTemp from '@/components/views/siiFile'
import TobjTemp from '@/components/views/tobjFile'

// Vue.use(Router)

const routerHistory = createWebHistory()

const router = createRouter({
    history: routerHistory,
    routes: [
        {
            path: '/',
            component: HomePage
        },
        {
            path: '/matTemp',
            component: MatTemp
        },
        {
            path: '/siiTemp',
            component: SiiTemp
        },
        {
            path: '/tobjTemp',
            component: TobjTemp
        },
    ]
})

export default router
