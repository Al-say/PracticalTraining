<template>
    <div class="common-layout">
        <el-container>
            <el-header>
                <div>
                    <el-row :gutter="30">
                        <el-col :span="7">
                            <el-input placeholder="客户姓名" @clear="query" v-model="condition.customerName" clearable
                                size="large">
                                <template #append>
                                    <el-button type="info" @click="query" style="color:black">查询</el-button>
                                </template>
                            </el-input>
                        </el-col>
                        <el-col :span="17" v-if="roleId === 2">
                            <el-button type="primary" @click="addItem" color="#337ab7" style="margin-top:4px">
                                <el-icon>
                                    <Plus />
                                </el-icon>
                                <span>添加退住申请</span>
                            </el-button>
                        </el-col>
                    </el-row>
                </div>
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
                            <div class="table-main-header">退住登记</div>
                            <!-- 表格 -->
                            <el-table :data="backdownList" size="small">
                                <el-table-column align="center" :index="indexMethodRecord" type="index" label="序号"
                                    width="40" />
                                <el-table-column align="center" prop="customerName" label="客户名称" width="100" />
                                <el-table-column align="center" prop="checkinDate" label="入住时间" width="100" />
                                <el-table-column align="center" prop="retreattime" label="退住时间" width="170" />
                                <el-table-column align="center" prop="retreattype" label="退住类型" width="80" />
                                <el-table-column align="center" prop="retreatreason" label="退住原因" width="100" />
                                <el-table-column align="center" prop="audittime" label="审批时间" width="100" />
                                <!-- <el-table-column align="center" prop="status" label="审批状态" width="100" /> -->
                                <el-table-column align="center" prop="auditstatus" label="审批状态" width="100">
                                    <template #default="{ row }">
                                        {{ row.auditstatus === 0 ? '已提交' : row.auditstatus === 1 ? '同意' : '拒绝' }}
                                    </template>
                                </el-table-column>
                                <el-table-column align="center" prop="bedId" label="床位" width="60" />
                                <el-table-column align="center" label="操作" width="200">
                                    <template #default="scope">
                                        <!-- <el-button v-if="scope.row.auditstatus === 1 && dialog.item.roleId === 2" :disabled="scope.row.actualreturntime" type="success" size="small" round plain @click="updateTime(scope.row.id)">登记回院时间</el-button> -->
                                        <el-button type="danger" size="small" round plain
                                            @click="del(scope.row.id)">撤销申请</el-button>
                                        <el-button v-if="scope.row.auditstatus === 0" type="primary" size="small" round plain
                                            @click="examine(scope.row)">审批</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <!-- 分页插件 -->
                            <div style="margin-top:15px" v-if="backdownList.length > 0">
                                <el-pagination :page-size="pageRecord.pageSize" background
                                    :current-page="pageRecord.currentPag" layout=" prev, pager, next"
                                    :total="pageRecord.total" @current-change="handleRecordChange" />
                            </div>
                        </div>
                    </el-col>
                </el-row>
            </el-main>
        </el-container>

        <!-- 审批对话框 -->
        <el-dialog v-model="dialog.dialogExamineVisible" :title="dialog.tops" width="40%" align-center draggable
            :before-close="handleExamineClose">
            <el-divider border-style="double" style="margin:0;" />
            <el-form label-position="right" label-width="auto" style="max-width:380px;margin:20px auto"
                class="demo-form-inline" ref="itemExamineFormRef" :model="dialog.item" :rules="rules">

                <el-form-item label="审批：" prop="auditstatus">
                    <el-radio-group v-model="dialog.item.auditstatus" class="ml-4">
                        <el-radio label="1" value="1">同意</el-radio>
                        <el-radio label="2" value="2">拒绝</el-radio>
                    </el-radio-group>
                </el-form-item>

            </el-form>
            <el-divider border-style="double" style="margin:0;" />
            <template #footer>
                <span class="dialog-footer" style="padding-top: 0px">
                    <el-button type="primary" @click="examineBackdownAction">保存</el-button>
                    <el-button @click="cancelExamine">取消</el-button>
                </span>
            </template>
        </el-dialog>
        <!-- 修改/添加对话框 -->
        <el-dialog v-model="dialog.dialogVisible" :title="dialog.tops" width="40%" align-center draggable
            :before-close="handleClose">
            <el-divider border-style="double" style="margin:0;" />
            <el-form label-position="right" label-width="auto" style="max-width:380px;margin:20px auto"
                class="demo-form-inline" ref="itemFormRef" :model="dialog.item" :rules="rules">
                <el-form-item label="客户姓名：" prop="customerId">
                    <el-select v-model="dialog.item.customerId" style="width:320px" placeholder="客户姓名：">
                        <el-option v-for="item in customerList" :label="item.customerName" :value="item.id"
                            :key="item.id" />
                    </el-select>
                </el-form-item>
                <el-form-item label="退住时间：" prop="retreattime">
                    <el-date-picker style="width:320px" v-model="dialog.item.retreattime" type="date"
                        placeholder="退住时间:" value-format="YYYY-MM-DD" />
                </el-form-item>
                <el-form-item label="退住类型：" prop="retreattype">
                    <el-select v-model="dialog.item.retreattype" style="width:320px" placeholder="退住类型：">
                        <el-option label="正常退住" value="0" />
                        <el-option label="死亡退住" value="1" />
                        <el-option label="保留床位" value="2" />
                    </el-select>
                </el-form-item>
                <el-form-item label="退住原因： " prop="retreatreason">
                    <el-input v-model="dialog.item.retreatreason" />
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
import { ref, reactive, computed, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';
import { getListPage } from "@/api/customerApi.js";
import { addBackdown, examineBackdown, delBackdown, queryBackdownVo } from "@/api/backdownApi.js";
import { getSessionStorage, getCurDate } from '@/utils/common.js';

// 表单引用
const itemFormRef = ref(null);
const itemExamineFormRef = ref(null);

// 响应式状态
const backdownList = ref([]);
const khxxList = ref([]);
const customerList = ref([]);
const roleId = ref('');

// 模态框数据
const dialog = reactive({
    dialogVisible: false, // 模态框状态
    dialogTimeVisible: false, // 模态框状态
    dialogExamineVisible: false,
    tops: "", // 模态框标题,
    item: {
        id: "",
        username: "",
        customerName: "",
        checkinDate: "",
        retreattime: "",
        retreattype: "",
        retreatreason: "",
        audittime: "",
        auditstatus: 0,
        bedId: "",
        roleId: ""
    },
    statusArr: [
        {
            value: 1,
            label: "停用"
        },
        {
            value: 2,
            label: "启用"
        }
    ]
});

// 校验规则
const rules = reactive({
    // 可以根据需要添加校验规则
});

// 分页属性封装 --客户
const page = reactive({
    total: 0,
    pageSize: 6,
    currentPag: 1,
    pagCount: 0
});

// 分页属性封装 --退住记录
const pageRecord = reactive({
    total: 0,
    pageSize: 6,
    currentPag: 1,
    pagCount: 0
});

// 查询条件封装--客户
const condition = reactive({
    customerName: "",
    userId: "",
    pageSize: "1" // 默认第一页
});

// 查询条件封装--退住记录
const conditionRecord = reactive({
    userId: "",
    pageSize: "1" // 默认第一页
});

// 计算属性
// 分页序号不重修 -客户
const indexMethod = computed(() => {
    return page.currentPag * page.pageSize - page.pageSize + 1;
});

// 分页序号不重修 -外出记录
const indexMethodRecord = computed(() => {
    return pageRecord.currentPag * pageRecord.pageSize - pageRecord.pageSize + 1;
});

// 点击查询
const query = () => {
    // 清空护理记录数据表
    backdownList.value = [];

    condition.pageSize = "1"; // 回到第一页
    getListPageData(); // 查询客户信息
    queryBackdownVoData();//查询退住记录
};

// 选中页码-客户
const handleCurrentChange = (curPage) => {
    page.currentPag = curPage;
    condition.pageSize = curPage; // 参数pageSize是服务端接收页码参数名
    // 重新渲染表格
    getListPageData();
    // 清空护理记录数据表
    backdownList.value = [];
    conditionRecord.customerId = "";
};

// 选中某客户行:获取用户的服务项目列表
const handleChangeCustomer = (row) => {
    if (row != null) {
        // 点击页码会清空row因此做出判断逻辑
        // 构建查询条件
        conditionRecord.userId = row.id;
        console.log(conditionRecord.userId+"---------->"+row.id)
        queryBackdownVoData();
    }
};

// 选中页码-护理记录
const handleRecordChange = (curPage) => {
    pageRecord.currentPag = curPage;
    conditionRecord.pageSize = curPage; // 参数pageSize是服务端接收页码参数名
    // 重新渲染表格:
    queryBackdownVoData();
};

// api-查询客户信息列表-分页
const getListPageData = () => {
    getListPage(condition).then(res => {
        khxxList.value = res.data.records;
        customerList.value = res.data.records;
        page.total = res.data.total; // 总记录数
        page.pageSize = res.data.size; // 每页显示条数
        page.currentPag = res.data.current; // 当前页码
        page.pagCount = res.data.pages; // 总页数
    });
};

// api-查询外出申请记录
const queryBackdownVoData = () => {
    console.log(conditionRecord.userId+"---------id---------");
    queryBackdownVo(conditionRecord).then(res => {
        backdownList.value = res.data.records;
        pageRecord.total = res.data.total; // 总记录数
        pageRecord.pageSize = res.data.size; // 每页显示条数
        pageRecord.currentPag = res.data.current; // 当前页码
        pageRecord.pagCount = res.data.pages; // 总页数
    });
};

const examine = (row) => {
    dialog.tops = "审批";
    dialog.dialogExamineVisible = true;
    dialog.item.id = row.id;   // id
    dialog.item.auditstatus = row.auditstatus; // 审批状态
};

const handleExamineClose = () => {
    dialog.dialogExamineVisible = false;
    resetForm(itemExamineFormRef); // 重置表单
};

const cancelExamine = () => {
    handleExamineClose();
};

// 点击添加按钮
const addItem = () => {
    dialog.tops = "添加退住申请";
    dialog.dialogVisible = true;
};

// 对话框关闭处理
const handleClose = () => {
    dialog.dialogVisible = false;
    resetForm(itemFormRef); // 重置表单
};

const cancel = () => {
    handleClose();
};

// 重置表单
const resetForm = (formRef) => {
    if (formRef.value) {
        formRef.value.resetFields();
    }
};
// 点击确定
const examineBackdownAction = () => {
    itemExamineFormRef.value.validate(valid => {
        if (valid) {
            dialog.item.audittime = getCurDate();
            //dialog.item.auditperson = getSessionStorage('user').id;
            examineBackdown(dialog.item).then(res => {
                if (res.flag) {
                    ElMessage.success(res.message);
                    // 刷新数据表格(回到最初查询状态)
                    queryBackdownVoData();
                    handleExamineClose(); // 关闭模态框
                } else {
                    ElMessage.error(res.message);
                }
            });
        } else {
            return false;
        }
    });
};

// api-保存(新增/编辑)
const save = () => {
    itemFormRef.value.validate(valid => {
        if (valid) {
            // 通过id判断是添加还是编辑
            if (!dialog.item.id) {
                dialog.item.createTime = getCurDate();
                //dialog.item.createBy = getSessionStorage("user").id;
                dialog.item.password = "000000";
                dialog.item.roleId = 2;
                dialog.item.isDeleted = 0;
                addBackdown(dialog.item).then(res => {
                    if (res.flag) {
                        ElMessage.success(res.message);
                        // 刷新数据表格(回到最初查询状态)
                        queryBackdownVoData();
                        handleClose(); // 关闭模态框
                    } else {
                        ElMessage.error(res.message);
                    }
                });
            }
        } else {
            return false;
        }
    });
};

const del = (id) => {
    ElMessageBox.confirm("确定撤销申请吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
    })
        .then(() => {
            delBackdown(id).then(res => {
                if (res.flag) {
                    ElMessage.success(res.message);
                    // 重载表格
                    queryBackdownVoData();
                }
            });
        })
        .catch(() => { });
};

// 初始化
onMounted(() => {
    roleId.value = 2; // 临时设置为2以显示添加按钮
    //roleId.value = getSessionStorage('user').roleId;
    //conditionRecord.userId = roleId.value === 1 ? '' : getSessionStorage('user').id;
    //condition.userId = roleId.value === 1 ? '' : getSessionStorage('user').id;
    getListPageData(); // 获取列表数据
    queryBackdownVoData(); // 获取退住记录
});
</script>

<style scoped>
.table-main {
    height: 600px;
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
