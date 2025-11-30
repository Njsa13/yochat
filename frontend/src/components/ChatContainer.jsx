import { useSelector } from "react-redux";
import ChatHeader from "./ChatHeader.jsx";
import ImagePreview from "./ImagePreview.jsx";
import MessageInput from "./MessageInput.jsx";
import MessageList from "./MessageList.jsx";
import { useEffect, useState } from "react";
import { useRef } from "react";
import { useReadMessageMutation } from "../services/messageApi.js";

function ChatContainer() {
  const selectedContact = useSelector((state) => state.message.selectedContact);
  const [imagePreview, setImagePreview] = useState(null);
  const imageRef = useRef(null);
  const [readMessage] = useReadMessageMutation();

  useEffect(() => {
    setImagePreview(null);
    if (selectedContact?.unread > 0) {
      (async () => {
        await readMessage({ chatRoomId: selectedContact.chatRoomId });
      })();
    }
  }, [readMessage, selectedContact.chatRoomId, selectedContact?.unread]);

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
