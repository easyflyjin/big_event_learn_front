<script setup>
import avatar from '@/assets/default.png';
import {
    CaretBottom,
    Crop,
    EditPen,
    Management,
    Promotion,
    SwitchButton,
    User,
    UserFilled
} from '@element-plus/icons-vue';

import { getUserInfoService, LogoutService } from '@/api/user';
import { useTokenStore } from '@/store/token';
import { useInfoStore } from '@/store/userinfo';
import { ElMessage, ElMessageBox } from 'element-plus';

const getUserInfoLayOut = async() => {
    let result = await getUserInfoService();
    infoStore.setinfo(result.data);
    console.log(result)
}
getUserInfoLayOut();

import { useRouter } from 'vue-router';
const router = useRouter();
const tokenStore =useTokenStore();
const infoStore = useInfoStore();

const HandleCommand = (command) =>{
    if(command === 'logout'){
        ElMessageBox.confirm(
        '确认登出?',
        '警告',{
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning'
        } 
    ).then(
        async() =>{
            tokenStore.removeToken;
            infoStore.removeinfo;
            let result = await LogoutService();
            ElMessage.info(result.msg?result.msg:'Token被删除')
            router.push('/login')
            
            ElMessage({
                type: 'success',
                message:'退出登录成功'
            })
        }).catch(() => {
            ()=>{
                ElMessage({
                    type: 'info',
                    message: '取消退出登录'
                })
            }
        });
    }else{
        router.push('/user/'+command);
    }
}

</script>

<template>
    <el-container class="layout-container">
        <!-- 左侧菜单 -->
        <el-aside width="200px">
            <div class="el-aside__logo"></div>
            <el-menu active-text-color="#ffd04b" background-color="#232323"  text-color="#fff"
                router>
                <el-menu-item index = "/article/category">
                    <el-icon>
                        <Management />
                    </el-icon>
                    <span>文章分类</span>
                </el-menu-item>
                <el-menu-item index = "/article/manage">
                    <el-icon>
                        <Promotion />
                    </el-icon>
                    <span>文章管理</span>
                </el-menu-item>
                <el-sub-menu >
                    <template #title>
                        <el-icon>
                            <UserFilled />
                        </el-icon>
                        <span>个人中心</span>
                    </template>
                    <el-menu-item index = "/user/userInfo">
                        <el-icon>
                            <User />
                        </el-icon>
                        <span>基本资料</span>
                    </el-menu-item>
                    <el-menu-item index = "/user/avatar">
                        <el-icon>
                            <Crop />
                        </el-icon>
                        <span>更换头像</span>
                    </el-menu-item>
                    <el-menu-item index = "/user/updatePwd">
                        <el-icon>
                            <EditPen />
                        </el-icon>
                        <span>重置密码</span>
                    </el-menu-item>
                </el-sub-menu>
            </el-menu>
        </el-aside>
        <!-- 右侧主区域 -->
        <el-container>
            <!-- 头部区域 -->
            <el-header>
                <div>欢迎用户：<strong>{{ infoStore.info.nickname }}</strong></div>
                <el-dropdown placement="bottom-end" @Command ="HandleCommand">
                    <span class="el-dropdown__box">
                        <el-avatar :src="infoStore.info.userPic?infoStore.info.userPic:avatar" />
                        <el-icon>
                            <CaretBottom />
                        </el-icon>
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item command="userInfo" :icon="User">基本资料</el-dropdown-item>
                            <el-dropdown-item command="avatar" :icon="Crop">更换头像</el-dropdown-item>
                            <el-dropdown-item command="updatePwd" :icon="EditPen">重置密码</el-dropdown-item>
                            <el-dropdown-item command="logout" :icon="SwitchButton">退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </el-header  >
            <!-- 中间区域 -->
            <el-main>
                <!-- <div style="width: 1290px; height: 570px;border: 1px solid red;">
                    内容展示区
                </div> -->
                <router-view></router-view>
            </el-main>
            <!-- 底部区域 -->
            <el-footer>大事件 ©2024 Created by EASYFLYx</el-footer>
        </el-container>
    </el-container>
</template>

<style lang="scss" scoped>
.layout-container {
    height: 100vh;

    .el-aside {
        background-color: #232323;

        &__logo {
            height: 120px;
            background: url('@/assets/logo.png') no-repeat center / 120px auto;
        }

        .el-menu {
            border-right: none;
        }
    }

    .el-header {
        background-color: #fff;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .el-dropdown__box {
            display: flex;
            align-items: center;

            .el-icon {
                color: #999;
                margin-left: 10px;
            }

            &:active,
            &:focus {
                outline: none;
            }
        }
    }

    .el-footer {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        color: #666;
    }
}
</style>