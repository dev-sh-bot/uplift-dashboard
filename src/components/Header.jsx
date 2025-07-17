import { FaRegUser } from "react-icons/fa";
import { MdKeyboardArrowLeft } from "react-icons/md";
import DropdownMenu from "./DropdownMenu";
import { GoBellFill } from "react-icons/go";
import { useMatches, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout, selectUser } from "../reducers/authSlice";
import NotificationDropdown from "./NotificationDropdown";
import ThemeToggle from "./ThemeToggle";

const Header = () => {
  const dispatch = useDispatch();
  const matches = useMatches();
  const navigate = useNavigate();
  const user = useSelector(selectUser);

  const notifications = []


  const dummyOptions = [
    {
      label: "Profile",
      type: "link",
      href: "/profile",
    },
    {
      label: "Logout",
      type: "button",
      action: () => {
        dispatch(logout());
      },
    },
  ];

  const handleGoBack = () => {
    navigate(sessionStorage.getItem("previousPage"));
  };

  // Find the deepest matched route with a handle
  const routeWithHandle = matches.reverse().find((match) => match.handle);
  const currentTitle = routeWithHandle?.handle?.title || "Default Title";

  return (
    <header className="top-header px-5 pt-5">
      <div className="flex items-center justify-between bg-white dark:bg-facebook-card rounded-2xl px-5 py-3 border border-gray-200 dark:border-facebook-border">
        <div className="flex items-center justify-between">
                      <div className="font-medium text-xl flex items-center gap-1 page-title text-gray-900 dark:text-facebook-text">
              <span className="cursor-pointer text-gray-600 dark:text-facebook-textSecondary hover:text-gray-900 dark:hover:text-facebook-text transition-colors">
              <MdKeyboardArrowLeft size={20} onClick={handleGoBack} />
            </span>
            {currentTitle}
          </div>
        </div>

        <div className="flex items-center gap-5">

          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Notification Dropdown with Tabs */}
            <NotificationDropdown
              user={user}
              notifications={notifications}
              onNotificationRead={() => {}}
              menuButtonLabel={
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gray-100 dark:bg-facebook-surface">
                  <span className="relative">
                    <GoBellFill size={25} className="text-gray-700 dark:text-facebook-textSecondary" />
                    <span className="w-4 h-4 text-white flex items-center justify-center text-[8px] bg-red-500 rounded-full absolute -top-[6px] -right-[2px] ">10</span>
                  </span>
                </div>
              }
            />

            {/* User Profile Dropdown */}
            <DropdownMenu
              menuButtonLabel={
                <div className="w-12 h-12 bg-blue-600 dark:bg-primary-700 rounded-full flex items-center justify-center shadow-sm">
                  <FaRegUser size={20} className="text-white" />
                </div>
              }
              options={dummyOptions}
              spaceBetweenInPercent={110}
              widthAsClass={"w-40"}
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;