import {
  CalculatorOutlined,
  LayoutOutlined,
  LogoutOutlined,
  PieChartOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { MenuProps } from "antd";
import useAuthStore from "@/stores/AuthStore";
import { AuthApi } from "../axios/api-service";

type MenuItem = Required<MenuProps>["items"][number] & {
  children?: MenuItem[];
};

const getItem = (
  label: React.ReactNode,
  key: string,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem => {
  return {
    key,
    icon,
    children,
    label,
  };
};

export const adminMenuItems: MenuItem[] = [
  getItem("Dashboard", "/dashboard", <LayoutOutlined />),
  getItem("Docs", "/document", <PieChartOutlined />, [
    getItem("All Docs", "/dashboard/document"),
    getItem("All Users", "/dashboard/document/users"),
    getItem("Company", "/dashboard/document/company"),
    getItem("Category", "/dashboard/document/category"),
  ]),
  getItem("Calculator", "/dashboard/calculator", <CalculatorOutlined />, [
    getItem("Depreciation", "/dashboard/calculator/depreciation"),
    getItem("Present Value", "/dashboard/calculator/present-value"),
    getItem("Weighted Average", "/dashboard/calculator/weighted-average"),
  ]),
];

export const clientMenuItems: MenuItem[] = [
  getItem("Dashboard", "/dashboard", <LayoutOutlined />),
  getItem("Docs", "/document", <PieChartOutlined />, [
    getItem("All Docs", "/dashboard/document"),
    getItem("All Users", "/dashboard/document/users"),
  ]),
  getItem("Calculator", "/dashboard/calculator", <CalculatorOutlined />, [
    getItem("Depreciation", "/dashboard/calculator/depreciation"),
    getItem("Present Value", "/dashboard/calculator/present-value"),
    getItem("Weighted Average", "/dashboard/calculator/weighted-average"),
  ]),
];

export const getMenuItemsByRole = (role: string): MenuItem[] => {
  if (role === "admin") {
    return adminMenuItems;
  } else if (role === "client") {
    return clientMenuItems;
  }
  return [];
};

export const getDefaultOpenKeys = (
  pathname: string,
  items: MenuItem[]
): string[] => {
  return items
    .filter((item): item is MenuItem => !!item && "children" in item)
    .filter((item) =>
      item.children?.some(
        (child) =>
          typeof child.key === "string" && pathname.startsWith(child.key)
      )
    )
    .map((item) => (typeof item.key === "string" ? item.key : ""))
    .filter((key) => key !== "");
};

function deleteCookie(name: string, path = "/") {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path};`;
}

function clearCookies() {
  deleteCookie("access_token");
  deleteCookie("refresh_token");
}

export const accountProfileItems: MenuProps["items"] = [
  {
    key: "1",
    label: "My Account",
    disabled: true,
  },
  {
    type: "divider",
  },
  {
    key: "2",
    label: "Profile Settings",
    icon: <SettingOutlined />,
    onClick: async () => {
      try {
        const token = useAuthStore.getState().accessToken;
        if (!token) {
          window.location.assign("/login");
          return;
        }

        window.location.assign("/dashboard/user/profile");
      } catch (error: unknown) {
        console.error("Go to Profile Setting Error:", error);
      }
    },
  },
  {
    key: "3",
    label: "Log Out",
    icon: <LogoutOutlined />,
    danger: true,
    onClick: async () => {
      try {
        const token = useAuthStore.getState().accessToken;
        if (!token) {
          window.location.assign("/login");
          return;
        }

        await AuthApi.logoutUser(token);
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        sessionStorage.removeItem("auth-storage");
        clearCookies();
        useAuthStore.getState().setAuth("", "");
        useAuthStore.getState().setUserInfo(null);
        window.location.assign("/login");
      } catch (error: unknown) {
        console.error("Logout Error:", error);
      }
    },
  },
];
