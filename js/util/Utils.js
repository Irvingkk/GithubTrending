export default class Utils {
  static checkFavorite(item, keys) {
    if (!keys) return false;
    const id = item.fullName? item.fullName: item.id.toString();
    return keys.includes(id);
  }
}
