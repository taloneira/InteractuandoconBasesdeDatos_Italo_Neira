/**
 ** @author Daniel Marcano <danielmarcanodev@gmail.com>
 **/

$(function(){
  $('#loginForm').submit((event) => {
    event.preventDefault();
    if (validateForm()) {
      sendForm();
    }
  });
});

  function sendForm() {
    $.post('/login/',{user: $('#user').val(), pass: $('#pass').val()}, function(response) {
      if (response.message == "OK") {
        window.location.href = 'main.html';
      } else {
        alert(response.description);
      }
    });
  }

  function validateForm() {
    if ($('#user').val() != '' && $('#pass').val() != '') {
      return true;
    } else {
      return false;
    }
  }
