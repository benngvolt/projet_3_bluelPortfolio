
const loginForm = document.querySelector(".loginForm");

const emailField = document.querySelector(".emailField");
loginForm.appendChild(emailField);

const passwordField = document.querySelector(".passwordField");
loginForm.appendChild(passwordField);

const submitButton = document.querySelector(".submitButton");
loginForm.appendChild(submitButton);

submitButton.addEventListener ("click", async function(event){ 
    event.preventDefault();
    let email = emailField.value;
    let password = passwordField.value;
    fetch('http://localhost:5678/api/users/login',{
        method:"POST", 
        body: JSON.stringify({"email":email, "password":password}),
        headers: {'Content-Type':'application/json'}
        })
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
