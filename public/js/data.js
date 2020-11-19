var rowsSelected = []

function hide () {
  document.querySelector('#advertisements').style.display = 'none'
  document.querySelector('#companies').style.display = 'none'
  document.querySelector('#people').style.display = 'none'
  document.querySelector('#mails').style.display = 'none'
  document.querySelector('#applications').style.display = 'none'
}

hide()

document.querySelector('#selection1').addEventListener('click', function () {
  hide()
  ajaxGet('./advertisements').then(ads => {
    updateTable($('#advertisements table'), ads, 'advertisements')
    document.querySelector('#advertisements').style.display = 'block'
  })
})

document.querySelector('#selection2').addEventListener('click', function () {
  hide()
  ajaxGet('./companies').then(companies => {
    updateTable($('#companies table'), companies, 'companies')
    document.querySelector('#companies').style.display = 'block'
  })
})

document.querySelector('#selection3').addEventListener('click', function () {
  hide()
  ajaxGet('./people').then(people => {
    updateTable($('#people table'), people, 'people')
    document.querySelector('#people').style.display = 'block'
  })
})

document.querySelector('#selection4').addEventListener('click',function () {
  hide()
  ajaxGet('./mails').then(mails => {
    updateTable($('#mails table'), mails, 'mails')
    document.querySelector('#mails').style.display = 'block'
  })
})

document.querySelector('#selection5').addEventListener('click', function () {
  hide()
  ajaxGet('./applications').then(applications => {
    updateTable($('#applications table'), applications, 'applications')
    document.querySelector('#applications').style.display = 'block'
  })
})

function createRow (data, name) {
  const row = document.createElement('tr')
  Object.values(data).forEach((item, i) => {
    const field = document.createElement('td')
    const fieldValue = document.createTextNode(item)
    field.appendChild(fieldValue)
    row.appendChild(field)
  })
  switch (name) {
    case 'advertisements':
      document.querySelector('#advertisements tbody').appendChild(row)
      break
    case 'companies':
      document.querySelector('#companies tbody').appendChild(row)
      break
    case 'people':
      document.querySelector('#people tbody').appendChild(row)
      break
    case 'mails':
      document.querySelector('#mails tbody').appendChild(row)
      break
    case 'applications':
      document.querySelector('#applications tbody').appendChild(row)
      break
  }
}

function createAllRows (data, name) {
  data.forEach((row, i) => {
    createRow(row, name)
  })
}

function clickRowEvent () {
  $('td')
    .off('click')
    .on('click', function () {
      var row = $(this).parent()
      if (!row.hasClass('no-records-found')) {
        const id = this.closest('.table-responsive').id
        row.toggleClass('selected')
        const selected = $('#' + id + ' .selected').length
        var array = []
        this.parentElement.innerHTML.split('<').forEach((item, i) => {
          if (i % 2 !== 0) array.push(item.split('>')[1])
        })
        if (row.hasClass('selected')) {
          rowsSelected.push(array)
        } else {
          rowsSelected.forEach((item, i) => {
            if (item[0] === array[0]) rowsSelected.splice(i, 1)
          })
        }

        if (!selected) {
          document.querySelector('#' + id + ' .deleteBtn').disabled = true
          document.querySelector('#' + id + ' .updateBtn').disabled = true
        } else if (selected === 1) {
          document.querySelector('#' + id + ' .deleteBtn').disabled = false
          document.querySelector('#' + id + ' .updateBtn').disabled = false
        } else {
          document.querySelector('#' + id + ' .deleteBtn').disabled = false
          document.querySelector('#' + id + ' .updateBtn').disabled = true
        }
      }
    })
}

function updateTable (table, data, name) {
  rowsSelected = []
  table.bootstrapTable('destroy')
  table.children('tbody').html('')
  createAllRows(data, name)
  table.bootstrapTable({
    pagination: true,
    pageSize: 10,
    pageList: [5, 10, 25, 50]
  })
  clickRowEvent()
  table.on('page-change.bs.table', () => {
    clickRowEvent()
  })
  document.querySelector('#' + name + ' .deleteBtn').disabled = true
  document.querySelector('#' + name + ' .updateBtn').disabled = true
  document.querySelector('#' + name + ' .newBtn').disabled = false
}

function submitInsert (e, table) {
  e.preventDefault()
  var form = $('.insert form').serializeArray()
  var values = {}
  var error
  error = 0
  form.forEach((item, i) => {
    if (document.querySelector('#' + item.name).required && document.querySelector('#' + item.name).value === '') {
      document.querySelector('#' + item.name).parentElement.classList.add('error')
      error++
    } else document.querySelector('#' + item.name).parentElement.classList.remove('error')
  })
  if (error === 0) {
    form.forEach((item, i) => {
      values[item.name] = item.value !== ''
        ? isNaN(item.value)
          ? item.value
          : item.value * 1
        : null
    })
    ajaxPost('/' + table + '/new', values).then(() => {
      ajaxGet('/' + table).then(rows => {
        updateTable($('#' + table + ' table'), rows, table)
      })
    })
  }
}

