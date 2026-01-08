<template>
    <div>
        <div class="common-layout">
            <!-- 外层容器 -->
            <el-container>
                <!-- 顶栏容器 -->
                <el-header>
                    <el-card style="width: 99%" shadow="always">
                        <el-row :gutter="20">
                            <el-col :span="6">
                                <el-button type="primary" plain :icon="CirclePlus" @click="addFoods">添加菜品</el-button>
                                <el-button type="primary" plain :icon="CirclePlus" @click="addMeals">添加膳食管理</el-button>
                            </el-col>
                            <el-col :span="11" :offset="7">
                                <el-radio-group v-model="queryParams.weekDay" size="large" @change="search">
                                    <el-radio-button v-for="day in weekdayList" :key="day" :label="day" :value="day"
                                        :class="{ 'active-day': queryParams.weekDay === day }" />
                                </el-radio-group>
                            </el-col>
                        </el-row>
                    </el-card>
                </el-header>

                <!-- 主要区域容器 早餐-->
                <el-main>
                    <el-card style="width: 99%; margin-top: 20px;" shadow="always">
                        <el-row :gutter="20">
                            <el-col :span="2">
                                <div class="flex items-center">
                                    <span>🍳</span>
                                    <span>早餐 </span>
                                </div>
                            </el-col>
                            <el-col :span="4" :offset="18">
                                07:00-09:00
                            </el-col>
                        </el-row>
                        <el-divider />
                        <el-row :gutter="20">
                            <el-col :span="6" v-for="meal in breakfastList" :key="meal.id"
                                style="margin-top: 10px;">
                                <el-card shadow="hover">
                                    <el-tag class="ml-2 taste" v-if="meal.taste == '正常'" type="primary">{{ meal.taste }}</el-tag>
                                    <el-tag class="ml-2 taste" v-if="meal.taste == '多糖'" type="warning">{{ meal.taste }}</el-tag>
                                    <el-tag class="ml-2 taste" v-if="meal.taste == '少糖'" type="success">{{ meal.taste }}</el-tag>
                                    <el-tag class="ml-2 taste" v-if="meal.taste == '多盐'" type="warning">{{ meal.taste }}</el-tag>
                                    <el-tag class="ml-2 taste" v-if="meal.taste == '少盐'" type="success">{{ meal.taste }}</el-tag>
                                    <el-image style="width: 100%; height: 180px" :src="meal.foodImg" fit="fill" />
                                    <div class="card-info">
                                        <h4 class="meal-name">{{ meal.foodName }}</h4>
                                        <div class="info-row">
                                            <span class="info-label">类型:</span>
                                            <span class="info-value">{{ meal.foodType }}</span>
                                        </div>
                                        <div class="info-row">
                                            <span class="info-label">价格:</span>
                                            <span class="info-value price">¥ {{ meal.price }}元</span>
                                        </div>
                                        <div class="info-row">
                                            <span class="info-label">清真:</span>
                                            <span class="info-value">
                                                <span class="info-value" :class="{ 'halal': meal.isHalal === 1 }">
                                                    {{ meal.isHalal === 1 ? '是' : '否' }}
                                                </span>
                                            </span>
                                        </div>
                                    </div>
                                    <div class="card-actions">
                                        <el-button type="primary" plain size="small" @click="update(meal)"
                                            class="action-btn">修改</el-button>
                                        <el-button type="danger" plain size="small" @click="del(meal)"
                                            class="action-btn">删除</el-button>
                                    </div>
                                </el-card>
                            </el-col>
                        </el-row>
                    </el-card>
                </el-main>
                <!-- 主要区域容器 中餐-->
                <el-main>
                    <el-card style="width: 99%; margin-top:  -20px;" shadow="always">
                        <el-row :gutter="20">
                            <el-col :span="2">
                                <div class="flex items-center">
                                    <span>🍲</span>
                                    <span>午餐 </span>
                                </div>
                            </el-col>
                            <el-col :span="4" :offset="18">
                                11:00-13:00
                            </el-col>
                        </el-row>
                        <el-divider />
                        <el-row :gutter="20">
                            <el-col :span="6" v-for="meal in lunchList" :key="meal.id" style="margin-top: 10px;">
                                <el-card shadow="hover">
                                    <el-tag class="ml-2 taste" v-if="meal.taste == '正常'" type="primary">{{ meal.taste }}</el-tag>
                                    <el-tag class="ml-2 taste" v-if="meal.taste == '多糖'" type="warning">{{ meal.taste }}</el-tag>
                                    <el-tag class="ml-2 taste" v-if="meal.taste == '少糖'" type="success">{{ meal.taste }}</el-tag>
                                    <el-tag class="ml-2 taste" v-if="meal.taste == '多盐'" type="warning">{{ meal.taste }}</el-tag>
                                    <el-tag class="ml-2 taste" v-if="meal.taste == '少盐'" type="success">{{ meal.taste }}</el-tag>
                                    <el-image style="width: 100%; height: 180px" :src="meal.foodImg" fit="fill" />
                                    <div class="card-info">
                                        <h4 class="meal-name">{{ meal.foodName }}</h4>
                                        <div class="info-row">
                                            <span class="info-label">类型:</span>
                                            <span class="info-value">{{ meal.foodType }}</span>
                                        </div>
                                        <div class="info-row">
                                            <span class="info-label">价格:</span>
                                            <span class="info-value price">¥ {{ meal.price }}元</span>
                                        </div>
                                        <div class="info-row">
                                            <span class="info-label">清真:</span>
                                            <span class="info-value">
                                                <span class="info-value" :class="{ 'halal': meal.isHalal === 1 }">
                                                    {{ meal.isHalal === 1 ? '是' : '否' }}
                                                </span>
                                            </span>
                                        </div>
                                    </div>
                                    <div class="card-actions">
                                        <el-button type="primary" plain size="small" @click="update(meal)"
                                            class="action-btn">修改</el-button>
                                        <el-button type="danger" plain size="small" @click="del(meal)"
                                            class="action-btn">删除</el-button>
                                    </div>
                                </el-card>
                            </el-col>
                        </el-row>
                    </el-card>
                </el-main>
                <!-- 主要区域容器 晚餐-->
                <el-main>
                    <el-card style="width: 99%; margin-top: -20px;" shadow="always">
                        <el-row :gutter="20">
                            <el-col :span="2">
                                <div class="flex items-center">
                                    <span>🍛</span>
                                    <span>晚餐 </span>
                                </div>
                            </el-col>
                            <el-col :span="4" :offset="18">
                                17:00-19:00
                            </el-col>
                        </el-row>
                        <el-divider />
                        <el-row :gutter="20">
                            <el-col :span="6" v-for="meal in dinnerList" :key="meal.id" style="margin-top: 10px;">
                                <el-card shadow="hover">
                                    <el-tag class="ml-2 taste" v-if="meal.taste == '正常'" type="primary">{{ meal.taste }}</el-tag>
                                    <el-tag class="ml-2 taste" v-if="meal.taste == '多糖'" type="warning">{{ meal.taste }}</el-tag>
                                    <el-tag class="ml-2 taste" v-if="meal.taste == '少糖'" type="success">{{ meal.taste }}</el-tag>
                                    <el-tag class="ml-2 taste" v-if="meal.taste == '多盐'" type="warning">{{ meal.taste }}</el-tag>
                                    <el-tag class="ml-2 taste" v-if="meal.taste == '少盐'" type="success">{{ meal.taste }}</el-tag>
                                    <el-image style="width: 100%; height: 180px" :src="meal.foodImg" fit="fill" />
                                    <div class="card-info">
                                        <h4 class="meal-name">{{ meal.foodName }}</h4>
                                        <div class="info-row">
                                            <span class="info-label">类型:</span>
                                            <span class="info-value">{{ meal.foodType }}</span>
                                        </div>
                                        <div class="info-row">
                                            <span class="info-label">价格:</span>
                                            <span class="info-value price">¥ {{ meal.price }}元</span>
                                        </div>
                                        <div class="info-row">
                                            <span class="info-label">清真:</span>
                                            <span class="info-value">
                                                <span class="info-value" :class="{ 'halal': meal.isHalal === 1 }">
                                                    {{ meal.isHalal === 1 ? '是' : '否' }}
                                                </span>
                                            </span>
                                        </div>
                                    </div>
                                    <div class="card-actions">
                                        <el-button type="primary" plain size="small" @click="update(meal)"
                                            class="action-btn">修改</el-button>
                                        <el-button type="danger" plain size="small" @click="del(meal)"
                                            class="action-btn">删除</el-button>
                                    </div>
                                </el-card>
                            </el-col>
                        </el-row>
                    </el-card>
                </el-main>
            </el-container>
        </div>
        <!-- 修改/添加对话框 添加膳食管理 -->
        <el-dialog v-model="dialog.dialogVisibleMeal" :title="dialog.tops" width="40%" align-center draggable
            :before-close="handleClose">
            <el-divider border-style="double" style="margin:0;" />
            <el-form label-position="right" label-width="auto" style="max-width:380px;margin:20px auto"
                class="demo-form-inline" ref="itemFormRef" :model="dialog.meal" :rules="rules">
                <el-form-item label="膳食类型：" prop="mealType">
                    <el-select v-model="dialog.meal.mealType" style="width:320px" placeholder="餐饮类型：">
                        <el-option v-for="meal in mealtypeList" :key="meal.typeId" :label="meal.mealtypeName"
                            :value="meal.typeId" />
                    </el-select>
                </el-form-item>
                <el-form-item label="食品名称：" prop="foodId">
                    <el-select v-model="dialog.meal.foodId" style="width:320px" placeholder="食品名称：">
                        <el-option v-for="meal in foodList" :key="meal.id" :label="meal.foodName" :value="meal.id" />
                    </el-select>
                </el-form-item>
                <el-form-item label="星期：" prop="weekDay">
                    <el-select v-model="dialog.meal.weekDay" style="width:320px" placeholder="星期：">
                        <el-option value="周一" />
                        <el-option value="周二" />
                        <el-option value="周三" />
                        <el-option value="周四" />
                        <el-option value="周五" />
                        <el-option value="周六" />
                        <el-option value="周日" />
                    </el-select>
                </el-form-item>
                <el-form-item label="口味：" prop="taste">
                    <el-select v-model="dialog.meal.taste" style="width:320px" placeholder="口味：">
                        <el-option value="正常" />
                        <el-option value="多糖" />
                        <el-option value="少糖" />
                        <el-option value="多盐" />
                        <el-option value="少盐" />
                    </el-select>
                </el-form-item>
            </el-form>
            <el-divider border-style="double" style="margin:0;" />
            <template #footer>
                <span class="dialog-footer" style="padding-top: 0px">
                    <el-button type="primary" @click="saveMeal">保存</el-button>
                    <el-button @click="cancel">取消</el-button>
                </span>
            </template>
        </el-dialog>
        <!-- 修改/添加对话框 添加菜品 -->
        <el-dialog v-model="dialog.dialogVisibleFood" :title="dialog.tops" width="40%" align-center draggable
            :before-close="handleClose">
            <el-divider border-style="double" style="margin:0;" />
            <el-form label-position="right" label-width="auto" style="max-width:380px;margin:20px auto"
                class="demo-form-inline" ref="itemFormRef" :model="dialog.food" :rules="rules">
                <el-form-item label="食品名称：" prop="foodName">
                    <el-input v-model="dialog.food.foodName" placeholder="输入食品名称：" />
                </el-form-item>
                <el-form-item label="食品类型：" prop="foodType">
                    <el-input v-model="dialog.food.foodType" placeholder="输入食品类型：" />
                </el-form-item>
                <el-form-item label="食品价格：" prop="price">
                    <el-input v-model="dialog.food.price" placeholder="输入食品价格：" />
                </el-form-item>
                <el-form-item label="是否清真：" prop="isHalal">
                    <el-radio-group v-model="dialog.food.isHalal" class="ml-4">
                        <el-radio :value="1">是</el-radio>
                        <el-radio :value="0">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="食品图片：" prop="foodImg">
                    <el-upload action="#" list-type="picture-card" :auto-upload="false" :on-change="uploadFile" :limit="1"
                        ref="uploadRef">
                        <el-icon>
                            <Plus />
                        </el-icon>
                    </el-upload>
                </el-form-item>
            </el-form>
            <el-divider border-style="double" style="margin:0;" />
            <template #footer>
                <span class="dialog-footer" style="padding-top: 0px">
                    <el-button type="primary" @click="saveFood">保存</el-button>
                    <el-button @click="cancel">取消</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { CirclePlus, Plus } from '@element-plus/icons-vue'
