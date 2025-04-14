export interface Product {
    _id: string; // Make _id a required string
    name: string;
    price: number;
    stock: number;
    images: string[];
    createdAt?: Date;
    updatedAt?: Date;
  }