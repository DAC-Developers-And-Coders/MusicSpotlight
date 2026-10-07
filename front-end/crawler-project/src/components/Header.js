"use client"

const Header = () =>
{
    return(
        <header className="bg-header h-13 grid grid-cols-3 items-center px-5 sticky top-0 z-50 left-0 right-0">
            <div className="flex justify-start">
                <h1 className="font-bold text-3xl">DAC</h1>
            </div>
            <div className="flex justify-center">
                <h1 className="font-bold text-4xl">MusicSpotlight</h1>
            </div>
            <div className="flex justify-end">
                <input placeholder="Filtre o gênero" className="bg-white/5 text-center h-7 w-48 border-2 border-white/20 rounded-xl focus:border-text"></input>
            </div>
        </header>
    )
}

export default Header;