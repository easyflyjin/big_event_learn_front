


import router from '@/router';
import { useTokenStore } from '@/store/token';
import axios from 'axios';
import { ElMessage } from 'element-plus';
const baseURL = '/api';
const instance = axios.create({baseURL})

instance.interceptors.request.use(
    (config)=>{
        //请求前的回调
        const tokenStore = useTokenStore();
        if(tokenStore.token){
            config.headers.Authorization = tokenStore.token
        }
        return config
    },
    (err) =>{
        router.push('/login')
        Promise.reject(err)
    }
)

;
//添加响应拦截器
instance.interceptors.response.use(
    result=>{
        //判断业务状态码
        if(result.data.code === 0){
            return result.data;
        }else{
            ElMessage.error(result.data.msg?result.data.msg:'操作失败')
            return Promise.reject(result.data);//异步的状态转化成失败的状态
        }
        
    },
    err=>{
        if(err.response.status === 401){
            //ElMessage.error('请先登录!')
            router.push('/login')
        }else{
            ElMessage.error('服务异常')
            router.push('/login')
        }
        
        return Promise.reject(err);//异步的状态转化成失败的状态
    }
)

export default instance;