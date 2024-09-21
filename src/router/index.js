

//导入组件
import ArticleCategory from '@/views/article/ArticleCategory.vue'
import ArticleManage from '@/views/article/ArticleManage.vue'
import LayOut from '@/views/LayOut.vue'
import Login from '@/views/Login.vue'
import UserAvatar from '@/views/user/UserAvatar.vue'
import UserInfo from '@/views/user/UserInfo.vue'
import UserResetPassword from '@/views/user/UserResetPassword.vue'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {path:'/login', component:Login},
    {path:'/', component:LayOut, redirect: "/article/manage",children:[
        {path:'/article/category',component: ArticleCategory},
        {path:'/article/manage',component:ArticleManage},
        {path:'/user/userInfo',component:UserInfo},
        {path:'/user/avatar',component: UserAvatar},
        {path:'/user/updatePwd',component: UserResetPassword}
    ]}
]

//创建路由器
const router = createRouter({
    history:createWebHistory(),
    routes:routes
})
//导出router
export default router