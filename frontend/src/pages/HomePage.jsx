import { useSelector } from "react-redux";
import ChatContainer from "../components/ChatContainer.jsx";
import Sidebar from "../components/Sidebar.jsx";
import UserProfile from "../components/UserProfile.jsx";
import NoContactSelected from "../components/NoContactSelected.jsx";

function HomePage() {
  const selectedContact = useSelector((state) => state.message.selectedContact);
  const authUser = useSelector((state) => state.auth.user);
  return (
    <div className="bg-base-100">
      <div className="grid grid-cols-1 lg:grid-cols-3 h-screen">
        <Sidebar />
        {selectedContact ? (
          selectedContact?.email === authUser?.email ? (
            <UserProfile />
          ) : (
            <ChatContainer />
          )
        ) : (
          <NoContactSelected />
        )}
      </div>
    </div>
  );
}

export default HomePage;