import { ref, reactive, toRefs, watch, onMounted, nextTick } from 'vue'
import { addMeal, updateMeal, delMeal, findMeal } from "@/api/mealApi.js";
import { findFood, addFood, updateFood, delFood } from "@/api/foodApi.js";
import { upload } from "@/api/uploadApi.js";
import { ElMessage, ElMessageBox, ElForm } from 'element-plus';
//星期几
const weekdayList = ref(['周一', '周二', '周三', '周四', '周五', '周六', '周日']);
const breakfastList = ref([]); //早餐
const lunchList = ref([]); //午餐
const dinnerList = ref([]); //晚餐
//查询参数
const queryParams = reactive({
    mealType: 0,  //1早餐 2午餐 3晚餐
    weekDay: "周一",  //星期几
})

// 获取膳食列表
const getMealList = async () => {
    const res = await findMeal(queryParams); //发送请求
    breakfastList.value = res.data.filter(item => item.mealType === 1); //早餐
    lunchList.value = res.data.filter(item => item.mealType === 2);  //午餐
    dinnerList.value = res.data.filter(item => item.mealType === 3);  //晚餐
};

//食品列表
const foodList = ref([])

// 获取食品列表
const getFoodList = async () => {
    let res = await findFood();
    foodList.value = res;
};

