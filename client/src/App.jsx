import Grid from "./components/Grid";
import { useGrid } from "./hooks/useGrid";
import { useSocket } from "./hooks/useSocket";
import Leaderboard from "./components/Leaderboard";
import UserPanel from "./components/UserPanel";

function App() {
  const { socket, isConnected, onlineCount, user } = useSocket();
  const { tiles, claimTile, reason } = useGrid(socket, user);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-5 bg-[#0f0f1a] text-gray-200 font-['inter', system-ui,sans-serif] overflow-hidden">
      <header className="text-center mb-6">
        <h1 className="text-4xl font-extrabold bg-linear-to-r from-[#5C5CE7] via-[#a29bfe] to-[#00CEC9] bg-clip-text text-transparent bg-size-[200$_auto] animate-shimmer tracking-tight">TileClash</h1>
        <p className="text-gray-500 text-sm mt-1"> Click to Claim. Compete in realtime. </p>
        <div className="flex items-center justify-center gap-2.5 mt-3 text-sm text-gray-400">
          <span className={`w-2 h-2 rounded-full inline-block` + `${isConnected ? "bg-emerald-500 shadow-[0_0_6px_#00B894]" : "bg-red-600"}`}></span>
          <span>{isConnected ? `${onlineCount} online` : "Connecting..."}</span>
          <span
            className="px-2.5 py-0.5 rounded-full border-2 text-xs font-semibold"
            style={{ borderColor: user.color }}
          >{user.username}</span>
        </div>
      </header >
      <div className="flex max-xl:flex-col gap-6 items-start max-xl:items-center">
        <aside className="w-56 flex flex-col  gap-54 max-xl:gap-6 shrink-0">
          <UserPanel user={user} onlineCount={onlineCount} isConnected={isConnected} />
          <Leaderboard currentUser={user} tiles={tiles} />
        </aside>
        <div className="flex flex-col items-center justify-center">
          <Grid tiles={tiles} onTileClick={claimTile} />
          <span className="text-red-600"> {reason ? `Tile is ${reason}` : null}</span>
        </div>
      </div>
    </div >
  )
}

export default App;