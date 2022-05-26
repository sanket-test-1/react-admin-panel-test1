import { Home } from "react-feather";
export const menuitems = [
  {
    title: "Dashboard",
    icon: "home",
    type: "link",
    path: "/Dashboard",
    badgeType: "primary",
    active: false
  },
  {
    title: "User",
    icon: "home",
    type: "link",
    path: "/user",
    badgeType: "primary",
    active: true,
    modelName: "user",
    displayModelName: "user",
    alwaysShow: false
  }
];
