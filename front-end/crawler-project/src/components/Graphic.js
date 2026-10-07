"use client"

import { PieChart, Pie, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { top10Musics, top10Artists, top10NewAlbuns } from "@/data/musicData";

const COLORS = [
  "#1DB954", "#8B5CF6", "#EC4899", "#D4AF37", "#3B82F6", 
  "#F97316", "#10B981", "#6366F1", "#EF4444", "#14B8A6"
];


const formattedMusics = top10Musics.map((item, index) => ({
  ...item,
  fill: COLORS[index % COLORS.length]
}));

const formattedArtist = top10Artists.map((item, index) => ({
  ...item,
  fill: COLORS[index % COLORS.length]
}));

const Graphic = () => {
    return (
        <section className="min-h-screen p-6 flex flex-col items-center">
            <h1 className="text-4xl text-center font-extrabold pb-8">Gráficos</h1>
            
            <div className="grid grid-cols-2 gap-10 w-full max-w-6xl">
                <div className="flex flex-col items-center bg-header border-2 p-4 rounded-2xl">
                    <h3 className="text-3xl font-bold">Músicas mais ouvidas</h3>
                    <div className="w-full h-80 mb-6">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={formattedMusics} cx="50%" cy="50%" innerRadius={60} outerRadius={90}paddingAngle={5} dataKey="qtdOuvida"nameKey="name"/>
                                <Tooltip 
                                    contentStyle={{ backgroundColor: "#181818", borderColor: "#333", borderRadius: "8px" }}
                                    itemStyle={{ color: "#fff" }}
                                />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    <h3 className="text-3xl font-bold">Artistas mais ouvidos</h3>
                    <div className="w-full h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={formattedArtist} cx="50%" cy="50%" innerRadius={60} outerRadius={90}paddingAngle={5} dataKey="qtdOuvida"nameKey="artist"/>
                                <Tooltip 
                                    contentStyle={{ backgroundColor: "#181818", borderColor: "#333", borderRadius: "8px" }}
                                    itemStyle={{ color: "#fff" }}
                                />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="flex flex-col items-center bg-header border-2 p-4 rounded-2xl gap-20">
                    <h3 className="text-3xl font-bold">Informações</h3>
                    <div className="flex flex-col gap-3 text-center">
                        <h3 className="text-2xl">Quantidade de músicas encontradas</h3>
                        <p className="text-xl">21141241</p>
                    </div>
                    <div className="flex flex-col gap-3 text-center">
                        <h3 className="text-2xl">Quantidade de artistas encontradas</h3>
                        <p className="text-xl">4124142</p>
                    </div>
                    <div className="flex flex-col gap-3 text-center">
                        <h3 className="text-2xl">Ouvintes total</h3>
                        <p className="text-xl">412414241</p>
                    </div>
                    <div className="flex flex-col gap-3 text-center">
                        <h3 className="text-2xl">Última requisição realizada</h3>
                        <p className="text-xl">4 horas atrás - 06.10.2026</p>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Graphic;