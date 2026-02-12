import { memo } from "react";
import { TILE_SIZE } from "../constants";

const Tile = memo(function Tile({ x, y, tile, onClick }) {
    const handleClick = () => onClick(x, y);

    return (
        <div className={`rounded cursor-pointer relative transition-all duration-150 ease-out w-7 h-7 max-xl:w-4 max-xl:h-4  ${tile ? "animate-claim-pop shadow-[inset_0_0_8px_rgba(0,0,0,0.3)]" : "hover:scale-130 hover:z-10 hover:bg-[#2a2a4a]! hover:shadow-[0_0_12px_rgba(108,92,231,0.4)]"}`}
            style={{
                backgroundColor: tile ? tile.color : '#1a1a2e'
            }}
            onClick={handleClick}
            title={tile ? `${tile.username}'s tile` : `(${x}, ${y}) --- Click to claim!`}
        >
            {tile && (
                <div className="absolute inset-0 rounded bg-white/15 animate-fade-out pointer-events-none" />
            )
            }

        </div>
    )
})

export default Tile;