import { defineStore } from "pinia";
import { ref } from "vue";
const useInfoStore = defineStore('userinfo',()=>{
    const info = ref('');

    const setinfo = (newInfo) =>{
        info.value = newInfo
    };
    const removeinfo = () =>{
        info.value = {}
    }
    return{info, setinfo,removeinfo}
},{persist: true})

export { useInfoStore };
