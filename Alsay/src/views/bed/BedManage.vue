<template>
    <div class="common-layout"><br />
        <el-container>
            <el-header>
                <div>
                    <el-row :gutter="30">
                        <el-col :span="5">
                            <el-form-item label="姓名：">
                                <el-input clearable v-model="queryParams.customerName" @clear="query" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="入住日期：">
                                <el-date-picker value-format="YYYY-MM-DD" format="YYYY/MM/DD" v-model="dateChange"
                                    type="daterange" unlink-panels range-separator="至" start-placeholder="开始日期"
                                    end-placeholder="结束日期"></el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-button type="primary" @click="query" :color="'#337ab7'" :icon="Search">查询</el-button>
                        </el-col>
                    </el-row>
                </div>
            </el-header>
            <el-divider style="margin:0"></el-divider>
            <el-main>
                <div>
                    <el-row class="mb-4">
                        <el-button :class="[{ activeBtn: btnFlag }]" style="border: 1px white solid;margin-left: 0px"
                            @click="doing">正在使用</el-button>
                        <el-button :class="[{ activeBtn: !btnFlag }]" style="border: 1px white solid;margin-left: 0px"
                            @click="history">使用历史</el-button>
                    </el-row>
                </div>
                <div> <!-- 表格 -->
                    <el-table :data="bedDetailsList" stripe style="width: 100%">
                        <el-table-column align="center" prop="id" label="序号" width="80" />
                        <el-table-column align="center" prop="customerName" label="客户姓名" width="180" />
                        <el-table-column align="center" prop="customerSex" label="性别" width="100">
                            <template #default="scope">{{ scope.row.customerSex == 0 ? '男' : '女' }}</template>
                        </el-table-column>
                        <el-table-column align="center" prop="bedDetails" label="床位详情" width="180" />
                        <el-table-column align="center" prop="startDate" label="床位使用起始日期" width="180" />
                        <el-table-column align="center" prop="endDate" label="床位使用结束如期" width="180" />
                        <el-table-column align="center" fixed="right" label="操作" width="320">
                            <template #default="scope">
                                <el-button type="warning" link :icon="SwitchButton" v-if="btnFlag" size="small"
                                    @click="exchange(scope.row)">床位调换</el-button>
                                <el-button type="primary" :icon="Edit" link size="small" v-if="btnFlag"
                                    @click="editMessage(scope.row)">修改</el-button>
                                <el-button type="danger" :icon="Delete" size="small" v-if="!btnFlag"
                                    @click="del(scope.row.id)">删除</el-button>
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

        <!-- 修改对话框 -->
        <el-dialog v-model="edit.dialogVisible" :before-close="editClose" title="信息修改" width="60%" align-center
            draggable>
            <el-divider border-style="double" style="margin:0;" />
            <el-form label-position="right" label-width="auto" style="max-width:800px;margin:20px auto"
                class="demo-form-inline" :inline="true" :model="edit.bedDetalsForm" :rules="rules" ref="editFormRef">
                <el-form-item label="客户姓名：" prop="customerName">
                    <el-input readonly v-model="edit.bedDetalsForm.customerName" />
                </el-form-item>
                <el-form-item label="性别：" prop="customerSex">
                    <el-input readonly v-model="edit.bedDetalsForm.customerSex"
                        :value="edit.bedDetalsForm.customerSex == 0 ? '男' : '女'" />
                </el-form-item>
                <el-form-item label="床位详情： " prop="bedDetails">
                    <el-input readonly v-model="edit.bedDetalsForm.bedDetails" />
                </el-form-item>

                <el-form-item label="床位使用起始日期：" prop="startDate">
                    <el-input readonly v-model="edit.bedDetalsForm.startDate" />
                </el-form-item>

                <el-form-item label="床位使用结束日期： " prop="endDate">
                    <el-date-picker v-model="edit.bedDetalsForm.endDate" style="width:200px" format="YYYY/MM/DD"
                        value-format="YYYY-MM-DD" type="date" placeholder="选择日期"></el-date-picker>
                </el-form-item>
            </el-form>
            <el-divider border-style="double" style="margin:0;" />
            <template #footer>
                <span class="dialog-footer" style="padding-top: 0px">
                    <el-button type="primary" @click="editSave">保存</el-button>
                    <el-button @click="editCancel">取消</el-button>
                </span>
            </template>
        </el-dialog>
        <!-- 床位调换对话框 -->
        <el-dialog v-model="exchangeData.dialogVisible" title="床位调换" width="60%" :before-close="exchangeClose"
            align-center draggable>
            <el-divider border-style="double" style="margin:0;" />
            <el-form label-position="right" label-width="auto" style="max-width:800px;margin:20px auto"
                class="demo-form-inline" :inline="true" :model="exchangeData.exchangeForm" ref="exchangeFormRef">
                <el-form-item label="客户姓名：" prop="customerName">
                    <el-input readonly v-model="exchangeData.exchangeForm.customerName" />
                </el-form-item>
                <el-form-item label="旧床位详情" prop="bedDetails">
                    <el-input readonly v-model="exchangeData.exchangeForm.bedDetails" />
                </el-form-item>

                <el-form-item label="性别：" prop="customerSex">
                    <el-input readonly v-model="exchangeData.exchangeForm.customerSex"
                        :value="exchangeData.exchangeForm.customerSex == 0 ? '男' : '女'" />
                </el-form-item>
                <el-form-item label="新楼号" prop="buildingNo">
                    <el-input readonly v-model="exchangeData.exchangeForm.buildingNo" />
                </el-form-item>

                <el-form-item label="新房号" prop="newRoomNo">
                    <el-select v-model="exchangeData.exchangeForm.newRoomNo" style="width:200px" placeholder="请选择房间号"
                        @change="getBed">
                        <el-option-group v-for="group in exchangeData.roomList" :key="group.label" :label="group.label">
                            <el-option v-for="item in group.options" :key="item.roomNo" :label="item.roomNo"
                                :value="item.roomNo"></el-option>
                        </el-option-group>
                    </el-select>
                </el-form-item>

                <el-form-item label="当前床位使用起始日期：" prop="startDate">
                    <el-input readonly v-model="exchangeData.exchangeForm.startDate" />
                </el-form-item>
                <el-form-item label="新床号" prop="newBedId">
                    <el-select style="width:200px" v-model="exchangeData.exchangeForm.newBedId" placeholder="请选择床位">
                        <el-option ref="bedlist" v-for="item in exchangeData.bedList" :key="item.bedNo"
                            :label="item.bedNo" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="当前床位使用结束时间：" prop="endDate">
                    <el-input readonly v-model="exchangeData.exchangeForm.endDate" />
                </el-form-item>
            </el-form>
            <el-divider border-style="double" style="margin:0;" />
            <template #footer>
                <span class="dialog-footer" style="padding-top: 0px">
                    <el-button type="primary" @click="exchangeSave">保存</el-button>
                    <el-button @click="exchangeCancel">取消</el-button>
                </span>
            </template>
        </el-dialog>
    </div>

