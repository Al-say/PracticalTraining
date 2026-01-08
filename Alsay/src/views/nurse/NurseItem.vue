<template>
    <div class="common-layout">
        <el-container>
            <el-header>
                <div>
                    <el-row :gutter="30">
                        <el-col :span="7">
                            <el-input placeholder="护理名称" v-model="queryParams.itemName" @clear="query" clearable
                                size="large">
                                <template #append>
                                    <el-button type="info" @click="query" style="color:black">查询</el-button>
                                </template>
                            </el-input>
                        </el-col>
                        <el-col :span="1" style="margin-top:1px;">
                            <el-button type="primary" @click="addItem" icon="Plus" color="#337ab7"
                                style="height: 38px;width:120px">
                                <span>添加护理</span>
                            </el-button>
                        </el-col>
                    </el-row>
                </div>
            </el-header>
            <el-divider style="margin:0"></el-divider>
            <el-main>
                <div>
                    <el-row class="mb-4">
                        <el-button :class="[{ activeBtn: btnFlag }]" style="border: 1px white solid;margin-left: 0px"
                            @click="enable">启用</el-button>
                        <el-button :class="[{ activeBtn: !btnFlag }]" style="border: 1px white solid;margin-left: 0px"
                            @click="disable">停用</el-button>
                    </el-row>
                </div>
                <div>
                    <!-- 表格 -->
                    <el-table :data="nurseItemList" style="width: 100% ;color:black;" stripe>
                        <el-table-column align="center" type="index" :index="indexMethod" label="序号" width="60" />
                        <el-table-column align="center" prop="serialNumber" label="编号" width="150" />
                        <el-table-column align="center" prop="nursingName" label="名称" width="150" />
                        <el-table-column align="center" prop="servicePrice" label="价格" width="120" />
                        <el-table-column align="center" prop="executionCycle" label="执行周次" width="120" />
                        <el-table-column align="center" prop="executionTimes" label="执行次数" width="120" />
                        <el-table-column align="center" prop="message" label="描述" width="120" />
                        <el-table-column align="center" prop="status" label="状态" width="120">
                            <template #default="scope">{{ scope.row.status == 1 ? '启用' : '停用' }}</template>
                        </el-table-column>
                        <el-table-column align="center" label="操作" width="220">
                            <template #default="scope">
                                <el-button type="primary" :icon="Edit" link @click="edit(scope.row)">修改</el-button>
                                <el-button type="danger" :icon="Delete" link @click="del(scope.row.id)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <!-- 分页插件 -->
                <div style="margin-top:15px">
                    <el-pagination :page-size="page.pageSize" background :current-page="page.currentPag"
                        layout=" prev, pager, next" :total="page.total" @current-change="handleCurrentChange" />
                </div>
            </el-main>
        </el-container>
        <!-- 修改/添加对话框 -->
        <el-dialog v-model="dialog.dialogVisible" :title="dialog.tops" width="40%" align-center draggable
            :before-close="handleClose">
            <el-divider border-style="double" style="margin:0;" />
            <el-form label-position="right" label-width="auto" style="max-width:380px;margin:20px auto"
                class="demo-form-inline" ref="itemFormRef" :model="dialog.item" :rules="rules">
                <el-form-item label="编号：" prop="serialNumber">
                    <el-input v-model="dialog.item.serialNumber" />
                </el-form-item>
                <el-form-item label="名称：" prop="nursingName">
                    <el-input v-model="dialog.item.nursingName" />
                </el-form-item>
                <el-form-item label="价格：" prop="servicePrice">
                    <el-input v-model="dialog.item.servicePrice" />
                </el-form-item>

                <el-form-item label="执行周期：" prop="executionCycle">
                    <el-select v-model="dialog.item.executionCycle" style="width:320px" placeholder="执行周期：">
                        <el-option label="每天" value="每天" />
                        <el-option label="每周" value="每周" />
                        <el-option label="每月" value="每月" />
                    </el-select>
                </el-form-item>

                <el-form-item label="执行次数：" prop="executionTimes">
                    <el-input v-model="dialog.item.executionTimes" />
                </el-form-item>

                <el-form-item label="描述： " prop="message">
                    <el-input v-model="dialog.item.message" />
                </el-form-item>

                <el-form-item label="状态：" prop="status">
                    <el-select v-model="dialog.item.status" style="width:320px" placeholder="状态">
                        <el-option v-for="item in dialog.statusArr" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>
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
import { Plus, Edit, Delete } from '@element-plus/icons-vue';
import { addNurseItem, findNurseItem, updateNurseItem, delNurseItem } from "@/api/nurseItemApi.js";

// 响应式引用
const itemFormRef = ref(null);
const nurseItemList = ref([]);
const btnFlag = ref(true);

// 分页属性封装
const page = reactive({
    total: 0,
    pageSize: 6,
    currentPag: 1,
    pagCount: 0
});

// 查询条件
const queryParams = reactive({
    status: "1", // 查询默认状态1 - 启用
    itemName: "",
    pageSize: "1" // 默认第一页
});

