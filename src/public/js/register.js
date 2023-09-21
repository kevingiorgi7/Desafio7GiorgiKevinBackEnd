// SESSIONS / REGISTER

const form = document.getElementById('registerForm')

form.addEventListener('submit',async(e)=>{
    e.preventDefault();
    const data = new FormData(form);
    const obj = {};
    data.forEach((value, key) => (obj[key] = value))
    const response = await fetch('/api/sessions/register',{
        method:'POST',
        body: JSON.stringify(obj),
        headers: {
            "Content-Type":"application/json"
        }
    })
    const responseData = await response.json()
    //console.log(responseData);
    if(responseData.status==="success"){
        //Redirijo al login (desde el front)
        window.location.replace('/api/views/login');
    } else {
        return responseData
    }

    //console.log(responseData);
})