</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Search, Edit, Delete, SwitchButton } from '@element-plus/icons-vue';
import {
    findBedDetailsList,
    updateDetailsStartDate,
    findBedByRoom,
    exchangeBed,
    delBedDetails
} from "@/api/bedApi.js";
import { listRoom } from "@/api/roomApi.js";
// 响应式状态
const queryParams = reactive({
    customerName: "",
    startDate: "",
    endDate: "",
    pageSize: "1", //默认第一页 
    isDeleted: "0" //显示标志  0-生效床位信息 1-失效床位信息(历史记录)
});

const dateChange = ref([]); //日期选择器
const bedDetailsList = ref([]); //床位详情列表
const btnFlag = ref(true); //按钮禁用标志

// 分页属性封装
const page = reactive({
    total: 0,
    pageSize: 6,
    currentPag: 1,
    pagCount: 0
});

// 表单引用
const editFormRef = ref(null);
const exchangeFormRef = ref(null);

// 编辑模态框model
const edit = reactive({
    dialogVisible: false,
    bedDetalsForm: {
        id: "",
        customerName: "",
        customerSex: "",
        bedDetails: "",
        roomNo: "",
        startDate: "",
        endDate: ""
    }
});

// 床位调换模态框model
const exchangeData = reactive({
    dialogVisible: false,
    exchangeForm: {
        // 展示属性
        customerName: "",
        customerSex: "",
        bedDetails: "",
        startDate: "",
        oldRoomNo: "",
        // 提交参数属性
        id: "",
        customerId: "",
        buildingNo: "606",
        newRoomNo: "",
        newBedId: "",
        oldBedId: "",
        endDate: ""
    },
    roomList: [], // 房间列表
    bedList: [] // 床位列表
});

