import Order from '../models/orderModel.js';
import asyncHandler from 'express-async-handler';

// $desc     Create new order
// $route    POST /api/orders
// $access   Private

const addOrderItems =
  // for handling exceptions inside of async express routes and passing them to your express error handlers.
  asyncHandler(async (req, res) => {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
      res.status(400);
      throw new Error('No order items');
      return;
    } else {
      const order = new Order({
        orderItems,
        user: req.user._id,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
      });

      const createdOrder = await order.save();

      res.status(201).json(createdOrder);
    }
  });

// $desc     Get order by ID
// $route    GET /api/orders/:id
// $access   Private

const getOrderById =
  // for handling exceptions inside of async express routes and passing them to your express error handlers.
  asyncHandler(async (req, res) => {
    // use populate to get the user's name and email that associated with order
    const order = await Order.findById(req.params.id).populate(
      'user',
      'name email'
    );

    if (order) {
      res.json(order);
    } else {
      res.status(404);
      throw new Error('Order not found');
    }
  });

// $desc   Update order to paid
// $route    GET /api/orders/:id/pay
// $access   Private

const updateOrderToPaid =
  // for handling exceptions inside of async express routes and passing them to your express error handlers.
  asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        // coming from PayPal response
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.payer.email_address,
      };

      const updateOrder = await order.save();

      res.json(updateOrder);
    } else {
      res.status(404);
      throw new Error('Order not found');
    }
  });

// $desc   Update order to paid
// $route    GET /api/orders/:id/pay
// $access   Private

const updateOrderToDelivered =
  // for handling exceptions inside of async express routes and passing them to your express error handlers.
  asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();

      // console.log(order.deliveredAt);

      const updateOrder = await order.save();

      res.json(updateOrder);
    } else {
      res.status(404);
      throw new Error('Order not found');
    }
  });

// $desc   Get logged in user orders
// $route    GET /api/orders/myorders
// $access   Private

const getMyOrders =
  // for handling exceptions inside of async express routes and passing them to your express error handlers.
  asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
  });

// $desc   Get logged in user orders
// $route    GET /api/orders
// $access   Private

const getOrders =
  // for handling exceptions inside of async express routes and passing them to your express error handlers.
  asyncHandler(async (req, res) => {
    const orders = await Order.find({}).populate('user', 'id name');
    res.json(orders);
  });

export {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
};
