const ChatSkeleton = (props) => {
  const skeletonChat = Array(props.loop || 1).fill(null);

  return (
    <div className="overflow-y-auto messages-container p-5 flex flex-col-reverse flex-1">
      {skeletonChat.map((val, index) => (
        <div className={`chat ${index % 2 === 0 ? "chat-end" : "chat-start"}`} key={index}>
          <div className="chat-bubble bg-base-100 w-[200px] animate-pulse"></div>
        </div>
      ))}
    </div>
  );
};

export default ChatSkeleton;
