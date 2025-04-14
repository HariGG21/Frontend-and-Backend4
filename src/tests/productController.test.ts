import { Request, Response } from 'express';
import Product from '../models/productmodel';
import path from 'path';

// Mock the Multer upload middleware BEFORE importing the controller
jest.mock('multer', () => {
  const multer = jest.requireActual('multer'); // Get the actual multer
  const mockMulter = () => ({
    single: jest.fn().mockReturnValue((req, res, next) => {
      req.file = { path: 'uploads/test_image.jpg' } as Express.Multer.File;
      next();
    }),
    array: jest.fn().mockReturnValue((req, res, next) => {
      req.files = [{ path: 'uploads/test_image1.jpg' }, { path: 'uploads/test_image2.jpg' }] as Express.Multer.File[];
      next();
    }),
    diskStorage: jest.fn(() => ({ // Mock diskStorage
      destination: jest.fn((req, file, cb) => cb(null, 'mocked/destination')),
      filename: jest.fn((req, file, cb) => cb(null, 'mocked_filename')),
    })),
  });
  // Mock the return value of the top-level multer function
  mockMulter.diskStorage = jest.fn(() => ({
    destination: jest.fn((req, file, cb) => cb(null, 'mocked/destination')),
    filename: jest.fn((req, file, cb) => cb(null, 'mock_filename')),
  }));
  return mockMulter;
});

const mockedMulter = require('multer');

// Mock the Product model
jest.mock('../models/productmodel');
const mockedProduct = Product as jest.Mocked<typeof Product>;

// Mock the path module if needed
jest.mock('path');
const mockedPath = path as jest.Mocked<typeof path>;
mockedPath.extname.mockReturnValue('.jpg');
mockedPath.join.mockReturnValue('mocked/path');

// Import the controller functions AFTER mocking
import {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  getProductsByName,
  getProductsByCreatedAt,
  getProductsByStock,
  upload,
} from '../controller/productController';

// Helper to create mock Request and Response objects
const mockRequest = (body: Record<string, any> = {}, params: Record<string, any> = {}, files?: Express.Multer.File[] | Record<string, Express.Multer.File[]> | undefined) => ({
  body,
  params,
  files,
} as Request);

const mockResponse = () => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as Response;
};