//点击星期进行搜索
const search = (val) => {
    queryParams.weekDay = val; //构建查询条件
    breakfastList.value = null; //清空数据
    lunchList.value = null; //清空数据
    dinnerList.value = null; //清空数据
    getMealList()
}

onMounted(() => {
    queryParams.weekDay = weekdayList.value[0]
    //getFoodList()
    getMealList() //获取所有数据
})

// 表单引用
const itemFormRef = ref(ElForm);
// 模态框数据
const dialog = reactive({
    dialogVisibleMeal: false, // 模态框状态
    dialogVisibleFood: false,
    tops: "", // 模态框标题,
    meal: {
        id: "",
        foodId: "",
        foodName: "",
        foodType: "",
        price: "",
        isHalal: "",
        weekDay: "",
        mealType: "",
        taste: "",
        isDeleted: 0
    },
    food: {
        id: "",
        foodName: "",
        foodType: "",
        price: "",
        isHalal: "",
        foodImg: ""
    }
});
// 响应式状态
const mealtypeList = ref([
    { typeId: 1, mealtypeName: '早餐' },
    { typeId: 2, mealtypeName: '午餐' },
    { typeId: 3, mealtypeName: '晚餐' }
]);
// 点击添加按钮-膳食
const addMeals = () => {
    dialog.tops = "添加膳食管理";
    dialog.dialogVisibleMeal = true;
    getFoodList();
};

