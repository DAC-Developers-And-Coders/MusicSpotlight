"use client"

import { useState, useEffect } from "react"

const Hero = ({ selectedTag }) => {
  const [musics, setMusics] = useState([])
  const [albuns, setAlbuns] = useState([])
  const [artists, setArtists] = useState([])
  const [loading, setLoading] = useState(false)

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
        return () => clearTimeout(timer);
  }, [selectedTag])

  return (
    <section className="mx-10 py-6 flex flex-col items-center gap-6">
      <h1 className="text-4xl font-extrabold text-center">{selectedTag ? `Resultados para: "${selectedTag}"` : "Descubra as músicas mais ouvidas!"}</h1>
      {loading ? (<p className="text-white/60 text-lg py-10">Buscando...</p>) : (
        <div className="grid grid-cols-3 gap-8 w-full max-w-7xl items-start">
          <div className="flex flex-col gap-4 border border-white/10 p-4 rounded-2xl bg-white/5">
            <h2 className="text-2xl font-bold text-center">Álbuns</h2>
            {albuns.length === 0 ? (
              <p className="text-center text-sm text-white/50">Nenhum álbum encontrado.</p>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {albuns.map((album) => (
                  <div key={album.id} className="flex flex-col items-center">
                    <img src={album.image} alt={album.name} className="w-full aspect-square object-cover rounded-xl" />
                    <p className="text-xs font-semibold mt-1">{album.name}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4 border border-white/10 p-4 rounded-2xl bg-white/5">
            <h2 className="text-2xl font-bold text-center">Músicas mais ouvidas</h2>
            {musics.length === 0 ? (
              <p className="text-center text-sm text-white/50">Nenhuma música encontrada.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {[...musics]
                  .sort((a, b) => b.qtdOuvida - a.qtdOuvida)
                  .map((music) => (
                    <div key={music.id} className="grid grid-cols-[auto_1fr_1fr_auto] items-center text-center gap-2">
                      <img src={music.image} alt={music.name} className="w-10 h-10 object-cover rounded-md justify-self-center"/>
                      <p className="text-sm font-semibold">{music.name}</p>
                      <p className="text-sm font-semibold">{music.artist}</p>
                      <p className="text-xs text-white/70 whitespace-nowrap">{music.qtdOuvida} vezes</p>
                    </div>
                  ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4 border border-white/10 p-4 rounded-2xl bg-white/5">
            <h2 className="text-2xl font-bold text-center">Artistas em destaque</h2>
            {artists.length === 0 ? (
              <p className="text-center text-sm text-white/50">Nenhum artista encontrado.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {[...artists]
                  .sort((a, b) => b.qtdOuvida - a.qtdOuvida)
                  .map((artist) => (
                    <div key={artist.id} className="grid grid-cols-3 items-center text-center gap-2">
                      <img src={artist.image} alt={artist.artist} className="w-10 h-10 object-cover rounded-md justify-self-center"/>
                      <p className="text-sm font-semibold">{artist.artist}</p>
                      <p className="text-xs text-white/70 whitespace-nowrap">{artist.qtdOuvida} ouvintes</p>
                    </div>
                  ))}
              </div>
            )}
          </div>

        </div>
      )}
    </section>
  )
}

export default Hero;