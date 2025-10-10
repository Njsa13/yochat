import { ImagePlus, SendHorizontal, Loader } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useSendMessageMutation } from "../services/messageApi";

function MessageInput(props) {
  const [text, setText] = useState("");
  const textareaRef = useRef(null);
  const selectedContact = useSelector((state) => state.message.selectedContact);
  const [sendMessage, { isLoading }] = useSendMessageMutation();

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "30px";
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + 4 + "px";
    }
  }, [text]);

  useEffect(() => {
    setText("");
  }, [selectedContact]);

  const imagePreviewHandler = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Error 400: Invalid image format");
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const base64Image = reader.result;
      props.setImagePreview(base64Image);
    };

    reader.onerror = () => {
      console.error("Failed to read image");
    };

    reader.readAsDataURL(file);
  };

  const sendMessageHandler = async (e) => {
    e.preventDefault();
    if (selectedContact?.partnerChat) {
      await sendMessage({
        message: {
          ...(text && { text: text }),
          ...(props.imagePreview && { image: props.imagePreview }),
        },
        sendTo: selectedContact.partnerChat.email,
      });
      setText("");
      props.setImagePreview(null);
    }
  };

  return (
    <div className="bg-base-100 py-3 px-5">
      <form className="flex gap-3 items-center" onSubmit={sendMessageHandler}>
        <div className="form-control flex gap-4 flex-1 items-center">
          <textarea
            name="text"
            className="textarea flex-1 min-h-0 resize-none"
            placeholder="Type here"
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
          ></textarea>
          <input
            type="file"
            accept="image/"
            name="image"
            id="image"
            className="hidden"
            onChange={imagePreviewHandler}
            ref={props.imageRef}
          />
          <button
            className="btn btn-circle p-1 bg-base-300 hover:bg-base-content/20 border-0"
            onClick={(e) => {
              props.imageRef.current?.click();
              e.preventDefault();
            }}
          >
            <ImagePlus className="text-base-content" />
          </button>
        </div>
        <div className="form-control">
          <button
            className="btn btn-circle p-1 bg-base-300 hover:bg-base-content/20 border-0"
            disabled={(!text && !props.imagePreview) || isLoading}
          >
            {isLoading ? (
              <Loader className="text-base-content animate-spin" />
            ) : (
              <SendHorizontal className="text-base-content" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default MessageInput;
