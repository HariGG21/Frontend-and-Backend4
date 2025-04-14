// // src/types/auth.ts

// export interface User {
//     _id: string;
//     username: string;
//     email: string;
//     // password?: string; // We likely don't want to expose the password on the frontend
//     __v?: number;
//   }
  
//   export interface LoginRequest {
//     email: string;
//     password: string;
//   }
  
//   export interface LoginResponse {
//     token: string;
//     user: Omit<User, 'password'>; // Exclude password from the user object
//   }
  
//   export interface RegisterRequest {
//     name?: string;
//     email: string;
//     password: string;
//   }
  
//   export interface RegisterResponse {
//     token: string;
//     user: Omit<User, 'password'>; // Exclude password from the user object
//   }
  
//   export interface ApiErrorResponse {
//     message: string;
//   }




export interface User {
  _id: string;
  username: string;
  email: string;
  __v?: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: Omit<User, 'password'>;
}

export interface RegisterRequest {
  name?: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  token: string;
  user: Omit<User, 'password'>;
}

export interface ApiErrorResponse {
  message: string;
}