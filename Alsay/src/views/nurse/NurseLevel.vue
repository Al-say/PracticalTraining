<template>
    <div class="common-layout">
        <el-container>
            <el-header>
                <div>
                    <el-row :gutter="10">
                        <el-col :span="1">
                            <el-button type="primary" @click="addLevel" color="#337ab7" style="margin-top:4px;width:100px">
                                <el-icon><Plus /></el-icon>
                                <span>添加</span>
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
                    <el-table :data="listLevel" style="width: 80%;color:black;" stripe >
                        <el-table-column align="center" type="index" label="序号" width="100" />
                        <el-table-column align="center" prop="levelName" label="护理级别" width="200" />
                        <el-table-column align="center" prop="levelStatus" label="状态" width="200">
                            <template #default="scope">{{ scope.row.levelStatus == 1 ? '启用' : '停用' }}</template>
                        </el-table-column>
                        <el-table-column align="center" label="操作" width="500">
                            <template #default="scope">
                                <el-button type="primary" :icon="Edit" size="small" @click="edit(scope.row)">修改</el-button>
                                <el-button type="danger" :icon="Delete" size="small" @click="del(scope.row.id)">删除</el-button>
                                <el-button type="success" :icon="Star" v-if="scope.row.levelStatus == 1"
                                 size="small" @click="itemToLevel(scope.row)">护理项目配置</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </el-main>
        </el-container>
        <!-- 修改/添加对话框 -->
        <el-dialog v-model="dialog.dialogVisible" :title="dialog.tops" width="40%" align-center draggable
            :before-close="handleClose">
            <el-divider border-style="double" style="margin:0;" />
            <el-form label-position="right" label-width="auto" style="max-width:380px;margin:20px auto"
                class="demo-form-inline" ref="levelFormRef" :model="dialog.level" :rules="dialog.rules">
                <el-form-item label="护理级别：" prop="levelName">
                    <el-input v-model="dialog.level.levelName" />
                </el-form-item>
                <el-form-item label="状态：" prop="levelStatus">
                    <el-select v-model="dialog.level.levelStatus" style="width:320px" placeholder="状态">
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
import { ref, reactive, onMounted, nextTick } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Plus, Edit, Star,Delete } from '@element-plus/icons-vue';
import { useRouter,useRoute } from 'vue-router';
import { addNurseLevel, updateNurseLevel, listNurseLevel, removeNurseLevel } from "@/api/nurseLevelApi.js";

// 使用router
const router = useRouter();
// 表单引用
const levelFormRef = ref(null);
// 响应式状态
const btnFlag = ref(true);
const listLevel = ref([]);
// 点击护理项目配置
const itemToLevel = (row) => {
    // 路由到护理项目配置  http://localhost:8080/nurse/addItemToLevel?levelId=4&levelName=%E5%9B%9B%E7%BA%A7
    router.push({ path: "/addItemToLevel", query: { levelId: row.id, levelName: row.levelName } });
};
// 查询参数
const queryParams = reactive({
    levelStatus: "1", // 1-启用 2-停用
});
// 对话框数据
const dialog = reactive({
    dialogVisible: false,
    tops: "",
    level: {
        id: "",
        levelName: "",
        levelStatus: ""
    },
    statusArr: [
        {
            value: 1,
            label: "启用"
        },
        {
            value: 2,
            label: "停用"
        }
    ],
    // 校验规则
    rules: {
        levelName: [{ required: true, message: "请输入级别", trigger: "blur" }],
        levelStatus: [{ required: true, message: "请选择状态", trigger: "change" }]
    }
});

// 页面加载时获取护理级别列表
onMounted(() => {
    listNurseLevelData();
});

// 点击启用
const enable = () => {
    btnFlag.value = true;
    queryParams.levelStatus = "1"; // 1-启用
    listNurseLevelData();
};

// 点击停用
const disable = () => {
    btnFlag.value = false;
    queryParams.levelStatus = "2"; // 2-停用
    listNurseLevelData();
};

// 关闭模态框
const handleClose = () => {
    dialog.dialogVisible = false;
    resetForm(); // 重置表单
};

// 重置表单
const resetForm = () => {
    if (levelFormRef.value) {
        levelFormRef.value.resetFields();
    }
};

// 取消
const cancel = () => {
    handleClose();
};

// 点击添加
const addLevel = () => {
    dialog.tops = "添加护理级别";
    dialog.dialogVisible = true;
    // 清空表单数据
    nextTick(() => {
        dialog.level.id = "";
        dialog.level.levelName = "";
        dialog.level.levelStatus = "";
    });
};

// 点击编辑
const edit = (row) => {
    dialog.tops = "信息编辑";
    dialog.dialogVisible = true;
    // 初始化模态框数据
    nextTick(() => {
        dialog.level.id = row.id;
        dialog.level.levelName = row.levelName;
        dialog.level.levelStatus = row.levelStatus;
    });
};

// 删除护理级别
const del = (id) => {
    ElMessageBox.confirm("确定删除此护理级别吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
    })
        .then(() => {
            removeNurseLevel(id).then(res => {
                if (res.flag) {
                    ElMessage.success(res.message);
                    // 刷新数据表格
                    listNurseLevelData();
                } else {
                    ElMessage.error(res.message);
                }
            });
        })
        .catch(() => {});
};

// api-保存（新增/编辑）
const save = () => {
    levelFormRef.value.validate(valid => {
        if (valid) {
            // 通过 id 判断是添加还是编辑
            if (!dialog.level.id) {
                addNurseLevel(dialog.level).then(res => {
                    if (res.flag) {
                        ElMessage.success(res.message);
                        // 刷新数据表格(回到最初查询状态)
                        queryParams.levelStatus = "1";
                        listNurseLevelData();
                        handleClose(); // 关闭模态框
                    } else {
                        ElMessage.error(res.message);
                    }
                });
            } else {
                updateNurseLevel(dialog.level).then(res => {
                    if (res.flag) {
                        ElMessage.success(res.message);
                        // 刷新数据表格
                        listNurseLevelData();
                        handleClose(); // 关闭模态框
                    } else {
                        ElMessage.error(res.message);
                    }
                }); nurselevelitem
            }
        } else {
            return false;
        }
    });
};

// api-查询护理级别列表
const listNurseLevelData = async() => {
    let res = await listNurseLevel(queryParams);
    listLevel.value = res.data;
};
</script>

<style scoped>
.activeBtn {
    color: #1890ff;
    background: rgb(232, 244, 255);
}
</style>
