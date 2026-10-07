"use client"

import { useState, useEffect } from "react";
import { PieChart, Pie, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = [
  "#1DB954", "#8B5CF6", "#EC4899", "#D4AF37", "#3B82F6", 
  "#F97316", "#10B981", "#6366F1", "#EF4444", "#14B8A6"
];

const Graphic = ({ selectedTag }) => {
    const [musics, setMusics] = useState([]);
    const [artists, setArtists] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function fetchGraphicData() {
            setLoading(true);
            try {
                const queryParam = selectedTag ? `?tag=${encodeURIComponent(selectedTag)}` : "";

                const [resMusics, resArtists] = await Promise.all([
                    fetch(`http://localhost:8000/api/musics${queryParam}`),
                    fetch(`http://localhost:8000/api/artists${queryParam}`)
                ]);

                const dataMusics = await resMusics.json();
                const dataArtists = await resArtists.json();

                const formattedMusics = dataMusics.map((item, index) => ({
                    ...item,
                    fill: COLORS[index % COLORS.length]
                }));

                const formattedArtists = dataArtists.map((item, index) => ({
                    ...item,
                    fill: COLORS[index % COLORS.length]
                }))

                setMusics(formattedMusics)
                setArtists(formattedArtists)
            } catch (error) {
                console.error("Erro ao buscar dados dos gráficos no FastAPI:", error)
            } finally {
                setLoading(false)
            }
        }

        const timer = setTimeout(() => {fetchGraphicData()}, 300)
            return () => clearTimeout(timer)}, [selectedTag])

    const totalOuvintes = musics.reduce((acc, curr) => acc + (curr.qtdOuvida || 0), 0)

    return (
        <section className="min-h-screen p-6 flex flex-col items-center">
            <h1 className="text-4xl text-center font-extrabold pb-8">
                {selectedTag ? `Gráficos: "${selectedTag}"` : "Gráficos Geral"}
            </h1>
            
            {loading ? (
                <p className="text-white/60 text-lg py-10">Atualizando gráficos...</p>
            ) : (
                <div className="grid grid-cols-2 gap-10 w-full max-w-6xl">
                    <div className="flex flex-col items-center bg-header border-2 p-4 rounded-2xl gap-4">
                        <h3 className="text-3xl font-bold">Músicas mais ouvidas</h3>
                        <div className="w-full h-80 mb-6">
                            {musics.length === 0 ? (
                                <div className="h-full flex items-center justify-center text-white/50">Nenhuma música encontrada</div>
                            ) : (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={musics} cx="50%" cy="50%" innerRadius={60} outerRadius={90}paddingAngle={5} dataKey="qtdOuvida" nameKey="name"/>
                                        <Tooltip contentStyle={{ backgroundColor: "#181818", borderColor: "#333", borderRadius: "8px" }} itemStyle={{ color: "#fff" }}/>
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            )}
                        </div>

                        <h3 className="text-3xl font-bold">Artistas mais ouvidos</h3>
                        <div className="w-full h-80">
                            {artists.length === 0 ? (
                                <div className="h-full flex items-center justify-center text-white/50">Nenhum artista encontrado</div>
                            ) : (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={artists} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="qtdOuvida"nameKey="artist"/>
                                        <Tooltip contentStyle={{ backgroundColor: "#181818", borderColor: "#333", borderRadius: "8px" }} itemStyle={{ color: "#fff"}}/>
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col items-center bg-header border-2 p-4 rounded-2xl gap-12 justify-center">
                        <h3 className="text-3xl font-bold">Informações</h3>
                        
                        <div className="flex flex-col gap-2 text-center">
                            <h3 className="text-2xl text-white/80">Quantidade de músicas encontradas</h3>
                            <p className="text-3xl font-extrabold text-green-400">{musics.length}</p>
                        </div>
                        
                        <div className="flex flex-col gap-2 text-center">
                            <h3 className="text-2xl text-white/80">Quantidade de artistas encontrados</h3>
                            <p className="text-3xl font-extrabold text-purple-400">{artists.length}</p>
                        </div>
                        
                        <div className="flex flex-col gap-2 text-center">
                            <h3 className="text-2xl text-white/80">Ouvintes total (Músicas)</h3>
                            <p className="text-3xl font-extrabold text-yellow-400">
                                {totalOuvintes.toLocaleString("pt-BR")}
                            </p>
                        </div>
                        
                        <div className="flex flex-col gap-2 text-center">
                            <h3 className="text-2xl text-white/80">Filtro aplicado</h3>
                            <p className="text-xl font-semibold text-white/60">
                                {selectedTag ? selectedTag : "Todos os gêneros"}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </section>
    )
}

export default Graphic