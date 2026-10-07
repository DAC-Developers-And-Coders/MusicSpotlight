"use client"

import Graphic from "@/components/Graphic";
import Header from "@/components/Header";
import Hero from "@/components/Hero";

export default function Home() {
  return (
    <>
      <Header/>
      <main>
        <Hero/>
        <Graphic/>
      </main>
    </>
  );
}
