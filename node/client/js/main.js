/**
** @author Daniel Marcano <danielmarcanodev@gmail.com>
**/

/*
* Checks whether a string contains digits or not
*/

function hasNumbers(t) {
  var regex = /\d/g;
  return regex.test(t);
}

class EventManager {

  deleteEvent(event, jsEvent){
    $.ajax({
      url: '/event/' + event.id,
      dataType: "json",
      cache: false,
      processData: false,
      contentType: false,
      data: {},
      type: 'DELETE',
      success: (data) =>{
        if (data.message == "OK") {
          alert(data.description);
        } else {
          alert(data.description);
        }
      }
    });
    $('.delete').find('img').attr('src', "../img/trash.png");
    $('.delete').css('background-color', '#8B0913');
  } // end of deleteEvent

  addEvent() {
    var eventData = {};
    eventData.title = $('#titulo').val();
    eventData.startDate = $('#start_date').val();
    eventData.fullDay = $('#allDay').prop('checked');
    if (!eventData.fullDay) {
      eventData.endDate = $('#end_date').val();
      eventData.endHour = $('#end_hour').val();
      eventData.startHour = $('#start_hour').val();
    } else {
      eventData.endDate = "";
      eventData.endHour = "";
      eventData.startHour = "";
    }

    $.post('/event/', eventData, function(response) {
      if (response.message == 'OK') {
        $('.calendario').fullCalendar('refetchEvents');
        alert(response.description);
      } else {
        alert(response.description);
      }
    });
  } // end of addEvent

  updateEvent(event) {
    var eventData = {};
    eventData.id = event.id;
    var start = $.fullCalendar.moment(event.start).format('YYYY-MM-DD HH:mm:ss'),
    end = $.fullCalendar.moment(event.end).format('YYYY-MM-DD HH:mm:ss');

    eventData.startDate = start.substr(0,10);
    eventData.endDate = end.substr(0,10);
    eventData.startHour = start.substr(11,8);
    eventData.endHour = end.substr(11,8);

    if (!hasNumbers(eventData.endDate) && !hasNumbers(eventData.endHour)) {
      eventData.fullDay = true;
      eventData.endDate = "";
      eventData.endHour = "";
    } else {
      eventData.fullDay = false;
    }

    $.ajax({
      url: '/event/' + eventData.id,
      dataType: "json",
      data: eventData,
      type: 'PUT',
      success: (data) => {
        if (data.message == "OK") {
          alert(data.description);
        }else {
          alert(data.description);
        }
      }
    });
  } // end of updateEvent

  poblarCalendario() {
    $('.calendario').fullCalendar({
      header: {
        left: 'prev,next today',
        center: 'title',
        right: 'month,agendaWeek,basicDay'
      },
      handleWindowResize: true,
      defaultDate: new Date(),
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
        url: "/events",
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
        }
      },
      eventDragStart: (event,jsEvent) => {
        $('.delete').find('img').attr('src', "../img/trash-open.png");
        $('.delete').css('background-color', '#a70f19');
      },
      eventDragStop: (event, jsEvent) =>{
        var trashEl = $('.delete');
        var ofs = trashEl.offset();
        var x1 = ofs.left;
        var x2 = ofs.left + trashEl.outerWidth(true);
        var y1 = ofs.top;
        var y2 = ofs.top + trashEl.outerHeight(true);
        if (jsEvent.pageX >= x1 && jsEvent.pageX<= x2 &&
          jsEvent.pageY >= y1 && jsEvent.pageY <= y2) {
            this.deleteEvent(event, jsEvent);
            $('.calendario').fullCalendar('removeEvents', event.id);
          }
        }
      });
    } // end of poblarCalendario

  } // End of EventManager

  $(function(){
    initForm();

    const eventManager = new EventManager();

    checkLogin(function() {
      eventManager.poblarCalendario();
    });

    $('#eventForm').submit(function(event){
      event.preventDefault();

      if (checkForm()) {
        eventManager.addEvent(eventManager);
      }

    });

    $('#logout').click(function() {
      logOut();
    });
  });

  function logOut() {
    $.ajax({
      url: '/logout',
      dataType: "json",
      cache: false,
      processData: false,
      contentType: false,
      type: 'GET',
      success: (data) => {
        alert(data.description);
        window.location.href = 'index.html';
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
        $('.timepicker, #end_date').attr('disabled', 'disabled');
      } else {
        $('.timepicker, #end_date').removeAttr("disabled");
      }
    });
  }

  function checkForm() {
    if ($('#titulo').val() != '' && $('#start_date').val() != '') {
      return true;
    } else {
      return false;
    }
  }

  function checkLogin(callback) {
    $.get('/login', function(response) {
      if (response.message != 'OK') {
        window.location.href = 'index.html';
      } else {
        callback();
      }
    });
  }
