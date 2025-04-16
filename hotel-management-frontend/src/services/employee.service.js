import { axiosInstance } from "../configs/axios.config.js";

class EmployeeService {
    static async getAllEmployee() {
        return await axiosInstance.get("/employees");
    }

    static async deleteEmployee(id) {
        return await axiosInstance.delete(`/employees/${id}`);
    }

    static async getUserById(id) {
        return await axiosInstance.get(`/employees/${id}`);
    }

    static async searchEmployees(search) {
        return await axiosInstance.get(
            `/employees?user_id_like=${search}`
        );
    }

    static async addEmployee(employee) {
        return await axiosInstance.post(`/employees`, employee);
    }
}

export default EmployeeService;