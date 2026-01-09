<template>
    <div class="common-layout">
        <el-container>
            <el-header>
                <el-row :gutter="30">
                    <el-col :span="7">
                        <el-input placeholder="护理项目名称" v-model="queryParams.itemName" @clear="query" clearable
                            size="large">
                            <template #append>
                                <el-button type="info" @click="query" style="color:black">查询</el-button>
                            </template>
                        </el-input>
                    </el-col>
                    <el-col :span="7" style="margin-top:5px">
                        <el-button type="primary" color="#1d83ec" @click="goBack" round>返回</el-button>
                    </el-col>
                </el-row>
            </el-header>
            <el-divider style="margin:0"></el-divider>
            <el-main>
                <div class="table-main">
                    <div class="table-main-header">护理项目</div>
                    <!-- 表格 -->
                    <el-table :data="nurseItemList" style="width: 100% ;color:black;" size="small"
                        @row-click="changeRow" stripe>
                        <el-table-column align="center" type="index" :index="indexMethod" label="序号" width="60" />
                        <el-table-column align="center" prop="serialNumber" label="编号" width="180" />
                        <el-table-column align="center" prop="nursingName" label="名称" width="180" />
                        <el-table-column align="center" prop="servicePrice" label="价格" width="180" />
                        <el-table-column align="center" prop="executionCycle" label="执行周次" width="180" />
                        <el-table-column align="center" prop="executionTimes" label="执行次数" width="180" />
                        <el-table-column align="center" prop="message" label="备注" width="180" />
                    </el-table>
                    <!-- 分页插件 -->
                    <div style="margin-top:15px">
                        <el-pagination :page-size="page.pageSize" background :current-page="page.currentPag"
                            layout=" prev, pager, next" :total="page.total" @current-change="handleCurrentChange" />
                    </div>
                </div>
                <el-divider></el-divider>
                <div class="table-main">
                    <div class="table-main-header">已选护理项目</div>
                    <!-- 表格 -->
                    <el-table :data="changeNurseItemList" style="width: 100% ;color:black;" size="small" stripe>
                        <el-table-column align="center" type="index" label="序号" width="150" />
                        <el-table-column align="center" prop="serialNumber" label="编号" width="150" />
                        <el-table-column align="center" prop="nursingName" label="名称" width="150" />
                        <el-table-column align="center" prop="buyTime" label="服务购买日期" width="150" />
                        <el-table-column align="center" prop="nurseNumber" label="购买数量" width="150">
                            <template #default="scope">
                                <el-input v-model="scope.row.nurseNumber" placeholder="购买数量"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" prop="maturityTime" label="服务到期日期" width="150">
                            <template #default="scope">
                                <el-date-picker style="width:130px" format="YYYY/MM/DD" value-format="YYYY-MM-DD"
                                    v-model="scope.row.maturityTime" type="date" placeholder="服务到期日期"></el-date-picker>
                            </template>
                        </el-table-column>

                        <el-table-column align="center" label="操作" width="150">
                            <template #default="scope">
                                <el-button type="danger" :icon="CloseBold" size="small"
                                    @click="del(scope.$index)"></el-button>
                            </template>
                        </el-table-column>
                    </el-table>

                </div>
                <div class="demo-drawer__footer" style="margin:0 auto;width:200px">
                    <el-button @click="clearArr" type="warning">清空</el-button>
                    <el-button @click="isOk" type="success">保存</el-button>
                </div>
            </el-main>
        </el-container>
    </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, nextTick } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { CloseBold } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';
import { findNurseItem } from "@/api/nurseItemApi.js";
import { getListPage } from "@/api/customerApi.js";
import { isIncludesItemCustomer, addItemToCustomer, listCustomerItem } from "@/api/customerNurseItemApi.js";
import { getSessionStorage, getCurDate } from '@/utils/common.js';

// 路由实例
const router = useRouter();

// 表单引用
const buyFormRef = ref(null);

// 响应式数据
const nurseItemList = ref([]); // 护理项目列表
const khxxList = ref([]); // 客户信息列表
const buyedList = ref([]); // 已购买的护理项目列表
const changeNurseItemList = ref([]); // 已选择的护理项目
const customerId = ref(''); // 当前客户ID

// 查询参数
const queryParams = reactive({
    itemName: "",
    pageSize: "1",// 默认第一页
    status: "1"
});

// 抽屉数据
const drawer = reactive({
    openFlag: false
});

// 内层抽屉数据 - 购买护理项目
const innerDrawer = reactive({
    openFlag: false,
    buyForm: {
        customerId: "",
        customerName: "",
        itemId: "",
        itemName: "",
        itemNumber: "",
        perPrice: 0,
        itemCount: 1,
        itemPrice: 0,
        days: 0
    },
    // 校验规则
    rules: {
        itemCount: [{ required: true, message: "请输入护理项目数量", trigger: "blur" }]
    }
});

// 分页属性 - 护理项目
const pageItem = reactive({
    total: 0,
    pageSize: 6,
    currentPag: 1,
    pagCount: 0
});

// 查询条件 - 护理项目
const conditionItem = reactive({
    pageSize: "1"
});

