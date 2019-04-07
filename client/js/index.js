function register() {
  event.preventDefault()

  const name = $('#reg-name').val(),
    email = $('#reg-email').val()
    password = $('#reg-password').val()

  $.ajax({
    url: 'http://localhost:3000/users',
    method: 'POST',
    data: {
      name,
      email,
      password
    }
  })
    .done(function (response) {
      swal({
        title: "Success Register!",
        text: "You clicked the button!",
        icon: "success",
        button: "close!",
      });
    })
    .fail(function (jqXHR, textStatus) {
      console.log('request failed', textStatus)
      swal({
        title: "password/email salah!",
        text: "You clicked the button!",
        icon: "error",
        button: "close!",
      });
    })
}

function login() {
  event.preventDefault()
  const email = $('#login-email').val(),
    password = $('#login-password').val()
  $.ajax({
    url: 'http://localhost:3000/users/login',
    method: 'POST',
    data: {
      email,
      password
    }
  })
    .done(function (response) {
      const { token, id, email, name } = response
      swal({
        title: "Success Login!",
        text: "You clicked the button!",
        icon: "success",
        button: "close!",
      });
      localStorage.setItem('token', token)
      localStorage.setItem('id', id)
      localStorage.setItem('name', name)
      localStorage.setItem('email', email)

      $('#navbar-option').prepend(`
        <li class="nav-item">
          <a class="nav-link text-light" href="#" id="user">Hello, ${response.name}</a>
        </li>
      `)

      successLogin()
      getAllTodo()
      $('#login-modal').modal('toggle')
    })
    .fail(function(jqXHR, textSatus) {
      console.log('request failed')
      swal({
        title: `${jqXHR.responseJSON.message}`,
        text: "You clicked the button!",
        icon: "error",
        button: "close!",
      });
    })
}

function onSignIn(googleUser) {
  var profile = googleUser.getBasicProfile();
  console.log('ID: ' + profile.getId());
  console.log('Name: ' + profile.getName());
  console.log('Image URL: ' + profile.getImageUrl());
  console.log('Email: ' + profile.getEmail());
  const id_token = googleUser.getAuthResponse().id_token;

  $.ajax({
    url: 'http://localhost:3000/users/login-google',
    method: 'POST',
    data: {
      id_token
    }
  })
    .done(function (response) {
      localStorage.setItem('token', response.token)
      localStorage.setItem('id', response.id)
      localStorage.setItem('login', 'google')
      
      $('#navbar-option').prepend(`
        <li class="nav-item">
          <a class="nav-link text-light" href="#" id="user">Hello, ${profile.getName()}</a>
        </li>
      `)

      successLogin()
      getAllTodo()
      swal({
        title: "Success Login!",
        text: "You clicked the button!",
        icon: "success",
        button: "close!",
      });
      $('#login-modal').modal('toggle')
    })
    .fail(function (jqXHR, textSatus) {
      console.log('request failed', textSatus)
    })
}

function signOut() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    console.log('User signed out.');
    localStorage.clear()
    swal({
      title: "Success Logout!",
      text: "You clicked the button!",
      icon: "success",
      button: "close!",
    });
  });
}

/*=============== todo ==================*/
function addTodo() {
  const name = $('#add-task').val(),
    due_date = $('#add-due-date').val(),
    description = $('#add-desc').val()

  $.ajax({
    url: `http://localhost:3000/todos`,
    method: 'POST',
    data: {
      name,
      due_date,
      description,
      user_id: localStorage.getItem('id')
    },
    headers: {
      token: localStorage.getItem('token')
    }
  })
    .done(function (response) {
      $('#card-todo').prepend(`
        <div class="col-md-4 mr-3 ml-3 card text-white ${color[i % color.length]} mb-3" style="max-width: 15rem;" data-aos="zoom-in-up">
          <div class="card-header">${response.name}
            <button type="button" class="close" data-dismiss="modal" aria-label="Close" id="delete-todo">
              <span aria-hidden="true" onclick="deleteTodo('${response._id}')">&times;</span>
            </button>
          </div>
          <div class="card-body">
            <p class="card-text btn btn-danger" onclick="updateTodo('${response._id}')"><b>${response.status}</b></p>
            <p class="card-text">${response.description}</p>
            <p class="card-text">${response.due_date.slice(0, 10).split('-').reverse().join('-')}</p>
          </div>
        </div>
      `)

      swal({
        title: "Success Add Todo!",
        text: "You clicked the button!",
        icon: "success",
        button: "close!",
      });
    })
    .fail(function (jqXHR, textStatus) {
      console.log('request failed')
      swal({
        title: 'please fill all',
        text: "You clicked the button!",
        icon: "error",
        button: "close!",
      });
    })
}

