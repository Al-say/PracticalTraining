<template>
    <div class="common-layout">
        <el-container>
            <el-header>
                <el-row :gutter="20">
                    <el-col :span="7">
                        <el-input placeholder="输入客户姓名" @clear="query" v-model="condition.customerName" clearable
                            size="large">
                            <template #append>
                                <el-button type="info" @click="query" style="color:black" :icon="Search">查询</el-button>
                            </template>
                        </el-input>
                    </el-col>
                    <el-col :span="5">
                        <el-button type="primary" @click="addItem" :icon="Plus" color="#337ab7"
                            style="margin-top:3px;height:37px">
                            <span>添加外出申请</span>
                        </el-button>
                    </el-col>
                </el-row>
            </el-header>
            <el-divider style="margin:0"></el-divider>
            <el-main>
                <el-row :gutter="20">
                    <el-col :span="10">
                        <div class="table-main">
                            <div class="table-main-header">客户信息</div>
                            <!-- 表格 -->
                            <el-table :data="pageList" highlight-current-row @current-change="handleChangeCustomer"
                                size="small" style="width: 100% ;color:black;" stripe>
                                <el-table-column align="center" fixed type="index" :index="indexMethod" label="序号"
                                    width="40" />
                                <el-table-column align="center" prop="customerName" label="姓名" />
                                <el-table-column align="center" prop="customerAge" label="年龄" width="50" />
                                <el-table-column align="center" prop="customerSex" label="性别">
                                    <template #default="scope">{{ scope.row.customerSex == 0 ? '男' : '女' }}</template>
                                </el-table-column>
                                <el-table-column align="center" prop="bedNo" label="床号" />
                                <el-table-column align="center" prop="levelName" label="护理级别" />
                            </el-table>
                            <!-- 分页插件 -->
                            <div style="margin-top:15px">
                                <el-pagination :page-size="condition.pageSize" background :current-page="condition.pageNum"
                                    layout=" prev, pager, next" :total="page.total"
                                    @current-change="handleCurrentChange" />
                            </div>
                        </div>
                    </el-col>
                    <el-col :span="14">
                        <div class="table-main">
                            <div class="table-main-header">外出登记</div>
                            <!-- 表格 -->
                            <el-table :data="outwardList" size="small" stripe>
                                <el-table-column align="center" :index="indexMethodRecord" type="index" label="序号"
                                    width="40" />
                                <el-table-column align="center" prop="customerName" label="客户名称" width="80" />
                                <el-table-column align="center" prop="outgoingreason" label="外出事由" width="100" />
                                <el-table-column align="center" prop="outgoingtime" label="外出时间" width="100" />
                                <el-table-column align="center" prop="expectedreturntime" label="预计回院时间" width="100" />
                                <el-table-column align="center" prop="actualreturntime" label="实际回院时间" width="100" />
                                <el-table-column align="center" prop="escorted" label="陪同人" width="100" />
                                <el-table-column align="center" prop="relation" label="与老人关系" width="100" />
                                <el-table-column align="center" prop="escortedtel" label="陪同人电话" width="100" />
                                <el-table-column align="center" prop="auditstatus" label="审批状态" width="100">
                                    <template #default="{ row }">
                                        {{ row.auditstatus === 0 ? '已提交' : row.auditstatus === 1 ? '同意' : '拒绝' }}
                                    </template>
                                </el-table-column>
                                <el-table-column align="center" label="操作" width="200">
                                    <template #default="scope">
                                        <el-button v-if="scope.row.auditstatus === 1"
                                            :disabled="scope.row.actualreturntime" type="success" size="small" round
                                            plain @click="updateTime(scope.row.id)">登记回院时间</el-button>
                                        <el-button v-if="scope.row.auditstatus === 0" type="danger" size="small" round
                                            plain @click="del(scope.row.id)">撤销申请</el-button>
                                        <el-button v-if="scope.row.auditstatus === 0" type="primary" size="small" round
                                            plain @click="examine(scope.row.id)">审批</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <!-- 分页插件 -->
                            <div style="margin-top:15px" v-if="outwardList.length > 0">
                                <el-pagination :page-size="conditionRecord.pageSize" background
                                    :current-page="conditionRecord.pageNum" layout=" prev, pager, next"
                                    :total="pageRecord.total" @current-change="handleRecordChange" />
                            </div>
                        </div>
                    </el-col>
                </el-row>
            </el-main>
        </el-container>
        <!-- 修改实际回院时间 -->
        <el-dialog v-model="dialog.dialogTimeVisible" :title="dialog.tops" width="40%" align-center draggable
            :before-close="handleTimeClose">
            <el-divider border-style="double" style="margin:0;" />
            <el-form label-position="right" label-width="auto" style="max-width:380px;margin:20px auto"
                class="demo-form-inline" ref="itemTimeFormRef" :model="dialog.item" :rules="rules">
                <el-form-item label="实际回院时间： " prop="actualreturntime">
                    <el-date-picker style="width:320px" v-model="dialog.item.actualreturntime" type="date"
                        placeholder="实际回院时间:" value-format="YYYY-MM-DD" />
                </el-form-item>
            </el-form>
            <el-divider border-style="double" style="margin:0;" />
            <template #footer>
                <span class="dialog-footer" style="padding-top: 0px">
                    <el-button type="primary" @click="handleBackTimeUpdate">保存</el-button>
                    <el-button @click="cancelTime">取消</el-button>
                </span>
            </template>
        </el-dialog>
        <!-- 修改/添加对话框 审批 -->
        <el-dialog v-model="dialog.dialogExamineVisible" :title="dialog.tops" width="40%" align-center draggable
            :before-close="handleExamineClose">
            <el-divider border-style="double" style="margin:0;" />
            <el-form label-position="right" label-width="auto" style="max-width:380px;margin:20px auto"
                class="demo-form-inline" ref="itemExamineFormRef" :model="dialog.item" :rules="rules">
                <el-form-item label="审批：" prop="auditstatus">
                    <el-radio-group v-model="dialog.item.auditstatus" class="ml-4">
                        <el-radio :label="1">同意</el-radio>
                        <el-radio :label="2">拒绝</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <el-divider border-style="double" style="margin:0;" />
            <template #footer>
                <span class="dialog-footer" style="padding-top: 0px">
                    <el-button type="primary" @click="submitExamine">保存</el-button>
                    <el-button @click="cancelExamine">取消</el-button>
                </span>
            </template>
        </el-dialog>
        <!-- 添加外出申请对话框 -->
        <el-dialog v-model="dialog.dialogVisible" :title="dialog.tops" width="40%" align-center draggable
            :before-close="handleClose">
            <el-divider border-style="double" style="margin:0;" />
            <el-form label-position="right" label-width="auto" style="max-width:380px;margin:20px auto"
                class="demo-form-inline" ref="itemFormRef" :model="dialog.item" :rules="rules">
                <el-form-item label="客户姓名：" prop="customerId">
                    <el-select
                        v-model="dialog.item.customerId"
                        style="width:320px"
                        placeholder="客户姓名："
                        filterable
                        teleported
                        popper-class="customer-select-popper"
                        :popper-options="{
                            modifiers: [
                                { name: 'preventOverflow', options: { boundary: 'viewport' } },
                                { name: 'flip', options: { fallbackPlacements: ['bottom', 'top'] } }
                            ]
                        }"
                    >
                        <el-option v-for="item in customerOptions" :key="item.id" :label="item.customerName"
                            :value="item.id" />
                    </el-select>
                </el-form-item>
                <el-form-item label="外出事由：" prop="outgoingreason">
                    <el-input v-model="dialog.item.outgoingreason" />
                </el-form-item>
                <el-form-item label="外出时间：" prop="outgoingtime">
                    <el-date-picker style="width:320px" v-model="dialog.item.outgoingtime" type="date"
                        placeholder="外出时间:" value-format="YYYY-MM-DD" />
                </el-form-item>

                <el-form-item label="预计回院时间： " prop="expectedreturntime">
                    <el-date-picker style="width:320px" v-model="dialog.item.expectedreturntime" type="date"
                        placeholder="外出时间:" value-format="YYYY-MM-DD" />
                </el-form-item>

                <el-form-item label="陪同人： " prop="escorted">
                    <el-input v-model="dialog.item.escorted" />
                </el-form-item>

                <el-form-item label="陪同人电话： " prop="escortedtel">
                    <el-input v-model="dialog.item.escortedtel" />
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
import { ElMessage, ElMessageBox, ElForm } from 'element-plus';
import { Plus, Search } from '@element-plus/icons-vue';
import { getListPage } from "@/api/customerApi.js";
import { queryOutwardVo, addOutward, examineOutward, delOutward, updateBackTime } from "@/api/outwardApi.js";
import { getSessionStorage, getCurDate } from '@/utils/common.js';

