"use client"

import { top10Musics, top10Artists, top10NewMusics } from "@/data/musicData";

const Hero = () => {

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
                    <h2 className="text-3xl font-bold text-center">Novos Álbuns!</h2>
                    <div className="flex flex-col gap-5">
                        {[...top10NewMusics].map((music) => (
                            <div key={music.id} className="grid grid-cols-3 items-center text-center gap-2">
                                <img src={music.image} alt={music.name} className="w-12 h-12 object-cover rounded-md ml-4"></img>
                                <p className="text-xl font-semibold">{music.name}</p>
                                <p className="text-xl font-semibold">{music.artist}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col gap-4 p-4 col-span-2">
                    <h2 className="text-3xl font-bold text-center">Músicas mais ouvidas hoje!</h2>
                    <div className="flex flex-col gap-5">
                        {[...top10Musics].sort((a, b) => b.qtdOuvida - a.qtdOuvida).map((music) => (
                            <div key={music.id} className="grid grid-cols-4 items-center text-center gap-2">
                                <img src={music.image} alt={music.name} className="w-12 h-12 object-cover rounded-md ml-10"></img>
                                <p className="text-xl font-semibold">{music.name}</p>
                                <p className="text-xl font-semibold">{music.artist}</p>
                                <p className="text-xl text-white/70 whitespace-nowrap">{music.qtdOuvida} vezes</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;