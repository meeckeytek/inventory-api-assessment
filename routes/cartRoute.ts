import express from 'express';
import {Router} from 'express'
import { isAuth } from "../middlewares/util"
import * as cartController from '../Controllers/cartController'
const cartRoute = Router();

//Default message when the default API is visited route
cartRoute.get('/', cartController.defaultMsg);

//Adding to cart route
cartRoute.get('/addToCart/:productId', isAuth, cartController.addToCart);

//Remove from cart route
cartRoute.post('/removeFromCart/:orderId', isAuth, cartController.removeFromCart);

//Fetch cart items route
cartRoute.get('/viewCart', isAuth, cartController.viewCart);

//Checking out route
cartRoute.get('/checkOut', isAuth, cartController.checkOut);

//Fetching single order details route
cartRoute.get('/viewOrderDetails/:orderId', isAuth, cartController.viewOrderDetails);

//Fetching all orders route
cartRoute.post('/allOrders', isAuth, cartController.viewAllOrders);

export default cartRoute;
