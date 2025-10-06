import { MessagesSquare } from "lucide-react";

function NoContactSelected() {
  return (
    <div className="bg-base-300 hidden lg:flex justify-center items-center col-span-2">
      <div className="flex justify-center items-center">
        <MessagesSquare size={100} className="text-secondary mr-4" />
        <p className="font-roboto font-medium text-7xl text-center">YoChat</p>
      </div>
    </div>
  );
}

export default NoContactSelected;
