import { axiosInstance } from "../configs/axios.config.js";

class EmployeeService {
    static async getAllEmployee(page = 0, size = 10) {
        return await axiosInstance.get(`/employees?page=${page}&size=${size}`);
    }

    static async deleteEmployee(id) {
        return await axiosInstance.delete(`/employees/${id}`);
    }

    static async getUserById(id) {
        return await axiosInstance.get(`/employees/${id}`);
    }

    static async searchEmployees(search) {
        return await axiosInstance.get(`/employees?full_name_like=${search}`);
    }

    static async addEmployee(employee) {
        return await axiosInstance.post(`/employees`, employee);
    }

    static async updateEmployee(id, employee) {
        return await axiosInstance.put(`/employees/${id}`, employee);
    }

}

export default EmployeeService;