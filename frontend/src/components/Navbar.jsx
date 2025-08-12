import { MessagesSquare, Lightbulb, CircleUser, LightbulbOff } from "lucide-react";
import { useState } from "react";

function Navbar() {
  const [isDark, setIsDark] = useState(false);

  const themeHandler = () => {
    setIsDark(!isDark);
  };

  return (
    <header className="bg-base-100 border-b border-base-300">
      <div className="container mx-auto p-4">
        <div className="flex justify-between">
          <div className="flex">
            <a href="" className="flex gap-2 items-center">
              <div>
                <MessagesSquare size={30} />
              </div>
              <h1 className="font-roboto text-xl font-medium">YoChat</h1>
            </a>
          </div>
          <div className="flex gap-10">
            <button aria-label="Theme toggle" onClick={themeHandler}>{isDark ? <Lightbulb size={28} /> : <LightbulbOff size={28} />}</button>
            <a href="">
              <CircleUser size={30} />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
