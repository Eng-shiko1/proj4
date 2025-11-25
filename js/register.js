let first_name = document.querySelector("#first_name")
let last_name = document.querySelector("#last_name")
let email = document.querySelector("#email")
let password = document.querySelector("#password")

let register_btn = document.querySelector("#sign_up")

register_btn.addEventListener ("click" , function (e){
    e.preventDefault()
    if (first_name.value==="" || last_name.value==="" || email.value==="" || password.value ===""){
        alert("Enter the data")
    } else {
        localStorage.setItem("first_name" , first_name.value);
        localStorage.setItem("last_name" , last_name.value);
        localStorage.setItem("email" , email.value);
        localStorage.setItem("password" , password.value); 

        setTimeout ( () => {
            window.location = "login.html"
        } , 1000)
    }
})

