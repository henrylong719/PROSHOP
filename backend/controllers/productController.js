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

export { getProducts, getProductById };
