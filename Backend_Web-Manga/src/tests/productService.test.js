const { createProduct } = require('../services/ProductService');
const Product = require('../models/ProductModel');

jest.mock('../models/ProductModel');

describe('createProduct', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return error if product name already exists', async () => {
        Product.findOne.mockResolvedValue({ name: 'Sách A' });

        const result = await createProduct({
            name: 'Sách A',
            type: 'Kỹ năng',
            price: 100000,
            stock: 10,
            description: 'Sách kỹ năng sống',
            cover: 'bìa mềm',
            image: 'image.jpg',
            author: 'Tác giả A',
            publisher: 'NXB A',
            pages: 200
        });

        expect(result.status).toBe('ERR');
        expect(result.message).toBe('The name of product is already');
    });

    it('should create product successfully if name does not exist', async () => {
        Product.findOne.mockResolvedValue(null);
        Product.create.mockResolvedValue({
            _id: 'abc123',
            name: 'Sách B'
        });

        const result = await createProduct({
            name: 'Sách B',
            type: 'Văn học',
            price: 150000,
            stock: 5,
            description: 'Một cuốn tiểu thuyết hấp dẫn',
            cover: 'bìa cứng',
            image: 'image-b.jpg',
            author: 'Tác giả B',
            publisher: 'NXB Văn Học',
            pages: 350
        });

        expect(result.status).toBe('OK');
        expect(result.message).toBe('SUCCESS');
        expect(result.data.name).toBe('Sách B');
    });

    it('should throw error on exception', async () => {
        Product.findOne.mockRejectedValue(new Error('DB Error'));

        await expect(createProduct({ name: 'Lỗi' })).rejects.toThrow('DB Error');
    });
});
