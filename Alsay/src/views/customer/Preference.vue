<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <div>
          <el-row :gutter="30">
            <el-col :span="7">
              <el-input placeholder="客户名称" v-model="queryParams.customerName" @clear="query" clearable size="large">
                <template #append>
                  <el-button type="info" @click="query" style="color:black">查询</el-button>
                </template>
              </el-input>
            </el-col>
            <el-col :span="17">
              <el-button type="primary" @click="addItem" color="#337ab7" style="margin-top:4px">
                <el-icon>
                  <Plus />
                </el-icon>
                <span>添加</span>
              </el-button>
            </el-col>
          </el-row>
        </div>
      </el-header>
      <el-divider style="margin:0"></el-divider>
      <el-main>
        <div>
          <!-- 表格 -->
          <el-table :data="preferenceList" style="width: 100% ;color:black;" stripe>
            <el-table-column align="center" type="index" :index="indexMethod" label="序号" width="60" />
            <el-table-column align="center" prop="customerName" label="客户名称" width="120" />
            <el-table-column align="center" prop="customerSex" label="性别" width="60">
              <template #default="scope">{{ scope.row.customerSex == 0 ? '男' : '女' }}</template>
            </el-table-column>
            <el-table-column align="center" prop="customerAge" label="年龄" width="120" />
            <el-table-column align="center" prop="preferences" label="喜好" width="300" />
            <el-table-column align="center" prop="attention" label="注意事项" width="200" />
            <el-table-column align="center" prop="remark" label="备注" width="200" />

            <el-table-column align="center" fixed="right" label="操作" width="220">
              <template #default="scope">
                <el-button type="primary" icon="Edit" link @click="edit(scope.row)">修改</el-button>
                <el-button type="danger" icon="Delete" link @click="del(scope.row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- 分页插件 -->
        <div style="margin-top:15px">
          <!-- 
              page-size:每页显示条目个数
              current-page:页码 配合@current-change使用
              disabled:是否禁用分页 
              background:是否为分页按钮添加背景色
              layout:组件布局，子组件名用逗号分隔
              total:总条目数
          -->
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
        <el-form-item label="客户姓名：" prop="customerId">
          <el-select v-model="dialog.item.customerId" style="width:320px" placeholder="客户姓名：">
            <el-option v-for="item in customerList" :key="item.id" :label="item.customerName" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="喜好：" prop="preferences">
          <el-input v-model="dialog.item.preferences" />
        </el-form-item>
        <el-form-item label="提示：" prop="attention">
          <el-input v-model="dialog.item.attention" />
        </el-form-item>

        <el-form-item label="备注：" prop="remark">
          <el-input v-model="dialog.item.remark" />
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
import { Plus } from '@element-plus/icons-vue';
import {
  addPreference,
  findPreference,
  updatePreference,
  delPreference
} from "@/api/preferenceApi.js";
import { getListPage } from "@/api/customerApi.js";

// 表单引用
const itemFormRef = ref(null);

// 响应式状态
const preferenceList = ref([]);
const customerList = ref([]);
const btnFlag = ref(true);

// 查询条件
const queryParams = reactive({
  customerName: "",
  pageSize: "1" // 默认第一页
});

// 查询条件封装--客户
const condition = reactive({
  customerName: "",
  pageSize: "1" // 默认第一页
});

// 分页属性封装
const page = reactive({
  total: 0,
  pageSize: 6,
  currentPag: 1,
  pagCount: 0
});

// 模态框数据
const dialog = reactive({
  dialogVisible: false, // 模态框状态
  tops: "", // 模态框标题,
  item: {
    id: "",
    customerId: "",
    customerName: "",
    customerSex: "",
    customerAge: "",
    preferences: "",
    attention: "",
    remark: "",
    isDeleted: 0
  }
});

// 校验规则
const rules = reactive({
  // 可以根据需要添加校验规则
});

// 计算属性 - 序号计算
const indexMethod = computed(() => {
  return page.currentPag * page.pageSize - page.pageSize + 1;
});

// 页面加载时初始化
onMounted(() => {
  getPageListData();
  getPreferenceListData();
});

// 点击查询按钮
const query = () => {
  queryParams.pageSize = "1"; // 回到第一页
  getPreferenceListData();
  getPageListData();
};

// 选中页码
const handleCurrentChange = (curPage) => {
  page.currentPag = curPage;
  queryParams.pageSize = curPage; // 参数pageSize是服务端接收页码参数名
  // 重新渲染表格
  getPreferenceListData();
};

// 点击修改按钮
const edit = (row) => {
  dialog.tops = "修改护理项目";
  dialog.dialogVisible = true;
  // 初始化模态框数据
  nextTick(() => {
    dialog.item.id = row.id;
    dialog.item.customerId = row.customerId;
    dialog.item.customerName = row.customerName;
    dialog.item.customerSex = row.customerSex;
    dialog.item.customerAge = row.customerAge;
    dialog.item.preferences = row.preferences;
    dialog.item.attention = row.attention;
    dialog.item.remark = row.remark;
  });
};

// 点击添加按钮
const addItem = () => {
  dialog.tops = "添加膳食管理";
  dialog.dialogVisible = true;
  // 清空表单数据
  dialog.item = {
    id: "",
    customerId: "",
    customerName: "",
    customerSex: "",
    customerAge: "",
    preferences: "",
    attention: "",
    remark: "",
    isDeleted: 0
  };
};

// 对话框关闭处理
const handleClose = () => {
  dialog.dialogVisible = false;
  resetForm();
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

// 保存数据(新增/编辑)
const save = () => {
  itemFormRef.value.validate(valid => {
    if (valid) {
      // 通过id判断是添加还是编辑
      if (dialog.item.id == null || dialog.item.id == "") {
        addPreference(dialog.item).then(res => {
          if (res.flag) {
            ElMessage.success(res.message);
            // 刷新数据表格(回到最初查询状态)
            queryParams.status = "1";
            queryParams.pageSize = "1"; // 回到第一页
            queryParams.customerName = "";
            getPreferenceListData();
            getPageListData();
            handleClose(); // 关闭模态框
          } else {
            ElMessage.error(res.message);
          }
        });
      } else {
        updatePreference(dialog.item).then(res => {
          if (res.flag) {
            ElMessage.success(res.message);
            // 刷新数据表格
            getPreferenceListData();
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

// 删除数据
const del = (id) => {
  ElMessageBox.confirm("此操作删除记录, 是否继续?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(() => {
      delPreference(id).then(res => {
        if (res.flag) {
          ElMessage.success(res.message);
          // 重载表格
          getPreferenceListData();
        } else {
          ElMessage.error(res.message);
        }
      });
    })
    .catch(() => { });
};

// 查询护理项目(分页)
const getPreferenceListData = () => {
  findPreference(queryParams).then(res => {
    preferenceList.value = res.data.records;
    page.total = res.data.total; // 总记录数
    page.pageSize = res.data.size; // 每页显示条数
    page.currentPag = res.data.current; // 当前页码
    page.pagCount = res.data.pages; // 总页数
  });
};

// 查询客户信息列表
const getPageListData = () => {
  getListPage(condition).then(res => {
    customerList.value = res.data.records;
  });
};
</script>

<style scoped>
.activeBtn {
  color: #1890ff;
  background: rgb(232, 244, 255);
}
</style>
