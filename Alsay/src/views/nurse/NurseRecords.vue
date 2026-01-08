<template>
    <div class="common-layout">
        <el-container>
            <el-header>
                <el-row :gutter="30">
                    <el-col :span="7">
                        <el-input placeholder="客户姓名" @clear="query" v-model="condition.customerName" clearable
                            size="large">
                            <template #append>
                                <el-button type="info" @click="query" style="color:black">查询</el-button>
                            </template>
                        </el-input>
                    </el-col>
                </el-row>
            </el-header>
            <el-divider style="margin:0"></el-divider>
            <el-main>
                <el-row :gutter="20">
                    <el-col :span="9">
                        <div class="table-main">
                            <div class="table-main-header">客户信息</div>
                            <!-- 表格 -->
                            <el-table :data="customerList" highlight-current-row @current-change="handleChangeCustomer"
                                size="small" style="width: 100% ;color:black;" stripe>
                                <el-table-column align="center" fixed type="index" :index="indexMethod" label="序号"
                                    width="40" />
                                <el-table-column align="center" prop="customerName" label="姓名" />
                                <el-table-column align="center" prop="customerAge" label="年龄" />
                                <el-table-column align="center" prop="customerSex" label="性别">
                                    <template #default="scope">{{ scope.row.customerSex == 0 ? '男' : '女' }}</template>
                                </el-table-column>
                                <el-table-column align="center" prop="bedNo" label="床号" width="90" />
                                <el-table-column align="center" prop="levelName" label="护理级别" />
                            </el-table>
                            <!-- 分页插件 -->
                            <div style="margin-top:15px">
                                <el-pagination :page-size="pages.pageSize" background :current-page="pages.currentPag"
                                    layout=" prev, pager, next" :total="pages.total"
                                    @current-change="handleCurrentChange" />
                            </div>
                        </div>
                    </el-col>
                    <el-col :span="15">
                        <div class="table-main">
                            <div class="table-main-header">护理记录</div>
                            <!-- 表格 -->
                            <el-table :data="nurseRecordList" size="small">
                                <el-table-column align="center" :index="indexMethodRecord" type="index" label="序号"
                                    width="40" />
                                <el-table-column align="center" prop="serialNumber" label="护理项目编号" width="100" />
                                <el-table-column align="center" prop="nursingName" label="护理项目名称" width="100" />
                                <el-table-column align="center" prop="nursingCount" label="护理数量" width="70" />
                                <el-table-column align="center" prop="nursingContent" label="护理内容" width="120" />
                                <el-table-column align="center" prop="nickname" label="护理人员" width="80" />
                                <el-table-column align="center" prop="phoneNumber" label="护理人员号码" width="100" />
                                <el-table-column align="center" prop="nursingTime" label="护理时间" width="100" />
                                <el-table-column align="center" label="操作" width="100">
                                    <template #default="scope">
                                        <el-button type="danger" size="small" round plain
                                            @click="del(scope.row.id)">移除</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <!-- 分页插件 -->
                            <div style="margin-top:15px" v-if="nurseRecordList.length > 0">
                                <el-pagination :page-size="pageRecord.pageSize" background
                                    :current-page="pageRecord.currentPag" layout=" prev, pager, next"
                                    :total="pageRecord.total" @current-change="handleRecordChange" />
                            </div>
                        </div>
                    </el-col>
                </el-row>
            </el-main>
        </el-container>
    </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { getListPage } from "@/api/customerApi.js";
import { listNurseRecordsVo, removeCustomerRecord } from "@/api/nurseRecordApi.js";

// ---------------------客户信息--------------------------
//客户信息列表
const customerList = ref([]);
// 查询条件
const condition = reactive({
    customerName: "",
    pageSize: "1" // 默认第一页
});
// 分页属性封装 --客户
const pages = reactive({
    total: 0,
    pageSize: 6,
    currentPag: 1,
    pagCount: 0
});
// 计算属性 - 分页序号不重复 - 客户
const indexMethod = computed(() => {
    return pages.currentPag * pages.pageSize - pages.pageSize + 1;
});
// api-查询客户信息列表-分页
const getCustomerList = async () => {
    let res = await getListPage(condition);
    if (res.flag) {
        customerList.value = res.data.records;  // 数据
        pages.total = res.data.total; // 总记录数
        pages.pageSize = res.data.size; // 每页显示条数
        pages.currentPag = res.data.current; // 当前页码
        pages.pagCount = res.data.pages; // 总页数
    }
}
// 页码切换处理
const handleCurrentChange = (curPage) => {
    pages.currentPag = curPage;
    condition.pageSize = curPage; // 参数pageSize是服务端接收页码参数名
    // 重新渲染表格
    getCustomerList();
    // 清空护理记录数据表
    nurseRecordList.value = [];
    conditionRecord.customerId = "";
};
// ---------------------护理记录--------------------------
// 护理记录列表
const nurseRecordList = ref([]);
// 查询条件封装--护理记录
const conditionRecord = reactive({
    customerId: "", // 客户编号
    pageSize: "1" // 默认第一页
});
// 分页属性封装 --护理记录
const pageRecord = reactive({
    total: 0,
    pageSize: 6,
    currentPag: 1,
    pagCount: 0
});
// 计算属性 - 分页序号不重复 - 护理记录
const indexMethodRecord = computed(() => {
    return pageRecord.currentPag * pageRecord.pageSize - pageRecord.pageSize + 1;
});
// api-查询客户护理记录
const getNurseRecordList = async () => {
    let res = await listNurseRecordsVo(conditionRecord);
    if (res.flag) {
        nurseRecordList.value = res.data.records;  // 数据
        pageRecord.total = res.data.total; // 总记录数
        pageRecord.pageSize = res.data.size; // 每页显示条数
        pageRecord.currentPag = res.data.current; // 当前页码
        pageRecord.pagCount = res.data.pages; // 总页数
    }
}
// 选中某客户行:获取用户的服务项目列表
const handleChangeCustomer = (row) => {
    if (row != null) {
        // 点击页码会清空row因此做出判断逻辑
        // 构建查询条件
        conditionRecord.customerId = row.id;
        getNurseRecordList(); // 查询
    }
}
// 页码切换处理
const handleRecordChange = (curPage) => {
    pageRecord.currentPag = curPage;
    conditionRecord.pageSize = curPage; // 默认第一页
    // 刷新护理记录列表
    getNurseRecordList();
}
//搜索
const query = () => {
    // 清空护理记录数据表
    nurseRecordList.value = [];
    conditionRecord.customerId = "";
    condition.pageSize = "1"; // 回到第一页
    getCustomerList();
}
// api-删除客户护理记录
const del = (id) => {
    ElMessageBox.confirm('此操作将永久删除该护理记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(async () => {
        let res = await removeCustomerRecord(id);
        if (res.flag) {
            ElMessage.success(" 删除护理记录成功！！！")
            // 刷新护理记录列表
            getNurseRecordList();
        }
    })
}
onMounted(() => {
    getCustomerList();
})
</script>

<style lang="scss" scoped></style>
