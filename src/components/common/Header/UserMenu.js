import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { Lock, LogOut, User } from "react-feather";
import { withRouter } from "react-router";
import { TOKEN_KEY } from "../../../api/config";
import { STORAGE_KEY } from "../../../constant/common";
import { logoutService } from "../../../api/general";

const UserMenu = ({ history }) => {
  const logout = () => {
    logoutService();
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem("USER");
    localStorage.removeItem("USER_ID");
    localStorage.clear();
    history.push(`/login`);
  };

  const storageUserData = localStorage.getItem(STORAGE_KEY.USER);
  const userData = storageUserData ? JSON.parse(storageUserData) : {};
  return (
    <Fragment>
      <li className="onhover-dropdown mr-0 pull-right w-auto">
        <div className="media align-items-center justify-content-center">
          <User
            color="#000000"
            style={{
              marginTop: 0
            }}
          />
        </div>
        <ul className="profile-dropdown onhover-show-div p-20 profile-dropdown-hover">
          <li className="d-flex align-items-center profileInformationBlock">
            <div className="media align-items-center justify-content-center flex-shrink-0 mr-3">
              <User
                color="#000000"
                style={{
                  marginTop: 0
                }}
              />
            </div>
            <span className="profileInformation">
              {userData?.username || "@username"}
            </span>
            ;
          </li>
          <li>
            <Link to="/update-profile">
              <User />
              <span>Update Profile</span>
            </Link>
          </li>
          <li>
            <Link to="/change-password">
              <Lock />
              <span>Change Password</span>
            </Link>
          </li>
          <li>
            <a href="/login" onClick={logout}>
              <LogOut />
              <span>Log out</span>
            </a>
          </li>
        </ul>
      </li>
    </Fragment>
  );
};

export default withRouter(UserMenu);
