import { plantCollection } from "../../plants";
import Image from "next/image";
import Link from "next/link";

export default function Shop() {
  const cartdata = async () => {
    const res = await fetch("/api/cartItems");
    const data = await res.json();
    console.log(data);
  };

  return (
    <div className="p-9 w-full h-full items-center flex flex-row justify-center ">
      {/* Card for each item */}
      <div className="w-full grid grid-cols-2 gap-1 pr-22 md:grid-cols-5">
        {plantCollection.map((eachplant) => (
          <Link
            href={{
              pathname: `/shop/${eachplant.code}`,
              query: { data: JSON.stringify(eachplant) },
            }}
            className="p-2  w-18 m-1 md:w-40 flex flex-col items-center shadow-[0_3px_10px_rgb(0,0,0,0.2)]"
            eachplant={eachplant}
            key={eachplant.code}
          >
            <Image
              src={eachplant.image}
              width="auto"
              height="auto"
              alt={eachplant.plantName}
              className="w-14 h-18 w-40 h-44 md:w-40 md:h-44 "
            />

            <p className="text-sm md:text-base">{eachplant.plantName}</p>

            <p className="font-bold text-red-500 text-sm md:text-base">
              {" "}
              $: {eachplant.price}
            </p>
            <p className="text-sm md:text-base">Rating: {eachplant.rating}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