// 点击添加按钮-菜品
const addFoods = () => {
    dialog.tops = "添加菜品";
    dialog.dialogVisibleFood = true;
};

//点击修改按钮-菜品
const update = (row) => {
    console.log("update", row);
    dialog.tops = "修改膳食日历";
    dialog.dialogVisibleFood = true;
    // 初始化模态框数据
    nextTick(() => {
        dialog.food.id = row.foodId;
        dialog.food.foodName = row.foodName;
        dialog.food.foodType = row.foodType;
        dialog.food.price = row.price;
        dialog.food.isHalal = row.isHalal;
        dialog.food.foodImg = row.foodImg;
    });
};


// 点击删除按钮-膳食
const del =  (row) => {
    ElMessageBox.confirm("此操作删除记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
    }).then(async () => {
        let res = await delMeal(row.id);
        if (res.flag) {
            ElMessage.success(res.message)
            // 刷新数据表格
            getMealList()
        }
    }).catch(() => {
        ElMessage.success("取消删除！！")
    });
};

//保存膳食信息
const saveMeal = () => {
    console.log("--+dialog.meal-->" + dialog.meal)
    itemFormRef.value.validate(async (valid) => {
        if (valid) {
            // 通过id判断是添加还是编辑
            if (dialog.meal.id == null || dialog.meal.id == "") {
                const res = await addMeal(dialog.meal)
                if (res.flag) {
                    ElMessage.success(res.message)
                    // 刷新数据表格
                    getMealList()
                    handleClose()
                } else {
                    ElMessage.error(res.message)
                }
            } else { // 编辑

            }
        } else {
            ElMessage.error("验证失败！！！");
            return false;
        }
    });
};
//保存食品信息
const saveFood = () => {
    console.log("---->" + dialog.food)
    itemFormRef.value.validate(async (valid) => {
        if (valid) {
            // 通过id判断是添加还是编辑
            if (dialog.food.id == null || dialog.food.id == "") {
                const res = await addFood(dialog.food)
                if (res.flag) {
                    ElMessage.success(res.message);
                    // 刷新数据表格
                    getMealList()
                    handleClose()
                }
            } else { // 编辑
                const res = await updateFood(dialog.food)
                if (res.flag) {
                    ElMessage.success(res.message);
                    // 刷新数据表格
                    getMealList()
                    handleClose()
                }
            }
        } else {
            ElMessage.error("验证失败！！！");
            return false;
        }
    });
};

