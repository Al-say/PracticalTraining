<template>
    <div class="common-layout">
        <el-container>
            <el-header>
                <div>
                    <el-row :gutter="30">
                        <el-col :span="7">
                            <el-input placeholder="客户姓名" v-model="condition.customerName" clearable @clear="query"
                                size="large">
                                <template #append>
                                    <el-button type="info" @click="query" style="color:black">查询</el-button>
                                </template>
                            </el-input>
                        </el-col>
                    </el-row>
                </div>
            </el-header>
            <el-divider style="margin:0"></el-divider>
            <el-main>
                <el-table :data="customerList" style="width: 95% ;color:black;" stripe>
                    <el-table-column align="center" fixed type="index" :index="indexMethod" label="序号" width="60" />
                    <el-table-column align="center" fixed prop="customerName" label="客户姓名" width="120" />
                    <el-table-column align="center" prop="customerAge" label="年龄" width="80" />
                    <el-table-column align="center" prop="customerSex" label="性别" width="80">
                        <template #default="scope">{{ scope.row.customerSex == 0 ? '男' : '女' }}</template>
                    </el-table-column>
                    <el-table-column align="center" prop="roomNo" label="房间号" width="100" />
                    <el-table-column align="center" prop="bedNo" label="床号" width="100" />
                    <el-table-column align="center" prop="buildingNo" label="所属楼房" width="100" />
                    <el-table-column align="center" prop="contactTel" label="联系电话" width="150" />
                    <el-table-column align="center" prop="levelName" label="护理级别" width="150" />
                    <el-table-column align="center" label="操作" width="180">
                        <template #default="scope">
                            <el-button type="primary" link size="small" icon="Star" v-if="scope.row.levelId == null"
                                @click="opensetting(scope.row)">设置护理级别</el-button>
                            <el-button type="danger" link size="small" icon="Delete" v-if="scope.row.levelId != null"
                                @click="del(scope.row)">移除护理级别</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- 分页插件 -->
                <div style="margin-top:15px">
                    <el-pagination :page-size="pages.pageSize" background :current-page="pages.currentPage"
                        layout=" prev, pager, next" :total="pages.total" @current-change="handleCurrentChange" />
                </div>
                <!-- 护理级别设置抽屉 -->
                <el-drawer title="客户护理设置" :before-close="handleClose" v-model="drawer.openFlag" direction="rtl"
                    size="50%">
                    <el-container>
                        <el-header>
                            <el-row>
                                <el-col :span="1">
                                    <el-select v-model="drawer.levelId" @change="getListNurseItemByLevel"
                                        style="width:200px" placeholder="选择护理级别">
                                        <el-option v-for="item in drawer.listLevel" :key="item.id"
                                            :label="item.levelName" :value="item.id" />
                                    </el-select>
                                </el-col>
                            </el-row>
                        </el-header>
                        <el-divider style="margin:0"></el-divider>
                        <el-main>
                            <!-- 表格 -->
                            <el-table :data="drawer.isInLevelItemList" size="small">
                                <el-table-column align="center" type="index" label="序号" width="60" />
                                <el-table-column align="center" prop="serialNumber" label="编号" width="80" />
                                <el-table-column align="center" prop="nursingName" label="名称" width="100" />
                                <el-table-column align="center" prop="servicePrice" label="价格" width="80" />
                                <el-table-column align="center" prop="executionCycle" label="执行周次" width="80" />
                                <el-table-column align="center" prop="executionTimes" label="执行次数" width="80" />
                                <el-table-column align="center" prop="buyTime" label="服务购买日期" width="150" />
                                <el-table-column align="center" prop="nurseNumber" label="购买数量" width="100">
                                    <template #default="scope">
                                        <el-input v-model="scope.row.nurseNumber" placeholder="购买数量"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column align="center" prop="maturityTime" label="服务到期日期" width="160">
                                    <template #default="scope">
                                        <el-date-picker style="width:130px" format="YYYY/MM/DD"
                                            value-format="YYYY-MM-DD" v-model="scope.row.maturityTime" type="date"
                                            placeholder="服务到期日期"></el-date-picker>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-main>
                        <div class="demo-drawer__footer">
                            <el-button @click="handleClose">取 消</el-button>
                            <el-button @click="isOk" type="primary">确认</el-button>
                        </div>
                    </el-container>
                </el-drawer>
            </el-main>
        </el-container>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from "vue";
