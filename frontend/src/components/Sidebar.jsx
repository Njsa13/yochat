import { Search, Image } from "lucide-react";
import { useLazyGetContactsQuery } from "../services/messageApi.js";
import { useEffect, useState } from "react";
import SidebarSkeleton from "./skeletons/SidebarSkeleton.jsx";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedContact } from "../store/messageSlice.js";
import InfiniteScroll from "react-infinite-scroll-component";

function Sidebar() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const [triggerGetContacts] = useLazyGetContactsQuery();
  const contacts = useSelector((state) => state.message.contacts);
  const contactsHasNextPage = useSelector(
    (state) => state.message.contactsHasNextPage
  );
  const selectedContact = useSelector((state) => state.message.selectedContact);
  const isProfileOpened = useSelector((state) => state.message.isProfileOpened);

  const selectedFilterCss =
    "badge bg-accent/40 border-base-content/20 text-base-content/50 py-4 rounded-xl";
  const unSelectedFilterCss =
    "badge badge-outline border-base-content/20 text-base-content/50 py-4 rounded-xl hover:bg-base-content/20 transition-colors duration-300";

  const selectedContactCss =
    "bg-base-content/10 transition-colors duration-300 rounded-tr-lg rounded-br-lg";
  const unSelectedContactCss =
    "hover:bg-base-content/10 transition-colors duration-300 rounded-tr-lg rounded-br-lg";

  useEffect(() => {
    const filterObj = {
      ...(filter === "UNREAD" && { isUnread: true }),
      ...(search && { search }),
    };
    setIsLoading(true);
    if (!search) {
      triggerGetContacts({ params: filterObj, reset: true })
        .unwrap()
        .finally(() => setIsLoading(false));
    } else {
      const handler = setTimeout(() => {
        triggerGetContacts({ params: filterObj, reset: true })
          .unwrap()
          .finally(() => setIsLoading(false));
      }, 800);
      return () => clearTimeout(handler);
    }
  }, [filter, search, triggerGetContacts]);

  const getMoreContacts = async () => {
    const filterObj = {
      ...(filter === "UNREAD" && { isUnread: true }),
      ...(search && { search }),
      ...(contactsHasNextPage && {
        cursorChatRoomId: contacts[contacts.length - 1].chatRoomId,
        cursorLatestMessageAt: contacts[contacts.length - 1].latestMessageAt,
      }),
    };
    triggerGetContacts({ params: filterObj, reset: false });
  };

  return (
    <div
      className={`${
        selectedContact || isProfileOpened ? "hidden lg:" : ""
      }flex flex-col gap-4 pt-[80px] border-r border-base-content/10 overflow-auto`}
    >
      <div className="px-5 flex flex-col gap-3">
        <h1 className="font-roboto font-semibold text-xl text-base-content">
          Friends
        </h1>
        <div className="input w-full flex items-center rounded-lg">
          <Search size={20} className="opacity-50" />
          <input
            id="search"
            autoComplete="off"
            type="text"
            placeholder="Search name"
            onChange={(e) => setSearch(e.target.value)}
            value={search}
          />
        </div>
        <div className="flex gap-3 items-center border-b-1 border-base-content/20 pb-3">
          <button
            className={
              filter === "ALL" ? selectedFilterCss : unSelectedFilterCss
            }
            onClick={() => {
              setFilter("ALL");
            }}
            disabled={isLoading}
          >
            All
          </button>
          <button
            className={
              filter === "UNREAD" ? selectedFilterCss : unSelectedFilterCss
            }
            onClick={() => {
              setFilter("UNREAD");
            }}
            disabled={isLoading}
          >
            Unread
          </button>
        </div>
      </div>
      {isLoading ? (
        <SidebarSkeleton loop={8} />
      ) : contacts.length !== 0 ? (
        <div id="sidebar-scroll" className="overflow-y-auto">
          <InfiniteScroll
            className="flex flex-col pr-5 gap-2"
            dataLength={contacts.length}
            next={getMoreContacts}
            hasMore={contactsHasNextPage}
            loader={<SidebarSkeleton loop={2} />}
            scrollableTarget="sidebar-scroll"
            scrollThreshold={0.95}
          >
            {contacts.map((contact, index) => (
              <button
                className={
                  (selectedContact?.chatRoomId === contact.chatRoomId
                    ? selectedContactCss
                    : unSelectedContactCss) +
                  (contacts.length - 1 === index && !contactsHasNextPage
                    ? " mb-3"
                    : "")
                }
                key={contact.chatRoomId}
                onClick={() => {
                  dispatch(setSelectedContact(contact));
                }}
              >
                <div className="user-card pl-5 py-4 flex gap-6">
                  <div className="avatar avatar-online">
                    <div className="w-13 rounded-full">
                      <img
                        src={
                          contact.partnerChat?.profilePicture || "/avatar.png"
                        }
                      />
                    </div>
                  </div>
                  <div className="flex flex-col justify-center text-left min-w-0 max-w-full">
                    <h2 className="font-roboto text-lg font-medium text-base-content truncate">
                      {contact.partnerChat?.fullName || "Anonymus"}
                    </h2>
                    <p className="text-base-content/50 truncate">
                      {contact.isTherePicture ? (
                        <Image className="inline" color="#848f9a" size={20} />
                      ) : (
                        ""
                      )}
                      {"  "}
                      {contact.latestMessage}
                    </p>
                  </div>
                  {contact.unread != 0 && (
                    <div className="number flex flex-col justify-center ml-auto mr-6">
                      <div className="bg-accent px-4 py-1 rounded-full">
                        <p className="text-neutral">{contact.unread}</p>
                      </div>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </InfiniteScroll>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center h-full">
          <p className="text-base-content">Not Found</p>
        </div>
      )}
    </div>
  );
}

export default Sidebar;
