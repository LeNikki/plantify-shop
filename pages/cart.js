import React, { useState, useEffect, useReducer } from 'react';
import Image from "next/image"
import clientPromise from "@/lib/mongodb";
import axios from 'axios';
export let totalNum = 0;
export default function Cart({ cartData }) {
   //const [ plantData, setPlantData] = useState(cartData); //plantdata is one plant object, it will be updated if it's deleted in cart
   const cartTotal = []; //total for all items in the cart
   const [checkedItems, setCheckedItems] = useState([]); //selected items in cart
   const [totalPrice, setTotalPrice] = useState(1); //total price for individual items
   const [Edit, setEdit] = useState(false); //if checkbox are shown or not
  
  //reducer method:
  const addSubtract = (plants, action) => {
   switch (action.type) {
     case "Add":
       return plants.map((plant, index) =>
         index === action.index
           ? { ...plant, quantity: plant.quantity + 1 } 
           : plant
       );
     case "Subtract":
       return plants.map((plant, index) =>
         index === action.index
           ? { ...plant, quantity: Math.max(1, plant.quantity - 1) }
           : plant
       );
     default:
       return plants;
   }  
 };
  const [plantData, dispatch] = useReducer(addSubtract, cartData);
 
  const addPlant = (index)=>{
   dispatch({
     type:"Add",
     index:index
   })
  }
  const subPlant = (index)=>{
   dispatch({
     type:"Subtract",
     index:index
   })
  }

  useEffect(() => {
   totalNum= plantData.length
   console.log("Len "+ totalNum)
  }, [plantData])
  
//total for all items in the cart
  useEffect(() => {
    const sum = cartTotal.reduce((accumulator, item) => accumulator + item, 0);
    setTotalPrice(sum);
  }, [cartTotal]);

  const total = (quantA, quantB) => {
    return quantA * quantB;
  };
//show checkbox
  const edit = ()=>{
    setEdit(!Edit);
    console.log("Edit"  + Edit);
  }
//checking and unchecking checkbox
 const handleChange = (itemID,e)=>{
    console.log(e.target.checked) 
    if(e.target.checked){
      setCheckedItems([...checkedItems, itemID]);  
    }
    else {
      //return a new array that does not include the passed itemID
      //in simple words, removing itemID in the new checkedItems array
      setCheckedItems(checkedItems.filter((existing)=>existing!==itemID));
    }
  }
  //delete data in the cartItems database 
  function deleteData() {
    if (checkedItems.length == 0){
      window.alert("No data to delete. Select items to delete");
    }
    else{
      let confirm = window.confirm("Are you sure you want to delete these items?");
      if(confirm){
          axios
        .delete("/api/cartItems", { data: { deleteItems: checkedItems } })
        .then((res) => console.log(res))
        .catch((e) => console.log(e));
        window.alert("Item/s deleted successfully")
        }
      }
      axios.get("/api/cartItems")
      .then((res)=>dispatch({
        type:"Refetch",
        newData: res.data
      }));
    
  }
  //checkout items
  function checkoutFunc(){
    let confirm = window.confirm("Confirm to checkout these item/s?");
    if(confirm){
      //check if only chosen items are to be checked out
      if (Edit){
        if(checkedItems.length == 0){
          window.alert("Please reselect items to checkout.");
        }
        else{
          window.alert("Checking out " + checkedItems.length + " items")
        }
      }
      else{
        window.alert("Checkout all items in cart.")
      }
    }
  }
 
  return (
    <div className="w-full h-full p-5">
      <p className='font-bold text-red-700 float-right hover:text-red-500' onClick={edit}>Edit</p>
      {plantData.map((item, index) => (
        <section key={item.code} className='m-2  w-full items-center h-auto p-5 rounded-lg flex md:flex-row justify-around'>
          <Image
            src={item.image}
            height='auto'
            alt="plant-image"
            className='w-12 md:w-28'
          />
          <p className='font-semibold w-14 m-2 text-sm md:w-40 md:text-base'>{item.plantName}</p>
          <section className=' flex flex-col items-center md:flex-row md:w-22 md:h-18 md:justify-center'>
          <p className='font-semibold m-2 items-center text-sm  md:text-base'>P {item.price}</p>
          <section className='flex flex-row justify-between w-28 items-center'>
            <p
              className='m-2 text-slate-50 w-7 h-7 text-center text-sm bg-red-700 hover:bg-red-400 md:text-base'
              onClick={() => subPlant(index, item.quantity, item.price)} // Pass a function reference
            >
              -
            </p>
            <p className='p-2 w-10 h-10 text-center'>{item.quantity}</p>
            <p
              className='m-2 text-slate-50 w-7 h-7 text-center text-sm bg-red-700 hover:bg-red-400 md:text-base'
              onClick={() => addPlant(index, item.quantity, item.price)} // Pass a function reference
            >
              +
            </p>
           <p className='hidden'> {cartTotal.push(total(item.quantity, item.price))} </p> 
          </section>
          <p className='text-sm p-2 font-bold text-red-700 md:text-base'>P{total(item.quantity, item.price)}</p>
          </section>
        
          <input type="checkbox"  onClick={(e)=>handleChange(item._id, e)}className={Edit ? 'inline-block' : 'hidden'}/>
       
        </section>
      ))}
      
      <section className='w-full h-32 p-5 flex flex-row justify-between items-center'>
      <p className='font-bold'>Order Total: {totalPrice}</p>
      <section className='flex flex-row m-2 justify-evenly w-3/4 md:w-1/2 '>
     {Edit ? <p className= {`p-2 bg-red-700 text-slate-100 w-30 rounded-md  items-center hover:bg-red-500`} onClick={deleteData}> Delete items? </p> : <p></p>}
     <p className={`p-2 bg-green-700 text-slate-100 w-30 rounded-md  items-center hover:bg-green-500`} onClick={ checkoutFunc}>{ 'Checkout Now'}</p>
      
      </section>
    
      </section>
    </div>
  );
}

export async function getServerSideProps() {
  const client = await clientPromise;
  const db = client.db("Plantify");
  const cartItem = await db.collection("cartItems")
    .find({})
    .toArray();
  const cartData = JSON.parse(JSON.stringify(cartItem));

  return {
    props: {
      cartData: cartData
    }
  };
}
