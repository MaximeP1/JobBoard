$(document).ready(function () {
  document.querySelector('.close').addEventListener('click', hideSignUp)
  document.querySelector('.cancelbtn').addEventListener('click', hideSignUp)
  document.getElementById('openSignUp').addEventListener('click', showSignUp)
  document.querySelector('.signupbtn').addEventListener('click', function (e) {
    e.preventDefault()
    signUp() ? hideSignUp() : console.log('error in password')
  })
})

function hideSignUp () {
  document.getElementById('signUp').style.display = 'none'
}

function showSignUp () {
  document.getElementById('signUp').style.display = 'block'
}

function signUp () {
  var form = $('#signUpForm').serializeArray()
  if (!validatePassword(form[4].value, form[5].value)) return false
  form = getFormValues(form)
  ajaxPostNewUser(form)
  return true
}

function validatePassword (password, confirmPassword) {
  if (password !== confirmPassword || password.length < 8) return false
  else return true
}

function getFormValues (values) {
  var firstName = values[0].value.trim()
  var lastName = values[1].value.trim()
  var email = values[2].value.trim()
  var phone = values[3].value.trim()
  var password = values[4].value
  var applicant = values[6].value
  var recruiter = applicant === '1' ? '0' : '1'
  var data = {
    firstName: firstName,
    lastName: lastName,
    email: email,
    phone: phone,
    password: password,
    applicant: applicant,
    recruiter: recruiter
  }
  return data
}

var ajaxPostNewUser = function (values) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: './people/new',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(values)
    })
      .fail(function (err) {
        console.log('Error')
        reject(err)
      })
      .done(function (data) {
        console.log('done')
        resolve(data)
      })
  })
}