// 重置表单
const resetForm = () => {
    //uploadRef.value.clearFiles();//清空图片
    if (itemFormRef.value) {
        itemFormRef.value.resetFields();//重置表单
    }
};
// 对话框关闭处理
const handleClose = () => {
    cancel()
};// 取消操作
const cancel = () => {
    dialog.dialogVisibleFood = false;
    dialog.dialogVisibleMeal = false;
    resetForm(); // 重置表单
};
// 校验规则
const rules = reactive({
    // 可以根据需要添加校验规则
    mealType: [{ required: true, message: "请选择膳食类型", trigger: "blur" }],
    foodId: [{ required: true, message: "请选择食品名称", trigger: "blur" }],
    weekDay: [{ required: true, message: "请选择星期", trigger: "blur" }],
    taste: [{ required: true, message: "请选择口味", trigger: "blur" }],
    foodName: [{ required: true, message: "食品名称不能为空", trigger: "blur" }],
    foodType: [{ required: true, message: "食品类型不能为空", trigger: "blur" }],
    price: [{ required: true, message: "食品价格不能为空", trigger: "blur" }],
    isHalal: [{ required: true, message: "请选择是否清真", trigger: "blur" }],
});

// ========== 膳食管理相关函数 ==========

// ========== 菜品管理相关函数 ==========

// ========== 通用函数 ==========
</script>

<style lang="scss" scoped>
.card-info {
    .meal-name {
        margin: 0 0 7px 0;
        font-size: 16px;
        color: #333;
        font-weight: 600;
    }

    .info-row {
        display: flex;
        margin-bottom: 6px;
        font-size: 13px;

        .info-label {
            color: #666;
            width: 50px;
            flex-shrink: 0;
        }

        .info-value {
            color: #333;

            &.price {
                color: #FF6347;
                font-weight: bold;
            }

            &.halal {
                color: #1E90FF;
                font-weight: bold;
            }
        }
    }
}

.card-actions {
    padding: 10px 10px 0px 10px;
    border-top: 1px solid #eee;
    display: flex;
    justify-content: flex-end;

    .action-btn {
        padding: 3px 12px;
        font-size: 12px;
    }
}

.taste {
    position: absolute;
    z-index: 10;
}
</style>
