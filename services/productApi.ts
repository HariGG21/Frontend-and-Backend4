import axios, { AxiosResponse } from 'axios';
import { Product } from '../types/product';
import { ApiResponse } from '../types/apiResponse';

const API_BASE_URL = 'http://localhost:5000/';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

const apiWithFormData = axios.create({ 
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'multipart/form-data',
    },
});

export const createProduct = async (
    productData: FormData
): Promise<AxiosResponse<ApiResponse<Product>>> => {
    try {
        const response = await apiWithFormData.post<ApiResponse<Product>>('/api/products/products', productData);
        return response;
    } catch (error: any) {
        throw error;
    }
};


// export const getProducts = async (
//   sort?: string,
//   filter?: { name?: string; stock?: string } | undefined
// ): Promise<AxiosResponse<Product[]>> => {
//   try {
//       const response = await api.get<Product[]>('/api/products', {
//           params: {
//               sort: sort || undefined,
//               name: filter?.name || undefined,
//               stock: filter?.stock || undefined,
//           },
//       });
//       return response;
//   } catch (error: any) {
//       console.error('Error fetching products:', error);
//       throw error;
//   }
// };




export const getProducts = async (
    sort?: string,
    filter?: { name?: string; stock?: string }
): Promise<AxiosResponse<Product[]>> => {
    try {
        const response = await api.get<Product[]>('/api/products/products', {
            params: {
                sort: sort || undefined,
                name: filter?.name || undefined,
                stock: filter?.stock || undefined,
            },
        });
        return response;
    } catch (error: any) {
        console.error('Error fetching products:', error);
        throw error; // <--- Crucial: You are re-throwing the error
    }
};





export const updateProduct = async (
    id: string,
    productData: FormData
): Promise<AxiosResponse<ApiResponse<Product>>> => {
    try {
        const response = await apiWithFormData.put<ApiResponse<Product>>(`/api/products/products/${id}`, productData);
        return response;
    } catch (error: any) {
        console.error(`Error updating product with ID ${id}:`, error);
        throw error;
    }
};

export const deleteProduct = async (
    id: string
): Promise<AxiosResponse<ApiResponse<string>>> => {
    try {
        const response =await api.delete(`/api/products/products/${id}`);  // Assuming RESTful DELETE endpoint
        return response;
    } catch (error: any) {
        console.error(`Error deleting product with ID ${id}:`, error);
        throw error;
    }
};

export const getProductsByName = async (
    name: string
): Promise<AxiosResponse<Product[]>> => {
    try {
        const response = await api.get<Product[]>('/api/products/products', { params: { name } }); // Using GET with query param
        return response;
    } catch (error: any) {
        console.error(`Error fetching products by name "${name}":`, error);
        throw error;
    }
};

export const getProductsByCreatedAt = async (
    createdAt: Date
): Promise<AxiosResponse<Product[]>> => {
    try {
        const response = await api.get<Product[]>('/api/products/products', { params: { createdAt } }); // Using GET with query param
        return response;
    } catch (error: any) {
        console.error(`Error fetching products by createdAt "${createdAt}":`, error);
        throw error;
    }
};

export const getProductsByStock = async (
    stock: number
): Promise<AxiosResponse<Product[]>> => {
    try {
        const response = await api.get<Product[]>('/api/products/products', { params: { stock } }); // Using GET with query param
        return response;
    } catch (error: any) {
        console.error(`Error fetching products by stock "${stock}":`, error);
        throw error;
    }
};