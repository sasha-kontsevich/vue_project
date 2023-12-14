export const formats = {
  a2: { width: 42, height: 59.4, title: "A2" },
  a3: { width: 29.7, height: 42, title: "A3" },
  a4: { width: 21, height: 29.7, title: "A4" },
  a5: { width: 14.8, height: 21, title: "A5" },
  a6: { width: 10.5, height: 14.8, title: "A6" },
  over9000: { width: 21, height: 210, title: "over9000" },
};

export const fontFamilies = {
  times: { value: "Times", title: "Times New Roman" },
  arial: { value: "Arial", title: "Arial" },
  segoeUi: { value: "'Segoe UI'", title: "Segoe UI" },
  georgia: { value: "Georgia", title: "Georgia" },
  calibri: { value: "Calibri", title: "Calibri" },
  // Roboto: { value: "Roboto", title: "Roboto" },
};

export const fontSizes = [
  8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72,
];

export const TAB_TEMPLATE_SETTINGS = 1;
export const TAB_NOT_COMPONETS = 2;
export const TAB_RULE_SETTINGS = 3;
export const TAB_USER_FORM = 4;
export const TABS = {
  TAB_TEMPLATE_SETTINGS,
  TAB_NOT_COMPONETS,
  TAB_RULE_SETTINGS,
  TAB_USER_FORM,
};
export const VIEW_EDITOR = 1;
export const VIEW_USER = 2;
