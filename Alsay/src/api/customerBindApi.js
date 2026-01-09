import http from "@/http/index.js";

/** 护工绑定客户：POST /customer/bindCustomers */
export const bindCustomers = (data) => {
  return http.post("/customer/bindCustomers", data);
};
