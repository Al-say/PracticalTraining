<template>
    <div class="common-layout">
        <el-container>
            <el-header>
                <el-row :gutter="30">
                    <el-col :span="7">
                        <el-input placeholder="客户姓名" v-model="queryParams.customerName" @clear="query" clearable
                            size="large">
                            <template #append>
                                <el
                            </template>
                        </el-input>
                    </el-col>
                    <el-col :span="7" style="margin-top:5px">
                        <el-button type="primary" @click="router.go(-1)" round>返回上一级</el-button>
                    </el-col>
                </el-row>
            </el-header>
            <el-divider style="margin:0"></el-divider>
            <el-main>
                <el-row :gutter="20">
                    <el-col :span="11">
                        <div class="table-main">
                            <div class="table-main-header">无管家客户信息</div>
                            <!-- 表格 -->
                            <el-table :data="notManagerKhxxList" @row-click="changeRow"
                                style="width: 100% ;color:black;" stripe>
                                <el-table-column align="center" fixed type="index" :index="indexMethod" label="序号"
                                    width="60" />
                                <el-table-column align="center" fixed prop="customerName" label="客户姓名" width="120" />
                                <el-table-column align="center" prop="customerAge" label="年龄" width="80" />
                                <el-table-column align="center" prop="customerSex" label="性别" width="80">
                                    <template #default="scope">{{ scope.row.customerSex == 0 ? '男' : '女' }}</template>
                                </el-table-column>
                                <el-table-column align="center" prop="roomNo" label="房间号" width="80" />
                                <el-table-column align="center" prop="bedNo" label="床号" width="80" />
                                <el-table-column align="center" prop="levelName" label="护理级别" width="80" />
                            </el-table>
                            <!-- 分页插件 -->
                            <div style="margin-top:15px">
                                <el-pagination :page-size="page.pageSize" background :current-page="page.currentPag"
                                    layout=" prev, pager, next" :total="page.total"
                                    @current-change="handleCurrentChange" />
                            </div>
                        </div>
                    </el-col>
                    <el-col :span="13">
                        <div class="table-main">
                            <div class="table-main-header">{{ nickName }}--服务的客户</div>
                            <!-- 表格 -->
                            <el-table :data="managerKhxxList" style="width: 100% ;color:black;" size="small" stripe>
                                <el-table-column align="center" fixed type="index" :index="managerKhxxIndexMethod"
                                    label="序号" width="60" />
                                <el-table-column align="center" fixed prop="customerName" label="客户姓名" width="120" />
                                <el-table-column align="center" prop="customerAge" label="年龄" width="80" />
                                <el-table-column align="center" prop="customerSex" label="性别" width="80">
                                    <template #default="scope">{{ scope.row.customerSex == 0 ? '男' : '女' }}</template>
                                </el-table-column>
                                <el-table-column align="center" prop="roomNo" label="房间号" width="80" />
                                <el-table-column align="center" prop="bedNo" label="床号" width="80" />
                                <el-table-column align="center" prop="levelName" label="护理级别" width="80" />
                                <el-table-column align="center" fixed="right" label="操作" width="100">
                                    <template #default="scope">
                                        <el-button type="danger" icon="CloseBold" size="small"
                                            @click="del(scope.row.id)"></el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <div style="margin-top:15px">
                                <el-pagination :page-size="manager.page.pageSize" background
                                    :current-page="manager.page.currentPag" layout=" prev, pager, next"
                                    :total="manager.page.total" @current-change="handleCurrentChangeManager" />
                            </div>
                        </div>
                        <div class="demo-drawer__footer" style="margin:0 auto;width:200px">
                            <el-button @click="onSave" type="primary">保存绑定</el-button>
                            <el-button @click="onClearBind" type="warning">清空绑定</el-button>
                        </div>
                    </el-col>
                </el-row>
            </el-main>
        </el-container>
    </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import { CloseBold } from '@element-plus/icons-vue';
import { getListPage, editCustomer } from "@/api/customerApi.js";
import { bindCustomers } from "@/api/customerBindApi.js";

// 路由相关
const router = useRouter();
const route = useRoute();
// 响应式状态
const nickName = ref(route.query.nickName);
const notManagerKhxxList = ref([]); // 无管家客户信息列表
const managerKhxxList = ref([]); // 当前管家的客户信息列表
// 分页属性封装 - 无管家
const page = reactive({
    total: 0,
    pageSize: 6,
    currentPag: 1,
    pagCount: 0
});

// 查询参数 - 无管家
const queryParams = reactive({
    customerName: "",
    pageSize: "1", // 默认第一页
    manType: "3" // 无管家客户
});

