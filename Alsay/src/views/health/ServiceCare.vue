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
                    <el-col :span="1">
                        <el-button type="primary" @click="buyService" color="#337ab7" style="margin-top:4px">
                            <el-icon size="20">
                                <ShoppingCart />
                            </el-icon>
                            <span>购买护理服务</span>
                        </el-button>
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
                            <el-table :data="khxxList" highlight-current-row @current-change="handleChangeCustomer"
                                size="small" style="width: 100% ;color:black;" stripe>
                                <el-table-column align="center" fixed type="index" :index="indexMethod" label="序号"
                                    width="40" />
                                <el-table-column align="center" prop="customerName" label="姓名" />
                                <el-table-column align="center" prop="customerAge" label="年龄" />
                                <el-table-column align="center" prop="customerSex" label="性别">
                                    <template #default="scope">{{ scope.row.customerSex == 0 ? '男' : '女' }}</template>
                                </el-table-column>
                                <el-table-column align="center" prop="bedNo" label="床号" />
                                <el-table-column align="center" prop="levelName" label="护理级别" />
                            </el-table>
                            <!-- 分页插件 -->
                            <div style="margin-top:15px">
                                <el-pagination :page-size="page.pageSize" background :current-page="page.currentPag"
                                    layout=" prev, pager, next" :total="page.total"
                                    @current-change="handleCurrentChange" />
                            </div>
                        </div>
                    </el-col>
                    <el-col :span="15">
                        <div class="table-main">
                            <div class="table-main-header">已购护理服务</div>
                            <!-- 表格 -->
                            <el-table :data="customerItemList" size="small" >
                                <el-table-column align="center" :index="indexMethodItem" type="index" label="序号"
                                    width="40" />
                                <el-table-column align="center" prop="customerName" label="客户" />
                                <el-table-column align="center" prop="serialNumber" label="编号" />
                                <el-table-column align="center" prop="nursingName" label="名称" />
                                <el-table-column align="center" prop="servicePrice" label="价格" />
                                <el-table-column align="center" prop="nurseNumber" label="余量" />
                                <el-table-column align="center" prop="maturityTime" label="服务到期日期" width="100" />
                                <el-table-column align="center" prop label="状态" >
                                    <template #default="scope">
                                        <el-tag v-if="0 < scope.row.nurseNumber && scope.row.nurseNumber < 10" type="warning" disable-transitions>即将用完</el-tag>
                                        <el-tag v-if="10 < scope.row.nurseNumber" type="success" disable-transitions>数量正常</el-tag>
                                        <el-tag v-if="scope.row.nurseNumber < 0" type="danger" disable-transitions>已欠费</el-tag>
                                        <el-tag v-if="(new Date(scope.row.maturityTime) - new Date()) / 86400000 > 10" type="success" disable-transitions>未到期</el-tag>
                                        <el-tag v-if="(new Date(scope.row.maturityTime) - new Date()) / 86400000 > 0 && (new Date(scope.row.maturityTime) - new Date()) / 86400000 < 10" type="warning" disable-transitions>即将到期</el-tag>
                                        <el-tag v-if="(new Date(scope.row.maturityTime) - new Date()) / 86400000 < 0" type="danger" disable-transitions>已到期</el-tag>
                                    </template>
                                </el-table-column>
                                <el-table-column align="center" label="操作" width="140">
                                    <template #default="scope">
                                        <el-button type="primary" size="small" round plain
                                            @click="enew(scope.row)">续费</el-button>
                                        <el-button type="danger" size="small" round plain
                                            @click="del(scope.row.id)">移除</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <!-- 分页插件 -->
                            <div style="margin-top:15px" v-if="customerItemList.length > 0">
                                <el-pagination :page-size="pageItem.pageSize" background
                                    :current-page="pageItem.currentPag" layout=" prev, pager, next"
                                    :total="pageItem.total" @current-change="handleItemChange" />
                            </div>
                        </div>
                    </el-col>
                </el-row>
            </el-main>
        </el-container>
        <!-- 修改/添加对话框 -->
        <el-dialog v-model="dialog.dialogVisible" :title="dialog.tops" width="40%" align-center draggable
            :before-close="handleClose">
            <el-divider border-style="double" style="margin:0;" />
            <el-form label-position="right" label-width="auto" style="max-width:380px;margin:20px auto"
                class="demo-form-inline" ref="customerItemForm" :model="dialog.customerNurseItem" :rules="dialog.rules">
                <el-form-item label="客户姓名：" prop="customerName">
                    <el-input readonly v-model="dialog.customerNurseItem.customerName" />
                </el-form-item>
                <el-form-item label="护理项目编号：" prop="serialNumber">
                    <el-input readonly v-model="dialog.customerNurseItem.serialNumber" />
                </el-form-item>
                <el-form-item label="护理项目名称" prop="nursingName">
                    <el-input readonly v-model="dialog.customerNurseItem.nursingName" />
                </el-form-item>
                <el-form-item label="价格：" prop="servicePrice">
                    <el-input readonly v-model="dialog.customerNurseItem.servicePrice" />
                </el-form-item>
                <el-form-item label="原有数量：" prop="oldNumber">
                    <el-input readonly v-model="dialog.customerNurseItem.oldNumber" />
                </el-form-item>
                <el-form-item label="新增数量：" prop="addNumber">
                    <el-input v-model="dialog.customerNurseItem.addNumber" />
                </el-form-item>
                <el-form-item label="总数量：" prop="nurseNumber">
                    <el-input readonly v-model="nurseNumber" />
                </el-form-item>
                <el-form-item label="服务到期日期：" prop="maturityTime">
                    <el-date-picker style="width:300px" format="YYYY/MM/DD" value-format="YYYY-MM-DD"
                        v-model="dialog.customerNurseItem.maturityTime" type="date" placeholder="选择日期"></el-date-picker>
                </el-form-item>
            </el-form>
            <el-divider border-style="double" style="margin:0;" />
            <template #footer>
                <span class="dialog-footer" style="padding-top: 0px">
                    <el-button type="primary" @click="save">保存</el-button>
                    <el-button @click="cancel">取消</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, nextTick } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { ShoppingCart } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';
