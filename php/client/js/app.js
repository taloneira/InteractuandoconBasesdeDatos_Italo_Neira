/* Beginning of EventsManager */

function hasNumbers(t) {
  var regex = /\d/g;
  return regex.test(t);
}

class EventsManager {

  poblarCalendario() {
    $('.calendario').fullCalendar({
      header: {
        left: 'prev,next today',
        center: 'title',
        right: 'month,agendaWeek,basicDay'
      },
      defaultDate: '2017-10-01',
      navLinks: true,
      editable: true,
      eventLimit: true,
      droppable: true,
      dragRevertDuration: 0,
      timeFormat: 'H:mm',
      eventDrop: (event) => {
        this.updateEvent(event);
      },
      eventResize: (event) => {
        this.updateEvent(event);
      },
      events: {
        url: "../server/get_events.php",
        dataType: "json",
        cache: false,
        processData: false,
        contentType: false,
        type: 'GET',
        success: (data) => {
          if (data.message == 'OK') {
            return data.events;
          } else {
            alert(data.description);
          }
        },
        error: function(data){
          console.log("Error trying to fetch all the events");
          console.log(data);
        }
      },
      eventDragStart: (event,jsEvent) => {
        $('.delete-btn').find('img').attr('src', "img/trash-open.png");
        $('.delete-btn').css('background-color', '#a70f19');
      },
      eventDragStop: (event,jsEvent) =>{
        var trashEl = $('.delete-btn');
        var ofs = trashEl.offset();
        var x1 = ofs.left;
        var x2 = ofs.left + trashEl.outerWidth(true);
        var y1 = ofs.top;
        var y2 = ofs.top + trashEl.outerHeight(true);
        if (jsEvent.pageX >= x1 && jsEvent.pageX<= x2 &&
          jsEvent.pageY >= y1 && jsEvent.pageY <= y2) {
            this.eliminarEvento(event, jsEvent);
            $('.calendario').fullCalendar('removeEvents', event.id);
          }

        }
      });
    } // end of poblarCalendario

    addEvent(eventManager){
      var form_data = new FormData();
      form_data.append('title', $('#titulo').val());
      form_data.append('start_date', $('#start_date').val());
      form_data.append('full_day', $('#allDay').prop('checked'));
      if (!$('#allDay').prop('checked')) {
        form_data.append('end_date', $('#end_date').val());
        form_data.append('end_hour', $('#end_hour').val());
        form_data.append('start_hour', $('#start_hour').val());
      } else {
        form_data.append('end_date', "");
        form_data.append('end_hour', "");
        form_data.append('start_hour', "");
      }
      $.ajax({
        url: '../server/new_event.php',
        dataType: "json",
        cache: false,
        processData: false,
        contentType: false,
        data: form_data,
        type: 'POST',
        success: (data) =>{
          if (data.message=="OK") {
            alert('Se ha añadido el evento exitosamente');
            $('.calendario').fullCalendar('refetchEvents');
          } else {
            alert(data.message);
            alert(data.description);
          }
        },
        error: function(data){
          console.log('error');
          console.log(data);
          alert("error en la comunicación con el servidor");
        }
      });
    } // end of addEvent

    eliminarEvento(event, jsEvent){

      var form_data = new FormData();
      form_data.append('event_id', event.id);
      $.ajax({
        url: '../server/delete_event.php',
        dataType: "json",
        cache: false,
        processData: false,
        contentType: false,
        data: form_data,
        type: 'POST',
        success: (data) =>{
          if (data.message == "OK") {
            alert('Se ha eliminado el evento exitosamente');
          }else {
            alert(data.message);
            alert(data.description);
          }
        },
        error: function(data){
          alert("error en la comunicación con el servidor");
          console.log(data);
        }
      });
      $('.delete-btn').find('img').attr('src', "img/trash.png");
      $('.delete-btn').css('background-color', '#8B0913');
    } // end of eliminarEvento

    updateEvent(event) {

      let id = event.id,
      start = $.fullCalendar.moment(event.start).format('YYYY-MM-DD HH:mm:ss'),
      end = $.fullCalendar.moment(event.end).format('YYYY-MM-DD HH:mm:ss'),
      form_data = new FormData(),
      start_date,
      end_date,
      start_hour,
      end_hour;
      var full_day;

        start_date = start.substr(0,10);
        end_date = end.substr(0,10);
        start_hour = start.substr(11,8);
        end_hour = end.substr(11,8);

      if (!hasNumbers(end_date) && !hasNumbers(end_hour)) {
        full_day = true;
      } else {
        full_day = false;
      }

      form_data.append('id', id);
      form_data.append('start_date', start_date);
      form_data.append('end_date', end_date);
      form_data.append('start_hour', start_hour);
      form_data.append('end_hour', end_hour);
      form_data.append('full_day', full_day);

      $.ajax({
        url: '../server/update_event.php',
        dataType: "json",
        cache: false,
        processData: false,
        contentType: false,
        data: form_data,
        type: 'POST',
        success: (data) =>{
          if (data.message =="OK") {
            alert('Se ha actualizado el evento exitosamente');
          }else {
            alert(data.message);
            alert(data.description);
          }
        },
        error: function(data){
          console.log('Error in updateEvent');
          console.log(data);
          alert("error en la comunicación con el servidor en updateEvent");
        }
      });
    } // end of updateEvent
  }

  /* End of EventsManager */

  $(function(){

    initForm();

    var eventManager = new EventsManager();

    checkLogin(function() {
      eventManager.poblarCalendario();
    });

    $('form').submit(function(event){
      event.preventDefault();

      if (checkForm()) {
        eventManager.addEvent(eventManager);
      }

    });

    $('#logout').click(function() {
      logOut();
    });
  });

  function checkLogin(callback) {
    $.ajax({
      url: '../server/check_login.php',
      dataType: "json",
      cache: false,
      processData: false,
      contentType: false,
      type: 'GET',
      success: (data) => {
        if (data.message == 'error') {
          alert('You must log in before...');
          window.location.href = 'index.html';
        } else {
          callback();
        }
      },
      error: (data) => {
        console.log('error');
        console.log(data);
        alert("Error en la comunicación con el servidor en checkLogin");
      }
    });
  } // end of checkLogin

  function logOut() {
    $.ajax({
      url: '../server/logout.php',
      dataType: "json",
      cache: false,
      processData: false,
      contentType: false,
      type: 'GET',
      success: (data) =>{
        alert(data.message);
        window.location.href = 'index.html';
      },
      error: function(){
        alert("Error when trying to log out");
      }
    });
  } // end of logOut

  function initForm(){
    $('#start_date, #titulo, #end_date').val('');
    $('#start_date, #end_date').datepicker({
      dateFormat: "yy-mm-dd"
    });
    $('.timepicker').timepicker({
      timeFormat: 'H:i:s',
      interval: 30,
      minTime: '5',
      maxTime: '23:30',
      defaultTime: '7',
      startTime: '5:00',
      dynamic: false,
      dropdown: true,
      scrollbar: true
    });
    $('#allDay').on('change', function(){
      if (this.checked) {
        $('.timepicker, #end_date').attr("disabled", "disabled");
      }else {
        $('.timepicker, #end_date').removeAttr("disabled");
      }
    });
  } // end of initForm

  function checkForm() {
    if ($('#titulo').val() != '' && $('#start_date').val() != '') {
      return true;
    } else {
      return false;
    }
  }
