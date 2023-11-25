import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
function SearchResults() {
  const router = useRouter();
  const { plantdata } = router.query;
  const filteredPlants = JSON.parse(plantdata);
  return (
    <div className="p-9 w-full h-full items-center flex flex-col md:flex-row justify-center ">
      {filteredPlants && filteredPlants.length > 0 ? (
        filteredPlants.map((plant, index) => (
          <div key={index} className="flex flex-col md:flex-row">
            <Link
              href={{
                pathname: `/shop/${plant.code}`,
                query: { data: JSON.stringify(plant) },
              }}
              className="p-2  w-18 m-1 md:w-40 flex flex-col items-center shadow-[0_3px_10px_rgb(0,0,0,0.2)]"
              plant={plant}
              key={plant.code}
            >
              <Image
                src={filteredPlants ? plant.image : "../public/blankPlant.png"}
                width="auto"
                height="auto"
                alt={plant.plantName}
                className="w-14 h-18 w-40 h-44 md:w-40 md:h-44 "
              />

              <p className="text-sm md:text-base">{plant.plantName}</p>

              <p className="font-bold text-red-500 text-sm md:text-base">
                {" "}
                $: {plant.price}
              </p>
              <p className="text-sm md:text-base">Rating: {plant.rating}</p>
            </Link>
          </div>
        ))
      ) : (
        <p>No plants available</p>
      )}
    </div>
  );
}

export default SearchResults;
