import { Menu } from "antd";

// 개발 중 경고 숨기기 (임시 방법, 권장하지 않음)
const consoleError = console.error;
console.error = (...args) => {
  if (args[0].includes("findDOMNode is deprecated")) {
    return;
  }
  consoleError(...args);
};

export default function Main() {
  return (
    <Menu mode="horizontal" defaultSelectedKeys={["mail"]}>
      <Menu.Item key="mail">Navigation One</Menu.Item>
      <Menu.SubMenu key="SubMenu" title="Navigation Two - Submenu">
        <Menu.Item key="two">Navigation Two</Menu.Item>
        <Menu.Item key="three">Navigation Three</Menu.Item>
        <Menu.ItemGroup title="Item Group">
          <Menu.Item key="four">Navigation Four</Menu.Item>
          <Menu.Item key="five">Navigation Five</Menu.Item>
        </Menu.ItemGroup>
      </Menu.SubMenu>
    </Menu>
  );
}