// 表单验证规则
const rules = reactive({
    endDate: [
        { required: true, message: "选择床位使用结束时间", trigger: "change" }
    ]
});

// 页面加载时获取床位列表
onMounted(() => {
    getBedDetailsList();
});

// 点击查询
const query = () => {
    if (dateChange.value != null) {
        //如果输入了日期
        queryParams.startDate = dateChange.value[0];
        queryParams.endDate = dateChange.value[1];
    } else {
        //清除日期后要初始化日期条件
        queryParams.startDate = "";
        queryParams.endDate = "";
    }
    queryParams.pageSize = "1"; //回到第一页
    //重载表格
    getBedDetailsList();
};

//正在使用
const doing = () => {
    btnFlag.value = true;
    queryParams.isDeleted = "0"; //0-生效床位信息
    queryParams.pageSize = "1"; //回到第一页
    getBedDetailsList();
};

// 使用历史
const history = () => {
    btnFlag.value = false;
    queryParams.isDeleted = "1"; //1-失效床位信息(历史记录)
    queryParams.pageSize = "1"; //回到第一页
    getBedDetailsList();
};

// 分页事件
const handleCurrentChange = (val) => {
    queryParams.pageSize = val;
    getBedDetailsList();
};

//点击编辑
const editMessage = (row) => {

    //显示模态框
    edit.dialogVisible = true;
    nextTick(() => {
        edit.bedDetalsForm.id = row.id;
        edit.bedDetalsForm.customerName = row.customerName;
        edit.bedDetalsForm.customerSex = row.customerSex;
        edit.bedDetalsForm.bedDetails = row.bedDetails;
        edit.bedDetalsForm.roomNo = row.roomNo;
        edit.bedDetalsForm.startDate = row.startDate;
        edit.bedDetalsForm.endDate = row.endDate;
    });

    console.log("点击编辑:", edit.bedDetalsForm);
};

// 重置表单
const resetForm = (formRef) => {
    if (formRef) {
        formRef.value.resetFields();
    }
};

// 编辑模态框关闭
const editClose = () => {
    edit.dialogVisible = false;
    resetForm(editFormRef); // 重置表单
};

// 编辑取消
const editCancel = () => {
    editClose();
};

// 床位调换模态框关闭
const exchangeClose = () => {
    exchangeData.dialogVisible = false;
    resetForm(exchangeFormRef); // 重置表单
};

//点击床位调换
const exchange = (row) => {
    exchangeData.dialogVisible = true;
    // 初始化表单
    nextTick(() => {
        exchangeData.exchangeForm.id = row.id;
        exchangeData.exchangeForm.customerName = row.customerName;
        exchangeData.exchangeForm.customerSex = row.customerSex;
        exchangeData.exchangeForm.bedDetails = row.bedDetails;
        exchangeData.exchangeForm.roomNo = row.roomNo;
        exchangeData.exchangeForm.startDate = row.startDate;
        exchangeData.exchangeForm.endDate = row.endDate;
        exchangeData.exchangeForm.oldRoomNo = row.roomNo;
        exchangeData.exchangeForm.customerId = row.customerId;
        exchangeData.exchangeForm.newRoomNo = "";
        exchangeData.exchangeForm.oldBedId = row.bedId;
        exchangeData.exchangeForm.newBedId = "";
    });
    //获取房间列表
    getRoomList();
};

