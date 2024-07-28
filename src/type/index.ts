type UserType = {
    id?: number;
    user_name?: string;
    password?: string;
    is_admin?: boolean;
}

// 定义一个接口来表示参数的类型
interface UserInfoParams {
    id?: number;
    user_name?: string;
    password?: string;
    is_admin?: boolean;
}


export { UserInfoParams,UserType }