// 模态框数据
const dialog = reactive({
    dialogVisible: false, // 模态框状态
    tops: "", // 模态框标题
    item: {
        id: "",
        serialNumber: "",
        nursingName: "",
        servicePrice: "",
        message: "",
        executionCycle: "",
        executionTimes: "",
        status: "" // 状态：1启用 0停用
    },
    statusArr: [{value: 1,label: "启用"},{value: 2,label: "停用"}]
});

// 校验规则
const rules = reactive({
    serialNumber: [{ required: true, message: "请输入编号", trigger: "blur" }],
    nursingName: [{ required: true, message: "请输入名称", trigger: "blur" }],
    servicePrice: [{ required: true, message: "请输入价格", trigger: "blur" }],
    status: [{ required: true, message: "请选择状态", trigger: "change" }]
});

// 计算属性
const indexMethod = computed(() => {
    return page.currentPag * page.pageSize - page.pageSize + 1;
});

// 点击查询
const query = () => {
    queryParams.pageSize = "1"; // 回到第一页
    getNurseItemList();
};

// 点击启用
const enable = () => {
    btnFlag.value = true;
    queryParams.status = "1"; // 1-启用
    queryParams.pageSize = "1"; // 回到第一页
    getNurseItemList();
};

// 点击停用
const disable = () => {
    btnFlag.value = false;
    queryParams.pageSize = "1"; // 2-停用 
    queryParams.status = "2"; // 0-生效床位信息
    getNurseItemList();
};

// 选中页码
const handleCurrentChange = (curPage) => {
    page.currentPag = curPage;
    queryParams.pageSize = curPage; // 参数pageSize是服务端接收页码参数名
    // 重新渲染表格
    getNurseItemList();
};

// 点击修改
const edit = (row) => {
    dialog.tops = "修改护理项目";
    dialog.dialogVisible = true;
    // 初始化模态框数据
    nextTick(() => {
        dialog.item.id = row.id;
        dialog.item.serialNumber = row.serialNumber;
        dialog.item.nursingName = row.nursingName;
        dialog.item.servicePrice = row.servicePrice;
        dialog.item.message = row.message;
        dialog.item.executionCycle = row.executionCycle;
        dialog.item.executionTimes = row.executionTimes;
        dialog.item.status = row.status;
    });
};

// 点击添加按钮
const addItem = () => {
    dialog.tops = "添加护理项目";
    dialog.dialogVisible = true;
    // 重置表单数据
    nextTick(() => {
        dialog.item.id = "";
        dialog.item.serialNumber = "";
        dialog.item.nursingName = "";
        dialog.item.servicePrice = "";
        dialog.item.message = "";
        dialog.item.executionCycle = "";
        dialog.item.executionTimes = "";
        dialog.item.status = "";
    });
};

// 处理关闭
const handleClose = () => {
    dialog.dialogVisible = false;
    resetForm(); // 重置表单
};

// 取消
const cancel = () => {
    handleClose();
};
// 重置表单
const resetForm = () => {
    if (itemFormRef.value) {
        itemFormRef.value.resetFields();
    }
};
// api-保存（新增/编辑）
const save = () => {
    itemFormRef.value.validate(valid => {
        if (valid) {
            // 通过id判断是编辑还是添加
            if (!dialog.item.id) {
                addNurseItem(dialog.item).then(res => {
                    if (res.flag) {
                        ElMessage.success(res.message);
                        // 刷新数据表格(回到最初查询状态)
                        queryParams.status = "1";
                        queryParams.pageSize = "1"; // 回到第一页
                        queryParams.itemName = "";
                        getNurseItemList();
                        handleClose(); // 关闭模态框
                    } else {
                        ElMessage.error(res.message);
                    }
                });
            } else {
                updateNurseItem(dialog.item).then(res => {
                    if (res.flag) {
                        ElMessage.success(res.message);
                        // 刷新数据表格
                        getNurseItemList();
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

// api-删除
const del = (id) => {
    ElMessageBox.confirm("此操作将删除记录，是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
    })
        .then(() => {
            delNurseItem(id).then(res => {
                if (res.flag) {
                    ElMessage.success(res.message);
                    // 重载表格
                    getNurseItemList();
                } else {
                    ElMessage.error(res.message);
                }
            });
        }).catch(() => { });
};

// api-查询护理项目(分页)
const getNurseItemList = () => {
    findNurseItem(queryParams).then(res => {
        nurseItemList.value = res.data.records;
        page.total = res.data.total; // 总记录数
        page.pageSize = res.data.size; // 每页显示条数
        page.currentPag = res.data.current; // 当前页码
        page.pagCount = res.data.pages; // 总页数
    });
};

// 页面加载时获取护理项目列表
onMounted(() => {
    getNurseItemList();
});
</script>

<style scoped>
.activeBtn {
    color: #1890ff;
    background: rgb(232, 244, 255);
}
</style>
