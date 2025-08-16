import ChatContainer from "../components/ChatContainer.jsx";
import Sidebar from "../components/Sidebar.jsx";

function HomePage() {
  return (
    <div className="bg-base-100">
      <div className="grid grid-cols-1 lg:grid-cols-3 h-screen">
        <Sidebar />
        <ChatContainer />
      </div>
    </div>
  );
}

export default HomePage;
