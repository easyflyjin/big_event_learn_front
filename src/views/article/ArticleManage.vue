<script setup>
import { articleAddService, articleCategoryListService, articleDeleteService, articleListService, articleUpdateService } from '@/api/article';
import {
    Delete,
    Edit, Plus
} from '@element-plus/icons-vue';

import { ref } from 'vue';

//文章分类数据模型
const categorys = ref([])

//用户搜索时选中的分类id
const categoryId=ref('')

//用户搜索时选中的发布状态
const state=ref('')

//文章列表数据模型
const articles = ref([])

//分页条数据模型
const pageNum = ref(1)//当前页
const total = ref(20)//总条数
const pageSize = ref(10)//每页条数
const title = ref('')



//当每页条数发生了变化，调用此函数
const onSizeChange = (size) => {
    pageSize.value = size
    articleList()
}
//当前页码发生变化，调用此函数
const onCurrentChange = (num) => {
    pageNum.value = num
    articleList()
}

const articaleCategoryList = async () => {
    let result = await articleCategoryListService();
    categorys.value = result.data;
}
articaleCategoryList();


const articleList = async () => {
    let params = {
        pageNum: pageNum.value,
        pageSize: pageSize.value,
        categoryId: categoryId.value?categoryId.value:null,
        state: state.value?state.value:null
    }
    let result = await articleListService(params);
    total.value = result.data.total;
    articles.value = result.data.items;
    
    //定义（categoryId,categoryName）键值对
    const m = new Map();
    for(const element of categorys.value){
        let category = element
        m.set(category.id,category.categoryName)
    }
    for(const element of articles.value){
        let article = element;
        article.categoryName = m.get(article.categoryId);
    }
}
articleList();

const resetSearchCondition = () =>{
    state.value = '';
    categoryId.value = '';
    articaleCategoryList();
    articleList();
}


//控制抽屉是否显示
const visibleDrawer = ref(false)
//添加表单数据模型
const articleModel = ref({
    title: '',
    categoryId: '',
    coverImg: '',
    content:'',
    state:''
})
const clearArticleInfo = () =>{
    articleModel.value ={
        title: '',
        categoryId: '',
        coverImg: '',
        content:'',
        state:''
    }
}

import { useTokenStore } from '@/store/token.js';
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import { ElMessage, ElMessageBox } from 'element-plus';
const tokenStore = useTokenStore()


const upLoadSuccess = (result) =>{
    articleModel.value.coverImg = result.data;
    console.log(result.data)
}

const addArticle = async(states) =>{
    articleModel.value.state = states;
    console.log(articleModel.value)
    let result = await articleAddService(articleModel.value);
    ElMessage.success(result.msg?result.msg:'添加成功');
    visibleDrawer.value = false;
    clearArticleInfo();
    articleList();
}

const updateArticle = async (states) => {
    articleModel.value.state = states;
    let result = await articleUpdateService(articleModel.value);
    ElMessage.success(result.msg?result.msg:'添加成功');
    visibleDrawer.value = false;
    clearArticleInfo();    
    articleList();
}

const showDrawer = (row) =>{
    visibleDrawer.value = true;
    title.value = '编辑文章';

    articleModel.value.title = row.title;
    articleModel.value.coverImg = row.coverImg;
    articleModel.value.content = row.content;
    articleModel.value.categoryId = row.categoryId;
    articleModel.value.id = row.id
}

