const { connectedUser } = require("../index.js");

const pool = require("../db");

const Allusers = async(req,res)=>{

    try {
        const findUser = await pool.query("SELECT id, username, email FROM pern.users");

        res.status(200).json({users:findUser.rows,liveUser:connectedUser})
    } catch (error) {
        console.log(error);
    }
}

module.exports = {Allusers};