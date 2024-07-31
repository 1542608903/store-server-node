class UtilsClass {
  // 深度克隆函数
  deepClone(obj) {
    if (obj == null || typeof obj !== "object") {
      return obj;
    }
    if (Array.isArray(obj)) {
      const arrCopy = [];
      for (const item of obj) {
        arrCopy.push(this.deepClone(item));
      }
      return arrCopy;
    }

    const objCopy = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        objCopy[key] = this.deepClone(obj[key]);
      }
    }

    return objCopy;
  }

  // 生成订单号函数
  getOrderNumber(number = 16) {
    let orderNumber = "";
    for (let i = 0; i < number; i++) {
      orderNumber += Math.floor(Math.random() * 10);
    }
    return orderNumber;
  }

  /**
   * 计算总价函数
   * @param {number} price - 必填
   * @param {number} num - 选填，默认值为 1
   * @returns {number} total - 总价
   *
   *使用示例
   *    const price = 100;
   *    const total = utils.countTotal(price, 2);
   *    console.log(total); //输出 200
   */
  countTotal(price, num = 1) {
    if (typeof price !== "number" || typeof num !== "number") {
      throw new TypeError("Both price and num should be numbers");
    }
    return price * num;
  }
}

module.exports = new UtilsClass();
