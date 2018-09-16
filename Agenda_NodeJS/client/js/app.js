class EventManager {
    constructor() {
        this.urlBase = "/events"
        this.obtenerDataInicial()
        this.inicializarFormulario()
        this.guardarEvento()
    }

    obtenerDataInicial() {
        let url = this.urlBase + "/all"
        $.get(url, (response) => {
          if(response == "loginExpira"){
            window.location.href = "http://localhost:3000/index.html";
          } else {
            this.inicializarCalendario(response);
          }
        })
    }

    eliminarEvento(evento) {
        let eventId = evento.id
        $.post('/events/delete/'+eventId, {id: eventId}, (response) => {
            if(response == "loginExpira"){
              window.location.href = "http://localhost:3000/index.html";
            } else {
              alert(response);
            }
        })
    }

    guardarEvento() {
        $('.addButton').on('click', (ev) => {
            ev.preventDefault()
            let nombre = $('#titulo').val(),
            start = $('#start_date').val(),
            title = $('#titulo').val(),
            end = '',
            start_hour = '',
            end_hour = '';

            if (!$('#allDay').is(':checked')) {
                end = $('#end_date').val()
                start_hour = $('#start_hour').val()
                end_hour = $('#end_hour').val()
                start = start + 'T' + start_hour
                end = end + 'T' + end_hour
            }
            let url = this.urlBase + "/new"
            if (title != "" && start != "") {
                let ev = {
                    title: title,
                    start: start,
                    end: end
                }
                $.post(url, ev, (response) => {
                    if(response.msg){
                      alert(response.msg + " ID:" + response.idEvento);
                      ev.id = response.idEvento;
                      $('.calendario').fullCalendar('renderEvent', ev)
                    } else {
                      if(response == "loginExpira"){
                        window.location.href = "http://localhost:3000/index.html";
                      } else {
                        alert(response);
                      }
                    }
                })
            } else {
                alert("Complete los campos obligatorios para el evento")
            }
        })
    }

    //------Función faltante "actualizarEvento" añadida------
    actualizarEvento(evento){
      let inicio = moment(evento.start).format();
      let ev;
      if(evento.end){
        //Evento NO es de día completo
        let fin = moment(evento.end).format();
        ev = {
          id:evento.id,
          title:evento.title,
          start:inicio,
          end:fin
        }
      } else {
        //Evento es de día completo
        ev = {
          id:evento.id,
          title:evento.title,
          start:inicio
        }
      }

      //Enviamos el post
      $.post("/events/update", ev, (resultado)=>{
        if(resultado.msg){
          alert(resultado.msg + " ID:"+resultado.idEvento);
        } else {
          if(resultado == "loginExpira"){
            window.location.href = "http://localhost:3000/index.html";
          } else {
            alert(resultado);
          }
        }
      });
    }

    inicializarFormulario() {
        $('#start_date, #titulo, #end_date').val('');
        $('#start_date, #end_date').datepicker({
            dateFormat: "yy-mm-dd"
        });
        $('.timepicker').timepicker({
            timeFormat: 'HH:mm:ss',
            interval: 30,
            minTime: '5',
            maxTime: '23:59:59',
            defaultTime: '',
            startTime: '5:00',
            dynamic: false,
            dropdown: true,
            scrollbar: true
        });
        $('#allDay').on('change', function(){
            if (this.checked) {
                $('.timepicker, #end_date').attr("disabled", "disabled")
            }else {
                $('.timepicker, #end_date').removeAttr("disabled")
            }
        })
    }

    inicializarCalendario(eventos) {
        $('.calendario').fullCalendar({
            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'month,agendaWeek,basicDay'
            },
            defaultDate: '2016-11-01',
            navLinks: true,
            editable: true,
            eventLimit: true,
            droppable: true,
            dragRevertDuration: 0,
            timeFormat: 'H:mm',
            eventDrop: (event) => {
              this.actualizarEvento(event);
            },
            events: eventos,
            eventDragStart: (event,jsEvent) => {
                $('.delete').find('img').attr('src', "img/trash-open.png");
                $('.delete').css('background-color', '#a70f19')
            },
            eventDragStop: (event,jsEvent) => {
                var trashEl = $('.delete');
                var ofs = trashEl.offset();
                var x1 = ofs.left;
                var x2 = ofs.left + trashEl.outerWidth(true);
                var y1 = ofs.top;
                var y2 = ofs.top + trashEl.outerHeight(true);
                if (jsEvent.pageX >= x1 && jsEvent.pageX<= x2 &&
                    jsEvent.pageY >= y1 && jsEvent.pageY <= y2) {
                        this.eliminarEvento(event)
                        $('.calendario').fullCalendar('removeEvents', event.id);
                    }
                }
            })
        }
    }

    const Manager = new EventManager()
