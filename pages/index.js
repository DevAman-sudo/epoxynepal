import Head from "next/head";
import Hero from "../components/Hero";
import Products from "../components/Products";
import ShopByArt from "../components/ShopByArt";
import Details from "../components/Details";
import SelectProduct from "../components/SelectProduct";
import ShowOff from "../components/ShowOff";

export default function Home() {
  return (
    <div>
      <Head>
        <title>Epoxy Nepal</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Hero />
      {/* <Details /> */}
      <Products />
      <ShopByArt />
      <SelectProduct />
      <ShowOff />
    </div>
  );
}
