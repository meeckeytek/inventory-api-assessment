import {Router} from 'express'
import {check} from "express-validator"
import * as userController from '../Controllers/userController'
import { isAdmin, isAuth } from '../middlewares/util';

const userRoute = Router();

//Default message when the default API is visited route
userRoute.get('/', userController.defaultMsg);

//Registering new user route
userRoute.post('/newUser',  [
    check('firstName').not().isEmpty(),
    check('lastName').not().isEmpty(),
    check('userName').not().isEmpty(),
    check('password').isLength({min: 6})
], userController.newUser);

// User authentication route
userRoute.post('/auth', userController.auth);

// Edit user details route
userRoute.patch('/editUser/:uId', isAuth, [
    check('firstName').not().isEmpty(),
    check('lastName').not().isEmpty(),
    check('userName').not().isEmpty(),
    check('password').isLength({min: 6})
], userController.editUser);


// User details route
userRoute.get('/getUserById/:uId', isAuth, userController.userDetials);

export default userRoute;
