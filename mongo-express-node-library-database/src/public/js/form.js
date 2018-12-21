function urlCreatorGet() {
    const updateId = document.getElementById('getId').value;
    const action_src =
        `/api/issues/${updateId}`;
    const url_form = document.getElementById('getIssueForm');
    url_form.action = action_src;

}

function urlCreatorPut() {
    const updateId = document.getElementById('updateId').value;
    const action_src =
        `/api/issues/${updateId}?_method=PUT`;
    const url_form = document.getElementById('updateIssueForm');
    url_form.action = action_src;
}

function urlCreatorDel() {
    const updateId = document.getElementById('deleteId').value;

    const action_src =
        `/api/issues/${updateId}?_method=DELETE`;
    const url_form = document.getElementById('deleteIssueForm');
    url_form.action = action_src;

}
