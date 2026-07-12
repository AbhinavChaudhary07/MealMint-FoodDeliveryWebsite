import Item from "../models/item.model.js";
import Shop from "../models/shop.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

export const addItem = async (req, res) => {
  try {
    const { name, category, foodType, price } = req.body;
    let image;
    if (req.file) {
      image = await uploadOnCloudinary(req.file.path);
    }
    const shop = await Shop.findOne({ owner: req.userId }).populate("items")
    if (!shop) {
      return res.status(400).json({ message: "shop not found" });
    }
    const item = await Item.create({
      name,
      category,
      foodType,
      price,
      image,
      shop: shop._id,
    });

    shop.items.push(item._id)
    await shop.save()
    const populatedShop = await Shop.findById(shop._id).populate("items")  // 👈
    return res.status(201).json(populatedShop)
    
  } catch (error) {
    console.error("addItem error:", error)
    return res.status(500).json({ message: `add item error ${error}` });
  }
};

export const editItem = async (req, res) => {
  try {
    const itemId = req.params.itemId;
    const { name, category, foodType, price } = req.body;
    let image;
    if (req.file) {
      image = await uploadOnCloudinary(req.file.path);
    }
    const item = await Item.findByIdAndUpdate(
      itemId,
      {
        name,
        category,
        foodType,
        price,
        image,
      },
      { new: true },
    );
    if (!item) {
      return res.status(400).json({ message: "item not found" });
    }
    return res.status(200).json(item)
  } catch (error) {
    console.error("editItem error:", error)
    return res.status(500).json({ message: `edit item error ${error}` });
  }
}

export const deleteItem =async (req,res)=>{
  try {
    const itemId =req.params.itemId
    const item =await Item.findByIdAndDelete(itemId)
    if(!item){
      return res.status(400).json({message: "items not found"})
    }
    const shop =await Shop.findOne({owner:req.userId})
    shop.items = shop.items.filter(i => i.toString() !== item._id.toString())
    await shop.save()
    await shop.populate({
      path:"items",
      options:{sort:{updatedAt:-1}}
    })
    return res.status(200).json(shop)
  } catch (error) {
    return res.status(500).json({message: `delete item error ${error}`})
  }
}

export const getItemsByShop = async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.shopId)
    if (!shop) return res.status(404).json({ message: "Shop not found" })
    const items = await Item.find({ shop: req.params.shopId })
    return res.status(200).json({ shop, items })
  } catch (error) {
    return res.status(500).json({ message: `Get items by shop error ${error}` })
  }
}

export const getItemByCity = async(req,res) =>{
      try {
        const {city} =req.params
        if(!city){
          return res.status(400).json({message:"city is required"})
        }
         const shops =await Shop.find({
            city: { $regex: new RegExp(`^${city}$`, "i") }
        }).populate("items")
        if(!shops){
            return res.status(400).json({message:"shops not found"})
        }
        const shopIds =shops.map((shop)=>shop._id)
        const items =await Item.find({shop:{$in:shopIds}})
        return res.status(200).json(items)
      } catch (error) {
        return res.status(500).json({message: `Get item by city error ${error}`})
      }
}