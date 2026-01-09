<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <el-row :gutter="30">
          <el-col :span="7">
            <el-input
              placeholder="管家名称"
              v-model="queryParams.nickname"
              @clear="query"
              clearable
              size="large"
            >
              <template #append>
                <el-button
                  type="info"
                  @click="query"
                  style="color:black"
                >查询</el-button>
              </template>
            </el-input>
          </el-col>
        </el-row>
      </el-header>
      <el-divider style="margin:0"></el-divider>
      <el-main>
        <!-- 表格 -->
        <el-table
          :data="userList"
          style="width: 100% ;color:black;"
          stripe
        >
          <el-table-column
            align="center"
            type="index"
            :index="indexMethod"
            label="序号"
            width="200"
          />
          <el-table-column
            align="center"
            prop="nickname"
            label="姓名"
            width="200"
          />
          <el-table-column
            align="center"
            prop="phoneNumber"
            label="电话"
            width="200"
          />
          <el-table-column
            align="center"
            prop="sex"
            label="性别"
            width="200"
          >
            <template #default="scope">
              {{ scope.row.sex == 0 ? '男' : '女' }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="email"
            label="邮箱"
            width="200"
          />
          <el-table-column
            align="center"
            fixed="right"
            label="操作"
            width="220"
          >
            <template #default="scope">
              <el-button
                type="success"
                color="#337ab7"
                icon="Star"
                size="small"
                @click="userToCustomerService(scope.row)"
              >设置服务对象</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页插件 -->
        <div style="margin-top:15px">
          <el-pagination
            :page-size="page.pageSize"
            background
            :current-page="page.currentPag"
            layout=" prev, pager, next"
            :total="page.total"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Star } from '@element-plus/icons-vue';
import { getUserList } from "@/api/userApi.js";
// 路由实例
const router = useRouter();
// 设置服务对象
const userToCustomerService = (row) => {
  // 路由到设置服务对象
  router.push({
    path: "/userToCustomerService",
    query: { userId: row.id, nickName: row.nickname }
  });
};
// 响应式状态
const userList = ref([]);
// 查询参数
const queryParams = reactive({
    roleId: "2", // 查询默认角色2 - 健康管家
    nickname: "",
    pageSize: "1" // 默认第一页
});
// 分页属性封装
const page = reactive({
    total: 0,
    pageSize: 3,
    currentPag: 1,
    pagCount: 0
});
// 获取用户列表
const getUserListData = async() => {
    let res = await getUserList(queryParams);
    // console.log("---->",res);
    if (res.flag) {
        userList.value = res.data.records;
        page.total = res.data.total; // 总记录数
        page.pageSize = res.data.size; // 每页显示条数
        page.currentPag = res.data.current; // 当前页码
        page.pagCount = res.data.pages; // 总页数
    }
};
// 点击查询
const query = () => {
    queryParams.pageSize = "1"; // 回到第一页
    getUserListData();
};
// 选中页码
const handleCurrentChange = (curPage) => {
    page.currentPag = curPage;
    queryParams.pageSize = curPage; // 参数pageSize是服务端接收页码参数名
    // 重新渲染表格
    getUserListData();
};
// 计算属性 - 序号计算
const indexMethod = computed(() => {
    return page.currentPag * page.pageSize - page.pageSize + 1;
});
// 页面加载时初始化
onMounted(() => {
    getUserListData();
});
</script>

<style lang="scss" scoped></style>
