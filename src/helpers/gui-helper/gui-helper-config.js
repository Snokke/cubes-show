const GUIFolders = {
  'Helpers': 'Helpers',
  'Camera': 'Camera',
  'Lights': 'Lights',
  'Cubes': 'Cubes',
};

const GUIFoldersVisibility = {
  [GUIFolders.Helpers]: true,
  [GUIFolders.Camera]: true,
  [GUIFolders.Lights]: true,
  [GUIFolders.Cubes]: true,
};

const GUIHelpersStartState = {
  'Enable all helpers': false,
  'Physics debugger': false,
  'Directional light': true,
  'Shadow camera': true,
  'Axes': true,
};

const GUIConfig = {
  openAtStart: true,
}

export { GUIFolders, GUIFoldersVisibility, GUIHelpersStartState, GUIConfig };
