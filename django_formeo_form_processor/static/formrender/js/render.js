let renderContainer = document.querySelector('#formeo-editor');
let goHomeBtn = document.getElementById('goHomeBtn');

let formeoOpts = {};

const formeo = new window.Formeo(formeoOpts, savedTemplate);

window.setTimeout(function () {
    formeo.render(renderContainer);
}, 500);

goHomeBtn.onclick = function () {
    window.sessionStorage.removeItem('formData');
    window.location = "/";
};
