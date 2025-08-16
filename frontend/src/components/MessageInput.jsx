import { Image, SendHorizontal } from "lucide-react";

function MessageInput() {
  return (
    <div className="bg-base-100 py-3 px-5">
      <form className="flex gap-3">
        <div className="form-control flex gap-4 flex-1">
          <input type="text" placeholder="Type here" className="input flex-1" />
          <button className="btn btn-circle p-1 bg-base-300 hover:bg-base-content/5 border-0">
            <Image className="text-base-content" />
          </button>
        </div>
        <div className="form-control">
          <button className="btn btn-circle p-1 bg-base-300 hover:bg-base-content/5 border-0">
            <SendHorizontal className="text-base-content" />
          </button>
        </div>
      </form>
    </div>
  );
}

export default MessageInput;
