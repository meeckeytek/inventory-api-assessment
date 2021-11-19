import bcrypt from "bcryptjs";
import { validationResult } from "express-validator";
import User from "../models/user.model";
import msg from "../middlewares/messages";
import { getToken } from "../middlewares/util";

//Default message when the default API is visited
export const defaultMsg = async (req: string, res: any) => {
  return res.status(200).json({ message: msg.defaultMsg });
};

//Registering new user controller
export const newUser = async (req: any, res: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ message: msg.inputError });
  }
  const { firstName, lastName, userName, password, isAdmin } = req.body;

  let existed: any;

  try {
    existed = await User.findOne({ userName });
  } catch (error) {
    return res.status(500).json({ message: msg.serverError });
  }

  if (existed) {
    return res.status(409).json({ message: msg.alreadyExist });
  }

  let hashedPassword: string, salt: string | number;
  try {
    salt = await bcrypt.genSalt(12);
    hashedPassword = await bcrypt.hash(password, salt);
  } catch (error) {
    return res.status(500).json({ message: msg.serverError });
  }
  const user: any = new User({
    firstName,
    lastName,
    userName,
    password: hashedPassword,
    isAdmin,
  });

  try {
    await user.save();
  } catch (error) {
    return res.status(500).json({ message: msg.serverError });
  }
  res.status(201).json({ message: msg.newInputSuccess });
};

// User authentication controller
export const auth = async (req: any, res: any) => {
  const { userName, password } = req.body;

  let user: any;
  try {
    user = await User.findOne({ userName });
  } catch (error) {
    return res.status(500).json({ message: msg.serverError });
  }

  if (!user) {
    return res.status(422).json({ message: msg.inputError });
  }

  let isValidPassword: any;

  try {
    isValidPassword = await bcrypt.compare(password, user.password);
  } catch (error) {
    return res.status(422).json({ message: msg.inputError });
  }

  if (!isValidPassword) {
    return res.status(422).json({ message: msg.inputError });
  }
  res.status(200).json(getToken(user));
};

// Edit user details controller
export const editUser = async (req: any, res: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ message: msg.inputError });
  }
  const { firstName, lastName, userName, password, isAdmin } = req.body;

  let user: any;

  try {
    user = await User.findById(req.params.uId);
  } catch (error) {
    return res.status(500).json({ message: msg.serverError });
  }

  if (!user) {
    return res.status(404).json({ message: msg.notFound });
  }

  let hashedPassword: string, salt: string | number;
  try {
    salt = await bcrypt.genSalt(12);
    hashedPassword = await bcrypt.hash(password, salt);
  } catch (error) {
    return res.status(500).json({ message: msg.serverError });
  }

  user.firstName = firstName || user.firstName;
  user.lastName = lastName || user.lastName;
  user.password = hashedPassword || user.password;
  user.isAdmin = isAdmin || user.isAdmin;

  try {
    await user.save();
  } catch (error: any) {
    return res.status(500).json({ message: msg.serverError });
  }
  res.status(200).json({ message: msg.success });
};


// Edit user details controller
export const userDetials = async (req: any, res: any) => {

  let user: any;

  try {
    user = await User.findById(req.params.uId, '-password');
  } catch (error) {
    return res.status(500).json({ message: msg.serverError });
  }

  if (!user) {
    return res.status(404).json({ message: msg.notFound });
  }

  res.status(200).json(user)

}