const deleteArticle = (row) => {
    //console.log(row.id);
    ElMessageBox.confirm(
        '确认删除?',
        '警告',{
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning'
        } 
    ).then(
        async() =>{
            let result = await articleDeleteService(row.id);
            articleList();
            ElMessage({
                type: 'success',
                message:'删除成功'
            })
        }).catch(() => {
            ()=>{
                ElMessage({
                    type: 'info',
                    message: '取消删除'
                })
            }
        });d
    

}
</script>
<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>文章管理</span>
                <div class="extra">
                    <el-button type="primary" @click ="visibleDrawer = true;title = '添加文章'">添加文章</el-button>
                </div>
            </div>
        </template>
        <!-- 搜索表单 -->
        <el-form inline>
            <el-form-item label="文章分类：" >
                <el-select placeholder="请选择" v-model="categoryId" style="width: 220px;">
                    <el-option 
                        v-for="c in categorys" 
                        :key="c.id" 
                        :label="c.categoryName"
                        :value="c.id">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="发布状态：">
                <el-select placeholder="请选择" v-model="state"style="width: 220px;">
                    <el-option label="已发布" value="已发布"></el-option>
                    <el-option label="草稿" value="草稿"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click ="articleList()">搜索</el-button>
                <el-button @click = "resetSearchCondition()">重置</el-button>
            </el-form-item>
        </el-form>
        <!-- 文章列表 -->
        <el-table :data="articles" style="width: 100%">
            <el-table-column label="文章标题" width="400" prop="title"></el-table-column>
            <el-table-column label="分类" prop="categoryName"></el-table-column>
            <el-table-column label="发表时间" prop="createTime"> </el-table-column>
            <el-table-column label="状态" prop="state"></el-table-column>
            <el-table-column label="操作" width="100">
                <template #default="{ row }">
                    <el-button :icon="Edit" circle plain type="primary" @click = "showDrawer(row)"></el-button>
                    <el-button :icon="Delete" circle plain type="danger" @click = "deleteArticle(row)"></el-button>
                </template>
            </el-table-column>
            <template #empty>
                <el-empty description="没有数据" />
            </template>
        </el-table>
        <!-- 分页条 -->
        <el-pagination v-model:current-page="pageNum" v-model:page-size="pageSize" :page-sizes="[3, 5 ,10, 15]"
            layout="jumper, total, sizes, prev, pager, next" background :total="total" @size-change="onSizeChange"
            @current-change="onCurrentChange" style="margin-top: 20px; justify-content: flex-end" />
        <el-drawer v-model="visibleDrawer" :title="title" direction="rtl" size="50%">
            <!-- 添加文章表单 -->
            <el-form :model="articleModel" label-width="100px" >
                <el-form-item label="文章标题" >
                    <el-input v-model="articleModel.title" placeholder="请输入标题"></el-input>
                </el-form-item>
                <el-form-item label="文章分类">
                    <el-select placeholder="请选择" v-model="articleModel.categoryId">
                        <el-option v-for="c in categorys" :key="c.id" :label="c.categoryName" :value="c.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="文章封面">
                    <el-upload class="avatar-uploader" :auto-upload="true" :show-file-list="false" action ="/api/upload" name = "file" :headers = "{Authorization:tokenStore.token}" :on-success="upLoadSuccess">
                        <img v-if="articleModel.coverImg"  :src="articleModel.coverImg" :headers = "{Authorization:tokenStore.token}" class="avatar" />
                        <el-icon v-else class="avatar-uploader-icon">
                            <Plus />
                        </el-icon>
                    </el-upload>
                </el-form-item>
                <el-form-item label="文章内容">
                    <div class="editor">
                        <QuillEditor theme="snow" v-model:content="articleModel.content" content-type="html"></QuillEditor>
                    </div>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click ="title == '添加文章'?addArticle('已发布'):updateArticle('已发布')">发布</el-button>
                    <el-button type="info" @click ="title == '添加文章'?addArticle('草稿'):updateArticle('草稿')">草稿</el-button>
                </el-form-item>
            </el-form>
        </el-drawer>
    </el-card>
    
</template>
<style lang="scss" scoped>

.page-container {
    min-height: 100%;
    box-sizing: border-box;

    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

}
.avatar-uploader {
    :deep() {
        .avatar {
            width: 178px;
            height: 178px;
            display: block;
        }

        .el-upload {
            border: 1px dashed var(--el-border-color);
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            transition: var(--el-transition-duration-fast);
        }

        .el-upload:hover {
            border-color: var(--el-color-primary);
        }

        .el-icon.avatar-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width: 178px;
            height: 178px;
            text-align: center;
        }
    }
}
.editor {
  width: 100%;
  :deep(.ql-editor) {
    min-height: 200px;
  }
}
</style>