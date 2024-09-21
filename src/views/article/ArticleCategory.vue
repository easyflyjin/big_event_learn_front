<script setup>
import { articleCategoryAddService, articleCategoryDeleteService, articleCategoryListService, articleCategoryUpdateService } from '@/api/article.js';
import {
    Delete,
    Edit
} from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { ref } from 'vue';
const categorys = ref([])
const articaleCategoryList = async() =>{
    let result =  await articleCategoryListService();
    categorys.value = result.data;
}
articaleCategoryList();

const dialogVisible = ref(false)

const categoryModel = ref({
    categoryName:'',
    categoryAlias:'',
})

const rules = {
    categoryName:[
        {required: true, message: '请输入分类名称',trigger:'blur'}
    ],
    categoryAlias:[
        {required: true, message: '请输入分类别名',trigger:'blur'}
    ]
}

//调用接口,添加表单
const addCategory = async() =>{
    let result = await articleCategoryAddService(categoryModel.value);
    ElMessage.success(result.msg?result.msg:'添加成功');
    dialogVisible.value = false;
    articaleCategoryList();
    
}

const title = ref('')

const showEdit = (row) =>{
    dialogVisible.value = true;
    title.value = '编辑分类';

    categoryModel.value.categoryAlias = row.categoryAlias;
    categoryModel.value.categoryName = row.categoryName;
    categoryModel.value.id = row.id;
}

const updateCategory = async() =>{
    let result = await articleCategoryUpdateService(categoryModel.value)
    ElMessage.success('修改成功');
    dialogVisible.value = false;
    articaleCategoryList();
}

const clearData = () =>{
    categoryModel.value.categoryAlias = ''
    categoryModel.value.categoryName = ''
}
const deleteCategory = (row) => {
    console.log(row)
    console.log(row.id) 
    ElMessageBox.confirm(
        '确认删除?',
        '警告',{
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning'
        } 
    ).then(
        async() =>{
            let result = await articleCategoryDeleteService(row.id);
            articaleCategoryList();
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
        });

}
</script>
<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>文章分类</span>
                <div class="extra">
                    <el-button type="primary" @click = "dialogVisible = true;title = '添加分类';clearData()">添加分类</el-button>
                </div>
            </div>
        </template>
        <el-table :data="categorys" style="width: 100%">
            <el-table-column label="序号" width="100" prop = "id"> </el-table-column>
            <el-table-column label="分类名称" prop="categoryName"></el-table-column>
            <el-table-column label="分类别名" prop="categoryAlias"></el-table-column>
            <el-table-column label="操作" width="100">
                <template #default="{ row }">
                    <el-button :icon="Edit" circle plain type="primary" @click="showEdit(row);clearData()"></el-button>
                    <el-button :icon="Delete" circle plain type="danger" @click = "deleteCategory(row)"></el-button>
                </template>
            </el-table-column>
            <template #empty>
                <el-empty description="没有数据" />
            </template>
        </el-table>


        <el-dialog v-model="dialogVisible" :title="title" width="30%">
            <el-form :model="categoryModel" :rules="rules" label-width="100px" style="padding-right: 30px">
                <el-form-item label="分类名称" prop="categoryName">
                    <el-input v-model="categoryModel.categoryName" minlength="1" maxlength="10"></el-input>
                </el-form-item>
                <el-form-item label="分类别名" prop="categoryAlias">
                    <el-input v-model="categoryModel.categoryAlias" minlength="1" maxlength="15"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click = "title == '添加分类'?addCategory():updateCategory()"> 确认 </el-button>
                </span>
            </template>
        </el-dialog>
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
</style>