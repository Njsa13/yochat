import { X, Dot } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { deleteSelectedContacts } from "../store/messageSlice";

function ChatHeader() {
  const dispatch = useDispatch();
  const selectedContact = useSelector((state) => state.message.selectedContact);

  return (
    <div className="px-5 py-4 bg-base-100 mt-[68px] flex justify-between">
      <div className="flex gap-6 items-center">
        <div className="avatar avatar-online">
          <div className="w-11 rounded-full">
            <img
              src={
                selectedContact?.partnerChat?.profilePicture || "/avatar.png"
              }
            />
          </div>
        </div>
        <div className="flex flex-col justify-center text-left">
          <h2 className="font-roboto text-md font-medium text-base-content">
            {selectedContact?.partnerChat?.fullName || "Anonymus"}
          </h2>
          <p className="text-base-content/50 text-sm flex">
            {" "}
            Online <Dot /> {selectedContact?.partnerChat?.email}
          </p>
        </div>
      </div>
      <div className="flex items-center">
        <button
          type="button"
          onClick={() => dispatch(deleteSelectedContacts())}
          className="text-[#8A8C8E] hover:text-base-content transition-colors duration-300"
        >
          <X />
        </button>
      </div>
    </div>
  );
}

export default ChatHeader;