import { getListPage } from "@/api/customerApi.js";
import { listCustomerItem, newNurseItem, removeCustomerItem } from "@/api/customerNurseItemApi.js";

// 路由实例
const router = useRouter();

// 表单引用
const customerItemForm = ref(null);

// 响应式状态
const customerItemList = ref([]);
const khxxList = ref([]);

// 分页属性封装--护理项目
const pageItem = reactive({
    total: 0,
    pageSize: 6,
    currentPag: 1,
    pagCount: 0
});

// 查询条件封装--护理项目
const conditionItem = reactive({
    customerId: "", // 客户编号
    pageSize: "1" // 默认第一页
});

// 分页属性封装--客户
const page = reactive({
    total: 0,
    pageSize: 6,
    currentPag: 1,
    pagCount: 0
});

// 查询条件封装--客户
const condition = reactive({
    customerName: "",
    pageSize: "1" // 默认第一页
});

// 续费模态框数据
const dialog = reactive({
    dialogVisible: false,
    tops: "护理项目续费",
    // 校验规则
    rules: {
        maturityTime: [{ required: true, message: "请选择日期", trigger: "change" }]
    },
    customerNurseItem: {
        id: "",
        customerName: "",
        maturityTime: "",
        oldNumber: 0,
        newNumber: 0,
        nursingName: "",
        serialNumber: "",
        servicePrice: "",
        addNumber: ""
    }
});

// 计算属性 - 序号计算 - 客户
const indexMethod = computed(() => {
    return page.currentPag * page.pageSize - page.pageSize + 1;
});

// 计算属性 - 序号计算 - 护理项目
const indexMethodItem = computed(() => {
    return pageItem.currentPag * pageItem.pageSize - pageItem.pageSize + 1;
});

// 计算数量
const nurseNumber = computed(() => {
    if (
        dialog.customerNurseItem.addNumber == null ||
        dialog.customerNurseItem.addNumber == "" ||
        dialog.customerNurseItem.addNumber == "undefine"
    ) {
        return dialog.customerNurseItem.oldNumber;
    }
    return (
        parseInt(dialog.customerNurseItem.oldNumber) +
        parseInt(dialog.customerNurseItem.addNumber)
    );
});

