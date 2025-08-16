import ChatHeader from "./ChatHeader.jsx";
import MessageInput from "./MessageInput.jsx";

function ChatContainer() {
  return (
    <div className="col-span-2 bg-base-300 hidden lg:flex flex-col justify-between overflow-auto">
      <ChatHeader />
      <div className="messages-container flex-1 p-5 flex flex-col-reverse overflow-y-auto">
        <div className="chat chat-start">
          <div className="chat-bubble bg-base-100">
            It's over Anakin,
            <br />I have the high ground.
          </div>
        </div>
        <div className="chat chat-end">
          <div className="chat-bubble bg-base-100">You underestimate my power!</div>
        </div>
        <div className="chat chat-start">
          <div className="chat-bubble bg-base-100">
            It's over Anakin,
            <br />I have the high ground.
          </div>
        </div>
        <div className="chat chat-end">
          <div className="chat-bubble bg-base-100">You underestimate my power!</div>
        </div>
        <div className="chat chat-start">
          <div className="chat-bubble bg-base-100">
            It's over Anakin,
            <br />I have the high ground.
          </div>
        </div>
        <div className="chat chat-end">
          <div className="chat-bubble bg-base-100">You underestimate my power!</div>
        </div>
        <div className="chat chat-start">
          <div className="chat-bubble bg-base-100">
            It's over Anakin,
            <br />I have the high ground.
          </div>
        </div>
        <div className="chat chat-end">
          <div className="chat-bubble bg-base-100">You underestimate my power!</div>
        </div>
      </div>
      <MessageInput />
    </div>
  );
}

export default ChatContainer;
