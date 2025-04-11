import {Typography} from "@mui/material";
import React from "react";

function ContentAdmin(){
    return (
        <section style={{padding: "20px", flex: 1}}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
                Tổng quan - Hàng hóa
            </Typography>
            <Typography>
                Đây là nơi bạn có thể hiển thị nội dung chính cho mục "Tổng quan" và "Hàng hóa".
            </Typography>
        </section>
    )
}

export default ContentAdmin;