// 当前管家客户信息模型数据
const manager = reactive({
    queryParams: {
        pageSize: "1", // 默认第一页
        userId: route.query.userId
    },
    page: {
        total: 0,
        pageSize: 6,
        currentPag: 1,
        pagCount: 0
    }
});
// 查询无管家客户信息列表
const getNotManagerKhxxListData = () => {
    getListPage(queryParams).then(res => {
        notManagerKhxxList.value = res.data.records;
        page.total = res.data.total; // 总记录数
        page.pageSize = res.data.size; // 每页显示条数
        page.currentPag = res.data.current; // 当前页码
        page.pagCount = res.data.pages; // 总页数
    });
};
// 查询当前管家客户信息列表
const getManagerKhxxListData = () => {
    getListPage(manager.queryParams).then(res => {
        managerKhxxList.value = res.data.records;
        manager.page.total = res.data.total; // 总记录数
        manager.page.pageSize = res.data.size; // 每页显示条数
        manager.page.currentPag = res.data.current; // 当前页码
        manager.page.pagCount = res.data.pages; // 总页数
    });
};
// 选中页码 - 无管家
const handleCurrentChange = (curPage) => {
    page.currentPag = curPage;
    queryParams.pageSize = curPage; // 参数pageSize是服务端接收页码参数名
    // 重新渲染表格
    getNotManagerKhxxListData();
};

// 选中页码 - 当前管家
const handleCurrentChangeManager = (curPage) => {
    manager.page.currentPag = curPage;
    manager.queryParams.pageSize = curPage; // 参数pageSize是服务端接收页码参数名
    // 重新渲染表格
    getManagerKhxxListData();
};

// 点击查询
const query = () => {
    queryParams.pageSize = "1"; // 回到第一页
    getNotManagerKhxxListData();
};
// 设置未当前管家的服务对象
const changeRow = (row) => {
    editCustomer({
        id: row.id,
        userId: manager.queryParams.userId
    }).then(res => {
        if (res.flag) {
            // 刷新表格
            getManagerKhxxListData();
            getNotManagerKhxxListData();
        } else {
            ElMessage.error(res.message);
        }
    });
};
// 移除当前管家服务的客户
const del = (id) => {
    ElMessageBox.confirm("确定移除？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
    })
        .then(() => {
            editCustomer({ id: id, userId: -1 }).then(res => {
                if (res.flag) {
                    // 刷新表格
                    getManagerKhxxListData();
                    getNotManagerKhxxListData();
                } else {
                    ElMessage.error(res.message);
                }
            });
        })
        .catch(() => { });
};
// 保存绑定
const onSave = async () => {
    const userId = manager.queryParams.userId;
    if (!userId || Number.isNaN(userId)) {
        ElMessage.warning("当前护工ID(userId) 为空");
        return;
    }
    const customerIds = managerKhxxList.value.map(item => item.id);
    if (!Array.isArray(customerIds) || customerIds.length === 0) {
        ElMessage.warning("请选择至少一个客户");
        return;
    }
    try {
        const res = await bindCustomers({ userId, customerIds });
        if (res?.flag) {
            ElMessage.success(res?.message || "绑定成功");
            await getNotManagerKhxxListData();
            await getManagerKhxxListData();
        } else {
            ElMessage.error(res?.message || "绑定失败");
        }
    } catch (e) {
        ElMessage.error(e?.message || "绑定请求异常");
    }
};

// 清空绑定
const onClearBind = async () => {
    const userId = manager.queryParams.userId;
    if (!userId) {
        ElMessage.warning("userId 为空");
        return;
    }
    try {
        const res = await bindCustomers({ userId, customerIds: [] });
        if (res?.flag) {
            ElMessage.success("已清空绑定");
            await getNotManagerKhxxListData();
            await getManagerKhxxListData();
        } else {
            ElMessage.error(res?.message || "清空失败");
        }
    } catch (e) {
        ElMessage.error(e?.message || "清空请求异常");
    }
};

onMounted(() => {
    getNotManagerKhxxListData();
    getManagerKhxxListData();
})
// 计算属性 - 序号计算 - 无管家
const indexMethod = computed(() => {
    return page.currentPag * page.pageSize - page.pageSize + 1;
});

// 计算属性 - 序号计算 - 当前管家
const managerKhxxIndexMethod = computed(() => {
    return manager.page.currentPag * manager.page.pageSize - manager.page.pageSize + 1;
});

</script>
<style lang="scss" scoped>
.table-main {
    height: 500px;
    border: 1px solid #d4c5c5;
}
.table-main .table-main-header {
    height: 50px;
    background-color: #3ca2e0;
    color: #fff;
    font-size: 20px;
    font-family: "Microsoft YaHei";
    line-height: 50px;
}
</style>
