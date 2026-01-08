<template>
    <div class="common-layout">
        <el-container>
            <el-header>
                <div>
                    <el-row :gutter="30">
                        <el-col :span="7">
                            <el-input placeholder="护理项目名称" v-model="queryParams.itemName" @clear="query" clearable
                                size="large">
                                <template #append>
                                    <el-button type="info" @click="query" style="color:black"
                                        icon="Search">查询</el-button>
                                </template>
                            </el-input>
                        </el-col>
                        <el-col :span="1" style="margin-top:1px;">
                            <el-button type="primary" @click="this.$router.go(-1)" icon="ArrowLeftBold"
                                style="height: 38px;width:120px">返回上一级</el-button>
                        </el-col>
                    </el-row>
                </div>
            </el-header>
            <el-divider style="margin:0"></el-divider>
            <el-main>
                <el-row :gutter="20">
                    <el-col :span="11">
                        <div class="table-main">
                            <div class="table-main-header">护理项目</div>
                            <!-- 表格 -->
                            <el-table :data="nurseItemList" highlight-current-row style="width: 90% ;color:black;"
                                size="small" @row-click="changeRow" stripe>
                                <el-table-column align="center" type="index" :index="indexMethod" label="序号"
                                    width="60" />
                                <el-table-column align="center" prop="serialNumber" label="编号" width="100" />
                                <el-table-column align="center" prop="nursingName" label="名称" width="100" />
                                <el-table-column align="center" prop="servicePrice" label="价格" width="80" />
                                <el-table-column align="center" prop="executionCycle" label="执行周次" width="80" />
                                <el-table-column align="center" prop="executionTimes" label="执行次数" width="80" />
                            </el-table>
                            <!-- 分页插件 -->
                            <div style="margin-top:15px">
                                <el-pagination :page-size="pages.pageSize" background :current-page="pages.currentPag"
                                    layout=" prev, pager, next" :total="pages.total"
                                    @current-change="handleCurrentChange" />
                            </div>
                        </div>
                    </el-col>
                    <el-col :span="13">
                        <div class="table-main">
                            <div class="table-main-header">护理项目({{ levelName }})</div>
                            <!-- 表格 -->
                            <el-table :data="isInLevelItemList" style="width: 90% ;color:black;" size="small" stripe>
                                <el-table-column align="center" type="index" label="序号" width="60" />
                                <el-table-column align="center" prop="serialNumber" label="编号" width="80" />
                                <el-table-column align="center" prop="nursingName" label="名称" width="100" />
                                <el-table-column align="center" prop="servicePrice" label="价格" width="100" />
                                <el-table-column align="center" prop="executionCycle" label="执行周次" width="80" />
                                <el-table-column align="center" prop="executionTimes" label="执行次数" width="80" />
                                <el-table-column align="center" label="操作" width="100">
                                    <template #default="scope">
                                        <el-button type="danger" icon="CloseBold" size="small"
                                            @click="del(scope.row)">删除</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </el-col>
                </el-row>
            </el-main>
        </el-container>
    </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted,computed } from 'vue'
import { useRoute } from 'vue-router'
import { addItemToLevel, listNurseItemByLevel, removeNurseLevelItem } from "@/api/nurseLevelApi.js";
import { findNurseItem } from "@/api/nurseItemApi.js";
import { ElMessage, ElMessageBox } from 'element-plus';

const route = useRoute()//获取路由参数
const levelId = ref(route.query.levelId) //获取路由参数-级别ID
const levelName = ref(route.query.levelName) //获取路由参数-级别名称

// 查询参数
const queryParams = reactive({
    status: "1", // 查询默认状态1 -启用
    itemName: "",
    pageNum: 1,   // 当前页
    pageSize: 6   // 每页条数
})
// 分页属性封装
const pages = reactive({
    total: 0,
    pageSize: 6,
    currentPag: 1,
    pagCount: 0
})
// 护理项目列表
const nurseItemList = ref([])
//获取护理项目列表
const getNurseItemList = async () => {
    const res = await findNurseItem(queryParams)
    console.log("获取护理项目列表+++>>", res)
    if (res.flag) {
        nurseItemList.value = res.data.records // 记录数
        pages.total = res.data.total  // 总记录数
        pages.pagCount = res.data.pages // 总页数
        pages.currentPag = res.data.current // 当前页码
        pages.pageSize = res.data.size  // 每页条数
        queryParams.pageNum = res.data.current // 同步
    }
}

// 在当前级别中的护理项目
const isInLevelItemList = ref([])

// 获取当前级别中的护理项目
const getIsInLevelItemList = async () => {
    const res = await listNurseItemByLevel(levelId.value) //根据ID获取当前级别中的护理项目
    // console.log("获取当前级别中的护理项目+++>>",res)
    if (res.flag) {
        isInLevelItemList.value = res.data
    }
}
//选中页码
const handleCurrentChange = (val) => {
    queryParams.pageNum = val;
    pages.currentPag = val;
    getNurseItemList();
}

//点击查询
const query = () => {
    queryParams.pageNum = 1; //回到第一页
    getNurseItemList()
}

//api-鼠标点击某行触发: 添加护理项目到当前护理级别中
const changeRow = async (row) => {
    let res = await addItemToLevel({
        levelId: levelId.value,
        itemId: row.id
    })
    if (res.flag) {
        getIsInLevelItemList() //刷新
        ElMessage.success(" 添加护理项目成功！！！")
    } else {
        ElMessage.error(" 添加护理项目失败！！！")
    }
}

//删除
const del = async (row) => {
    ElMessageBox.confirm("此操作删除记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
    }).then(async () => {
        //console.log(row)    
        let res = await removeNurseLevelItem({
            levelId: levelId.value,
            itemId: row.id
        })
        if (res.flag) {
            getIsInLevelItemList() //刷新
            ElMessage.success(" 删除护理项目成功！！！")
        } else {
            ElMessage.error(" 删除护理项目失败！！！")
        }
    }).catch(() => {
        ElMessage.success("取消删除！！")
    });
}
//序号
const indexMethod = computed(() => {
    return pages.currentPag * pages.pageSize - pages.pageSize + 1; 
})

onMounted(() => {
    getNurseItemList()
    getIsInLevelItemList()
})

</script>
<style lang="scss" scoped></style>
