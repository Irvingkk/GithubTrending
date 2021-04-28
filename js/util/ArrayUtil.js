export default class ArrayUtil{
  /**
   * simple object equality check.
   * @param obj1
   * @param obj2
   * @returns {boolean}
   */
  static isEqualObject (obj1, obj2) {
    if (!(obj1 && obj2)) return false;
    if (obj1.length !== obj2.length) return false;
    for (let key in obj1) {
      if (obj1[key] !== obj2[key]) return false
    }
    return true;
  }

  /**
   * check equality of two array of objects
   * @param arr1
   * @param arr2
   * @returns {boolean}
   */
  static isEqual(arr1, arr2) {
    if (!(arr1 && arr2)) return false;
    if (arr1.length !== arr2.length) return false;
    let result = true;
    debugger
    arr1.forEach((item, i) =>{
      result = this.isEqualObject(item, arr2[i]) && result;
    })
    debugger
    return result;
  }
}
