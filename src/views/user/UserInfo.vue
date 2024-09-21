<script setup>
import { ref } from 'vue';
const userInfo = ref('')
const rules = {
    nickname: [
        { required: true, message: '请输入用户昵称', trigger: 'blur' },
        {
            pattern: /^\S{1,20}$/,
            message: '昵称必须是1-20位的非空字符串',
            trigger: 'blur'
        }
    ],
    email: [
        { required: true, message: '请输入用户邮箱', trigger: 'blur' },
        { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
    ]
}

import { getUserInfoService, updateUserInfoService } from '@/api/user';
import { useInfoStore } from '@/store/userinfo';
import { ElMessage } from 'element-plus';

//const infoStore = useInfoStore();

const getUserInfo = async() => {
    let result = await getUserInfoService();
    //infoStore.setinfo(result.data);
   
    userInfo.value = result.data;
    console.log(userInfo.value)
}
getUserInfo();
const infoStore = useInfoStore();
const updateUserInfo = async() =>{
    let result = await updateUserInfoService(userInfo.value);
    ElMessage.success('修改成功')
    console.log(infoStore.info)
    location.reload();
}


</script>
<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>基本资料</span>
            </div>
        </template>
        <el-row>
            <el-col :span="12">
                <el-form :model="userInfo" :rules="rules" label-width="100px" size="large">
                    <el-form-item label="登录名称">
                        <el-input v-model="userInfo.username" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="用户昵称" prop="nickname">
                        <el-input v-model="userInfo.nickname"></el-input>
                    </el-form-item>
                    <el-form-item label="用户邮箱" prop="email">
                        <el-input v-model="userInfo.email"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click = "updateUserInfo">提交修改</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </el-card>
</template>