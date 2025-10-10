import { useSelector } from "react-redux";
import ChatHeader from "./ChatHeader.jsx";
import ImagePreview from "./ImagePreview.jsx";
import MessageInput from "./MessageInput.jsx";
import MessageList from "./MessageList.jsx";
import { useEffect, useState } from "react";
import { useRef } from "react";

function ChatContainer() {
  const selectedContact = useSelector((state) => state.message.selectedContact);
  const [imagePreview, setImagePreview] = useState(null);
  const imageRef = useRef(null);

  useEffect(() => {
    setImagePreview(null);
  }, [selectedContact]);

  return (
    <div
      className={`${
        selectedContact ? "" : "hidden lg:"
      }flex flex-col col-span-2 bg-base-300 justify-between overflow-auto`}
    >
      <ChatHeader />
      <ImagePreview
        imagePreview={imagePreview}
        setImagePreview={setImagePreview}
        imageRef={imageRef}
      />
      <MessageList imagePreview={imagePreview} />
      <MessageInput
        imagePreview={imagePreview}
        setImagePreview={setImagePreview}
        imageRef={imageRef}
      />
    </div>
  );
}

export default ChatContainer;
