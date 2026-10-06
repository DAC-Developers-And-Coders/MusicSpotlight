"use client"

const Hero = () => {

    const top10Musics = [
        {id:1, name:"Musica1", artist:"Cantor1", qtdOuvida:3123123, image:"/assets/images/teste.png"},
        {id:2, name:"Musica2", artist:"Cantor2", qtdOuvida:41241, image:"/assets/images/teste.png"},
        {id:3, name:"Musica3", artist:"Cantor3", qtdOuvida:525232, image:"/assets/images/teste.png"},
        {id:4, name:"Musica4", artist:"Cantor4", qtdOuvida:6546465, image:"/assets/images/teste.png"},
        {id:5, name:"Musica5", artist:"Cantor5", qtdOuvida:4142666, image:"/assets/images/teste.png"},
        {id:6, name:"Musica6", artist:"Cantor6", qtdOuvida:9734543, image:"/assets/images/teste.png"},
        {id:7, name:"Musica7", artist:"Cantor7", qtdOuvida:74563363, image:"/assets/images/teste.png"},
        {id:8, name:"Musica8", artist:"Cantor8", qtdOuvida:41215351, image:"/assets/images/teste.png"},
        {id:9, name:"Musica9", artist:"Cantor9", qtdOuvida:86769956, image:"/assets/images/teste.png"},
        {id:10, name:"Musica10", artist:"Cantor10", qtdOuvida:41411414, image:"/assets/images/teste.png"},
    ]
    const top10NewMusics = [
        {id:1, name:"Musica1", artist:"Cantor1", image:"/assets/images/teste.png"},
        {id:2, name:"Musica2", artist:"Cantor2", image:"/assets/images/teste.png"},
        {id:3, name:"Musica3", artist:"Cantor3", image:"/assets/images/teste.png"},
        {id:4, name:"Musica4", artist:"Cantor4", image:"/assets/images/teste.png"},
        {id:5, name:"Musica5", artist:"Cantor5", image:"/assets/images/teste.png"},
        {id:6, name:"Musica6", artist:"Cantor6", image:"/assets/images/teste.png"},
        {id:7, name:"Musica7", artist:"Cantor7", image:"/assets/images/teste.png"},
        {id:8, name:"Musica8", artist:"Cantor8", image:"/assets/images/teste.png"},
        {id:9, name:"Musica9", artist:"Cantor9", image:"/assets/images/teste.png"},
        {id:10, name:"Musica10", artist:"Cantor10", image:"/assets/images/teste.png"},
    ]

    const top10Artists = [
        {id:1, artist:"Cantor1", qtdOuvida:3123123, image:"/assets/images/teste.png"},
        {id:2, artist:"Cantor2", qtdOuvida:5234242, image:"/assets/images/teste.png"},
        {id:3, artist:"Cantor3", qtdOuvida:456456456, image:"/assets/images/teste.png"},
        {id:4, artist:"Cantor4", qtdOuvida:236263232, image:"/assets/images/teste.png"},
        {id:5, artist:"Cantor5", qtdOuvida:42342424, image:"/assets/images/teste.png"},
        {id:6, artist:"Cantor6", qtdOuvida:56464564, image:"/assets/images/teste.png"},
        {id:7, artist:"Cantor7", qtdOuvida:142141241, image:"/assets/images/teste.png"},
        {id:8, artist:"Cantor8", qtdOuvida:643534533, image:"/assets/images/teste.png"},
        {id:9, artist:"Cantor9", qtdOuvida:4124124141, image:"/assets/images/teste.png"},
        {id:10, artist:"Cantor10", qtdOuvida:545435355, image:"/assets/images/teste.png"},
    ]

    return (
        <section className="mx-10 py-4 flex flex-col items-center gap-2">
            <h1 className="text-4xl font-extrabold text-center">Descubra as músicas mais ouvidas!</h1>

            <div className="grid grid-cols-2 gap-25 w-full max-w-7xl items-start">
                <div className="flex flex-col gap-4 p-4">
                    <h2 className="text-3xl font-bold text-center ml-15">Artistas mais ouvidas hoje!</h2>
                    <div className="flex flex-col gap-5">
                        {[...top10Artists].sort((a, b) => b.qtdOuvida - a.qtdOuvida).map((music) => (
                            <div key={music.id} className="grid grid-cols-3 items-center text-center gap-2">
                                <img src={music.image} alt={music.name} className="w-12 h-12 object-cover rounded-md justify-self-center"></img>
                                <p className="text-xl font-semibold">{music.artist}</p>
                                <p className="text-xl text-white/70 whitespace-nowrap">{music.qtdOuvida} vezes</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col gap-4 p-4">
                    <h2 className="text-3xl font-bold text-center">Últimas novidades!</h2>
                    <div className="flex flex-col gap-5">
                        {[...top10NewMusics].map((music) => (
                            <div key={music.id} className="grid grid-cols-3 items-center text-center gap-2">
                                <img src={music.image} alt={music.name} className="w-12 h-12 object-cover rounded-md justify-self-center"></img>
                                <p className="text-xl font-semibold">{music.name}</p>
                                <p className="text-xl font-semibold">{music.artist}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col gap-4 p-4 col-span-2">
                    <h2 className="text-3xl font-bold text-center ml-15">Músicas mais ouvidas hoje!</h2>
                    <div className="flex flex-col gap-5">
                        {[...top10Musics].sort((a, b) => b.qtdOuvida - a.qtdOuvida).map((music) => (
                            <div key={music.id} className="grid grid-cols-4 items-center text-center gap-2">
                                <img src={music.image} alt={music.name} className="w-12 h-12 object-cover rounded-md justify-self-center"></img>
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