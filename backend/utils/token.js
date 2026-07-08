import jwt from "jsonwebtoken"
const genToken= async(userId) =>{
    try {
        const token =await jwt.sign({userId}, process.env.JWT_SECRET,{expiresIn:"7d"})
        return token
        
    } catch (error) {
        
    }
}

export default genToken