export const generateRandomSmallString = () =>
  Math.round(Date.now() + Math.random() * 100).toString(36);