// 表单引用
const itemFormRef = ref(null);
const itemExamineFormRef = ref(null);
const itemTimeFormRef = ref(null);

// 校验规则
const rules = reactive({
    // 可以根据需要添加校验规则
    actualreturntime: [{ required: true, message: "时间不能为空", trigger: "blur" }],
    auditstatus: [{ required: true, message: "选项不能为空", trigger: "change" }],
    customerId: [{ required: true, message: "请选择客户姓名", trigger: "blur" }],
    outgoingreason: [{ required: true, message: "外出事由不能为空", trigger: "blur" }],
    outgoingtime: [{ required: true, message: "外出时间不能为空", trigger: "blur" }],
    expectedreturntime: [{ required: true, message: "回院不能为空", trigger: "blur" }],
    escorted: [{ required: true, message: "陪同人不能为空", trigger: "blur" }],
    escortedtel: [{ required: true, message: "电话不能为空", trigger: "blur" }],

});
// 响应式状态
const pageList = ref([]); // 客户列表（分页表格）
const outwardList = ref([]); // 外出记录列表
const customerOptions = ref([]); // 客户下拉框选项（全量）
const roleId = ref(''); // 当前用户角色id

// 查询条件封装--客户
const condition = reactive({
    customerName: "",
    userId: "",
    pageNum: 1,   // ✅ 当前页
    pageSize: 6   // ✅ 每页条数
});

