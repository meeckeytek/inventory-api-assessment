import message from "../middlewares/messages";
import Cart from "../models/cart.model";
import Product from "../models/product.model";
import msg from "../middlewares/messages";

//Default message when the default API is visited route
export const defaultMsg = async (req: string, res: any) => {
  res.status(200).json({ message: message.defaultMsg });
};

//Adding product to cart controller
export const addToCart = async (req: any, res: any) => {
  const { productId } = req.params;

  let product: any;

  try {
    product = await Product.findById(productId);
  } catch (error) {
    return res.status(500).json({ message: msg.serverError });
  }

  if (!product) {
    return res.status(404).json({ message: msg.notFound });
  }

  if (product.quantity < 1) {
    return res.status(404).json({ message: msg.notFound });
  }

  let existingCart: any;
  let eachProduct: any;
  try {
    existingCart = await Cart.findOne({
      customerId: req.user.userId,
      status: "Pending",
    });
  } catch (error) {
    return res.status(500).json({ message: msg.serverError });
  }

  let cartItems = {
    productId: product._id,
    name: product.name,
    price: product.price,
    quantity: 1,
  };
  if (!existingCart) {
    const cart: any = new Cart({
      customerId: req.user.userId,
      products: cartItems,
      totalPrice: product.price,
    });
    product.quantity -= 1;
    await product.save();
    await cart.save();
    return res.status(201).json({ message: "product added to cart" });
  } else {
    for (eachProduct of existingCart.products)
      if (JSON.stringify(eachProduct.productId) === JSON.stringify(productId)) {
        eachProduct.quantity += 1;
        existingCart.totalPrice += eachProduct.price;
        product.quantity -= 1;
        await product.save();
        await existingCart.save();
        return res.status(200).json({ message: "product quantity updated" });
      } else {
        await Cart.findByIdAndUpdate(existingCart._id, {
          $push: { products: cartItems },
        });
        existingCart.totalPrice += eachProduct.price;
        product.quantity -= 1;
        await product.save();
        await existingCart.save();
        return res.status(201).json({ message: "added new product" });
      }
  }
};

//Adding product to cart controller
export const removeFromCart = async (req: any, res: any) => {
  const { orderId, productId } = req.body;

  let order: any;

  try {
    order = await Cart.findOne({
      customerId: req.user.userId,
      _id: orderId,
      status: "Pending",
    });
  } catch (error) {
    return res.status(500).json({ message: msg.serverError });
  }

  if (!order) {
    return res.status(404).json({ message: msg.notFound });
  }

  if(order.products < 1){
    return res.status(404).json({ message: msg.notFound });
  }

  let product: any;

  try {
    product = await Product.findById(productId);
  } catch (error) {
    return res.status(500).json({ message: 'msg.serverError' });
  }

  if (!product) {
    return res.status(404).json({ message: msg.notFound });
  }

  for (let eachProduct of order.products)
    if (JSON.stringify(eachProduct.productId) === JSON.stringify(productId)) {
      product.quantity += eachProduct.quantity;
      order.totalPrice -= (eachProduct.price * eachProduct.quantity);
      await product.save();
      await order.save();
      await Cart.findByIdAndUpdate(orderId, {
        $pull: { products: productId },
      });
      return res.status(200).json({ message: msg.success });
    }
};

//Fetching cart items controller
export const viewCart = async (req: any, res: any) => {
  let cartItems: any;

  try {
    cartItems = await Cart.findOne({
      customerId: req.user.userId,
      status: "Pending",
    });
  } catch (error) {
    return res.status(500).json({ message: msg.serverError });
  }

  if (!cartItems) {
    return res.status(404).json({ message: message.notFound });
  }
  res.status(200).json({ message: msg.success, cartItems });
};

//Checking out controller (after payment have been made)
export const checkOut = async (req: any, res: any) => {
  let order: any;

  try {
    order = await Cart.findOne({
      customerId: req.user.userId,
      status: "Pending",
    });
  } catch (error) {
    return res.status(500).json({ message: msg.serverError });
  }

  if (!order) {
    return res.status(404).json({ message: message.notFound });
  }

  order.status = "Success" || order.status;

  try {
    order.save();
  } catch (error) {
    return res.status(500).json({ message: msg.serverError });
  }

  res.status(200).json({ message: msg.success, order });
};

//Fetching order details controller
export const viewOrderDetails = async (req: any, res: any) => {
  const { orderId } = req.params;
  let order: any;
  try {
    order = await Cart.findById(orderId);
  } catch (error) {
    return res.status(500).json({ message: msg.serverError });
  }
  if (!order) {
    return res.status(404).json({ message: message.notFound });
  }

  res.status(200).json({ message: msg.success, order });
};

// Fetching all orders controller
export const viewAllOrders = async (req: any, res: any) => {
  let order: any;
  try {
    order = await Cart.find();
  } catch (error) {
    return res.status(500).json({ message: msg.serverError });
  }
  if (!order) {
    return res.status(404).json({ message: message.notFound });
  }

  res.status(200).json({ message: msg.success, order });
};
