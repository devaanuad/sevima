import React, { useContext, useState } from "react";
import { SidebarContext } from "../context/SidebarContext";
import { MoonIcon, SunIcon, MenuIcon, OutlineLogoutIcon } from "../icons";
import {
  Avatar,
  Dropdown,
  DropdownItem,
  WindmillContext,
} from "@windmill/react-ui";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { API_URL } from "./Middleware/constants";
import * as SweetAlert from "./Sweetalert2";
import * as Secure from "./Middleware/SecureLocalStorage";
import SearchMenu from "./Search/SearchMenu";

function Header() {
  const { mode, toggleMode } = useContext(WindmillContext);
  const { toggleSidebar } = useContext(SidebarContext);

  const [isNotificationsMenuOpen, setIsNotificationsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  function handleNotificationsClick() {
    setIsNotificationsMenuOpen(!isNotificationsMenuOpen);
  }

  function handleProfileClick() {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  }

  const history = useHistory();
  const logout = () => {
    SweetAlert.SweetNanya("Are u Sure?", "press ok if sure").then(
      async (result) => {
        if (result.isConfirmed) {
          try {
            SweetAlert.SweetLoading();
            await axios.post(
              API_URL + "api/logout",
              {},
              {
                withCredentials: true,
                headers: {
                  Authorization: `${Secure.getItem("token")}`,
                },
              }
            );
            await SweetAlert.SweetOK("Logout Success");
            localStorage.removeItem("token");
            localStorage.removeItem("data_user");
            localStorage.removeItem("role");
            history.push("/login");
            window.location.reload();
          } catch (error) {
            SweetAlert.SweetError("Logout Failed", error.response.data.message);
          }
        }
      }
    );
  };
  return (
    <header className="z-40 py-4 bg-white shadow-bottom dark:bg-gray-800">
      <div className="container flex items-center justify-between h-full px-6 mx-auto text-purple-600 dark:text-purple-300">
        {/* <!-- Mobile hamburger --> */}
        <button
          className="p-1 mr-5 -ml-1 rounded-md lg:hidden focus:outline-none focus:shadow-outline-purple"
          onClick={toggleSidebar}
          aria-label="Menu"
        >
          <MenuIcon className="w-6 h-6" aria-hidden="true" />
        </button>
        {/* <!-- Search input --> */}
        <SearchMenu />
        {/* END SEARCH */}
        <ul className="flex items-center flex-shrink-0 space-x-6">
          {/* <!-- Theme toggler --> */}
          <li className="flex">
            <button
              className="rounded-md focus:outline-none focus:shadow-outline-purple"
              onClick={toggleMode}
              aria-label="Toggle color mode"
            >
              {mode === "dark" ? (
                <SunIcon className="w-5 h-5" aria-hidden="true" />
              ) : (
                <MoonIcon className="w-5 h-5" aria-hidden="true" />
              )}
            </button>
          </li>

          {/* <!-- Profile menu --> */}
          <li className="relative">
            <button
              className="rounded-full focus:shadow-outline-purple focus:outline-none"
              onClick={handleProfileClick}
              aria-label="Account"
              aria-haspopup="true"
            >
              <Avatar
                className="align-middle"
                src="https://images.unsplash.com/photo-1502378735452-bc7d86632805?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&s=aa3a807e1bbdfd4364d1f449eaa96d82"
                alt=""
                aria-hidden="true"
              />
            </button>
            <Dropdown
              align="right"
              isOpen={isProfileMenuOpen}
              onClose={() => setIsProfileMenuOpen(false)}
            >
              <DropdownItem onClick={logout}>
                <OutlineLogoutIcon
                  className="w-4 h-4 mr-3"
                  aria-hidden="true"
                />
                <span>Log out</span>
              </DropdownItem>
            </Dropdown>
          </li>
        </ul>
      </div>
    </header>
  );
}

export default Header;
