import React from 'react'
import { useRouter } from 'next/router'
import {useState, useEffect} from "react"
import Image from "next/image"

function Details() {
  const router = useRouter();
  const router_data = router.query.data;
  let jsonData;
  //check is router query is not null
  if(router_data){
    jsonData = JSON.parse(router_data);
  }
  //check if jsonData is not null
  let jsonDataQuantity;
  if(jsonData){
    jsonDataQuantity = jsonData.quantity;
  }
  const [quantity, setquantity] = useState(jsonDataQuantity); //for quantity
  useEffect(() => {
    jsonData.quantity = quantity;
    console.log("Json Data quant: " + jsonData.quantity )
  }, [quantity, jsonData])
  
  const subtract = ()=>{
    if(quantity<=1){
      setquantity(1);
    }
    else{
      setquantity(quantity-1);
    }
    jsonData.quantity=quantity;
  }
  const add = ()=>{
      setquantity(quantity+1);
      jsonData.quantity=quantity;
  }
    const getCartData = async ()=>{
      try{
        const res = await fetch ("/api/cartItems");
        const data= await res.json();
        console.log("Updated Cart: " + data) ;
      }
      catch (e){
         console.log(e.message);
      }                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
    }
    const addToCart = async ()=>{
    
      console.log("New json data: " + jsonData.plantName + " " + jsonData.quantity + " " + jsonData.code);
      try{
        const res = await fetch ("/api/cartItems", {
          method: 'POST',
          headers: {'Content-Type': "application/json"},
          body: JSON.stringify(jsonData)
        });
        const data = await res.json();
        window.alert(data.message);
        getCartData();
      }
      catch (e){
        console.log(e.message);
      }
    }

  return (
    <div className='flex flex-row pt-10 pb-10 items-center w-full justify-center'>
     <section className='p-5 w-full md:w-1/2 flex items-center justify-between md:justify-around'>
      <Image
      src={jsonData ? jsonData.image : "../public/blankPlant.png"}
      width="auto"
      height="auto"
      alt="plant-image"
      className='w-44 '
      />
       
      <section className=' w-44  md:w-52 flex flex-col items-center'>
        <h1 className='font-semibold text-base p-2'>{jsonData?jsonData.plantName:"Error Collecting Data"}</h1>
          <p className='flex flex-row justify-around p-2 md:w-44'><img src="/star.png" alt="star" className='w-5 h-5'/> {jsonData?jsonData.rating: "_"} |<img src="/user.png" alt="image" className='w-5 h-5'/> {jsonData?jsonData.reviews:"_"} |   <img src="/ready-stock.png" className='w-5 h-5' alt="image"/>{jsonData?jsonData.itemSold:"_"}</p>
        <p className='text-red-500  font-bold text-base'>Price: ${jsonData?jsonData.price:"_"}</p>
       
        <section className='flex flex-row justify-between w-28'>
                <p className=' text-slate-50 w-7 h-7 text-center items-center bg-red-700 hover:bg-red-400' onClick={subtract}>-</p>
                <p>{quantity}</p>
                <p className=' text-slate-50 w-7 h-7 text-center items-center bg-red-700 hover:bg-red-400' onClick={add}>+</p>
            </section>
        <button onClick={addToCart} className='w-32 md:w-40 p-3 bg-red-500 text-slate-50 text-center hover:bg-emerald-500 mt-5'>Add to cart</button>
  </section>
  </section>
    </div>
  )
}

export default Details