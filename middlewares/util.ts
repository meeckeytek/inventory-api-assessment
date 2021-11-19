import msg from "./messages";
import jwt from "jsonwebtoken";

export const getToken = (existed: any) => {
  return jwt.sign(
    {
      userId: existed._id,
      userFirstName: existed.firstName,
      userLastName: existed.lastName,
      userUserName: existed.userName
    },
    `${process.env.JWT_KEY}`,
    { expiresIn: "14d" }
  );
};

export const isAuth = (req: any, res: any, next: any) => {
  if (req.method === "OPTION") {
    return next();
  }
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (token) {
      jwt.verify(
        token,
        `${process.env.JWT_KEY}`,
        function (err: any, decoded: any) {
          if (err) {
            res.status(401).json({ message: msg.invalidToken });
          } else {
            req.user = decoded;
            next();
          }
        }
      );
    } else {
      res.status(403).json(msg.notAuthorized);
    }
  } catch (err) {
    return res
      .status(403)
      .json(msg.notAuthorized);
  }
};

export const isAdmin = (req: any, res: any, next: any) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: msg.invalidToken });
  }
};
