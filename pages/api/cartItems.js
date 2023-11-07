import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler (req, res){
    const method = req.method;
    const client = await clientPromise;
    const db = client.db("Plantify");

    switch(method){
        case 'GET':{
            const cartItem = await db.collection("cartItems")
                .find({})
                .toArray()
                res.status(200).json(cartItem);
            } break;
        case "POST": {
            const {
                image,
                plantName,
                price,
                code,
                rating,
                reviews,
                itemSold,
                stocks,
                quantity
            } = req.body;

            const cartData = {
                image,
                plantName,
                price,
                code,
                rating,
                reviews,
                itemSold,
                stocks,
                quantity
            };

            const query = {code: code};
            const itemExists = await db.collection("cartItems").findOne(query); //if item exists in the cart

            if (itemExists) {
                console.log("Item exists: " + plantName); //just edit quantity of the existing item
                const newQuant = itemExists.quantity + quantity; //previous quantity + additional
                const updateData = { $set: { quantity: newQuant } };
                const addToCart = await db.collection("cartItems").updateOne(query, updateData);
                res.status(200).json({ "message": "Additional quantity added for " + plantName, addToCart });
            } else {
                const addToCart = await db.collection("cartItems").insertOne(cartData);
                res.status(200).json({ "message": "New Item added to cart.", addToCart });
            }
            break;
        }
        case 'DELETE':{
            const delItems = req.body.deleteItems; //get from req obj id
            let del =[]; //array of all deleted items
            if (!Array.isArray(delItems) || delItems.length === 0) {
                return res.status(200).json({ message: 'Empty checklist to delete' });
            }
            delItems.forEach(async (item)=>{
                const deleted = await db.collection("cartItems").deleteOne({"_id": new ObjectId (item)});
                del.push(deleted);
            })
            res.status(200).json({ message: "Item/s successfully deleted", del });
            break;
            }                         
    }
}