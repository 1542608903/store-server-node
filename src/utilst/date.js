const getTimestamp = (time) => {
  const timestamp = new Date(time.replace(/-/g, "/")).getTime(); // 兼容 iOS
  return timestamp;
};

module.exports = { getTimestamp };
