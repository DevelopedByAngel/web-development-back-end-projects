//Function to Hide Popup
const popHide = () => {
    document.getElementById('pop-window').style.display = "none";
}

// --------------------------------------------------------------------------------------
// Function to process the BulkUpload save and upload
const uploadOptions = (save) => {

    // get value of text typed for options 
    let insertedOptions = document.getElementById("pop-textarea").value

    // if nothing is inserted
    if (insertedOptions === "") {
        console.log('no options provided')
        alert("No options provided")
        return
    }

    // convert string into array based on splits label. 
    let optionList = insertedOptions.split("\n")

    // get the add option button
    let addOptionButton = document.getElementById(currentIdEdit).getElementsByClassName("add-options")[0]
    // let optionInput = document.getElementById(currentIdEdit).getElementsByClassName("f-input-group")

    // create events to trigger formeo events
    let changeEvent = new Event('change');
    let clickEvent = new Event('click');

    for (let i = 0; i < optionList.length; i++) {
        // create new option
        addOptionButton.dispatchEvent(clickEvent)
        // get the option input entry list 
        let optionInput = document.getElementById(currentIdEdit).getElementsByClassName("f-input-group")

        // get the last opion input 
        let lastOption = optionInput[optionInput.length - 1].childNodes
        // insert Label
        lastOption[0].value = optionList[i]
        // Dispatch change event
        lastOption[0].dispatchEvent(changeEvent);

        // insert Value
        lastOption[1].value = optionList[i].toLowerCase().split(' ').join('-');
        // Dispatch change event
        lastOption[1].dispatchEvent(changeEvent);
    }

    // if user want to save options save to database using fetch
    if (save === "save") {
        console.log('saving');

        let optionName = document.getElementById("options-name").value

        // upload using fetch
        var url = '/formprocessor/saveoptions/';
        var data = new FormData();
        data.append('options_name', optionName)
        data.append('options_data', optionList)

        // var data = "form_data=" + formeo.formData

        function getCookie(name) {
            var cookieValue = null;
            if (document.cookie && document.cookie !== '') {
                var cookies = document.cookie.split(';');
                for (var i = 0; i < cookies.length; i++) {
                    var cookie = jQuery.trim(cookies[i]);
                    // Does this cookie string begin with the name we want?
                    if (cookie.substring(0, name.length + 1) === (name + '=')) {
                        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                        break;
                    }
                }
            }
            return cookieValue;
        }

        fetch(url, {
            method: 'POST',
            credentials: "same-origin",
            headers: {
                "X-CSRFToken": getCookie("csrftoken"),
            },
            body: data
        }).catch(
            console.error
        )
    }
    // close pop-up
    popHide()

    // clear input text area
    document.getElementById("pop-textarea").value = ""
    document.getElementById("options-name").value = ""
}

// --------------------------------------------------------
// Function for BulkSave

const saveOptions = () => {
    let optionName = document.getElementById("options-name").value
    // if no option name provided
    if (!optionName.match(/[a-z]|[0-9]/i)) {
        alert('Provide option name')
        return
    }

    uploadOptions("save")
}

// --------------------------------------------------------------------------------------
// Function fohttps://stackoverflow.com/questions/16790375/django-object-is-not-json-serializabler loading saved options in database 

let options

const loadOptions = () => {

    fetch('/formprocessor/requestoptions')
        .then(function (response) {

            return response.json();
        })
        .then(function (myJson) {

            // convert string to list. 
            options = JSON.parse(myJson.mystring);

            let table = document.getElementById("table-options")

            // remove child nodes to refresh table
            while (table.firstChild) {
                table.removeChild(table.firstChild);
            }


            for (let i = 0; i < options.length; i++) {
                let row = table.insertRow(i);

                let cell1 = row.insertCell(0);
                let cell2 = row.insertCell(1);
                let cell3 = row.insertCell(2);
                cell3.id = "options-" + i

                let buttonElement = document.createElement('button');
                buttonElement.innerHTML = "Load"
                buttonElement.addEventListener('click', () => { pasteOptions(i) })

                cell1.innerHTML = i
                cell2.innerHTML = options[i].fields.options_name

                document.getElementById("options-" + i).appendChild(buttonElement)

                // display load window


                document.getElementById('pop-load-options').style.display = "block"

            }
        });
}


// --------------------------------------------------------------------------------------
// Load saved options fields to textbox 
const pasteOptions = (num) => {
    // get options list
    let optionLoad = options[num].fields.options_data
    // replace , with breaks
    optionLoad = optionLoad.replace(/,/g, "\n")

    // append to the textbox
    document.getElementById("pop-textarea").value = optionLoad



    document.getElementById('pop-load-options').style.display = "none"


}
// --------------------------------------------------------------------------------------
// Cancel Bulk upload

const optionsCancel = () => {
    document.getElementById('pop-load-options').style.display = "none"
}



// --------------------------------------------------------------------------------------
// Add event listeners to buttons
document.getElementById("load-options").addEventListener("click", loadOptions)
document.getElementById("bulk-update").addEventListener("click", uploadOptions)
document.getElementById("bulk-save").addEventListener("click", saveOptions)
document.getElementById("bulk-cancel").addEventListener("click", popHide)
document.getElementById("options-cancel").addEventListener("click", optionsCancel)
