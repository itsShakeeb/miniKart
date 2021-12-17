const jsonwebtoken = require("jsonwebtoken");
const config = require("config");
const auth = function (req, res, next) {
  const token = req.headers.authorization;
  if (!token)
    return res
      .status(401)
      .json({ errors: [{ msg: "No token ,authorization denied" }] });

  //verify token
  try {
    const decode = jsonwebtoken.verify(token, config.get("jwtSecret"));
    req.user = decode.user;
    next();
  } catch (error) {
    console.error(error.message);
    res.status(401).json({ errors: [{ msg: "Token is invalid" }] });
  }
};

module.exports = auth;
