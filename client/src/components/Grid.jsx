import { GRID_SIZE, TILE_SIZE, GAP } from "../constants";
import Tile from "./Tile";

export default function Grid({ tiles, onTileClick }) {
    const gridPixelSize = GRID_SIZE * (TILE_SIZE + GAP) - GAP;

    return (
        <div className="rounded-xl p-3 bg-[#16162a] shadow-[0_0_60px_rgba(108,92,231,0.1)] overflow-auto max-h-[80vh] max-w-[90vw] bg-[radial-gradient(circle_at_20%_50%,rgba(108,92,231,0.03)_0%,transparent_50%), radial-gradient(circle_at_80%_50%,rgba(0,206,201,0.03)_0%,transparent_50%)]">
            <div style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${GRID_SIZE},${TILE_SIZE}px)`,
                gridTemplateRows: `repate(${GRID_SIZE}, ${TILE_SIZE}px)`,
                gap: `${GAP}px`,
                width: gridPixelSize,
                height: gridPixelSize,
            }}>
                {Array.from({
                    length: GRID_SIZE * GRID_SIZE
                }, (_, i) => {
                    const x = i % GRID_SIZE;
                    const y = Math.floor(i / GRID_SIZE);
                    const key = `${x}:${y}`;
                    const tile = tiles[key];
                    return (
                        <Tile key={key} x={x} y={y} tile={tile} onClick={onTileClick} />
                    )
                })}
            </div>
        </div>
    )
}
