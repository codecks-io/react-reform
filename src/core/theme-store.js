const themes = {};

export function registerTheme(name, theme) {
  themes[name] = theme;
}

export function getTheme(name) {
  return themes[name];
}
