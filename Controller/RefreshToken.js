const jwt = require("jsonwebtoken");
const pool = require("../db");

const RefreshToken = async(req,res)=>{
const {refreshtoken,userID,email} = req.body

if(!refreshtoken || !email){
    return res.status(403).json({error:"refresh token is required"})
}
const findUser = await pool.query("SELECT * FROM pern.users WHERE email = $1",[email])

jwt.verify(refreshtoken,process.env.JWT_SECRET,(err,decoded)=>{
    if (err) {
        return res.status(403).json({ error: "Invalid or expired refresh token",err:err });
      }
  
      // Check that the token is indeed a refresh token (if using type claim) 
      if (decoded.type !== 'refresh') {
        return res.status(403).json({ error: "Invalid token type" });
      }
      const { password: _,created_at: __, ...userWithoutPassword } = findUser.rows[0];
      const accessToken = jwt.sign({userID:userWithoutPassword,type:'access'},process.env.JWT_SECRET,{expiresIn: "5m"})
      const refreshtoken = jwt.sign({userID:userWithoutPassword,type:'refresh'},process.env.JWT_SECRET,{expiresIn: "6m"})
res.status(200).json({"accessToken":accessToken,"refreshToken":refreshtoken})
    })

}

module.exports = {RefreshToken} 