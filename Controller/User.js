const pool = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");

const createuser = async (req, res) => {
  const errors = validationResult(req);
  console.log(req.body);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { username, email, password } = req.body;
    console.log(username, password, email);
    const hashedPassword = await bcrypt.hash(password, 10);
    const alreadyUser = await pool.query(
      "SELECT * FROM pern.users WHERE email = $1",
      [email]
    );
    if (alreadyUser.rows.length > 0) {
      // If the user exists, respond with a 400 status and a message
      return res
        .status(400)
        .json({ error: "User already exists with this email." });
    }

    const newUser = await pool.query(
      "INSERT INTO pern.users (username,email,password) VALUES($1,$2,$3) RETURNING *",
      [username, email, hashedPassword]
    );
    const {password:_password, ...userwithoutpassword} = newUser.rows[0]
    console.log(userwithoutpassword);
    res.status(201).json(userwithoutpassword);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server Error" });
  }
};

module.exports = { createuser };
