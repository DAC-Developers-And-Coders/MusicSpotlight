"use client"

import Graphic from "@/components/Graphic";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import { useState } from "react";

export default function Home() {
  const[selectedTag, setSelectedTag] = useState("");
  return (
    <>
      <Header selectedTag={selectedTag} setSelectedTag={setSelectedTag}/>
      <main>
        <Hero selectedTag={selectedTag}/>
        <Graphic selectedTag={selectedTag}/>
      </main>
    </>
  );
}
