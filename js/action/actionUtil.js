
export default function handleData(type, dispatch, data, storeName, pageSize) {
  console.log('actionUtils: ' + 'data & storeName passed to reducer when success: '+data.data.items + storeName);
  let fixItems = []; // all load items

  if (data && Array.isArray(data.data)) {
    fixItems = data.data;
  } else if(data && data.data && Array.isArray(data.data.items)) {
    fixItems = data.data.items;
  }
  dispatch({
    type: type,
    items: fixItems,
    projectModes: fixItems.length > pageSize? fixItems.slice(0, pageSize): fixItems,
    storeName: storeName,
    pageIndex: 1,
  })
}
