import mongoose from 'mongoose';

// associated user with a review, aside from just a name, so we can check if the user already leave or review or not
const reviewSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
      // reference specific model for this ObjectId
      // use ref to add relationship between review and user
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

const productSchema = mongoose.Schema(
  {
    // only admin can create product
    // want to know which admin creates which product
    user: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
      // reference specific model for this ObjectId
      // use ref to add relationship between product and user
      ref: 'User',
    },

    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },

    reviews: [reviewSchema],

    rating: {
      type: Number,
      required: true,
      default: 0,
    },
    numReviews: {
      type: Number,
      required: true,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    countInStock: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    // The timestamps option tells mongoose to assign createdAt and updatedAt fields to your schema. The type assigned is Date.
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);

export default Product;
