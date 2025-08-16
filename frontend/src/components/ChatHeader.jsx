import { X } from "lucide-react";

function ChatHeader() {
  return (
    <div className="px-5 py-4 bg-base-100 mt-[68px] flex justify-between">
      <div className="flex gap-6 items-center">
        <div className="avatar avatar-online">
          <div className="w-11 rounded-full">
            <img src="/avatar.png" />
          </div>
        </div>
        <div className="flex flex-col justify-center text-left">
          <h2 className="font-roboto text-md font-medium text-base-content">John Doe</h2>
          <p className="text-base-content/50 text-sm">Online</p>
        </div>
      </div>
      <div className="flex items-center">
        <button className="text-[#8A8C8E] hover:text-base-content transition-colors duration-300">
          <X />
        </button>
      </div>
    </div>
  );
}

export default ChatHeader;
