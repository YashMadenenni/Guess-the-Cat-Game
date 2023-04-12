//Load the cats info onload
//window.onload = getCats(10);

var chosenCat = {};
var selectedCats = []; // store selected random cats
var catsTemperment = [];
var catsTempermentObject = [];
let showedHints = [];

let WIN = 0;
let LOST = 0;
let qAsked = 0;
let guesses = 0;
var score5 = localStorage.getItem("game5");
var score10 = localStorage.getItem("game10");
var score15 = localStorage.getItem("game15");
var score20 = localStorage.getItem("game20");



/**Function 1 
 * Starts a new game with selected radio button(5,10,15,20)
 * 
 */
function getNoOfCats() {

    //disabling the New Game button to prevent double click
    (document.getElementById("newGame")).setAttribute("disabled", "disabled");

    //Setting the number of cats to display is empty at start
    document.getElementById("catsRow").innerHTML = " ";
    document.getElementById("selectCat").innerHTML = " ";
    document.getElementById("selectTemperment").innerHTML = " ";
    document.getElementById("message").innerHTML = " ";

    //resetting the values 
   var chosenCat = {};
    selectedCats = [];
    catsTemperment = [];
    catsTempermentObject = [];
    showedHints = [];
    WIN = 0;
    LOST = 0;
    guesses = 0;
    qAsked = 0;


    //Reset the disabled buttons and feilds 
    if (((document.getElementById("selectTemperment")).hasAttribute("disabled")) ||
        ((document.getElementById("selectCat")).hasAttribute("disabled"))) {
        (document.getElementById("selectTemperment")).removeAttribute("disabled");
        (document.getElementById("selectCat")).removeAttribute("disabled");
    }

    //invokes api request with selected No. Of Breeds
    if (document.getElementById("game5").checked) {
        getCats(5);
    } else if (document.getElementById("game10").checked) {
        getCats(10);
    } else if (document.getElementById("game15").checked) {
        getCats(15);
    } else if (document.getElementById("game20").checked) {
        getCats(20);
    }

}


/**Function 2
 * Funtion to send an APi request, select cats from response and display cats for game.
 * @param {Number} noOfCats  - stores No. of Cats in Game.
 */
async function getCats(noOfCats) {

    //Fetch request for API
    const request = await fetch('https://api.thecatapi.com/v1/breeds', { method: "GET" });
    var responseBody = await request.json();

    //While loop until the selected cats are equal to No. of breeds selected
    while (selectedCats.length < noOfCats) {

        var selectedIndex = Math.floor(Math.random() * (responseBody.length));

        if (selectedCats.indexOf(responseBody[selectedIndex]) == -1) {

            //try catch as there are few cats not having images
            try {
                var URL = await getImage(responseBody[selectedIndex].id)
                selectedCats.push(responseBody[selectedIndex]);
                let index = selectedCats.indexOf(responseBody[selectedIndex]);
                selectedCats[index].image = URL;

                let tempermentArray = (selectedCats[index].temperament).split(",");
                // console.log(tempermentArray);

                tempermentArray.forEach(element => {
                    if (catsTemperment.indexOf(element.trim()) == -1) {
                        catsTemperment.push(element.trim())
                    }
                });
                //console.log(catsTemperment);             

            } catch (error) {

            }
        }

    }

    //console.log(selectedCats)

    //Append cats info to catsRow 
    selectedCats.forEach(element => {
        var name = (element.name).split(" ").join("")
        document.getElementById("catsRow").innerHTML = document.getElementById("catsRow").innerHTML + 
            '<div class=" col-xs-3 col-sm-5 col-md-3 col-lg-3 mb-3 mt-3">' +
            '<div class="card text-center bg-light"  style="height:400px" id = ' + element.id + '>' +
            '<img class="card-img-top"  src=" ' + element.image + ' " alt =' + name + '  style="height:200px; width:;">' +
            '<div class="card-body"  style="height:">' +
            '<p>' + element.temperament + '</p>' +
            '<p class="messages" id="' + name + '-message" ></p>' +
            '</div>' +
            '<div class="card-footer">' +
            '<h6>' + element.name + '</h6>' +
            '</div>' +
            '</div>' +
            '</div>';

        element.blurred = false;

        document.getElementById("selectCat").innerHTML = document.getElementById("selectCat").innerHTML + '<option id=' + name + ' value=' + name + ' >' + element.name + '</option>';
    });

    //Append temperment options 
    catsTemperment.forEach(element => {
        
        document.getElementById("selectTemperment").innerHTML = document.getElementById("selectTemperment").innerHTML + '<option id=' + element + ' value=' + element + ' >' + element + '</option>';
    })

    selectChosenCat(); 

    (document.getElementById("newGame")).removeAttribute("disabled"); // Enable New Game Button
}


