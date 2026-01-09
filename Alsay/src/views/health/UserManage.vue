<template>
    <div class="common-layout">
        <el-container>
            <el-header>
                <el-row :gutter="30">
                    <el-col :span="7">
                        <el-input placeholder="名称" v-model="queryParams.nickname" @clear="query" clearable size="large">
                            <template #append>
                                <el-button type="info" @click="query" style="color:black">查询</el-button>
                            </template>
                        </el-input>
                    </el-col>
                    <el-col :span="6" style="margin-top:5px">
                        <el-button type="primary" @click="addItem" icon="Plus" color="#337ab7" >
                            <span>添加</span>
                        </el-button>
                         <el-button type="warning" icon="Loading" @click="resetBtn">重置</el-button>
                    </el-col>
                </el-row>
            </el-header>
            <el-divider style="margin:0"></el-divider>
            <el-main>
                <!-- 表格 -->
                <el-table :data="userList" style="width: 100% ;color:black;" stripe>
                    <el-table-column align="center" type="index" :index="indexMethod" label="序号" width="60" />
                    <!-- <el-table-column align="center" prop="id" label="编号" width="120" /> -->
                    <el-table-column align="center" prop="createTime" label="创建时间" width="120" />
                    <el-table-column align="center" prop="username" label="用户名" width="120" />
                    <el-table-column align="center" prop="nickname" label="真实姓名" width="120" />
                    <el-table-column align="center" prop="sex" label="性别" width="120">
                        <template #default="scope">{{ scope.row.sex == 1 ? '男' : '女' }}</template>
                    </el-table-column>
                    <el-table-column align="center" prop="email" label="邮箱" width="180" />
                    <el-table-column align="center" prop="phoneNumber" label="电话号码" width="120" />
                    <el-table-column align="center" prop="roleId" label="权限" width="120">
                        <template #default="scope">{{ scope.row.roleId == 1 ? '管理员' : '护工' }}</template>
                    </el-table-column>
                    <el-table-column align="center" prop="status" label="状态" width="120">
                        <template #default="scope">{{ scope.row.isDeleted == 1 ? '停用' : '启用' }}</template>
                    </el-table-column>
                    <el-table-column align="center" fixed="right" label="操作" width="220">
                        <template #default="scope">
                            <el-button type="primary" :icon="Edit" link @click="edit(scope.row)">修改</el-button>
                            <el-button type="danger" :icon="Delete" link @click="del(scope.row.id)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- 分页插件 -->
                <div style="margin-top:15px">
                    <!-- <el-pagination :page-size="page.pageSize" background :current-page="page.currentPag"
                        layout=" prev, pager, next" :total="page.total" @current-change="handleCurrentChange" /> -->

                        <el-pagination :current-page="page.curPage" :page-size="page.pageSize" :page-sizes="[2, 3, 4, 5, 6]"
            :size="size" :disabled="disabled" :background="background" layout="total, sizes, prev, pager, next, jumper"
            :total="page.total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
                </div>
            </el-main>
        </el-container>
        <!-- 修改/添加对话框 -->
        <el-dialog v-model="dialog.dialogVisible" :title="dialog.tops" width="40%" align-center draggable
            :before-close="handleClose">
            <el-divider border-style="double" style="margin:0;" />
            <el-form label-position="right" label-width="auto" style="max-width:380px;margin:20px auto"
                class="demo-form-inline" ref="itemFormRef" :model="dialog.item" :rules="rules">
                <el-form-item label="用户名：" prop="username">
                    <el-input v-model="dialog.item.username" />
                </el-form-item>
                <el-form-item label="真实姓名：" prop="nickname">
                    <el-input v-model="dialog.item.nickname" />
                </el-form-item>
                <el-form-item label="性别：" prop="sex">
                    <el-select v-model="dialog.item.sex"  :model-value ="dialog.item.sex == 1 ? '男' : '女'" style="width:320px" placeholder="性别：">
                        <el-option label="男" value="1" />
                        <el-option label="女" value="2" />
                    </el-select>
                </el-form-item>
                <el-form-item label="邮箱：" prop="email">
                    <el-input v-model="dialog.item.email" />
                </el-form-item>
                <el-form-item label="电话号码： " prop="phoneNumber">
                    <el-input v-model="dialog.item.phoneNumber" />
                </el-form-item>
                <el-form-item label="状态：" prop="isDeleted">
                    <el-select v-model="dialog.item.isDeleted" :model-value ="dialog.item.isDeleted == 1 ? '停用' : '启用'" style="width:320px" placeholder="状态">
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
import { Edit, Delete, Plus } from '@element-plus/icons-vue';
import { addUser, updateUser, delUser, findAllUser } from "@/api/userApi.js";
import { getCurDate, getSessionStorage } from "@/utils/common.js";

// 表单引用
const itemFormRef = ref(null);

// 响应式状态
const userList = ref([]);
const btnFlag = ref(true);

// 查询参数
const queryParams = reactive({
    status: "1", // 查询默认状态1 -启用 nickname
    nickname: "",
    pageSize: "6", // 默认第一页
    curPage: "1"
});

// 分页属性封装
const page = reactive({
    total: 0,
    pageSize: 6,
    curPage: 1,
    pagCount: 0
});

