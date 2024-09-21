<script setup>
    import { updatePwdService } from '@/api/user';
import { ElMessage } from 'element-plus';
import { ref } from 'vue';
    const pwdModel = ref({
        old_pwd: '',
        new_pwd: '',
        re_pwd: ''
    })
    const confirmPwd = (rule, value, callback) =>{
    if(value !== pwdModel.value.new_pwd){
        callback(new Error('两次输入的密码不一致'))
    }else{
        callback();
    }
}
    const rules = {
    old_pwd: [
        { required: true, message: '请输入旧密码', trigger: 'blur' }
    ],
    new_pwd: [
        { required: true, message: '请输入新密码', trigger: 'blur' },
        {
            pattern: /^\S{5,16}$/,
            message: '密码必须是5-16位的非空字符串',
            trigger: 'blur'
        }
    ],
    re_pwd: [
        { required: true, message: '请重新输入密码', trigger: 'blur' },
        { validator: confirmPwd,trigger: 'blur'}
    ]
}

const updatePwd = async () => {
    let result = await updatePwdService(pwdModel.value);
    console.log(result.data)
    if(result.code === 1){
        ElMessage.error(result.message?result.message:'操作失败1111')
        
    }
    
    ElMessage.success('修改成功')

}


</script>


<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>修改密码</span>
            </div>
        </template>
        <el-row>
            <el-col :span="12">
                <el-form :model="pwdModel" :rules="rules" label-width="100px" size="large">
                    <el-form-item label="旧密码" prop="old_pwd">
                        <el-input type = "password" v-model="pwdModel.old_pwd" ></el-input>
                    </el-form-item>
                    <el-form-item  label="新密码" prop="new_pwd">
                        <el-input type = "password" v-model="pwdModel.new_pwd"></el-input>
                    </el-form-item>
                    <el-form-item label="再次输入密码" prop="re_pwd">
                        <el-input type = "password" v-model="pwdModel.re_pwd"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click = "updatePwd">提交修改</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </el-card>
</template>