function urlCreatorGet() {
    const updateId = document.getElementById('getId').value;
    const action_src =
        `/api/books/${updateId}`;
    const url_form = document.getElementById('getBookForm');
    url_form.action = action_src;

}

function urlCreatorPut() {
    const updateId = document.getElementById('updateId').value;
    const action_src =
        `/api/books/${updateId}?_method=PUT`;
    const url_form = document.getElementById('commentBookForm');
    url_form.action = action_src;
}

function urlCreatorDel() {
    const updateId = document.getElementById('deleteId').value;

    const action_src =
        `/api/books/${updateId}?_method=DELETE`;
    const url_form = document.getElementById('deleteBookForm');
    url_form.action = action_src;

}