/**Function 3
 * Function to select random cat as chosen cat
 */
function selectChosenCat() {
    chosenCat = selectedCats[Math.floor(Math.random() * (selectedCats.length))]
   // console.log(chosenCat);
}

/**Function 4
 * Function to fetch images from API
 * @param {number} imageId 
 * @returns image url
 */
//Function to get Images
async function getImage(imageId) {
    var imgRequest = await fetch(`https://api.thecatapi.com/v1/images/search?breed_ids=${imageId}`, { method: "GET" });
    var imageResponseBody = await imgRequest.json();

    return imageResponseBody[0].url;

}

/**Function 5
 * Function to verify questions asked for temperment.
 */
function checkTemperment() {
    let userChosenTemperment = document.getElementById("selectTemperment").value;

    //condition to check if the game is over or if the payer quit 
    if (!((document.getElementById("selectTemperment")).hasAttribute("disabled"))) {
        qAsked++// increment Questions Asked

        //conditon to diable the temperment option
        if (!(document.getElementById(userChosenTemperment)).hasAttribute("disabled")) {
            (document.getElementById(userChosenTemperment)).setAttribute("disabled", "disabled");
        }

        let chosenTempermentArray = (chosenCat.temperament).split(", ");
        

        if (chosenTempermentArray.includes(userChosenTemperment)) {

            window.alert('Yes the cat is "' + userChosenTemperment + '"');
            selectedCats.forEach(element => {
                if (!(element.temperament).includes(userChosenTemperment)) {
                    if (!(document.getElementById(element.id).classList.contains("opacity"))) {
                        document.getElementById(element.id).classList.add("opacity");
                        element.blurred = true;
                    }
                }
            })
        }
        else {
            window.alert('No the cat is not "' + userChosenTemperment + '"');
            selectedCats.forEach(element => {
                if ((element.temperament).includes(userChosenTemperment)) {
                    if (!(document.getElementById(element.id).classList.contains("opacity"))) {
                        document.getElementById(element.id).classList.add("opacity");
                        element.blurred = true;
                    }
                }
            });

        }

    } else {
        window.alert("Game over");
    }

}


/**Function 6
 * Function to find the solution for hint
 */
function giveHint() {

    let newCatsTemperment = [];
    var catsTempermentObject = [];

    //condition to check if the game is over or if the payer quit
    if (!((document.getElementById("selectTemperment")).hasAttribute("disabled"))) {

        //finding the number of repetition for each temperment and storing them
        selectedCats.forEach(elementSelectedCat => {
            if (!elementSelectedCat.blurred) {

                let tempermentArray = (elementSelectedCat.temperament).split(",");
                // console.log(tempermentArray);

                tempermentArray.forEach(element => {
                    if (newCatsTemperment.indexOf(element.trim()) == -1) {
                        newCatsTemperment.push(element.trim());

                        let elementObject = {}; //create an object with vaule for repetition as 1
                        elementObject.name = element;
                        elementObject.value = 1;

                        catsTempermentObject.push(elementObject); //store the objects in new array
                    } else {                                                        
                        catsTempermentObject.forEach(catElementObject => {          // increment the value if object is present 
                            if (catElementObject.name == element) { 
                                catElementObject.value++
                                //console.log(catElementObject.value);
                            }
                        })
                    }
                });
            }
        });

        //sort the array of object based on value of repetition
        catsTempermentObject.sort((element1, element2) => {
            return element1.value - element2.value;
        });

        let valuesArray = [];

        //creating array for values only 
        catsTempermentObject.forEach(element => {
            if (valuesArray.indexOf(element.value) == -1) {
                valuesArray.push(element.value);
            }
        });

        //finding the middle value as its the middle value so the difference is zero
        let requiredElementValue = valuesArray[Math.floor(valuesArray.length / 2)];

        let hints = [];
        //creating new array to store all posible hints with that value 

        catsTempermentObject.forEach(element => {
            if (element.value == requiredElementValue) {
                hints.push(element.name);
            }
        });

        let showHint = ''; // stores the value to be displayed 

        //checking for non repetition of hints
        hints.forEach(element => {
            if (showedHints.indexOf(element) == -1) {
                showHint = element;
            }

        });
        //display hint
        if (showHint.length > 0) {
            window.alert(" Ask if Cat is " + showHint);
        } else {
            window.alert(" Ask if Cat is " + (chosenCat.temperament).split(", ")[0]);
        }
        showedHints.push(showHint); // add the displayed hint to showed hints array

    } else {
        window.alert("Game Over!")
    }
}