describe('productController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createProduct', () => {
    //     const req = mockRequest(
    //       { name: 'Test Product', price: '25.99', stock: '100' },
    //       {},
    //       [
    //         { path: 'uploads/product_images/test_image1.jpg' } as Express.Multer.File,
    //         { path: 'uploads/product_images/test_image2.png' } as Express.Multer.File,
    //       ]
    //     );
    //     const res = mockResponse();
    //     const newProduct = {
    //       _id: 'someId',
    //       name: 'Test Product',
    //       price: 25.99,
    //       stock: 100,
    //       images: ['uploads/product_images/uploads/test_image1.jpg', 'uploads/product_images/uploads/test_image2.png'],
    //     };
    //     mockedProduct.prototype.save = jest.fn().mockResolvedValue(newProduct);
      
    //     await createProduct(req, res);
      
    //     expect(mockedProduct).toHaveBeenCalledWith({ // This assertion should match the controller's logic
    //       name: 'Test Product',
    //       price: 25.99,
    //       stock: 100,
    //       images: ['uploads/product_images/test_image1.jpg'.replace('src', 'uploads'), 'uploads/product_images/test_image2.png'.replace('src', 'uploads')],
    //     });
    //     expect(mockedProduct.prototype.save).toHaveBeenCalledTimes(1);
    //     expect(res.status).toHaveBeenCalledWith(201);
    //     expect(res.json).toHaveBeenCalledWith({ message: 'Product created successfully', product: newProduct });
    //   });
     it('should return 400 if name, price, or stock is missing', async () => {
           const reqWithoutName = mockRequest({ price: '25.99', stock: '100' }, {}, []);
           const resWithoutName = mockResponse();
           await createProduct(reqWithoutName, resWithoutName);
           expect(resWithoutName.status).toHaveBeenCalledWith(400);
           expect(resWithoutName.json).toHaveBeenCalledWith({ message: 'Name, price, and stock are required.' });
     
           const reqWithoutPrice = mockRequest({ name: 'Test Product', stock: '100' }, {}, []);
           const resWithoutPrice = mockResponse();
           await createProduct(reqWithoutPrice, resWithoutPrice);
           expect(resWithoutPrice.status).toHaveBeenCalledWith(400);
           expect(resWithoutPrice.json).toHaveBeenCalledWith({ message: 'Name, price, and stock are required.' });
     
           const reqWithoutStock = mockRequest({ name: 'Test Product', price: '25.99' }, {}, []);
           const resWithoutStock = mockResponse();
           await createProduct(reqWithoutStock, resWithoutStock);
           expect(resWithoutStock.status).toHaveBeenCalledWith(400);
           expect(resWithoutStock.json).toHaveBeenCalledWith({ message: 'Name, price, and stock are required.' });
         });
     
         it('should return 400 if no images are provided', async () => {
           const req = mockRequest({ name: 'Test Product', price: '25.99', stock: '100' }, {}, []);
           const res = mockResponse();
           await createProduct(req, res);
           expect(res.status).toHaveBeenCalledWith(400);
           expect(res.json).toHaveBeenCalledWith({ message: 'At least one image is required.' });
           expect(mockedProduct.prototype.save).not.toHaveBeenCalled();
         });
     
         it('should handle errors during product creation', async () => {
           const req = mockRequest(
             { name: 'Test Product', price: '25.99', stock: '100' },
             {},
             [{ path: 'uploads/product_images/test.jpg' } as Express.Multer.File]
           );
           const res = mockResponse();
           const errorMessage = 'Database error';
           mockedProduct.prototype.save = jest.fn().mockRejectedValue(new Error(errorMessage));
     
           await createProduct(req, res);
     
           expect(res.status).toHaveBeenCalledWith(500);
           expect(res.json).toHaveBeenCalledWith({ message: 'Error creating product', error: errorMessage });
         });
  });
   describe('getProducts', () => {
      it('should get all products', async () => {
        const req = mockRequest();
        const res = mockResponse();
        const products = [
          { _id: '1', name: 'Product 1', price: 10, stock: 50, images: [] },
          { _id: '2', name: 'Product 2', price: 20, stock: 100, images: [] },
        ];
        mockedProduct.find.mockResolvedValue(products);
  
        await getProducts(req, res);
  
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(products);
        expect(mockedProduct.find).toHaveBeenCalledTimes(1);
      });
  
      it('should handle errors during fetching products', async () => {
        const req = mockRequest();
        const res = mockResponse();
        const errorMessage = 'Database error';
        mockedProduct.find.mockRejectedValue(new Error(errorMessage));
  
        await getProducts(req, res);
  
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Error fetching products', error: errorMessage });
      });
    });

 describe('updateProduct', () => {
    // it('should update an existing product with new details and images', async () => {
    //     const req = mockRequest(
    //       { name: 'Updated Product', price: '30.50', stock: '75' },
    //       { id: 'someId' },
    //       [
    //         { path: 'uploads/product_images/updated1.jpg' } as Express.Multer.File,
    //         { path: 'uploads/product_images/updated2.png' } as Express.Multer.File,
    //       ]
    //     );
    //     const res = mockResponse();
    //     const updatedProductData = {
    //       _id: 'someId',
    //       name: 'Updated Product',
    //       price: 30.50,
    //       stock: 75,
    //       images: ['uploads/product_images/updated1.jpg', 'uploads/product_images/updated2.png'.replace('src', 'uploads')], // Apply the same replacement logic
    //     };
    //     const existingProduct = {
    //       _id: 'someId',
    //       name: 'Original Product',
    //       price: 25.99,
    //       stock: 100,
    //       images: ['old/image1.jpg'],
    //       save: jest.fn().mockResolvedValue(updatedProductData),
    //     } as any;
    //     mockedProduct.findById.mockResolvedValue(existingProduct);
      
    //     await updateProduct(req, res);
      
    //     expect(mockedProduct.findById).toHaveBeenCalledWith('someId');
    //     expect(existingProduct.save).toHaveBeenCalledTimes(1);
    //     expect(res.status).toHaveBeenCalledWith(200);
    //     expect(res.json).toHaveBeenCalledWith({
    //       message: 'Product updated successfully',
    //       product: updatedProductData,
    //     });
    //   });

    //   it('should update product details without new images', async () => {
    //     const req = mockRequest(
    //       { name: 'Updated Product Name', price: '28', stock: '90' },
    //       { id: 'someProductId' },
    //       undefined
    //     );
    //     const res = mockResponse();
    //     const updatedProductData = {
    //       _id: 'someProductId',
    //       name: 'Updated Product Name',
    //       price: 28,
    //       stock: 90,
    //       images: ['uploads/product_images/test.jpg'.replace('src', 'uploads')], // Apply the same replacement logic
    //     };
    //     const existingProduct = {
    //       _id: 'someProductId',
    //       name: 'Original Product Name',
    //       price: 25,
    //       stock: 80,
    //       images: ['uploads/product_images/test.jpg'],
    //       save: jest.fn().mockResolvedValue(updatedProductData),
    //     } as any;
    //     mockedProduct.findById.mockResolvedValue(existingProduct);
      
    //     await updateProduct(req, res);
      
    //     expect(mockedProduct.findById).toHaveBeenCalledWith('someProductId');
    //     expect(existingProduct.save).toHaveBeenCalledTimes(1);
    //     expect(res.status).toHaveBeenCalledWith(200);
    //     expect(res.json).toHaveBeenCalledWith({
    //       message: 'Product updated successfully',
    //       product: updatedProductData,
    //     });
    //   });

    it('should return 404 if product to update is not found', async () => {
      const req = mockRequest({ name: 'Updated Product' }, { id: 'nonExistentId' }, undefined);
      const res = mockResponse();
      mockedProduct.findById.mockResolvedValue(null);

      await updateProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Product not found' });
      expect(mockedProduct.findById).toHaveBeenCalledWith('nonExistentId');
    });

    it('should handle errors during product update', async () => {
      const req = mockRequest({ name: 'Updated Product' }, { id: 'someProductId' }, undefined);
      const res = mockResponse();
      const errorMessage = 'Database error';
      mockedProduct.findById.mockRejectedValue(new Error(errorMessage));

      await updateProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error updating product', error: errorMessage });
    });
  });

 describe('deleteProduct', () => {
     it('should delete an existing product', async () => {
       const req = mockRequest({}, { id: 'someProductId' });
       const res = mockResponse();
       const deletedProduct = { _id: 'someProductId', name: 'Test Product' };
       mockedProduct.findByIdAndDelete.mockResolvedValue(deletedProduct);
 
       await deleteProduct(req, res);
 
       expect(res.status).toHaveBeenCalledWith(200);
       expect(res.json).toHaveBeenCalledWith({ message: 'Product deleted successfully', product: deletedProduct });
       expect(mockedProduct.findByIdAndDelete).toHaveBeenCalledWith('someProductId');
     });
 
     it('should return 404 if product to delete is not found', async () => {
       const req = mockRequest({}, { id: 'nonExistentId' });
       const res = mockResponse();
       mockedProduct.findByIdAndDelete.mockResolvedValue(null);
 
       await deleteProduct(req, res);
 
       expect(res.status).toHaveBeenCalledWith(404);
       expect(res.json).toHaveBeenCalledWith({ message: 'Product not found' });
       expect(mockedProduct.findByIdAndDelete).toHaveBeenCalledWith('nonExistentId');
     });
 
     it('should handle errors during product deletion', async () => {
       const req = mockRequest({}, { id: 'someProductId' });
       const res = mockResponse();
       const errorMessage = 'Database error';
       mockedProduct.findByIdAndDelete.mockRejectedValue(new Error(errorMessage));
 
       await deleteProduct(req, res);
 
       expect(res.status).toHaveBeenCalledWith(500);
       expect(res.json).toHaveBeenCalledWith({ message: 'Error deleting product', error: errorMessage });
     });
   });
 

 describe('getProductsByName', () => {
    it('should get products by name', async () => {
      const req = mockRequest({ name: 'Test' });
      const res = mockResponse();
      const products = [
        { _id: '1', name: 'Test Product 1', price: 10, stock: 50, images: [] },
        { _id: '2', name: 'Another Test Item', price: 20, stock: 100, images: [] },
      ];
      mockedProduct.find.mockResolvedValue(products);

      await getProductsByName(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(products);
      expect(mockedProduct.find).toHaveBeenCalledWith({ name: { $regex: 'Test', $options: 'i' } });
    });

    it('should return 400 if name is missing', async () => {
      const req = mockRequest({});
      const res = mockResponse();

      await getProductsByName(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Name is required for searching.' });
      expect(mockedProduct.find).not.toHaveBeenCalled();
    });

    it('should handle errors during fetching products by name', async () => {
      const req = mockRequest({ name: 'Test' });
      const res = mockResponse();
      const errorMessage = 'Database error';
      mockedProduct.find.mockRejectedValue(new Error(errorMessage));

      await getProductsByName(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error fetching products by name', error: errorMessage });
    });
  });

  describe('getProductsByCreatedAt', () => {
    it('should get products created after a given date', async () => {
      const req = mockRequest({ startDate: '2025-04-09T12:00:00.000Z' });
      const res = mockResponse();
      const date = new Date('2025-04-09T12:00:00.000Z');
      const products = [{ _id: '1', name: 'Product A', createdAt: new Date('2025-04-10T00:00:00.000Z') }];
      mockedProduct.find.mockResolvedValue(products);

      await getProductsByCreatedAt(req, res);

      expect(mockedProduct.find).toHaveBeenCalledWith({ createdAt: { $gte: date } });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(products);
    });

   it('should return 400 if startDate is not provided', async () => {
            const req = mockRequest({});
            const res = mockResponse();
      
            await getProductsByCreatedAt(req, res);
      
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Start date is required for filtering.' });
          });
      
          it('should return 400 if startDate is in an invalid format', async () => {
            const req = mockRequest({ startDate: 'invalid-date' });
            const res = mockResponse();
      
            await getProductsByCreatedAt(req, res);
      
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Invalid date format.' });
          });
      
          it('should handle errors during fetching products by created date', async () => {
            const req = mockRequest({ startDate: '2023-10-26' });
            const res = mockResponse();
            const errorMessage = 'Error fetching by date';
            mockedProduct.find.mockRejectedValue(new Error(errorMessage));
      
            await getProductsByCreatedAt(req, res);
      
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Error fetching products by created date', error: errorMessage });
          });
        });
      

  describe('getProductsByStock', () => {
         it('should get products with stock greater than or equal to minStock', async () => {
           const req = mockRequest({ minStock: '50' });
           const res = mockResponse();
           const products = [{ _id: '1', name: 'Product X', stock: 55 }, { _id: '2', name: 'Product Y', stock: 100 }];
           mockedProduct.find.mockResolvedValue(products);
     
           await getProductsByStock(req, res);
     
           expect(mockedProduct.find).toHaveBeenCalledWith({ stock: { $gte: 50 } });
           expect(res.status).toHaveBeenCalledWith(200);
           expect(res.json).toHaveBeenCalledWith(products);
         });
     
         it('should return 400 if minStock is not provided', async () => {
           const req = mockRequest({});
           const res = mockResponse();
     
           await getProductsByStock(req, res);
     
           expect(res.status).toHaveBeenCalledWith(400);
           expect(res.json).toHaveBeenCalledWith({ message: 'Minimum stock value is required for filtering.' });
         });
     
         it('should return 400 if minStock is not a valid number', async () => {
           const req = mockRequest({ minStock: 'abc' });
           const res = mockResponse();
     
           await getProductsByStock(req, res);
     
           expect(res.status).toHaveBeenCalledWith(400);
           expect(res.json).toHaveBeenCalledWith({ message: 'Invalid minimum stock value.' });
         });
     
         it('should handle errors during fetching products by stock', async () => {
           const req = mockRequest({ minStock: '10' });
           const res = mockResponse();
           const errorMessage = 'Error fetching by stock';
           mockedProduct.find.mockRejectedValue(new Error(errorMessage));
     
           await getProductsByStock(req, res);
     
           expect(mockedProduct.find).toHaveBeenCalledWith({ stock: { $gte: 10 } });
           expect(res.status).toHaveBeenCalledWith(500);
           expect(res.json).toHaveBeenCalledWith({ message: 'Error fetching products by stock', error: errorMessage });
         });
       });
});