// 分页属性 - 客户列表
const page = reactive({
    total: 0,
    pageSize: 6,
    currentPag: 1,
    pagCount: 0
});

// 查询条件 - 客户列表
const condition = reactive({
    userId: "",//getSessionStorage("user").id,
    customerName: "",
    pageSize: "1"
});

// 客户护理项目条件
const conditionCustomerItem = reactive({
    customerId: "",
    pageSize: "1"
});

// 计算属性 - 序号计算
const indexMethod = computed(() => {
    return page.currentPag * page.pageSize - page.pageSize + 1;
});

// 计算属性 - 序号计算 - 护理项目
const indexMethodItem = computed(() => {
    return pageItem.currentPag * pageItem.pageSize - pageItem.pageSize + 1;
});

// 页面加载时初始化数据
onMounted(() => {
    getNurseItemData();
    // 从路由获取客户ID
    if (router.currentRoute.value.query.customerId) {
        // 确保客户ID作为数字类型处理
        customerId.value = parseInt(router.currentRoute.value.query.customerId, 10);
        console.log("获取到客户ID:", customerId.value);
        // 验证客户ID
        if (isNaN(customerId.value)) {
            ElMessage.error("客户ID无效，请返回重新选择客户");
            customerId.value = null;
        }
    } else {
        ElMessage.warning('未找到客户ID，请返回选择客户');
    }
});

// 点击行选择护理项目
const changeRow = (row) => {
    // 检查项目是否已经添加
    const isExist = changeNurseItemList.value.some(item => item.id === row.id);
    if (!isExist) {
        // 深拷贝对象
        const item = JSON.parse(JSON.stringify(row));
        // 设置默认值
        item.buyTime = getCurDate();
        item.nurseNumber = 1;
        item.maturityTime = '';
        // 添加到已选列表
        changeNurseItemList.value.push(item);
    } else {
        ElMessage.warning('该项目已经添加，请勿重复添加');
    }
};

// 删除已选项目
const del = (index) => {
    changeNurseItemList.value.splice(index, 1);
};

// 清空已选项目
const clearArr = () => {
    changeNurseItemList.value = [];
};

// 返回上一页
const goBack = () => {
    router.go(-1);
};

// 查询护理项目列表 - 分页
const getNurseItemData = () => {
    findNurseItem(queryParams).then(res => {
        console.log("----->", res);
        nurseItemList.value = res.data.records;
        page.total = res.data.total; // 总记录数
        page.pageSize = res.data.size; // 每页显示条数
        page.currentPag = res.data.current; // 当前页码
        page.pagCount = res.data.pages; // 总页数
    });
};

// 点击查询
const query = () => {
    queryParams.pageSize = "1"; // 回到第一页
    getNurseItemData();
};

// 选中页码 - 护理项目列表
const handleCurrentChange = (curPage) => {
    page.currentPag = curPage;
    queryParams.pageSize = curPage; // 参数pageSize是服务端接收页码参数名
    getNurseItemData(); // 重新渲染表格
};

// 保存购买信息
const isOk = () => {
    let customerItemList = changeNurseItemList.value;
    let paramsArr = [];//提交的参数列表

    if (customerItemList.length === 0) {
        ElMessage.error("请选择需要购买的护理项目");
        return;
    }
    // 确保有有效的客户ID
    if (!customerId.value || isNaN(customerId.value)) {
        ElMessage.error("未找到有效的客户ID，无法添加护理项目");
        return;
    }

    console.log("提交数据时的客户ID:", customerId.value);

    // 构建提交的参数列表
    for (let i = 0; i < customerItemList.length; i++) {
        if (!customerItemList[i].nurseNumber) {
            ElMessage.error("请填写购买数量");
            return;
        }
        if (!customerItemList[i].maturityTime) {
            ElMessage.error("请选择服务到期日期");
            return;
        }

        let obj = {};
        obj.itemId = customerItemList[i].id;
        obj.buyTime = customerItemList[i].buyTime;
        obj.customerId = customerId.value; // 确保这是一个数值
        obj.nurseNumber = parseInt(customerItemList[i].nurseNumber, 10);
        obj.isDeleted = 0;
        obj.maturityTime = customerItemList[i].maturityTime;
        paramsArr.push(obj);
    }

    // 最后检查一次参数
    console.log("提交的参数:", paramsArr);

    ElMessageBox.confirm("确定护理项目数据无误?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
    }).then(() => {
        addItemToCustomer(paramsArr).then(res => {
            if (res.flag) {
                ElMessage.success(res.message);
                // 路由回上一级
                router.go(-1);
            } else {
                ElMessage.error(res.message);
            }
        }).catch(err => {
            console.error("添加护理项目失败:", err);
            ElMessage.error("添加护理项目失败，请检查网络连接或联系管理员");
        });
    }).catch(() => { });
};
</script>

<style scoped>
.table-main {
    height: 300px;
    border: 1px solid #d4c5c5;
    width: 100%;
}
.table-main .table-main-header {
    height: 30px;
    background-color: #1d83ec;
    color: #fff;
    font-size: 18px;
    font-family: "Microsoft YaHei";
    line-height: 30px;
}
</style>
