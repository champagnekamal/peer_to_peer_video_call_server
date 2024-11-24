const pool = require("../db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const login = async (req, res) => {
const {email, password} = req.body;

try {
    const findUser = await pool.query("SELECT * FROM pern.users WHERE email = $1",[email])
    console.log(findUser.rows[0])
    if(findUser.rows.length === 0){
        return res.status(400).json({error: "User not found"})
    }
    const passwordMatch = await bcrypt.compare(password, findUser.rows[0].password)
    if (!passwordMatch) {
        return res.status(401).json({ error: 'Authentication failed' });
        }
        const { password: _,created_at: __, ...userWithoutPassword } = findUser.rows[0];
        
        const token = jwt.sign({userID:userWithoutPassword,type:'access'},process.env.JWT_SECRET,{expiresIn: "5m"})
        const refreshtoken = jwt.sign({userID:userWithoutPassword,type:'refresh'},process.env.JWT_SECRET,{expiresIn: "6m"})
    res.status(200).json({user:userWithoutPassword,token:token,refreshToken:refreshtoken})
    
} catch (error) {
    console.log(error);
    res.status(500).json({error: "Server Error"});
}
}

module.exports = { login };