import { Image, SendHorizontal } from "lucide-react";
import { useEffect, useRef, useState } from "react";

function MessageInput() {
  const [text, setText] = useState("");
  const textareaRef = useRef(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "30px";
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + 4 + "px";
    }
  }, [text]);

  return (
    <div className="bg-base-100 py-3 px-5">
      <form className="flex gap-3 items-center">
        <div className="form-control flex gap-4 flex-1 items-center">
          <textarea name="text" className="textarea flex-1 min-h-0 resize-none" placeholder="Type here" ref={textareaRef} value={text} onChange={(e) => setText(e.target.value)}></textarea>
          <button className="btn btn-circle p-1 bg-base-300 hover:bg-base-content/20 border-0">
            <Image className="text-base-content" />
          </button>
        </div>
        <div className="form-control">
          <button className="btn btn-circle p-1 bg-base-300 hover:bg-base-content/20 border-0">
            <SendHorizontal className="text-base-content" />
          </button>
        </div>
      </form>
    </div>
  );
}

export default MessageInput;
