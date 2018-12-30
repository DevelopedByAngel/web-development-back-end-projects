function urlCreatorDel() {
  const updateStock = document.getElementById('deleteStockSymbol').value;

  const actionSrc = `/api/stocks/delete/${updateStock}?_method=DELETE`;
  const urlForm = document.getElementById('deleteStockForm');
  urlForm.action = actionSrc;
}
