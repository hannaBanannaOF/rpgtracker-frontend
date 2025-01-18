type Menu = {
  label: string;
  iconLib: string;
  iconName: string; 
  menuLink: string;
}

type UserPermissions = {
  screen: string;
  permission: string[];
}

type UserInfo = {
  sideMenu: { menu: Menu[] };
  permissions: UserPermissions[];
}