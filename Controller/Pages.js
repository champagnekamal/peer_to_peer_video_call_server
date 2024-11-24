const pool = require("../db");
// const db = require('../db')


const CreatePages =async (req,res) =>{
    const {userID,author,misc,description,dob,end,achievements,career} = req.body;
   // console.log(userID,author,misc,description,dob,end,achievements,career);
   if(!userID || !author || !description || !dob ||!career){
    if (!userID) {
        return res.status(400).json({ error: "user_id is required" });
    }
    if (!author) {
        return res.status(400).json({ error: "author is required" });
    }
    if (!description) {
        return res.status(400).json({ error: "description is required" });
    }
    if (!career) {
        return res.status(400).json({ error: "career is required" });
    }

}
    try {
     

        const user = await pool.query("SELECT * FROM pern.users WHERE id = $1",[userID])
        // console.log(user);

        if(!user?.rows[0]){
            return res.status(404).json({error:"user not found"})
        }

      const result = await pool.query("INSERT INTO pern.pages (user_id,author,description,dob,career,misc,end_date,achievements) VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *",[userID,author,description,dob,career,misc,end,achievements]) 
    
    res.status(200).json({message:"data saved",data:result.rows[0]})
    
    } catch (error) {

        console.log(error);
        res.status(500).json({error:"internal server error",message:error.message})    }
}


module.exports = {CreatePages}