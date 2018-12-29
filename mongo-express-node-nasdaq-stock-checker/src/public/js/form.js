function urlCreatorDel() {
  const updateStock = document.getElementById('deleteStockSymbol').value;

  const action_src = `/api/stocks/delete/${updateStock}?_method=DELETE`;
  const url_form = document.getElementById('deleteStockForm');
  url_form.action = action_src;
}
