/**
 * 将时间字符串转换为秒数
 * @param {string|number} time - 时间字符串或数字
 * @returns {number} - 返回时间的秒数
 */
const convertToSeconds = (time) => {
    if (typeof time === 'number') {
      return time;
    }
  
    const unit = time.slice(-1);
    const amount = parseInt(time.slice(0, -1));
  
    switch (unit) {
      case 'm': // 分钟
        return amount * 60;
      case 'h': // 小时
        return amount * 60 * 60;
      case 'd': // 天
        return amount * 24 * 60 * 60;
      default:
        throw new Error('不支持的时间单位');
    }
  };
  
  module.exports = {convertToSeconds};
  