// 模态框数据
const dialog = reactive({
    dialogVisible: false, // 模态框状态
    tops: "", // 模态框标题,
    item: {
        id: "",
        username: "",
        nickname: "",
        sex: "",
        email: "",
        phoneNumber: "",
        isDeleted: "", // 状态 1：启用；2：停用
        createTime: "",
        createBy: "",
        password: "",
        roleId: ""
    },
    statusArr: [{ value: 1, label: "停用" }, { value: 2, label: "启用" }]
});
// 校验规则
const rules = reactive({
    username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
    nickname: [{ required: true, message: "请输入真实姓名", trigger: "blur" }],
    email: [{ required: true, message: "请输入邮箱", trigger: "blur" }],
    isDeleted: [{ required: true, message: "请选择状态", trigger: "change" }]
});

// 计算属性
const indexMethod = computed(() => {
    return page.curPage * page.pageSize - page.pageSize + 1;
});
// 页面加载时获取用户列表
onMounted(() => {
    getUserList();
});
// 点击查询
const query = () => {
    // queryParams.pageSize = "1"; // 回到第一页
    queryParams.curPage = "1";
    getUserList();
};
// 点击启用
const enable = () => {
    btnFlag.value = true;
    queryParams.status = "1"; // 1-启用
    queryParams.curPage = "1"; // 回到第一页
    getUserList();
};

// 点击停用
const disable = () => {
    btnFlag.value = false;
    queryParams.curPage = "1"; // 2-停用
    queryParams.status = "2"; // 0-生效床位信息
    getUserList();
};
// 选中页码
const handleCurrentChange = (curPage) => {
    page.curPage = curPage;
    queryParams.curPage = curPage; // 参数pageSize是服务端接收页码参数名
    // 重新渲染表格
    getUserList();
};
const handleSizeChange = (size) => {
    page.pageSize = size;
    queryParams.pageSize = size; // 参数pageSize是服务端接收页码参数名
    getUserList();
};  

const resetBtn = () => {
    queryParams.nickname = '';
    queryParams.curPage = "1";
    getUserList();
};
// 点击修改
const edit = (row) => {
    dialog.tops = "修改用户";
    dialog.dialogVisible = true;
    // 初始化模态框数据
    nextTick(() => {
        dialog.item.id = row.id;
        dialog.item.username = row.username;
        dialog.item.nickname = row.nickname;
        dialog.item.email = row.email;
        dialog.item.sex = row.sex;
        dialog.item.isDeleted = row.isDeleted;
        dialog.item.phoneNumber = row.phoneNumber;
    });
};

// 点击添加按钮
const addItem = () => {
    dialog.tops = "添加用户";
    dialog.dialogVisible = true;
    // 重置表单数据
    nextTick(() => {
        dialog.item.id = "";
        dialog.item.username = "";
        dialog.item.nickname = "";
        dialog.item.email = "";
        dialog.item.sex = "";
        dialog.item.isDeleted = "";
        dialog.item.phoneNumber = "";
    });
};

// 对话框关闭处理
const handleClose = () => {
    dialog.dialogVisible = false;
    resetForm(); // 重置表单
};

// 取消操作
const cancel = () => {
    handleClose();
};

// 重置表单
const resetForm = () => {
    if (itemFormRef.value) {
        itemFormRef.value.resetFields();
    }
};

// api-保存(新增/编辑)
const save = () => {
    itemFormRef.value.validate(async (valid) => {
        if (valid) {
            // 通过id判断是添加还是编辑
            if (dialog.item.id == null || dialog.item.id == "") {
                dialog.item.createTime = getCurDate();
                dialog.item.createBy = "2"; //getSessionStorage("user").id;
                dialog.item.password = "000000";
                dialog.item.roleId = 2;
                console.log(dialog.item);
                let res = await addUser(dialog.item);
                if (res.flag) {
                    ElMessage.success(res.message);
                    // 刷新数据表格(回到最初查询状态)
                    queryParams.status = "1";
                    queryParams.curPage  = "1"; // 回到第一页
                    queryParams.itemName = "";
                    getUserList();
                    handleClose(); // 关闭模态框
                } else {
                    ElMessage.error(res.message);
                }
            } else {
                 console.log(dialog.item);
                updateUser(dialog.item).then(res => {
                    if (res.flag) {
                        ElMessage.success(res.message);
                        // 刷新数据表格
                        getUserList();
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
    ElMessageBox.confirm("此操作删除记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
    })
        .then(() => {
            delUser(id).then(res => {
                if (res.flag) {
                    ElMessage.success(res.message);
                    // 重载表格
                    getUserList();
                } else {
                    ElMessage.error(res.message);
                }
            });
        }).catch(() => { });
};

// api-查询用户列表(分页)
const getUserList = () => {
    findAllUser(queryParams).then(res => {
        userList.value = res.data.records;
        page.total = res.data.total; // 总记录数
        page.pageSize = res.data.size; // 每页显示条数
        page.curPage = res.data.current; // 当前页码
        page.pagCount = res.data.pages; // 总页数
    });
};
</script>

<style scoped>
.activeBtn {
    color: #1890ff;
    background: rgb(232, 244, 255);
}
</style>
