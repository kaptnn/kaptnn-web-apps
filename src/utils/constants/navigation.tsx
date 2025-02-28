import {
  CalculatorOutlined,
  LayoutOutlined,
  PieChartOutlined,
} from "@ant-design/icons";
import { MenuProps } from "antd";

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

export const menuItems: MenuItem[] = [
  getItem("Dashboard", "/dashboard", <LayoutOutlined />),
  getItem("Docs", "/document", <PieChartOutlined />, [
    getItem("All Docs", "/dashboard/document"),
    getItem("Category", "/dashboard/document/category"),
  ]),
  getItem("Calculator", "/dashboard/calculator", <CalculatorOutlined />, [
    getItem("Depreciation", "/dashboard/calculator/depreciation"),
    getItem("Present Value", "/dashboard/calculator/present-value"),
    getItem("Weighted Average", "/dashboard/calculator/weighted-average"),
  ]),
];

export const getDefaultOpenKeys = (pathname: string): string[] => {
  return menuItems
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
