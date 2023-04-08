
import React from "react";
import styles from "../styles/Hero.module.css"
import Categorize from "./Categorize";
import Image from "next/image";

const Hero = () => {
  return (
    <>
        <div className={` ${styles.container} flex flex-col-reverse md:flex-row`}>
            <div className={styles.left} >
                <h1 className="text-white text-center text-6xl md:text-left m-1" >Live in the <br></br> Ara</h1>
                <p className="text-xl text-center text-gray-700 md:text-left ml-4 m-2">Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
                <button className="m-1 ml-4 md:mr-auto bg-white py-2 px-5 font-bold">Shop Now</button>
            </div>
            <div className={styles.right}>
                <img className={styles.heroImg}  src="/img/table.jpg" alt="epoxy table" />
            </div>
        </div>

        <Categorize />


        <div className="bg-yellow-50 h-52 w-auto flex items-center justify-center text-center">
          <h1 className="text-3xl">Art is a line around your thought and <br /> creation around your space</h1>
        </div>
    </>
  );
};

export default Hero;
