import { defineStore } from "pinia";
//定义store
export const collapseStore = defineStore('collapseStore',{
    state:()=> { //状态
        return{
            collapse:false
        }
    },
    actions:{ //方法
        setCollapse(collapse){
            this.collapse = collapse;
        }
    },
    getters:{ //属性
        getCollapse(state){
            return state.collapse
        }
    }
})
