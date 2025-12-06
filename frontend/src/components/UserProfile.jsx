import { Camera, User, UserRoundPen, X, Loader } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { deleteSelectedContacts } from "../store/messageSlice";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  useLazyLogoutQuery,
  useUpdateProfileMutation,
  useUpdateProfilePicMutation,
} from "../services/authApi";
import { setCredentials } from "../store/authSlice";

function UserProfile() {
  const authUser = useSelector((state) => state.auth.user);
  const fileInputRef = useRef(null);
  const [selectedImg, setSelectedImg] = useState(null);
  const dispatch = useDispatch();
  const selectedContact = useSelector((state) => state.message.selectedContact);
  const [formData, setFormData] = useState({
    username: authUser.username || "",
    fullName: authUser.fullName || "",
  });
  const [updateProfile, { isLoading: isLoadingUpdateProfile }] =
    useUpdateProfileMutation();
  const [updateProfilePic] = useUpdateProfilePicMutation();
  const [isLoadingUpdatePic, setIsLoadingUpdatePic] = useState(false);
  const [triggerLogout] = useLazyLogoutQuery();
  const [isLoadingLogout, setIsLoadingLogout] = useState(false);

  const logoutHandler = async () => {
    try {
      setIsLoadingLogout(true);
      await triggerLogout().unwrap();
      window.location.reload();
    } catch (error) {
      setIsLoadingLogout(false);
      console.error("Error on logoutHandler: ", error.message);
    }
  };

  const updateProfileHandler = async (e) => {
    e.preventDefault();
    await updateProfile(formData);
    dispatch(
      setCredentials({
        ...authUser,
        username: formData.username,
        fullName: formData.fullName,
      })
    );
  };

  const updatePicHandler = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Error 400: Invalid image format");
      return;
    }

    setIsLoadingUpdatePic(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfilePic({ profilePicture: base64Image });
      dispatch(
        setCredentials({
          ...authUser,
          profilePicture: base64Image,
        })
      );
      setIsLoadingUpdatePic(false);
    };

    reader.onerror = () => {
      console.error("Failed to read image");
    };

    reader.readAsDataURL(file);
  };

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
              <div className="relative ring-base-content/50 ring-offset-base-100 w-24 rounded-full ring-2 ring-offset-2">
                {isLoadingUpdatePic && (
                  <Loader
                    className="absolute size-10 animate-spin top-1/2 left-1/2 -translate-1/2 z-10"
                    color="#ecf9ff"
                  />
                )}
                <img
                  className={isLoadingUpdatePic ? "brightness-50" : ""}
                  src={selectedImg || authUser.profilePicture || "/avatar.png"}
                />
              </div>
            </div>
            <div className="bg-[#a1aebf] text-base-200 flex p-2 rounded-full absolute -bottom-1 -right-1">
              <button onClick={() => fileInputRef.current?.click()}>
                <Camera size={20} />
              </button>
              <input
                type="file"
                accept="image/"
                className="hidden"
                ref={fileInputRef}
                onChange={updatePicHandler}
              />
            </div>
          </div>
          <p className="text-base-content/60">{authUser.email}</p>
        </div>
        <div>
          <form
            className="form w-full flex flex-col items-center gap-6"
            onSubmit={updateProfileHandler}
          >
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
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
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
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="form-control max-w-md lg:min-w-sm w-full">
              <button
                type="submit"
                className="font-medium rounded-lg btn btn-primary w-full text-[#212121] font-roboto"
                disabled={
                  isLoadingUpdateProfile ||
                  ((formData.username === authUser.username ||
                    formData.username === "") &&
                    (formData.fullName === authUser.fullName ||
                      formData.fullName === ""))
                }
              >
                {isLoadingUpdateProfile ? "Loading..." : "Submit"}
              </button>
            </div>
            <div className="form-control max-w-md lg:min-w-sm w-full">
              <button
                type="button"
                className="font-medium rounded-lg btn btn-error w-full text-error-content font-roboto"
                disabled={isLoadingLogout}
                onClick={logoutHandler}
              >
                Log Out
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
