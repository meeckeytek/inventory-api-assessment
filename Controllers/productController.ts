import { validationResult } from "express-validator";
import message from "../middlewares/messages";
import Product from "../models/product.model";
import msg from "../middlewares/messages";

export const defaultMsg = async (req: string, res: any) => {
  res.status(200).json({ message: message.defaultMsg });
};

//Adding new product controller
export const newProduct = async (req: any, res: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ message: msg.inputError });
  }
  const { name, price, quantity } = req.body;

  const product: any = new Product({
    name,
    price,
    quantity,
  });

  try {
    await product.save();
  } catch (error) {
    return res.status(500).json({ message: msg.serverError });
  }

  res.status(201).json({ messge: msg.newInputSuccess });
};

//Fetch product by ID controller
export const getProductById = async (req: any, res: any) => {
  const { pId } = req.params;

  let product;
  try {
    product = await Product.findById(pId);
  } catch (error) {
    return res.status(500).json({ message: msg.serverError });
  }
  if (!product) {
    return res.status(404).json({ message: msg.notFound });
  }

  res.status(200).json({ Product: product });
};

//Fetch all products controller
export const allProducts = async (req: any, res: any) => {
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const sortBy = req.query.sortBy || "createdAt";
  const orderBy = req.query.orderBy || "-1";
  const { search } = req.body || "";
  const sortQuery = {
    [sortBy]: orderBy,
  };

  const searchQuery = {
    $or: [
      { name: new RegExp(String(search), "i") }
    ],
  };

  const productsCount = await Product.countDocuments(searchQuery);
  Product.countDocuments(searchQuery).then((productsCount) => {
    Product.find()
    .sort(sortQuery)
    .limit(limit)
    .skip(page * limit - limit)
    .then((products) => {
      return res.json({
        products,
        pagination: {
          hasPrevious: page > 1,
          prevPage: page - 1,
          hasNext: page < Math.ceil(productsCount / limit),
          nextPage: page + 1,
          currentPage: Number(page),
          total: productsCount,
          limit: limit,
          lastPage: Math.ceil(productsCount / limit),
        },
        links: {
          prevLink: `http://${req.headers.host}/api/v1/product/allProducts?page=${
            page - 1
          }&limit=${limit}`,
          nextLink: `http://${req.headers.host}/api/v1/product/allProducts?page=${
            page + 1
          }&limit=${limit}`,
        },
      });
    })
    .catch((err) => console.log(err));
  });
};

//Edit product controller
export const editProduct = async (req: any, res: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ message: msg.inputError });
  }
  const {name, price, quantity} = req.body;

  let product: any;
  try {
    product = await Product.findById(req.params.pId)
  } catch (error) {
    return res.status(500).json({message: msg.serverError})
  }

  if(!product){
    return res.status(404).json({message: msg.notFound})
  }

  product.name = name || product.name;
  product.price = price || product.price;
  product.quantity = quantity || product.quantity;

  try {
    await product.save()
  } catch (error) {
    return res.status(500).json({message: msg.serverError})
  }

  res.status(200).json({message: msg.success, Product: product})
};

//Delete product controller
export const deleteProduct = async (req: any, res: any) => {
  const {pId} = req.params
  let product: any;
  try {
   product = await Product.findById(pId)
  } catch (error) {
    return res.status(500).json({message: msg.serverError})
  }

  if(!product){
    return res.status(404).json({message: msg.notFound})
  }

  try {
    await product.remove()
  } catch (error) {
    return res.status(500).json({message: msg.serverError})
  }

  res.status(200).json({message: msg.success})
};
