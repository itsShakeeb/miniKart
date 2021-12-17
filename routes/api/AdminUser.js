const express = require("express");
const { check, validationResult } = require("express-validator");
const bcryptjs = require("bcryptjs");
const jsonwebtoken = require("jsonwebtoken");
const config = require("config");

const Admin = require("../../models/AdminUser");

const router = express.Router();

router.post(
  "/admin/register",
  [
    check("email", "Email is required").isEmail(),
    check("password", "Password  length must be between than 6 to 8").isLength({
      min: 6,
      max: 8,
    }),
  ],
  async (req, res) => {
    const { email, password } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      let admin = await Admin.findOne({ email });
      if (admin) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Admin already exist" }] });
      }

      admin = new Admin({
        email,
        password,
      });

      const salt = await bcryptjs.genSalt(12);
      admin.password = await bcryptjs.hash(password, salt);

      const payload = {
        admin: {
          id: admin.id,
        },
      };

      jsonwebtoken.sign(payload, config.get("jwtSecret"), (err, token) => {
        if (err) throw err;
        res.json({ token });
      });

      await admin.save();
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ errors: [{ msg: "Server error" }] });
    }
  }
);

module.exports = router;
