import { useSelector } from "react-redux";
import ChatHeader from "./ChatHeader.jsx";
import ImagePreview from "./ImagePreview.jsx";
import MessageInput from "./MessageInput.jsx";
import MessageList from "./MessageList.jsx";

function ChatContainer() {
  const selectedContact = useSelector((state) => state.message.selectedContact);

  return (
    <div
      className={`${
        selectedContact ? "" : "hidden lg:"
      }flex flex-col col-span-2 bg-base-300 justify-between overflow-auto`}
    >
      <ChatHeader />
      <MessageList />
      {/* <ImagePreview /> */}
      <MessageInput />
    </div>
  );
}

export default ChatContainer;
