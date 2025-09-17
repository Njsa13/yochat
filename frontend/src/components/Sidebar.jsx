import { Search } from "lucide-react";

function Sidebar() {
  return (
    <div className="flex flex-col gap-4 pt-[80px] border-r border-base-content/10 overflow-auto">
      <div className="px-5 flex flex-col gap-3">
        <h1 className="font-roboto font-semibold text-xl text-base-content">Friends</h1>
        <div className="input w-full flex items-center rounded-lg">
          <Search size={20} className="opacity-50" />
          <input id="search" autoComplete="on" type="text" placeholder="Search name" />
        </div>
        <div className="flex gap-3 items-center border-b-1 border-base-content/20 pb-3">
          <button className="badge bg-accent/40 border-base-content/20 text-base-content/50 py-4 rounded-xl">All</button>
          <button className="badge badge-outline border-base-content/20 text-base-content/50 py-4 rounded-xl hover:bg-base-content/20 transition-colors duration-300">Unread</button>
        </div>
      </div>
      <div className="flex flex-col pr-5 overflow-y-auto gap-2">
        <button className="bg-base-content/10 transition-colors duration-300 rounded-tr-lg rounded-br-lg">
          <div className="user-card pl-5 py-4 flex gap-6">
            <div className="avatar avatar-online">
              <div className="w-13 rounded-full">
                <img src="/avatar.png" />
              </div>
            </div>
            <div className="flex flex-col justify-center text-left">
              <h2 className="font-roboto text-lg font-medium text-base-content">John Doe</h2>
              <p className="text-base-content/50">Pesan Terbaru</p>
            </div>
          </div>
        </button>
        <button className="hover:bg-base-content/10 transition-colors duration-300 rounded-tr-lg rounded-br-lg">
          <div className="user-card pl-5 py-4 flex gap-6">
            <div className="avatar">
              <div className="w-13 rounded-full">
                <img src="/avatar.png" />
              </div>
            </div>
            <div className="flex flex-col justify-center text-left">
              <h2 className="font-roboto text-lg font-medium text-base-content">Jane Dea</h2>
              <p className="text-base-content/50">Pesan Terbaru</p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
