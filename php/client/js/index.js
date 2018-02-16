$(function(){
  var l = new Login();
});


class Login {
  constructor() {
    this.submitEvent();
  }

  submitEvent(){
    $('form').submit((event) => {
      event.preventDefault();
      this.sendForm();
    });
  }

  sendForm(){
    let form_data = new FormData();
    form_data.append('username', $('#user').val());
    form_data.append('password', $('#password').val());
    $.ajax({
      url: '../server/login.php',
      dataType: "json",
      cache: false,
      processData: false,
      contentType: false,
      data: form_data,
      type: 'POST',
      success: (data) => {
        if (data.message == "OK") {
          window.location.href = 'main.html';
        } else {
          alert(data.description);
        }
      },
      error: (data) => {
        alert("Error en la comunicación con el servidor");
        console.log(data);
      }
    });
  }
}
