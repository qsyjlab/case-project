
/**
 *
 * @param {String} el
 * @returns
 */
 function queryElSelector(el) {
    return document.querySelector(el);
  }
  
  /**
   *
   * @param {String} el
   * @returns
   */
  function queryElId(el) {
    return document.getElementById(el);
  }
  
  /**
   *  批量设置属性值
   * @param {*} el
   * @param {*} attributes
   */
  function setAttributes(el, attributes = {}) {
    Object.entries(attributes).forEach(([key, value]) => {
      el.setAttribute(key, value);
    });
  }
  