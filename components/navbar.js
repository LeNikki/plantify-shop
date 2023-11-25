import React, { useState, useEffect } from "react";
import { Inter, Tinos } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import search from "../public/search.png";
import menu from "../public/menu.png";
import plantifyLogo from "../public/plantifyLogo.png";
import xsolid from "../public/xsolid.svg";
import usersolid from "../public/usersolid.svg";
import { useRouter } from "next/router";
import { plantCollection } from "../plants";

const inter = Inter({ subsets: ["latin"] });
const tinos = Tinos({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export default function Navbar() {
  const [burger, setBurger] = useState(true);
  const [searchIn, setSearchIn] = useState("");
  const [filteredPlants, setFilteredPlants] = useState([]);
  const [searchClicked, setSearchClicked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const search = searchIn.trim().toLowerCase();
    const result = plantCollection.filter(
      (plant) =>
        plant &&
        plant.plantName &&
        plant.plantName.toLowerCase().includes(search)
    );
    setFilteredPlants(result);
  }, [searchIn]);

  const clearSearch = () => {
    setSearchIn("");
    setFilteredPlants([]);
    setSearchClicked(false);
  };

  const handleInputChange = (e) => {
    setSearchIn(e.target.value);
    setSearchClicked(!!e.target.value);
  };

  const pages = [
    {
      title: "Home",
      link: "/",
    },
    {
      title: "Shop",
      link: "/shop/shop",
    },
    {
      title: `Cart`,
      link: "/cart",
    },
  ];
  const searching = () => {
    console.log(filteredPlants);
    router.push({
      pathname: "/searchResults",
      query: { plantdata: JSON.stringify(filteredPlants) },
    });
  };
  const gotoPlant = (plant) => {
    router.push({
      pathname: `/shop/${plant.code}`,
      query: { data: JSON.stringify(plant) },
    });
  };

  return (
    <main className="w-full mt-3 md:mt-10 p-3 md:p-5 flex flex-col h-30 md:h-20 md:flex-row justify-center">
      <nav className="w-full p-2 flex flex-col md:flex-row md:w-70 md:justify-around md:items-center">
        <section className="flex flex-row w-full items-center">
          <Image
            src={burger ? menu : xsolid}
            width="auto"
            height="auto"
            className="inline-block md:hidden w-5 h-5 mr-2 "
            onClick={() => setBurger(!burger)}
            alt="burgerNav"
            priority={true}
          />
          <section className="flex flex-row items-center">
            <Image
              src={plantifyLogo}
              alt="logo"
              width="auto"
              height="auto"
              className="w-8"
            />
            <h1
              className={`${tinos.className} md:w-1/2 text-center text-5xl tracking-widest`}
            >
              Plantify
            </h1>
          </section>
        </section>

        <ul
          className={`${
            burger ? "hidden" : "flex"
          } flex flex-col w-full md:flex-row md:justify-around md:items-center md:w-3/4 md:flex`}
        >
          {pages.map((page) => (
            <Link
              key={page.title}
              href={page.link}
              className="p-3 items-center bg-neutral-50 text-center rounded-md hover:font-bold md:bg-transparent"
            >
              {page.title}
            </Link>
          ))}
        </ul>
      </nav>
      <section className="flex flex-row w-full items-center md:w-3/4">
        <section className="relative w-3/4 md:w-44">
          <input
            type="text"
            name="plant-name"
            value={searchIn}
            onChange={handleInputChange}
            className="w-full  shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-emerald-500 focus:shadow-outline"
          />
          {searchIn && (
            <button
              onClick={clearSearch}
              className="absolute inset-y-0 right-0 px-3 py-2 text-gray-600"
            >
              &#x2715;
            </button>
          )}
        </section>
        {searchClicked && filteredPlants.length > 0 && (
          <div className="absolute mt-12 md:mt-7 top-20 bg-green-200 w-3/4 md:w-44 p-2 rounded shadow">
            {filteredPlants.map((plant, index) => (
              <p
                key={index}
                className="hover:font-bold"
                onClick={() => gotoPlant(plant)}
              >
                {plant.plantName}
              </p>
            ))}
          </div>
        )}
        <Image
          src={search}
          className="w-10 md:w-12 ml-0 md:ml-10 rounded-full p-3 hover:bg-emerald-300"
          alt="search"
          onClick={searching}
        />
        <Image
          src={usersolid}
          className="w-9 md:w-12 ml-0 md:ml-10 rounded-full p-3 hover:bg-emerald-300"
          alt="profile"
        />
      </section>
    </main>
  );
}
