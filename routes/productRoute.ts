import { Router } from "express";
import {check} from "express-validator";
import * as productController from "../Controllers/productController";
import { isAdmin, isAuth } from "../middlewares/util";
const productRoute = Router();

//Default message when the default API is visited route
productRoute.get("/", productController.defaultMsg);

//Adding new product route
productRoute.post("/newProduct", isAuth, isAdmin, [
    check('name').not().isEmpty(),
    check('price').not().isEmpty(),
    check('quantity').not().isEmpty()
], productController.newProduct);

//Editing product details route
productRoute.patch(
  "/editProduct/:pId",
  isAuth,
  isAdmin, [
    check('name').not().isEmpty(),
    check('price').not().isEmpty(),
    check('quantity').not().isEmpty()
],
  productController.editProduct
);

//fetching single product by product ID route
productRoute.get("/getProductById/:pId", productController.getProductById);

//fetching all products route
productRoute.post("/allProducts", productController.allProducts);

//deleting product route
productRoute.delete(
  "/deleteProduct/:pId",
  isAuth,
  isAdmin,
  productController.deleteProduct
);

export default productRoute;
