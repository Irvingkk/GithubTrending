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
    arr1.forEach((item, i) =>{
      result = this.isEqualObject(item, arr2[i]) && result;
    })
    return result;
  }

  /**
   * add item if it's not in arr; remove item if it's in arr.
   * @param arr
   * @param item
   */
  static updateArray(arr, item){
    arr.forEach((elem, index)=>{
      if (this.isEqualObject(elem, item)){
        arr.slice(index, 1);
        return;
      }
    })
    arr.push(item);
  }

  /**
   * remove the specified item from arr based on 'item', or item property id 'id'
   * @param arr
   * @param item
   * @param id a string to access property of arr
   */
  static remove(arr, item, id) {
    let i = arr.length - 1;
    for(; i>= 0; i--){
      if(arr[i][id]) {
        arr[i][id] === item[id] && arr.splice(i, 1);
      } else {
        arr[i] === item && arr.splice(i, 1);
      }
    }
  }
}