import { ElMessage, ElMessageBox } from 'element-plus';
import { getListPage } from "@/api/customerApi.js";
import { listNurseLevel, listNurseItemByLevel } from "@/api/nurseLevelApi.js";
import { addItemToCustomer, removeCustomerLevelAndItem } from "@/api/customerNurseItemApi.js";
//序号
const indexMethod = computed(() => {
    return parseInt(pages.currentPage * pages.pageSize - pages.pageSize + 1); 
})
//查询条件
const condition = reactive({
    customerName: "",
    pageSize: "1"//默认第一页
});
//分页属性封装
const pages = reactive({
    total: 0, //总记录数
    pageSize: 6, //默认每页显示6条数据
    currentPage: 1, //当前页码
    pageCount: 0 //总页数
});
//抽屉数据
const drawer = reactive({
    openFlag: false,
    listLevel: [],//级别列表
    levelId: "",
    customerId: "",
    isInLevelItemList: []//级别的护理项目列表
});

// 客户列表
const customerList = ref([]);

// 获取客户列表
const getCustomerList = async () => {
    let res = await getListPage(condition)
    if (res.flag) {
        customerList.value = res.data.records; // 客户列表
        pages.total = res.data.total;  // 总记录数
        pages.pageSize = res.data.size; // 每页显示条数
        pages.currentPage = res.data.current; // 当前页码
        pages.pageCount = res.data.pages; // 总页数
    }
}
//搜索框
const query = () => {
    condition.pageSize = "1"
    getCustomerList()
}
//点击分页
const handleCurrentChange = (val) => {
    condition.pageSize = val
    pages.currentPage = val
    getCustomerList()
}

//设置护理级别
const opensetting = (row) => {
    drawer.openFlag = true; // 打开抽屉
    //设置当前用户
    drawer.customerId = row.id
    //获取护理级别列表
    getListNurseLevel();
}
//获取护理级别列表 下拉框
const getListNurseLevel = async () => {
    let res = await listNurseLevel({ levelId: drawer.levelId });
    drawer.listLevel = res.data;
}
//获取护理项目列表
const getListNurseItemByLevel = async () => {
    let res = await listNurseItemByLevel(drawer.levelId);
    if (res.flag) {
        let newArr = res.data;
        for (let i = 0; i < newArr.length; i++) {
            newArr[i].nurseNumber = 1;
            newArr[i].buyTime = new Date().getFullYear() + "-" + new Date().getMonth() + "-" + new Date().getDate();
            newArr[i].maturityTime = new Date().getFullYear() + "-" + (new Date().getMonth() + 3) + "-" + new Date().getDate();
        }
        drawer.isInLevelItemList = newArr;
    }
}

//关闭抽屉 - 修改方法名大小写与模板中保持一致
const handleClose = () => {
    drawer.openFlag = false;
    //初始化数据
    drawer.isInLevelItemList = []
    drawer.levelId = ""
    drawer.customerId = ""
    drawer.listLevel = []
}
//确定
const isOk = () => {
    let customerItemList = drawer.isInLevelItemList
    let paramsArr = [];//提交的参数
    if (customerItemList.length == 0) {
        ElMessage.error("请选择护理级别")
        return
    }
    //构建提交的参数列表
    for (let i = 0; i < customerItemList.length; i++) {
        let obj = {}
        obj.itemId = customerItemList[i].id
        obj.buyTime = customerItemList[i].buyTime
        obj.customerId = drawer.customerId  // 修正拼写错误：custormerId -> customerId
        obj.nurseNumber = customerItemList[i].nurseNumber
        obj.isDeleted = 0
        obj.maturityTime = customerItemList[i].maturityTime
        obj.levelId = drawer.levelId
        paramsArr.push(obj)
    }
    ElMessageBox.confirm("确定添加此护理级别及其护理项目数据无误?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
    }).then(async () => {
        //console.log(row)    
        let res = await addItemToCustomer(paramsArr)
        if (res.flag) {
            ElMessage.success(res.message)
            getCustomerList()// 刷新列表
            handleClose() // 关闭模态框
        } else {
            ElMessage.error(res.message)
        }
    }).catch(() => {
        ElMessage.success("取消添加！！")
    });
}

//删除护理级别
const del = (row) => {
    ElMessageBox.confirm("确定删除此护理级别及其护理项目数据?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
    }).then(async () => {
        //console.log(row)    
        let res = await removeCustomerLevelAndItem({ levelId: row.levelId, customerId: row.id })
        if (res.flag) {
            ElMessage.success(res.message)
            getCustomerList()// 刷新列表
            handleClose() // 关闭模态框
        } else {
            ElMessage.error(res.message)
        }
    }).catch(() => {
        ElMessage.success("取消删除！！")
    });
}

onMounted(() => {
    getCustomerList()
});

</script>

<style lang="scss" scoped></style>
