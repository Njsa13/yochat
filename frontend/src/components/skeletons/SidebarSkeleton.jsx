const SidebarSkeleton = (props) => {
  const skeletonContacts = Array(props.loop || 1).fill(null);

  return (
    <div className="flex flex-col pr-5 overflow-y-auto gap-2">
      {skeletonContacts.map((val, index) => (
        <button
          className="bg-base-content/10 transition-colors duration-300 rounded-tr-lg rounded-br-lg animate-pulse"
          key={index}
        >
          <div className="user-card pl-5 py-4 flex gap-6">
            <div className="avatar">
              <div className="w-13 rounded-full bg-base-100/50"></div>
            </div>
            <div className="flex flex-col justify-center text-left flex-1 mr-6 gap-2">
              <div className="h-[26px] bg-base-100/50 rounded-2xl"></div>
              <div className="h-[18px] bg-base-100/50 rounded-2xl w-[50%]"></div>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};

export default SidebarSkeleton;
