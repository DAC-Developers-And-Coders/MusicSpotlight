"use client"

import { useState, useEffect } from "react"

const Hero = ({ selectedTag }) => {
    const [tracks, setTracks] = useState([])
    const [albums, setAlbums] = useState([])
    const [artists, setArtists] = useState([])
    const [loading, setLoading] = useState(false)
    const [albumTitle, setAlbumTitle] = useState("Álbuns novos")

    useEffect(() => {
        if (selectedTag && selectedTag.trim() !== "") {
            setAlbumTitle("Álbuns mais ouvidos")
        } else {
            setAlbumTitle("Álbuns novos")
        }
    }, [selectedTag])

    useEffect(() => {
        async function fetchData() {
            setLoading(true)
            try {
                const cleanTag = selectedTag ? selectedTag.trim().toLowerCase() : ""
                
                const tracksUrl = cleanTag ? `http://localhost:8000/tracks/${cleanTag}` : `http://localhost:8000/tracks`
                const albumsUrl = cleanTag ? `http://localhost:8000/albums/${cleanTag}` : `http://localhost:8000/albums`
                const artistsUrl = cleanTag ? `http://localhost:8000/artists/${cleanTag}` : `http://localhost:8000/artists`

                const [resTracks, resAlbums, resArtists] = await Promise.all([
                    fetch(tracksUrl).catch(() => null),
                    fetch(albumsUrl).catch(() => null),
                    fetch(artistsUrl).catch(() => null)
                ])

                const dataTracks = resTracks?.ok ? await resTracks.json() : []
                const dataAlbums = resAlbums?.ok ? await resAlbums.json() : []
                const dataArtists = resArtists?.ok ? await resArtists.json() : []

                setTracks(Array.isArray(dataTracks) ? dataTracks : [])
                setAlbums(Array.isArray(dataAlbums) ? dataAlbums : [])
                setArtists(Array.isArray(dataArtists) ? dataArtists : [])

            } catch (error) {
                console.error("Erro ao buscar dados do FastAPI:", error)
                setTracks([])
                setAlbums([])
                setArtists([])
            } finally {
                setLoading(false)
            }
        }

        const timer = setTimeout(() => { fetchData() }, 300)
        return () => clearTimeout(timer)
    }, [selectedTag])

    return (
        <section className="mx-10 py-6 flex flex-col items-center gap-6">
            <h1 className="text-4xl font-extrabold text-center">
                {selectedTag ? `Resultados para: "${selectedTag}"` : "Descubra as músicas mais ouvidas!"}
            </h1>

            {loading ? (
                <p className="text-white/60 text-lg py-10">Buscando na API...</p>
            ) : (
                <div className="grid grid-cols-2 gap-8 w-full max-w-7xl items-start">
                    
                    <div className="flex flex-col gap-4 border border-white/10 p-4 rounded-2xl bg-white/5 col-span-2">
                        <h2 className="text-2xl font-bold text-center">{albumTitle}</h2>
                        {albums.length === 0 ? (
                            <p className="text-center text-sm text-white/50 py-4">Nenhum álbum encontrado.</p>
                        ) : (
                            <div className="grid grid-cols-5 gap-3">
                                {albums.map((album, index) => (
                                    <a 
                                        key={album.rank || index} 
                                        href={album.url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="flex flex-col items-center text-center group hover:opacity-80 transition-opacity"
                                    >
                                        <img 
                                            src={album.cover || "/assets/images/No-album-art.png"} 
                                            alt={album.name} 
                                            className="w-full aspect-square object-cover rounded-xl"
                                        />
                                        <p className="text-xs font-semibold mt-2 line-clamp-1 text-title group-hover:underline">{album.name}</p>
                                        <p className="text-[10px] text-white/60">{album.artist}</p>
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col gap-4 border border-white/10 p-4 rounded-2xl bg-white/5">
                        <h2 className="text-2xl font-bold text-center">Músicas mais ouvidas</h2>
                        {tracks.length === 0 ? (
                            <p className="text-center text-sm text-white/50 py-4">Nenhuma música encontrada.</p>
                        ) : (
                            <div className="flex flex-col gap-3">
                                {[...tracks]
                                    .sort((a, b) => a.rank - b.rank)
                                    .map((track) => (
                                        <div 
                                            key={track.rank} 
                                            className="grid grid-cols-[auto_1fr_1fr_auto] items-center text-center gap-2 p-1 rounded-lg"
                                        >
                                            <a href={track.url} target="_blank" rel="noopener noreferrer" className="hover:opacity-80">
                                                <img 
                                                    src={track.cover || "/assets/images/No-album-art.png"} 
                                                    alt={track.name} 
                                                    className="w-10 h-10 object-cover rounded-md justify-self-center"
                                                />
                                            </a>
                                            <a 
                                                href={track.url} 
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                className="text-sm font-semibold line-clamp-1 text-white hover:underline"
                                            >
                                                {track.name}
                                            </a>
                                            {track.artist_url ? (
                                                <a 
                                                    href={track.artist_url} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer" 
                                                    className="text-sm text-white/80 line-clamp-1 hover:underline"
                                                >
                                                    {track.artist}
                                                </a>
                                            ) : (
                                                <p className="text-sm text-white/80 line-clamp-1">{track.artist}</p>
                                            )}
                                            <p className="text-xs text-white/50 whitespace-nowrap">#{track.rank}</p>
                                        </div>
                                    ))}
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col gap-4 border border-white/10 p-4 rounded-2xl bg-white/5">
                        <h2 className="text-2xl font-bold text-center">Artistas em destaque</h2>
                        {artists.length === 0 ? (
                            <p className="text-center text-sm text-white/50 py-4">Nenhum artista encontrado.</p>
                        ) : (
                            <div className="flex flex-col gap-3">
                                {[...artists]
                                    .sort((a, b) => a.rank - b.rank)
                                    .map((artist) => (
                                        <a 
                                            key={artist.rank} 
                                            href={artist.url} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="grid grid-cols-[auto_1fr_auto] items-center text-center gap-3 group hover:bg-white/5 p-1 rounded-lg transition-colors"
                                        >
                                            <img 
                                                src={artist.image || "/assets/images/No-album-art.png"} 
                                                alt={artist.name} 
                                                className="w-10 h-10 object-cover rounded-md justify-self-center"
                                            />
                                            <p className="text-sm font-semibold text-left text-white group-hover:underline">{artist.name}</p>
                                            <p className="text-xs text-white/70 whitespace-nowrap">
                                                {artist.listeners ? `${artist.listeners.toLocaleString("pt-BR")} ouvintes` : `#${artist.rank}`}
                                            </p>
                                        </a>
                                    ))}
                            </div>
                        )}
                    </div>

                </div>
            )}
        </section>
    )
}

export default Hero