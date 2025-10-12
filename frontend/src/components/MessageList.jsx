import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLazyGetMessagesQuery } from "../services/messageApi";
import InfiniteScroll from "react-infinite-scroll-component";
import ChatSkeleton from "./skeletons/ChatSkeleton";

function MessageList(props) {
  const authUser = useSelector((state) => state.auth.user);
  const messages = useSelector((state) => state.message.messages);
  const selectedContact = useSelector((state) => state.message.selectedContact);
  const [triggerGetMessages] = useLazyGetMessagesQuery();
  const [isLoading, setIsLoading] = useState(false);
  const messagesHasNextPage = useSelector(
    (state) => state.message.messagesHasNextPage
  );

  useEffect(() => {
    if (selectedContact?.chatRoomId) {
      setIsLoading(true);
      triggerGetMessages({
        chatRoomId: selectedContact.chatRoomId,
        params: null,
        reset: true,
      })
        .unwrap()
        .finally(() => setIsLoading(false));
    }
  }, [selectedContact.chatRoomId, triggerGetMessages]);

  const getMoreMessages = async () => {
    triggerGetMessages({
      chatRoomId: selectedContact.chatRoomId,
      params: messagesHasNextPage && {
        cursorMessageId: messages[messages.length - 1].messageId,
        cursorSentAt: messages[messages.length - 1].sentAt,
      },
      reset: false,
    });
  };

  if (isLoading) {
    return <ChatSkeleton loop={10} />;
  }

  if (messages.length < 1) {
    return (
      <div
        className={`${
          props.imagePreview ? "hidden" : "flex"
        } flex-1 flex-col justify-center items-center`}
      >
        <p className="text-base-content">Not Found</p>
      </div>
    );
  }

  return (
    <div
      id="chat-scroll"
      className={`${
        props.imagePreview ? "hidden" : "flex"
      } overflow-y-auto flex-1 flex-col-reverse`}
    >
      <InfiniteScroll
        className="messages-container p-5 flex flex-col-reverse"
        dataLength={messages.length}
        next={getMoreMessages}
        inverse={true}
        hasMore={messagesHasNextPage}
        loader={
          <div className="flex justify-center items-center py-6">
            <Loader className="size-10 animate-spin" color="#ecf9ff" />
          </div>
        }
        scrollableTarget="chat-scroll"
        scrollThreshold={0.95}
      >
        {messages.map((message) => (
          <div
            className={`chat ${
              message.senderEmail === authUser.email ? "chat-end" : "chat-start"
            }`}
            key={message.messageId}
          >
            <div className="chat-bubble bg-base-100">
              {message.image && (
                <img
                  src={message.image}
                  alt="attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
}

export default MessageList;
