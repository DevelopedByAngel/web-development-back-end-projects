//Function to Hide Popup
const popHide = () => {
    document.getElementById('pop-window').style.display = "none";
}

// --------------------------------------------------------------------------------------
// Function to process the BulkUpload
const uploadOptions = () => {

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
    let addOptionButton = document.getElementById(currentIdEdit).getElementsByClassName("add-options")[1]
    // let optionInput = document.getElementById(currentIdEdit).getElementsByClassName("f-input-group")

    // create events to trigger formeo events.
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
    // close pop-up
    popHide()
}

// --------------------------------------------------------------------------------------
