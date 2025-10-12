import { useState } from "react";
import { Mail, X } from "lucide-react";
import { useDispatch } from "react-redux";
import { setIsModalOpen } from "../store/messageSlice";
import { useLazyGetSingleContactQuery } from "../services/messageApi";

function NewMessageModal() {
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();
  const [getSingleContact, { isLoading }] = useLazyGetSingleContactQuery();

  const getContactHandler = async (e) => {
    e.preventDefault();
    await getSingleContact({ recipientEmail: email });
    setEmail("");
  };

  return (
    <div className="absolute inset-0 bg-neutral/50 z-15 flex flex-col justify-center items-center">
      <div className="p-6 rounded-lg bg-base-100 relative">
        <div className="absolute flex items-center justify-end right-3 top-3">
          <button
            type="button"
            className="text-[#8A8C8E] hover:text-base-content transition-colors duration-300"
            onClick={() => {
              dispatch(setIsModalOpen(false));
              setEmail("");
            }}
          >
            <X size={20} />
          </button>
        </div>
        <h1 className="text-base-content/80 font-semibold text-xl font-roboto mb-4">
          New Message
        </h1>
        <form
          className="form w-full flex flex-col items-center gap-6"
          onSubmit={getContactHandler}
        >
          <div className="form-control max-w-md lg:min-w-sm w-full">
            <div className="input w-full flex items-center rounded-lg">
              <Mail size={20} className="opacity-50" />
              <input
                id="email"
                autoComplete="on"
                type="email"
                placeholder="Recipient email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div className="form-control max-w-md lg:min-w-sm w-full">
            <button
              className="font-medium rounded-lg btn btn-primary w-full text-[#212121] font-roboto"
              type="submit"
            >
              Create Chat
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewMessageModal;
