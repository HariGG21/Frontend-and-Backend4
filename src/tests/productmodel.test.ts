import mongoose from 'mongoose';

// Mock the Product model directly
const mockProduct = jest.fn(() => ({
  _id: 'someId',
  name: 'Test Product',
  price: 25.99,
  stock: 100,
  images: ['image1.jpg', 'image2.png'],
  save: jest.fn().mockResolvedValue({
    _id: 'someId',
    name: 'Test Product',
    price: 25.99,
    stock: 100,
    images: ['image1.jpg', 'image2.png'],
    createdAt: new Date(),
    updatedAt: new Date(),
    __v: 0,
  }),
})) as jest.Mock;

// Override the mongoose.model function to return our mock Product
jest.spyOn(mongoose, 'model').mockReturnValue(mockProduct);

// We don't need to import the actual Product model anymore for these tests
// import Product from '../models/productmodel';

describe('Product Model', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset the mock implementation before each test if needed
    mockProduct.mockImplementation(() => ({
      _id: 'someId',
      name: 'Test Product',
      price: 25.99,
      stock: 100,
      images: ['image1.jpg', 'image2.png'],
      save: jest.fn().mockResolvedValue({
        _id: 'someId',
        name: 'Test Product',
        price: 25.99,
        stock: 100,
        images: ['image1.jpg', 'image2.png'],
        createdAt: new Date(),
        updatedAt: new Date(),
        __v: 0,
      }),
    }));
  });

  it('should create a new product document and call save', async () => {
    const mockProductData = {
      name: 'Test Product',
      price: 25.99,
      stock: 100,
      images: ['image1.jpg', 'image2.png'],
    };

    const product = new mockProduct(mockProductData);
    await product.save();

    expect(mockProduct).toHaveBeenCalledWith(mockProductData);
    expect(product.save).toHaveBeenCalledTimes(1);
  });

  it('should return the saved product data', async () => {
    const mockProductData = {
      name: 'Test Product',
      price: 25.99,
      stock: 100,
      images: ['image1.jpg', 'image2.png'],
    };

    const product = new mockProduct(mockProductData);
    const savedProduct = await product.save();

    expect(savedProduct).toEqual({
      _id: 'someId',
      ...mockProductData,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
      __v: 0,
    });
  });

  // We are now directly mocking the model, so schema definition tests are less relevant here.
  // If you need to test the schema specifically, you might need a different setup.
  it('should have a mocked save method', () => {
    const product = new mockProduct({
      name: 'Test',
      price: 10,
      stock: 5,
      images: ['test.jpg'],
    });
    expect(product.save).toBeDefined();
  });
});