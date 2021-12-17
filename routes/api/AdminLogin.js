const express = require("express");
const config = require("config");
const bcryptjs = require("bcryptjs");
const jsonwebtoken = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const AdminUser = require("../../models/AdminUser");

const router = express.Router();

router.post(
  "/admin/login",
  [
    check("email", "Email is required").not().isEmpty(),
    check("password", "Password is required").isLength({ min: "6", max: 8 }),
  ],
  async (req, res) => {
    try {
      const { email, password } = req.body;

      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      let user = await AdminUser.findOne({ email });

      if (!user)
        res.status(400).json({ errors: [{ msg: "Invalid credential" }] });

      let isMatch = await bcryptjs.compare(password, user.password);

      if (!isMatch)
        res.status(400).json({ errors: [{ msg: "Invalid credential" }] });

      const payload = {
        user: {
          id: user.id,
        },
      };

      jsonwebtoken.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: "1d" },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ errors: [{ msg: "Server error" }] });
    }
  }
);
module.exports = router;
