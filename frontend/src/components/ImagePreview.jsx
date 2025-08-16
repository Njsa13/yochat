import { X } from "lucide-react";

function ImagePreview() {
  return (
    <div className="messages-container flex-1 p-5 flex flex-col overflow-y-auto">
      <div className="flex">
        <button className="text-[#8A8C8E] hover:text-base-content transition-colors duration-300">
          <X />
        </button>
      </div>
      <div className="flex justify-center h-full">
        <img src="/avatar.png" alt=""/>
      </div>
    </div>
  );
}

export default ImagePreview;
