import request from '@/utils/request.js';
//文章分类列表查询
export const articleCategoryListService = () =>{
    //const tokenStore = useTokenStore();
    //在pinia中定义的响应式数据都不需要加.value
    return request.get('/category')
}

export const articleCategoryAddService = (categoryData) =>{
    return request.post('/category',categoryData)
}

export const articleCategoryUpdateService = (categoryData) =>{
    return request.put('/category',categoryData)
}

export const articleCategoryDeleteService = (id) =>{
    return request.delete('/category?id='+id);
}
export const articleListService = (params) =>{
    return request.get('/article',{params:params})
}

export const articleAddService = (articleData) =>{
    return request.post('/article',articleData)
}

export const articleUpdateService = (ariticleData) =>{
    return request.put('/article', ariticleData)
}

export const articleDeleteService = (id) =>{
    return request.delete('/article?id='+id);
}