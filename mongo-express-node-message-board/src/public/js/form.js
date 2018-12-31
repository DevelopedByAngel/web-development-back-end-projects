function urlCreatorGet() {
  const updateId = document.getElementById('getId').value;
  const action_src = `/api/threads/${updateId}`;
  const url_form = document.getElementById('getThreadForm');
  url_form.action = action_src;
}

function urlCreatorPut() {
  const updateId = document.getElementById('updateId').value;
  const action_src = `/api/threads/${updateId}?_method=PUT`;
  const url_form = document.getElementById('reportThreadForm');
  url_form.action = action_src;
}

function urlCreatorDel() {
  const updateId = document.getElementById('deleteId').value;

  const action_src = `/api/threads/${updateId}?_method=DELETE`;
  const url_form = document.getElementById('deleteThreadForm');
  url_form.action = action_src;
}
