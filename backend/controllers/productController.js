import Product from '../models/productModel.js';
import asyncHandler from 'express-async-handler';

// $desc     Fetch all products
// $route    GET /api/products
// $access   Public

const getProducts =
  // for handling exceptions inside of async express routes and passing them to your express error handlers.
  asyncHandler(async (req, res) => {
    // pass {} return anything
    const products = await Product.find({});

    res.json(products);
  });

// $desc     Fetch single product
// $route    GET /api/products/:id
// $access   Public

const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.json(product);
  } else {
    // res.status(404).json({ message: 'Product not found' });

    res.status(404);
    // since we have error handler in server.js there could be just throw error
    throw new Error('Product not found');
  }
});

// $desc     delete single product
// $route    DELETE /api/products/:id
// $access   Private/Admin

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await product.remove();
    res.json({ message: 'Product removed' });
  } else {
    // res.status(404).json({ message: 'Product not found' });

    res.status(404);
    // since we have error handler in server.js there could be just throw error
    throw new Error('Product not found');
  }
});

// $desc     Create a product
// $route    POST /api/products
// $access   Private/Admin

const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: 'Sample name',
    price: 0,
    user: req.user._id,
    image: '/image/sample.jpg',
    brand: 'Sample brand',
    category: 'Sample category',
    countInStock: 0,
    numReviews: 0,
    description: 'Sample description',
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// $desc     Update a product
// $route    PUT /api/products/:id
// $access   Private/Admin

const updateProduct = asyncHandler(async (req, res) => {
  const {
    name,
    price,
    description,
    image,
    brand,
    category,
    countInStock,
  } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name;
    product.price = price;
    product.description = description;
    product.image = image;
    product.brand = brand;
    product.category = category;
    product.countInStock = countInStock;

    const updatedProduct = await product.save();
    res.status(201).json(updatedProduct);
  } else {
    res.status(404);
    throw Error('Product not found');
  }
});

export {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
};
