import User from "../models/user.model.js"


export const getCurrentUser =async(req,res)=>{
try {
    const userId= req.userId
    if(!userId){
        return res.status(400).json({message:"userId not found"})
    }
    const user =await User.findById(userId)
    if(!user){
         return res.status(400).json({message:"User not found"})
    }
    return res.status(200).json(user)
} catch (error) {
    return res.status(500).json({message:`Get current user error${error}`})
    
}
}

export const updateLocation = async (req, res) => {
    try {
        const { lat, lon } = req.body

        if (lat == null || lon == null) {
            return res.status(400).json({ message: "Location is required" })
        }

        const user = await User.findByIdAndUpdate(
            req.userId,
            {
                location: {
                    type: "Point",
                    coordinates: [Number(lon), Number(lat)]
                },
                isOnline: true
            },
            { new: true }
        )

        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        return res.status(200).json(user)
    } catch (error) {
        return res.status(500).json({ message: `Update location error ${error}` })
    }
}

