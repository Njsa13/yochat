import { Camera, User, UserRoundPen, X } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { deleteSelectedContacts } from "../store/messageSlice";

function UserProfile() {
  const dispatch = useDispatch();
  const selectedContact = useSelector((state) => state.message.selectedContact);
  const authUser = useSelector((state) => state.auth.user);

  return (
    <div
      className={`${
        selectedContact ? "" : "hidden lg:"
      }flex col-span-2 flex-col items-center overflow-auto mt-[68px]`}
    >
      <div className="bg-base-300 p-10 flex flex-col gap-4 my-5 rounded-xl shadow-md min-w-xs sm:min-w-md">
        <div className="flex items-center justify-end">
          <button
            type="button"
            onClick={() => dispatch(deleteSelectedContacts())}
            className="text-[#8A8C8E] hover:text-base-content transition-colors duration-300"
          >
            <X />
          </button>
        </div>
        <div className="text-center flex flex-col gap-2">
          <h1 className="font-roboto font-semibold text-2xl text-base-content">
            Profile
          </h1>
          <p className="text-base-content/60">Your profile information</p>
        </div>
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="avatar">
              <div className="ring-base-content/50 ring-offset-base-100 w-24 rounded-full ring-2 ring-offset-2">
                <img src={authUser.profilePicture || "/avatar.png"} />
              </div>
            </div>
            <div className="bg-[#a1aebf] text-base-200 flex p-2 rounded-full absolute -bottom-1 -right-1">
              <button>
                <Camera size={20} />
              </button>
            </div>
          </div>
          <p className="text-base-content/60">{authUser.email}</p>
        </div>
        <div>
          <form className="form w-full flex flex-col items-center gap-6">
            <div className="form-control max-w-md lg:min-w-sm w-full">
              <label htmlFor="username" className="label mb-2">
                <span className="font-roboto text-sm font-medium">
                  Username
                </span>
              </label>
              <div className="input w-full flex items-center rounded-lg">
                <User size={20} className="opacity-50" />
                <input
                  id="username"
                  autoComplete="on"
                  type="text"
                  placeholder="new username"
                  value={authUser.username}
                />
              </div>
            </div>
            <div className="form-control max-w-md lg:min-w-sm w-full">
              <label htmlFor="fullname" className="label mb-2">
                <span className="font-roboto text-sm font-medium">
                  Full Name
                </span>
              </label>
              <div className="input w-full flex items-center rounded-lg">
                <UserRoundPen size={20} className="opacity-50" />
                <input
                  id="fullname"
                  autoComplete="on"
                  type="text"
                  placeholder="new full name"
                  value={authUser.fullName}
                />
              </div>
            </div>
            <div className="form-control max-w-md lg:min-w-sm w-full">
              <button className="font-medium rounded-lg btn btn-primary w-full text-[#212121] font-roboto">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