function createForm (title, url) {
  ajaxGet(url).then(result => {
    const form = document.querySelector('.insert form')
    document.querySelector('.insert h1').innerHTML = 'New row in ' + title
    result.forEach((item, i) => {
      if (item.COLUMN_NAME === 'id') return
      var div = createInput(item.COLUMN_NAME, item.COLUMN_TYPE, item.IS_NULLABLE === 'NO')
      form.appendChild(div)
    })
    const submit = document.createElement('input')
    submit.setAttribute('type', 'submit')
    submit.setAttribute('value', 'Submit')
    submit.addEventListener('click', e => submitInsert(e, title))
    form.appendChild(submit)
  })
}

function createInput (name, type, required) {
  var inputType
  switch (type.split('(')[0]) {
    case 'tinyint':
      inputType = 'checkbox'
      break
    case 'int':
      inputType = 'number'
      break
    default:
      inputType = 'text'
  }
  const inputMaxLength = type.split('(').length > 1 ? type.split('(')[1].slice(0, -1) : false

  const div = document.createElement('div')
  const label = document.createElement('label')
  const labelText = document.createTextNode(name)
  label.setAttribute('for', name)
  label.appendChild(labelText)

  const input = document.createElement('input')
  input.setAttribute('id', name)
  input.setAttribute('name', name)
  input.setAttribute('type', inputType)
  if (required) input.required = true
  if (inputMaxLength) input.setAttribute('maxlength', inputMaxLength)
  if (inputType === 'number') input.setAttribute('min', '0')
  if (inputType === 'checkbox') {
    div.classList.add('form-check')
    input.classList.add('form-check-input')
    input.setAttribute('value', 1)
    label.classList.add('form-check-label')
    div.appendChild(input)
    div.appendChild(label)
  } else {
    div.classList.add('form-group')
    input.classList.add('form-control')
    div.appendChild(label)
    div.appendChild(input)
  }

  return div
}

$('.newBtn').click(function () {
  var parent = this.parentElement.id
  createForm(parent, '/' + parent + '/columns')
  $('.insert').show()
})

$('.updateBtn').click(function () {
  var parent = this.parentElement.id
  document.querySelector('#' + parent + ' .deleteBtn').disabled = true
  document.querySelector('#' + parent + ' .updateBtn').disabled = true
  document.querySelector('#' + parent + ' .newBtn').disabled = true

  var selected = document.querySelectorAll('#' + parent + ' .selected')
  var newHtml = ''
  selected.forEach((item, i) => {
    var baseHtml = item.innerHTML.split('</td>')
    baseHtml.forEach((split, i) => {
      if (i === 0) newHtml += '<td class="id">' + split.split('<td style="">').pop() + '</td>'
      else {
        var value = split.split('<td style="">').pop()
        if (i !== baseHtml.length - 1) newHtml += '<td><input class="form-control" value="' + (value !== 'null' ? value : '') + '"></td>'
        else newHtml += '<td class="justify-content-center"><button class="btn btn-info save">Save</button></td>'
      }
    })
    item.innerHTML = newHtml
    document.querySelector('.save').addEventListener('click', saveUpdate)
  })
})

function saveUpdate () {
  var row = $(this).parent().parent()
  var table = row.parents('.table-responsive').attr('id')
  var id = row.find('.id').html()
  var inputs = row.find('input')
  var values = { id: id }
  for (let i = 0; i < inputs.length; i++) {
    values[i] = inputs[i].value
  }
  ajaxPost('/' + table + '/update', values).then(() => {
    document.querySelector('#' + table + ' .deleteBtn').disabled = false
    document.querySelector('#' + table + ' .updateBtn').disabled = false
    document.querySelector('#' + table + ' .newBtn').disabled = false
    ajaxGet('/' + table).then(rows => {
      updateTable($('#' + table + ' table'), rows, table)
    })
  })
}

$('.deleteBtn').click(function () {
  var parent = this.parentElement.id
  var values = {}
  rowsSelected.forEach((item, i) => {
    values[i] = item[0]
  })
  ajaxDelete('/' + parent + '/delete', values).then(() => {
    ajaxGet('/' + parent).then(rows => {
      updateTable($('#' + parent + ' table'), rows, parent)
    })
  })
})

$('.quit').click(function () {
  $('.insert').hide()
  $('.insert form').empty()
})

var ajaxGet = function (url) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: url,
      dataType: 'text'
    })
      .fail(function (data) {
        console.log('Error')
        reject(data)
      })
      .done(function (data) {
        data = JSON.parse(data)
        resolve(data)
      })
  })
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
        console.log('New row sent')
        resolve(data)
      })
  })
}

var ajaxDelete = function (url, values) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: url,
      type: 'DELETE',
      contentType: 'application/json',
      data: JSON.stringify(values)
    })
      .fail(function (err) {
        console.log('Error')
        reject(err)
      })
      .done(function (data) {
        console.log('Row deleted')
        resolve(data)
      })
  })
}
