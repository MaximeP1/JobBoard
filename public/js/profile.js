var buttons = document.getElementsByClassName('modif')
var select = document.querySelectorAll('.change')

for (let i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener('click', function () {
    document.querySelector('.clearfix').style.display = 'block'
    modifyField(i)
  })
}

function modifyField (i) {
  select[i].removeAttribute('readonly')
  select[i].style.backgroundColor = 'white'

  if (i === buttons.length - 1) {
    modifyField(i + 1)
    modifyField(i + 2)
  }
}

document.getElementById('cancel').addEventListener('click', function (e) {
  e.preventDefault()
  window.location.reload(true)
})

document.getElementById('save').addEventListener('click', function (e) {
  e.preventDefault()

  var values = {}
  var form = $('form').serializeArray()
  form.forEach((item, i) => {
    if (item.name !== 'accountType') {
      values[item.name] = item.value.trim !== '' ? item.value : null
    }
  })
  values.phone = values.phone.split(' ').join('')
  console.log(values.phone)
  if (checkPhonePattern(values.phone) && checkEmailPattern(values.email)) {
    ajaxPost('/people/updateProfile', values).then(() => {
      window.location.reload(true)
    }, err => console.log(err))
  }
})

function checkPhonePattern (phone) {
  var pattern = $('input[type=tel]').attr('pattern')
  var exp = new RegExp('^' + pattern + '$')
  if (exp.test(phone) && phone.length <= 15) {
    return true
  }
  return false
}

function checkEmailPattern (email) {
  const emailPattern = /[A-Za-z0-9-.]+@[A-Za-z0-9.]+\.{1}[A-Za-z0-9]+/
  if (emailPattern.test(email)) return true
  return false
}

var ajaxPost = function (url, values) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: url,
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(values)
    })
      .fail(function (err) {
        console.log('Error')
        reject(err)
      })
      .done(function (data) {
        console.log('Post request done')
        resolve(data)
      })
  })
}