// 点击查询
const query = () => {
    // 清空护理项目数据表
    conditionItem.customerId = "";
    customerItemList.value = [];
    condition.pageSize = "1"; // 回到第一页
    getKhxxListData();
};

// 选中页码 - 客户信息列表
const handleCurrentChange = (curPage) => {
    page.currentPag = curPage;
    condition.pageSize = curPage; // 参数pageSize是服务端接收页码参数名
    // 重新渲染表格
    getKhxxListData();
    // 清空护理项目数据表
    conditionItem.customerId = "";
    customerItemList.value = [];
};

// 选中页码 - 护理项目
const handleItemChange = (curPage) => {
    pageItem.currentPag = curPage;
    conditionItem.pageSize = curPage; // 参数pageSize是服务端接收页码参数名
    // 重新渲染表格
    listCustomerItemData();
};

// 选中某客户行：获取用户的服务项目列表
const handleChangeCustomer = (row) => {
    if (row != null) {
        // 点击页码会清空row因此做出判断逻辑
        // 构建查询条件
        conditionItem.customerId = row.id;
        listCustomerItemData();
    }
};

// 关闭模态框
const handleClose = () => {
    dialog.dialogVisible = false;
    resetForm(); // 重置表单
};

// 重置表单
const resetForm = () => {
    if (customerItemForm.value) {
        customerItemForm.value.resetFields();
    }
};

// 取消
const cancel = () => {
    handleClose();
};

// 续费
const enew = (row) => {
    dialog.dialogVisible = true;
    // 初始化模态框数据
    nextTick(() => {
        dialog.customerNurseItem.id = row.id;
        dialog.customerNurseItem.customerName = row.customerName;
        dialog.customerNurseItem.serialNumber = row.serialNumber;
        dialog.customerNurseItem.oldNumber = row.nurseNumber;
        dialog.customerNurseItem.nursingName = row.nursingName;
        dialog.customerNurseItem.servicePrice = row.servicePrice;
        dialog.customerNurseItem.maturityTime = row.maturityTime;
    });
};

// 点击购买护理服务
const buyService = () => {
    // 判断是否选中客户
    if (conditionItem.customerId != null &&conditionItem.customerId != "") {
        router.push({
            path: "/serviceBuy",
            query: { customerId: conditionItem.customerId }
        });
    } else {
        ElMessage.warning("请选中表格中的客户");
    }
};

// 查询客户信息列表 - 分页
const getKhxxListData = () => {
    getListPage(condition).then(res => {
        khxxList.value = res.data.records;
        page.total = res.data.total; // 总记录数
        page.pageSize = res.data.size; // 每页显示条数
        page.currentPag = res.data.current; // 当前页码
        page.pagCount = res.data.pages; // 总页数
    });
};

// 查询用户的服务项目列表 - 分页
const listCustomerItemData = () => {
    listCustomerItem(conditionItem).then(res => {
        customerItemList.value = res.data.records;
        pageItem.total = res.data.total; // 总记录数
        pageItem.pageSize = res.data.size; // 每页显示条数
        pageItem.currentPag = res.data.current; // 当前页码
        pageItem.pagCount = res.data.pages; // 总页数
    });
};

// 删除护理项目
const del = (id) => {
    ElMessageBox.confirm("此操作将移除当前护理项目，请谨慎操作？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
    }).then(() => {
            removeCustomerItem(id).then(res => {
                if (res.flag) {
                    ElMessage.success(res.message);
                    // 重载表格
                    listCustomerItemData();
                }
            });
        })
        .catch(() => { });
};

// 保存数据
const save = () => {
    customerItemForm.value.validate(valid => {
        // 构建请求参数
        const params = {
            id: dialog.customerNurseItem.id,
            maturityTime: dialog.customerNurseItem.maturityTime, // 预计到期时间
            nurseNumber: nurseNumber.value  // 数量
        };

        if (valid) {
            // 保存
            newNurseItem(params).then(res => {
                if (res.flag) {
                    ElMessage.success(res.message);
                    // 刷新数据表格
                    listCustomerItemData();
                    handleClose(); // 关闭模态框
                } else {
                    ElMessage.error(res.message);
                }
            });
        } else {
            return false;
        }
    });
};

// 页面加载时初始化
onMounted(() => {
    getKhxxListData();
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