// 查询条件封装--外出记录
const conditionRecord = reactive({
    userId: "",
    pageNum: 1,
    pageSize: 6
});

// 分页属性封装 --客户
const page = reactive({
    total: 0,
    pageSize: 6,
    currentPag: 1,
    pagCount: 0
});

// 分页属性封装 --外出记录
const pageRecord = reactive({
    total: 0,
    pageSize: 6,
    currentPag: 1,
    pagCount: 0
});

// 模态框数据
const dialog = reactive({
    dialogVisible: false, // 模态框状态
    dialogTimeVisible: false, // 模态框状态
    dialogExamineVisible: false,
    tops: "", // 模态框标题
    item: {
        id: "",
        username: "",
        nickname: "",
        sex: "",
        email: "",
        phoneNumber: "",
        isDeleted: "", // 状态 1: 启用; 2: 停用
        createTime: "",
        createBy: "",
        password: "",
        roleId: "",
        auditstatus: 0,
        actualreturntime: "",
        backTimeId: "",
        auditperson: "",
        audittime: ""
    },
    statusArr: [
        {
            value: 1,
            label: "停用",
        },
        {
            value: 2,
            label: "启用"
        }
    ]
});
// 计算属性
const indexMethod = computed(() => {
    return page.currentPag * page.pageSize - page.pageSize + 1;
});

const indexMethodRecord = computed(() => {
    return pageRecord.currentPag * pageRecord.pageSize - pageRecord.pageSize + 1;
});

// 点击查询
const query = () => {
    // 清空护理记录数据表
    outwardList.value = [];
    condition.pageNum = 1; // 回到第一页
    fetchPageList();
    queryOutwardVoData();
};

// 选中页码-客户
const handleCurrentChange = (curPage) => {
    condition.pageNum = curPage;     // ✅ 改页码
    console.log("客户分页 - pageNum:", condition.pageNum, "pageSize:", condition.pageSize);
    fetchPageList();

    // 如果要切换客户页时清空右侧记录
    outwardList.value = [];
    conditionRecord.userId = "";
    conditionRecord.pageNum = 1;
};

// 处理客户表格行选中
const handleChangeCustomer = (row) => {
    if (row != null) {
        // 点击页码会清空 row 因此做出判断逻辑
        // 构建查询条件
        conditionRecord.userId = row.id;
        console.log(conditionRecord.userId+"---------->"+row.id)
        queryOutwardVoData();
    }
};

// 选中页码-外出记录
const handleRecordChange = (curPage) => {
    conditionRecord.pageNum = curPage;
    console.log("外出记录分页 - pageNum:", conditionRecord.pageNum, "pageSize:", conditionRecord.pageSize);
    queryOutwardVoData();
};

// 审批操作
const examine = (id) => {
    dialog.tops = "审批";
    dialog.dialogExamineVisible = true;
    dialog.item.id = id;
};

// 审批对话框关闭处理
const handleExamineClose = () => {
    dialog.dialogExamineVisible = false;
    resetForm(itemExamineFormRef); // 重置表单
};

// 取消审批
const cancelExamine = () => {
    handleExamineClose();
};

// 更新回院时间
const updateTime = (id) => {
    dialog.tops = "修改实际回院时间";
    dialog.dialogTimeVisible = true;
    dialog.item.backTimeId = id;
};

// 时间修改对话框关闭处理
const handleTimeClose = () => {
    dialog.dialogTimeVisible = false;
    resetForm(itemTimeFormRef); // 重置表单
};

// 取消修改时间
const cancelTime = () => {
    handleTimeClose();
};

// 添加外出申请
const addItem = async () => {
    dialog.tops = "添加外出申请";
    await fetchCustomerOptions();   // ✅ 加载全量客户选项
    console.log("customerOptions.length =", customerOptions.value.length);
    dialog.dialogVisible = true;
};

// 对话框关闭处理
const handleClose = () => {
    dialog.dialogVisible = false;
    resetForm(itemFormRef); // 重置表单
};

// 取消操作
const cancel = () => {
    handleClose();
};

// 重置表单
const resetForm = (formRef) => {
    if (formRef.value) {
        formRef.value.resetFields();
    }
};

