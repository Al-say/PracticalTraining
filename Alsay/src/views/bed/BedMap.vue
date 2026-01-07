<template>
    <div class="main">
        <div class="query">
            <table class="query-table">
                <thead>
                    <tr>
                        <td>
                            <div class="query-form">
                                <el-form :inline="true">
                                    <el-form-item label="楼层：">
                                        <el-select v-model="form.floor" @change="findBedVoData" style="width: 140px">
                                            <el-option label="一楼" value="一楼" />
                                            <el-option label="二楼" value="二楼" />
                                        </el-select>
                                    </el-form-item>
                                </el-form>
                            </div>
                        </td>
                        <td style="width:120px">
                            <div>
                                <img src="@/assets/bed/all.png" />
                                <span class="pic-text">总床数:</span>{{ count.zcw }}
                            </div>
                        </td>
                        <td style="width:120px">
                            <div>
                                <img src="@/assets/bed/kx.png" />
                                <span class="pic-text">空闲:</span>{{ count.kx }}
                            </div>
                        </td>
                        <td style="width:120px">
                            <div>
                                <img src="@/assets/bed/yr.png" />
                                <span class="pic-text">有人:</span>{{ count.yr }}
                            </div>
                        </td>
                        <td style="width:120px">
                            <div>
                                <img src="@/assets/bed/wc.png" />
                                <span class="pic-text">外出:</span>{{ count.wc }}
                            </div>
                        </td>
                    </tr>
                </thead>
            </table>
        </div>
        <div class="map">
            <table border="1px" cellspacing="20px" style=" border-collapse: collapse; width:100%;">
                <tbody>
                    <tr class="cwsyt_thead">
                        <!-- 第一行显示房间号 - 前半部分 -->
                        <template v-if="listRoom.length > 0">
                            <!-- 显示前面几个房间 -->
                            <td v-for="(item, index) in listRoom.slice(0, 1)" :key="'room-' + item.roomNo">
                                {{ item.roomNo }}
                            </td>
                            <!-- 固定的公共区域 -->
                            <td class="room_id" rowspan="2" style="background-color:#AEEEEE">电梯厅</td>
                            <td class="room_id" rowspan="2" colspan="2" style="background-color:#9AC0CD">洗衣房</td>
                            <td class="room_id" rowspan="2" colspan="2" style="background-color:#4EEE94">活动中心</td>
                            <!-- 显示中间几个房间 -->
                            <td v-for="(item, index) in listRoom.slice(1, 4)" :key="'room-' + item.roomNo">
                                {{ item.roomNo }}
                            </td>
                            <!-- 走道 -->
                            <td class="room_id" rowspan="2" style="background-color:#CDAA7D">走道</td>
                            <!-- 显示右侧几个房间 -->
                            <td v-for="(item, index) in listRoom.slice(4, 6)" :key="'room-' + item.roomNo">
                                {{ item.roomNo }}
                            </td>
                        </template>
                    </tr>
                    <tr class="cwsyt_tbody">
                        <!-- 第二行显示房间内的床位 - 前半部分 -->
                        <template v-if="listRoom.length > 0">
                            <!-- 前面几个房间的床位 -->
                            <td v-for="(item, index) in listRoom.slice(0, 1)" :key="'bed-' + item.roomNo">
                                <a href="javascript:void(0)" v-for="bedItem in item.bedList" :key="bedItem.bedNo">
                                    <div>
                                        <img v-if="bedItem.bedStatus == 1" src="@/assets/bed/kx.png" />
                                        <img v-if="bedItem.bedStatus == 2" src="@/assets/bed/yr.png" />
                                        <img v-if="bedItem.bedStatus == 3" src="@/assets/bed/wc.png" />
                                    </div>
                                    {{ bedItem.bedNo }}
                                </a>
                            </td>
                            <!-- 中间几个房间的床位 (公共区域已在上一行用 rowspan=2 设置，所以这里跳过) -->
                            <td v-for="(item, index) in listRoom.slice(1, 4)" :key="'bed-' + item.roomNo">
                                <a href="javascript:void(0)" v-for="bedItem in item.bedList" :key="bedItem.bedNo">
                                    <div>
                                        <img v-if="bedItem.bedStatus == 1" src="@/assets/bed/kx.png" />
                                        <img v-if="bedItem.bedStatus == 2" src="@/assets/bed/yr.png" />
                                        <img v-if="bedItem.bedStatus == 3" src="@/assets/bed/wc.png" />
                                    </div>
                                    {{ bedItem.bedNo }}
                                </a>
                            </td>
                            <!-- 右侧几个房间的床位 (走道已在上一行用rowspan=2设置，所以这里跳过) -->
                            <td v-for="(item, index) in listRoom.slice(4, 6)" :key="'bed-' + item.roomNo">
                                <a href="javascript:void(0)" v-for="bedItem in item.bedList" :key="bedItem.bedNo">
                                    <div>
                                        <img v-if="bedItem.bedStatus == 1" src="@/assets/bed/kx.png" />
                                        <img v-if="bedItem.bedStatus == 2" src="@/assets/bed/yr.png" />
                                        <img v-if="bedItem.bedStatus == 3" src="@/assets/bed/wc.png" />
                                    </div>
                                    {{ bedItem.bedNo }}
                                </a>
                            </td>
                        </template>
                    </tr>
                    <tr>
                        <!-- 空行作为分隔 -->
                    </tr>
                    <tr class="cwsyt_thead">
                        <!-- 第三行显示房间号 - 后半部分 -->
                        <template v-if="listRoom.length > 6">
                            <td v-for="(item, index) in listRoom.slice(6)" :key="'room-' + item.roomNo">
                                {{ item.roomNo }}
                            </td>
                        </template>
                    </tr>
                    <tr class="cwsyt_tbody">
                        <!-- 第四行显示房间内的床位 - 后半部分 -->
                        <template v-if="listRoom.length > 6">
                            <td v-for="(item, index) in listRoom.slice(6)" :key="'bed-' + item.roomNo">
                                <a href="javascript:void(0)" v-for="bedItem in item.bedList" :key="bedItem.bedNo">
                                    <div>
                                        <img v-if="bedItem.bedStatus == 1" src="@/assets/bed/kx.png" />
                                        <img v-if="bedItem.bedStatus == 2" src="@/assets/bed/yr.png" />
                                        <img v-if="bedItem.bedStatus == 3" src="@/assets/bed/wc.png" />
                                    </div>
                                    {{ bedItem.bedNo }}
                                </a>
                            </td>
                        </template>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { findBedVo } from '@/api/bedApi.js';

