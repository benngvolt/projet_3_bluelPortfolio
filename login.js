
const loginForm = document.querySelector(".loginForm");

const emailField = document.querySelector(".emailField");
loginForm.appendChild(emailField);

const passwordField = document.querySelector(".passwordField");
loginForm.appendChild(passwordField);

const submitButton = document.querySelector(".submitButton");
loginForm.appendChild(submitButton);

submitButton.addEventListener ("click", function(){ 
    let email = emailField.value;
    let password = passwordField.value;
    const loginResponse = fetch('http://localhost:5678/api/users/login', {
        method:"POST", 
        body: JSON.stringify({"email":email, "password":password}),
        headers: {'Content-Type':'application/json'}
        })
    loginResponse
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            if(data.token) {
            console.log("autorisé");
            } else {(console.log("refusé"))
            }   
        })
        .catch((error) => console.error(error))
    })