// 取消床位调换
const exchangeCancel = () => {
    exchangeClose();
};

// api-删除历史记录
const del = (id) => {
    ElMessageBox.confirm('此操作删除记录，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
    }).then(() => {
        delBedDetails({ id: id }).then(res => {
            if (res.flag) {
                ElMessage.success(res.message)
                // 重载表格
                getBedDetailsList();
            } else {
                ElMessage.error(res.message)
            }
        })
    }).catch(() => {
        // 取消操作
    });
};

// api-点击床位调换保存
const exchangeSave = () => {
    if (
        exchangeData.exchangeForm.newRoomNo != null &&
        exchangeData.exchangeForm.newRoomNo != "" &&
        exchangeData.exchangeForm.newBedId != null &&
        exchangeData.exchangeForm.newBedId != ""
    ) {
        exchangeBed(exchangeData.exchangeForm).then(res => {
            if (res.flag) {
                ElMessage.success(res.message);
                exchangeClose(); // 关闭模态框
                // 重载表格
                getBedDetailsList();
            } else {
                ElMessage.error(res.message);
            }
        });
    } else {
        ElMessage.error("请选择新的房间和床位");
    }
};

// api-查询房间列表
const getRoomList = () => {
    listRoom().then(res => {
        // 构建房间列表数据(按楼层分组显示)
        let floor1 = res.data.filter((item) => {
            return item.roomFloor === "一楼";
        });
        let floor2 = res.data.filter((item) => {
            return item.roomFloor === "二楼";
        });
        exchangeData.roomList = [
            {
                label: "一楼",
                options: floor1
            },
            {
                label: "二楼",
                options: floor2
            }
        ];
    });
};

// api-根据选择的房间查询床位
const getBed = () => {
    // 清空床位下拉列表
    exchangeData.bedList = [];
    exchangeData.exchangeForm.newBedId = "";
    findBedByRoom({
        bedStatus: 1,
        roomNo: exchangeData.exchangeForm.newRoomNo
    }).then(res => {
        exchangeData.bedList = res.data;
    });
};

// api-编辑保存
const editSave = () => {
    editFormRef.value.validate(async (valid) => {
        console.log(edit.bedDetalsForm + ">>>>>>>>>>")
        if (valid) {
            let res = await updateDetailsStartDate(edit.bedDetalsForm);
            if (res.flag) {
                ElMessage.success(res.message);
                editClose(); // 关闭模态框
                // 重载表格
                getBedDetailsList();
            } else {
                ElMessage.error(res.message);
            }
        }
    });
};

// api-查询床位详情信息(分页)
const getBedDetailsList = () => {
    findBedDetailsList(queryParams).then(res => {
        // 添加数据检查，确保res.data存在且包含必要的属性
        if (res && res.data && res.data.records) {
            bedDetailsList.value = res.data.records;
            page.total = res.data.total || 0; // 总记录数
            page.pageSize = res.data.size || 6; // 每页显示条数
            page.currentPag = res.data.current || 1; // 当前页码
            page.pagCount = res.data.pages || 0; // 总页数
        } else {
            console.error('API返回数据格式不正确:', res);
            // 设置默认值
            bedDetailsList.value = [];
            page.total = 0;
            page.currentPag = 1;
        }
    }).catch(err => {
        console.error('获取床位详情数据失败:', err);
        // 发生错误时设置默认值
        bedDetailsList.value = [];
        page.total = 0;
        page.currentPag = 1;
        ElMessage.error('获取数据失败，请稍后再试');
    });
};
</script>

<style scoped>
.activeBtn {
    color: #1890ff;
    background: rgb(232, 244, 255);
}
</style>
