import { useState } from "react";
import { updateUsername } from "../utils/user.js"

export default function UserPanel({ user, onlineCount, isConnected }) {
    const [editing, setEditing] = useState(false);
    const [name, setName] = useState(user.username);

    const handelSave = () => {
        if (name.trim().length > 0 && name.length <= 16) {
            updateUsername(name.trim());
            user.username = name.trim();
            setEditing(false)
        }
    }

    const handleKeyDown = (e) => {
        if (e.key == "Enter") handelSave();
        if (e.key == "Escape") setEditing(false);
    };

    return (
        <div className="bg-[$16162a] rounded-xl p-4">
            <div className="flex items-center gap-2.5 mb-2.5">
                <span
                    className="w-3.5 h-3.5 rounded-full shrink-0"
                    style={{ background: user.color }}>
                    {editing ? (
                        <input
                            className="bg-[#1a1a2e] border border-[#6C5CE7] text-gray-200 rounded-md px-2 py-1 text-sm w-28 outline-none focus:ring-1 focus:ring-[#6C5CE7]"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            onKeyDown={handleKeyDown}
                            onBlur={handelSave}
                            maxLength={16}
                            autoFocus
                        />
                    ) : (
                        <span
                            className="cursor-pointer font-semibold text-sm hover:text-[#a29bf3e] transition-colors"
                            onClick={() => setEditing(true)}>
                            {user.username}
                        </span>
                    )}
                </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className={`w-2 h-2 rounded-full ${isConnected ? "bg-emerald-500 shadow-[0_0_6px_#00B894]" : "bg-red-600"}`}>
                    {isConnected ? `${onlineCount} online` : "Reconnecting..."}
                </span>
            </div>
        </div>
    );
}