/**Function 7
 * Function to verify the user selceted cat and computer chosen cat
 */
function checkCat() {
    let chosenCatName = (chosenCat.name).split(" ").join("");
    const chosenElement = document.getElementById(chosenCat.id);

    if (!((document.getElementById("selectCat")).hasAttribute("disabled"))) {

        guesses++; // increment Guesses

        if (document.getElementById("selectCat").value == (chosenCatName)) {


            let messageElement = document.getElementById(chosenCatName + '-message');
            messageElement.innerHTML = '<h6 > Win! Guess ' + guesses + ' Helps ' + qAsked + '</h6>';
            //console.log(messageElement);
            chosenElement.scrollIntoView();
            chosenElement.classList.add("green");
            chosenElement.classList.remove("bg-light");

            selectedCats.forEach(element => {
                if (element.id != chosenCat.id) {
                    document.getElementById(element.id).classList.add("opacity");

                }
            });

            WIN++;

            //console.log(selectedCats.length) ;

            //Calling the best score function to update
            updateBestScore();

            (document.getElementById("selectCat")).setAttribute("disabled", "disabled");
            (document.getElementById("selectTemperment")).setAttribute("disabled", "disabled");

            
        }
        else {

            let userChosenCat = document.getElementById("selectCat").value;
            let userChosenCatName = document.getElementById(userChosenCat).innerHTML;
            (document.getElementById(userChosenCat)).setAttribute("disabled", "disabled");
            selectedCats.forEach(element => {
                if (element.name == userChosenCatName) {
                    (document.getElementById(element.id)).classList.remove("bg-light");
                    (document.getElementById(element.id)).classList.add("red");
                    (document.getElementById(element.id)).scrollIntoView();
                }
            })
            
            LOST++;
        }

    }
    else {
        window.alert("Game over")
    }

}

/**Function 8
 * Function to quit game 
 */
function quit() {
    window.alert("Play again soon");
    WIN = 0;
    LOST = 0;
    (document.getElementById("selectCat")).setAttribute("disabled", "disabled");
    (document.getElementById("selectTemperment")).setAttribute("disabled", "disabled");
    document.getElementById("message").innerHTML = '<h6 > Guess ' + guesses + ' Helps ' + qAsked + '</h6>';

}

/**Function 9
 * Function to update best score
 */
function updateBestScore() {
    switch (selectedCats.length) {

        case 5:
            if ((parseInt(document.getElementById("score5").innerHTML) > guesses) || (parseInt(document.getElementById("score5").innerHTML) == 0)) {
                score5 = guesses;
                document.getElementById("score5").innerHTML = score5;
            }
            //console.log(typeof (document.getElementById("score5").innerHTML))
            break;
        case 10:
            if ((parseInt(document.getElementById("score10").innerHTML) > guesses) || (parseInt(document.getElementById("score10").innerHTML) == 0)) {
                score10 = guesses;
                document.getElementById("score10").innerHTML = score10;
            }
            break;
        case 15:
            if (parseInt(document.getElementById("score15").innerHTML) > guesses || (parseInt(document.getElementById("score15").innerHTML) == 0)) {
                score15 = guesses;
                document.getElementById("score15").innerHTML = score15;
            }
            break;
        case 20:
            if (parseInt((document.getElementById("score20").innerHTML) > guesses) || (parseInt(document.getElementById("score20").innerHTML) == 0)) {
                score20 = guesses;
                document.getElementById("score20").innerHTML = score20;
            }
            break;

        default:
            break;
    }
    //Setting local storage variables and values 
    localStorage.setItem("game5", score5);
    localStorage.setItem("game10", score10);
    localStorage.setItem("game15", score15);
    localStorage.setItem("game20", score20);
}

/** Function 10
 * Function to display Best Score 
 */
window.onload = function displayBestScore() {
    document.getElementById("score5").innerHTML = score5;
    document.getElementById("score10").innerHTML = score10;
    document.getElementById("score15").innerHTML = score15;
    document.getElementById("score20").innerHTML = score20;
}
