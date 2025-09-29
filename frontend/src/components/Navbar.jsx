import { MessagesSquare, Sun, Moon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import { changeTheme } from "../store/themeSlice.js";

function Navbar() {
  const theme = useSelector((state) => state.theme.theme);
  const dispatch = useDispatch();

  return (
    <header className="bg-base-100 fixed z-10 w-full border-b border-base-content/10">
      <div className="container mx-auto p-4">
        <div className="flex justify-between">
          <div className="flex">
            <a href="/" className="flex gap-2 items-center">
              <div className="logo">
                <MessagesSquare size={30} className="text-secondary" />
              </div>
              <h1 className="font-roboto text-xl font-medium">YoChat</h1>
            </a>
          </div>
          <div className="flex gap-10">
            <button
              aria-label="Theme toggle"
              onClick={() => dispatch(changeTheme())}
              className="w-8 rounded-full p-1 transition-opacity duration-300 opacity-50 hover:opacity-100"
            >
              {theme === "light" ? <Sun /> : <Moon />}
            </button>
            <a
              href=""
              className="w-9 rounded-full p-1 transition-color duration-300 hover:bg-base-content/20 tooltip tooltip-bottom"
              data-tip="najibsauqi12"
            >
              <div className="avatar">
                <div className="rounded-full">
                  <img src="/avatar.png" />
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
