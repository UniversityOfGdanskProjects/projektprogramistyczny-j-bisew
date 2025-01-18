export interface SignInData {
    email: string;
    password: string;
}
  
export interface SignUpData {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
  }
  
  export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
  }
  
  export interface LoginResponse {
    id: string;
    name: string;
    email: string;
    role: string;
  }
  
  export interface RegisterResponse {
    message: string;
    user: User;
  }