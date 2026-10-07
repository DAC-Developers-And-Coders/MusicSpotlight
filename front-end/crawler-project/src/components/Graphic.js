"use client"

import { useState, useEffect } from "react"
import { PieChart, Pie, Tooltip, Legend, ResponsiveContainer } from "recharts"

const COLORS = [
  "#1DB954", "#8B5CF6", "#EC4899", "#D4AF37", "#3B82F6", 
  "#F97316", "#10B981", "#6366F1", "#EF4444", "#14B8A6"
]

const Graphic = () => {
    const [albuns, setAlbuns] = useState([])
    const [artists, setArtists] = useState([])
    const [tracks, setTracks] = useState([])
    const [lastCrawlerTime, setLastCrawlerTime] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        async function fetchGraphicData() {
            setLoading(true)
            try {
                const [resAlbuns, resArtists, resTracks] = await Promise.all([
                    fetch("http://localhost:8000/all/AL").catch(() => null),
                    fetch("http://localhost:8000/all/AR").catch(() => null),
                    fetch("http://localhost:8000/all/TR").catch(() => null)
                ])

                const dataAlbuns = resAlbuns?.ok ? await resAlbuns.json() : []
                const dataArtists = resArtists?.ok ? await resArtists.json() : []
                const dataTracks = resTracks?.ok ? await resTracks.json() : []

                const listAlbuns = Array.isArray(dataAlbuns) ? dataAlbuns : []
                const listArtists = Array.isArray(dataArtists) ? dataArtists : []
                const listTracks = Array.isArray(dataTracks) ? dataTracks : []

                const newestTime = listAlbuns[0]?.time || listArtists[0]?.time || listTracks[0]?.time || null
                if (newestTime) {
                    const parsedDate = new Date(newestTime)
                    const formattedDate = parsedDate.toLocaleDateString("pt-BR")
                    const formattedTime = parsedDate.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
                    setLastCrawlerTime(`${formattedDate} às ${formattedTime}`)
                } else {
                    setLastCrawlerTime(null)
                }

                const formattedAlbuns = listAlbuns.map((item, index) => ({
                    ...item,
                    fill: COLORS[index % COLORS.length]
                }))

                const formattedArtists = listArtists.map((item, index) => ({
                    ...item,
                    fill: COLORS[index % COLORS.length]
                }))

                setAlbuns(formattedAlbuns)
                setArtists(formattedArtists)
                setTracks(listTracks)
            } catch (error) {
                console.error("Erro ao buscar dados do endpoint /all no FastAPI:", error)
                setAlbuns([])
                setArtists([])
                setTracks([])
            } finally {
                setLoading(false)
            }
        }

        fetchGraphicData()
    }, [])

    const chartAlbuns = [...albuns]
        .sort((a, b) => (b.listeners || 0) - (a.listeners || 0))
        .slice(0, 10)

    const chartArtists = [...artists]
        .sort((a, b) => (b.listeners || 0) - (a.listeners || 0))
        .slice(0, 10)

    const totalOuvintesAlbuns = albuns.reduce((acc, curr) => acc + (curr.listeners || 0), 0)
    const totalOuvintesArtistas = artists.reduce((acc, curr) => acc + (curr.listeners || 0), 0)
    const totalOuvintesTracks = tracks.reduce((acc, curr) => acc + (curr.listeners || 0), 0)

    const renderClickableLegend = (value, entry) => {
        const itemUrl = entry?.payload?.url
        if (itemUrl) {
            return (
                <a 
                    href={itemUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-white hover:underline hover:text-white/80 transition-colors"
                >
                    {value}
                </a>
            )
        }
        return <span className="text-white">{value}</span>
    }

    return (
        <section className="min-h-screen p-6 flex flex-col items-center">
            <h1 className="text-4xl text-center font-extrabold pb-8">
                Gráficos Geral
            </h1>
            
            {loading ? (
                <p className="text-white/60 text-lg py-10">Carregando gráficos...</p>
            ) : (
                <div className="grid grid-cols-2 gap-10 w-full max-w-6xl">
                    <div className="flex flex-col items-center bg-header border-2 p-4 rounded-2xl gap-4">
                        <h3 className="text-3xl font-bold">Top 10 Álbuns</h3>
                        <div className="w-full h-80 mb-6">
                            {chartAlbuns.length === 0 ? (
                                <div className="h-full flex items-center justify-center text-white/50">Nenhum álbum encontrado</div>
                            ) : (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie 
                                            data={chartAlbuns} 
                                            cx="50%" 
                                            cy="50%" 
                                            innerRadius={60} 
                                            outerRadius={90}
                                            paddingAngle={5} 
                                            dataKey="listeners" 
                                            nameKey="name"
                                        />
                                        <Tooltip 
                                            contentStyle={{ backgroundColor: "#181818", borderColor: "#333", borderRadius: "8px" }} 
                                            itemStyle={{ color: "#fff" }}
                                        />
                                        <Legend formatter={renderClickableLegend} />
                                    </PieChart>
                                </ResponsiveContainer>
                            )}
                        </div>

                        <h3 className="text-3xl font-bold">Top 10 Artistas</h3>
                        <div className="w-full h-80">
                            {chartArtists.length === 0 ? (
                                <div className="h-full flex items-center justify-center text-white/50">Nenhum artista encontrado</div>
                            ) : (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie 
                                            data={chartArtists} 
                                            cx="50%" 
                                            cy="50%" 
                                            innerRadius={60} 
                                            outerRadius={90} 
                                            paddingAngle={5} 
                                            dataKey="listeners"
                                            nameKey="name"
                                        />
                                        <Tooltip 
                                            contentStyle={{ backgroundColor: "#181818", borderColor: "#333", borderRadius: "8px" }} 
                                            itemStyle={{ color: "#fff"}}
                                        />
                                        <Legend formatter={renderClickableLegend} />
                                    </PieChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col items-center bg-header border-2 p-4 rounded-2xl gap-8 justify-center">
                        <h3 className="text-3xl font-bold">Informações</h3>
                        
                        <div className="flex flex-col gap-1 text-center">
                            <h3 className="text-xl text-white/80">Quantidade de músicas encontradas</h3>
                            <p className="text-3xl font-extrabold text-pink-400">{tracks.length}</p>
                        </div>

                        <div className="flex flex-col gap-1 text-center">
                            <h3 className="text-xl text-white/80">Quantidade de álbuns encontrados</h3>
                            <p className="text-3xl font-extrabold text-green-400">{albuns.length}</p>
                        </div>
                        
                        <div className="flex flex-col gap-1 text-center">
                            <h3 className="text-xl text-white/80">Quantidade de artistas encontrados</h3>
                            <p className="text-3xl font-extrabold text-purple-400">{artists.length}</p>
                        </div>
                        
                        <div className="flex flex-col gap-1 text-center">
                            <h3 className="text-xl text-white/80">Total de ouvintes (Álbuns)</h3>
                            <p className="text-3xl font-extrabold text-yellow-400">
                                {totalOuvintesAlbuns.toLocaleString("pt-BR")}
                            </p>
                        </div>

                        <div className="flex flex-col gap-1 text-center">
                            <h3 className="text-xl text-white/80">Total de ouvintes (Artistas)</h3>
                            <p className="text-3xl font-extrabold text-blue-400">
                                {totalOuvintesArtistas.toLocaleString("pt-BR")}
                            </p>
                        </div>

                        <div className="flex flex-col gap-1 text-center">
                            <h3 className="text-xl text-white/80">Última execução do crawler</h3>
                            <p className="text-lg font-semibold text-emerald-400">
                                {lastCrawlerTime || "Sem registros"}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </section>
    )
}

export default Graphic