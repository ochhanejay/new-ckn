const jwt = require('jsonwebtoken');
const UserModel = require("../models/userModel");


const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;

    const foundUserModel = await UserModel.findOne({ refreshToken }).exec();
    if (!foundUserModel) return res.sendStatus(403); //Forbidden 
    // evaluate jwt 
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err || foundUserModel.email !== decoded.email) return res.sendStatus(403);
            const accessToken = jwt.sign(
                {
                    "UserModelInfo": {
                        "email": decoded.email,
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '10s' }
            );
            res.json({  accessToken })
        }
    );
}

module.exports = { handleRefreshToken }