// 查询条件数据
const form = reactive({
    floor: "一楼"  // 修改参数名为floor，与后端API保持一致
});

// 床位统计
const count = reactive({
    zcw: '',  // 总床位
    kx: '',  // 空床位
    yr: '',  // 有人
    wc: ''   // 外出
});
// 房间列表
const listRoom = ref([]);
// 查询房间和床位信息列表、床位统计信息
const findBedVoData = async () => {
    let res = await findBedVo(form);
    // 添加数据检查，确保res.data存在且包含必要的属性
    if (res && res.data) {
        count.zcw = res.data.zcw || 0;
        count.kx = res.data.kx || 0;
        count.yr = res.data.yr || 0;
        count.wc = res.data.wc || 0;
        listRoom.value = res.data.roomList || [];
    } else {
        console.error('API返回数据格式不正确:', res);
        // 设置默认值，防止页面出错
        count.zcw = 0;
        count.kx = 0;
        count.yr = 0;
        count.wc = 0;
        listRoom.value = [];
    }
};

// 初始化床位示意图
onMounted(() => {
    findBedVoData();
});
</script>

<style scoped>
.main .query {
    height: 60px;
}
.main .query .query-table {
    height: 60px;
}
.main .query .query-table .query-form {
    margin-top: 12px;
}
.main .query .query-table img {
    width: 25px;
    height: 13px;
}
.main .query .query-table .pic-text {
    margin-left: 5px;
    margin-right: 5px;
    font-weight: 700;
}
.main .map {
    margin-top: 5px;
}
.main .map .cwsyt_thead {
    background-color: #0168b7;
    color: white;
    text-align: center;
}
.main .map .cwsyt_tbody {
    height: 140px;
    text-align: center;
}
.main .map .cwsyt_tbody div {
    width: 50px;
    margin-top: 5px;
}
.main .map .cwsyt_tbody div>img {
    width: 100%;
    height: 100%;
    margin-left: 35%;
}
.main .map table>tbody>tr>td {
    border: 1px solid #484747;
}
a {
    color: #6a6767;
}
</style>
