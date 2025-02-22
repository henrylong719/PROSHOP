import Product from '../models/productModel.js';
import asyncHandler from 'express-async-handler';

// $desc     Fetch all products
// $route    GET /api/products
// $access   Public

const getProducts =
  // for handling exceptions inside of async express routes and passing them to your express error handlers.
  asyncHandler(async (req, res) => {
    // for pagination
    const pageSize = 10;

    // req.query: get query string  e.g.  /api/products?pagenumber=1
    const page = Number(req.query.pageNumber) || 1;

    const keyword = req.query.keyword
      ? {
          // use regex to do vague search e.g. ip == iphone
          name: {
            $regex: req.query.keyword,
            // case insensitive
            $options: 'i',
          },
        }
      : {};

    // count the total number of product
    const count = await Product.countDocuments({ ...keyword });

    // pass {} return anything
    const products = await Product.find({ ...keyword })
      // limit number of products showing on the page
      .limit(pageSize)
      // for the pages > 1
      .skip(pageSize * (page - 1));

    res.json({ products, page, pages: Math.ceil(count / pageSize) });
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

// $desc     Create new review
// $route    POST /api/products/:id/reviews
// $access   Private

const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error('Product already reviewed');
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);

    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();

    res.status(210).json({ message: 'Review added' });
  } else {
    res.status(404);
    throw Error('Product not found');
  }
});

// $desc     Get top rated products
// $route    POST /api/products/top
// $access   Public

const getTopProducts = asyncHandler(async (req, res) => {
  // ascending order (rating: -1)

  const products = await Product.find({}).sort({ rating: -1 }).limit(3);

  res.json(products);
});

export {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  createProductReview,
  getTopProducts,
};
