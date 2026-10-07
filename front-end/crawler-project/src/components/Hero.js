"use client"

import { top10Musics, top10Artists, top10NewAlbuns } from "@/data/musicData";
import { useState, useEffect } from "react";

const Hero = ({ selectedTag }) => {
    const [musics, setMusics] = useState([]);
    const [albuns, setAlbuns] = useState([]);
    const [artists, setArtists] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const queryParam = selectedTag ? `?tag=${encodeURIComponent(selectedTag)}` : "";
        const [resMusics, resAlbuns, resArtists] = await Promise.all([
          fetch(`http://localhost:8000/api/musics${queryParam}`),
          fetch(`http://localhost:8000/api/albuns${queryParam}`),
          fetch(`http://localhost:8000/api/artists${queryParam}`),
        ])
        const dataMusics = await resMusics.json()
        const dataAlbuns = await resAlbuns.json()
        const dataArtists = await resArtists.json()
        setMusics(dataMusics)
        setAlbuns(dataAlbuns)
        setArtists(dataArtists)
      } catch (error) {
        console.error("Error retrieving data from FastApi:", error)
      } finally {
        setLoading(false)
      }
    }

    const timer = setTimeout(() => {fetchData()}, 300)
        return () => clearTimeout(timer)
    }, [selectedTag])

    return (
        <section className="mx-10 py-4 flex flex-col items-center gap-2">
            <h1 className="text-4xl font-extrabold text-center">Descubra as músicas mais ouvidas!</h1>

            <div className="grid grid-cols-2 gap-25 w-full max-w-7xl items-start">
                <div className="flex flex-col gap-4 p-4">
                    <h2 className="text-3xl font-bold text-center ml-15">Artistas mais ouvidos hoje!</h2>
                    <div className="flex flex-col gap-5">
                        {[...top10Artists].sort((a, b) => b.qtdOuvida - a.qtdOuvida).map((music) => (
                            <div key={music.id} className="grid grid-cols-3 items-center text-center gap-2">
                                <img src={music.image} alt={music.name} className="w-12 h-12 object-cover rounded-md ml-4"></img>
                                <p className="text-xl font-semibold">{music.artist}</p>
                                <p className="text-xl text-white/70 whitespace-nowrap">{music.qtdOuvida} vezes</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col gap-4 p-4">
                    <h2 className="text-3xl font-bold text-center">Músicas mais ouvidas hoje!</h2>
                    <div className="flex flex-col gap-5">
                        {[...top10Musics].sort((a, b) => b.qtdOuvida - a.qtdOuvida).map((music) => (
                            <div key={music.id} className="grid grid-cols-3 items-center text-center gap-2">
                                <img src={music.image} alt={music.name} className="w-12 h-12 object-cover rounded-md ml-10"></img>
                                <p className="text-xl font-semibold">{music.name}</p>
                                <p className="text-xl font-semibold">{music.artist}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col gap-4 p-4 col-span-2">
                    <h2 className="text-3xl font-bold text-center">Novos Álbuns!</h2>
                    <div className="flex flex-col gap-5">
                        {[...top10NewAlbuns].map((music) => (
                            <div key={music.id} className="grid grid-cols-3 items-center text-center gap-2">
                                <img src={music.image} alt={music.name} className="w-12 h-12 object-cover rounded-md ml-4"></img>
                                <p className="text-xl font-semibold">{music.name}</p>
                                <p className="text-xl font-semibold">{music.artist}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Hero