// 审批外出申请
const submitExamine = () => {
    itemExamineFormRef.value.validate(valid => {
        if (valid) {
            dialog.item.auditTime = getCurDate(); // 审批时间
            // 确保auditstatus属性存在并且是数值类型
            if (dialog.item.auditstatus !== undefined) {
                // auditstatus已经是数值，不需要转换
                console.log("审批状态:", dialog.item.auditstatus);
            } else {
                // 如果还没有设置值，给一个默认值
                dialog.item.auditstatus = 1;
                console.log("设置默认审批状态:", dialog.item.auditstatus);
            }
            examineOutward(dialog.item).then(res => {
                if (res.flag) {
                    ElMessage.success(res.message);
                    // 刷新数据表格
                    queryOutwardVoData();
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

// 更新回院时间 actualreturntime
const handleBackTimeUpdate = () => {
    itemTimeFormRef.value.validate(valid => {
        console.log("更新回院时间:", dialog.item.actualreturntime + "====>" + valid);
        if (valid) {
            dialog.item.id = dialog.item.backTimeId;  // 设置id
            updateBackTime(dialog.item).then(res => {
                if (res.flag) {
                    ElMessage.success(res.message);
                    // 刷新数据表格
                    queryOutwardVoData();
                    handleTimeClose(); // 关闭模态框
                } else {
                    ElMessage.error(res.message);
                }
            });
        } else {
            return false;
        }
    });
};

// 保存外出申请
const save = () => {
    itemFormRef.value.validate(valid => {
        if (valid) {
            // 通过id判断是添加还是编辑
            if (dialog.item.id == null || dialog.item.id == "") {
                dialog.item.createTime = getCurDate();
                dialog.item.password = "000000";
                dialog.item.roleId = 2;
                dialog.item.isDeleted = 0;
                addOutward(dialog.item).then((res) => {
                    if (res.flag) {
                        ElMessage.success(res.message);
                        // 刷新数据表格
                        queryOutwardVoData();
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

// 删除外出申请
const del = (id) => {
    ElMessageBox.confirm("确定撤销申请吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
    })
        .then(() => {
            delOutward(id).then(res => {
                if (res.flag) {
                    ElMessage({
                        type: "success",
                        message: res.message
                    });
                    // 重载表格
                    queryOutwardVoData();
                }
            });
        })
        .catch(() => { });
};

// api-查询客户信息列表-分页
const fetchPageList = () => {
    console.log("调用fetchPageList，condition:", condition);
    getListPage(condition).then(res => {
        console.log("fetchPageList响应:", res);
        pageList.value = res.data.records; // 数据列表

        page.total = res.data.total; // 总记录数
        page.pageSize = res.data.size; // 每页显示条数
        page.currentPag = res.data.current; // 当前页码
        page.pagCount = res.data.pages; // 总页数
    }).catch(err => {
        console.error("fetchPageList错误:", err);
    });
};

// api-加载客户下拉框选项（全量）
const fetchCustomerOptions = async () => {
    const params = {
        customerName: "",
        pageNum: 1,
        pageSize: 10000  // 大页数获取全量
    };
    console.log("调用fetchCustomerOptions，params:", params);
    try {
        const res = await getListPage(params);
        console.log("fetchCustomerOptions响应:", res);
        customerOptions.value = res.data.records || [];
    } catch (err) {
        console.error("fetchCustomerOptions错误:", err);
    }
};

// api-查询外出申请记录
const queryOutwardVoData = () => {
    console.log("调用queryOutwardVoData，conditionRecord:", conditionRecord);
    queryOutwardVo(conditionRecord).then(res => {
        console.log("queryOutwardVoData响应:", res);
        outwardList.value = res.data.records;
        pageRecord.total = res.data.total; // 总记录数
        pageRecord.pageSize = res.data.size; // 每页显示条数
        pageRecord.currentPag = res.data.current; // 当前页码
        pageRecord.pagCount = res.data.pages; // 总页数
    }).catch(err => {
        console.error("queryOutwardVoData错误:", err);
    });
};

// 页面加载时初始化
onMounted(() => {
    fetchPageList();
    queryOutwardVoData();
    fetchCustomerOptions(); // 加载客户下拉框选项
});
</script>

<style lang="scss" scoped>
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

<!-- 全局样式，用于修复 teleported 下拉面板滚动问题 -->
<style lang="scss">
/* 修复 el-select 下拉面板滚动问题 */
.customer-select-popper .el-select-dropdown__wrap,
.customer-select-popper .el-scrollbar__wrap {
  max-height: 260px !important;
  overflow: auto !important;
  overflow-x: hidden !important;
}

/* 备用：如果上面不生效，直接修复所有下拉 */
.el-select-dropdown .el-scrollbar__wrap {
  max-height: 260px !important;
  overflow: auto !important;
}
</style>
