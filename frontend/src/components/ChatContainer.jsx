import ChatHeader from "./ChatHeader.jsx";
import ImagePreview from "./ImagePreview.jsx";
import MessageInput from "./MessageInput.jsx";
import MessageList from "./MessageList.jsx";

function ChatContainer() {
  return (
    <div className="col-span-2 bg-base-300 hidden lg:flex flex-col justify-between overflow-auto">
      <ChatHeader />
      <MessageList />
      {/* <ImagePreview /> */}
      <MessageInput />
    </div>
  );
}

export default ChatContainer;