function getAllTodo() {
  $.ajax({
    url: `http://localhost:3000/todos/${localStorage.getItem('id')}`,
    method: 'GET',
    headers: {
      token: localStorage.getItem('token')
    }
  })
    .done(function (response) {
      $('#card-todo').empty()
      const color = ['bg-warning', 'bg-info', 'bg-danger', 'bg-success', 'bg-secondary', 'bg-primary']
      response.forEach((todo, i) => {
        if(todo.status == 'uncomplete') {
          $('#card-todo').prepend(`
            <div class="col-md-4 mr-3 ml-3 card text-white ${color[i % color.length]} mb-3" style="max-width: 15rem;" data-aos="zoom-in-up">
              <div class="card-header">${todo.name}
                <button type="button" class="close" data-dismiss="modal" aria-label="Close" id="delete-todo">
                  <span aria-hidden="true" onclick="deleteTodo('${todo._id}')">&times;</span>
                </button>
              </div>
              <div class="card-body">
                <p class="card-text btn btn-danger" onclick="updateTodo('${todo._id}')"><b>${todo.status}</b></p>
                <p class="card-text">${todo.description}</p>
                <p class="card-text">${todo.due_date.slice(0, 10).split('-').reverse().join('-')}</p>
              </div>
            </div>
          `)
        } else {
          $('#card-todo').prepend(`
            <div class="col-md-4 mr-3 ml-3 card text-white ${color[i % color.length]} mb-3" style="max-width: 15rem;" data-aos="zoom-in-up">
              <div class="card-header">${todo.name}
                <button type="button" class="close" data-dismiss="modal" aria-label="Close" id="delete-todo">
                  <span aria-hidden="true" onclick="deleteTodo('${todo._id}')">&times;</span>
                </button>
              </div>
              <div class="card-body">
                <p class="card-text btn btn-success" onclick="updateTodo('${todo._id}')"><b>${todo.status}</b></p>
                <p class="card-text">${todo.description}</p>
                <p class="card-text">${todo.due_date.slice(0, 10).split('-').reverse().join('-')}</p>
              </div>
            </div>
          `)
        }
        
      }); 
    })
    .fail(function (jqXHR, textStatus) {
      console.log('request failed', textStatus)
    })
}

function deleteTodo(param) {
  $.ajax({
    url: `http://localhost:3000/todos/${param}/delete`,
    method: 'DELETE',
    headers: {
      token: localStorage.getItem('token')
    }
  })
    .done(function (response) {
      getAllTodo()
      swal({
        title: "Success Deleted!",
        text: "You clicked the button!",
        icon: "success",
        button: "close!",
      });
    })
    .fail(function (jqXHR, textStatus) {
      console.log('request failed', textStatus)
    })
}

function updateTodo(id) {
  $.ajax({
    url: `http://localhost:3000/todos/${id}/update`,
    method: 'PUT',
    headers: {
      token: localStorage.getItem('token')
    }
  })
    .done(function (response) {
      getAllTodo()
    })
    .fail(function (jqXHR, textStatus) {
      console.log('request failed', textStatus)
    })
}

/*=============== action ==================*/
function successRegister() {
  $('#register-modal').modal('toggle')
}

function successLogout() {
  $('#login').show()
  $('#register').show()
  $('#logout').hide()
  $('#myTodo').hide()
  $('#user').hide()
  $('#form-add-todo').hide()
  $('#list-todo').hide()
}

function successLogin() {
  $('#login-modal').hide()
  $('#login').hide()
  $('#register').hide()
  $('#logout').show()
  $('#myTodo').show()
  $('#form-add-todo').show()
  $('#list-todo').show()
}

function notLoggedIn() {
  $('#myTodo').hide()
  $('#logout').hide()
  $('#login').show()
  $('#user').hide()
  $('#form-add-todo').hide()
  $('#list-todo').hide()
}

/* ===================== document ready ====================== */
$(document).ready(function() {
  if (localStorage.getItem('token')) {
    getAllTodo()
    successLogin()
  } else {
    notLoggedIn()
  }

  $('#logout').click(function() {
    signOut()
    successLogout()
  })

  $('#ask-login').click(function() {
    $('#register-modal').modal('toggle')
  })

  $('#regForm').click(function() {
    successRegister()
    register()
  })

  $('#loginForm').click(function () {
    login()
  })

  $('#todoForm').click(function() {
    addTodo()
    getAllTodo()
  })

  AOS.init();
})