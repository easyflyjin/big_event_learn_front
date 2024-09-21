//导入request.js
import request from '@/utils/request.js';
export const userRegisterService = (registerData) =>{
    //借助UrlSearchParam
    const params = new URLSearchParams()
    for(let key in registerData){
        params.append(key,registerData[key])
    }
    return request.post('/user/register', params);
    
}

export const userLoginService = (loginData) => {
    const params = new URLSearchParams()
    for(let key in loginData){
        params.append(key,loginData[key])
    }
    return request.post('/user/login',params)
}

export const getUserInfoService = () => {
    return request.get('/user/userInfo')
}

export const LogoutService = () =>{
    return request.get('/user/logout')
}

export const updateUserInfoService = (userInfoData) =>{
    return request.put('/user/update',userInfoData)
}

export const updatePwdService = (PwdData) =>{
    return request.patch('/user/updatePwd',PwdData)
}

export const updateAvatarService = (avatarUrl) =>{
    const params = new URLSearchParams();
    params.append('avatarUrl',avatarUrl)
    return request.patch('/user/avatar',params)
}