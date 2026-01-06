import { defineStore } from "pinia";
//创建store
//defineStore第一个参数：唯一的，不能重复 
export const testStore = defineStore('testStore',{
    state:()=>{ //状态
        return{
            count:0
        }
    },
    getters:{//获取值
        getCount(state){
            return state.count
        }
    }, 
    actions:{ //改变state的值
        setCount(count){
            this.count = count;
        }
    }
})