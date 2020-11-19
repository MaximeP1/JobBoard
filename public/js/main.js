const articlesMaxOnPage = 9

$(document).ready(function () {
  document.querySelector('#fullAd .quit').addEventListener('click', function () {
    document.querySelector('#fullAd').style.visibility = 'hidden'
    document.querySelector('.information').style.visibility = 'hidden'
    $('#fullAdContainer').hide()
  })

  document.querySelector('.information .quit').addEventListener('click', function () {
    document.querySelector('.information').style.visibility = 'hidden'
  })

  document.querySelector('.apply').addEventListener('click', function () {
    document.querySelector('.information').style.visibility = 'visible'
  })

  $('.show').on('click', function (e) {
    const position = this.id
    clearFullAd()
    showLoader()
    $('#fullAdContainer').show()
    var start = new Date().getTime()
    ajaxGet('./advertisements/getIDByPosition/' + position).then(row => {
      const id = row[0].id
      ajaxGet('./advertisements/getByID/' + id).then(ad => {
        ajaxGet('./companies/' + ad[0].company).then(company => {
          var end = new Date().getTime()
          hideLoader()
          document.querySelector('#fullAd').style.visibility = 'visible'
          fillFullAd(ad, company)
          console.log(end - start + 'ms')
        })
      })
    })
  })

  $('form').on('submit', function (e) {
    e.preventDefault()
    const formValues = $(this).serializeArray()
    var data = $(this).find('input[type=submit]').hasClass('logged')
      ? getFormValuesWithAccount(formValues)
      : getFormValuesWithoutAccount(formValues)
    console.log(data)
    ajaxPostNewApplication(data).then(clearForm(), err => console.error(err))
  })

  createPagination(1)
})

function showLoader () {
  $('.loader').show()
}

function hideLoader () {
  $('.loader').hide()
}

function createArticle (title, preview, id, page) {
  const tag = document.createElement('article')
  const titleTag = document.createElement('h4')
  const previewTag = document.createElement('p')
  const titleText = document.createTextNode(title)
  const text = document.createTextNode(preview)
  const button = document.createElement('button')

  button.innerHTML = 'Learn more'
  button.classList.add('w3-button', 'w3-blue-grey', 'w3-small', 'w3-round-large')
  titleTag.appendChild(titleText)
  previewTag.appendChild(text)
  tag.appendChild(titleTag)
  tag.appendChild(previewTag)

  document.getElementById('secondSection').appendChild(tag)
  button.addEventListener('click', function () {
    clearFullAd()
    showLoader()
    $('#fullAdContainer').show()
    var start = new Date().getTime()
    ajaxGet('./advertisements/getByID/' + id).then(ad => {
      ajaxGet('./companies/' + ad[0].company).then(company => {
        var end = new Date().getTime()
        hideLoader()
        document.querySelector('#fullAd').style.visibility = 'visible'
        fillFullAd(ad, company)
        console.log(end - start + 'ms')
      })
    })
  })
  tag.appendChild(button)
}

function createAllArticles (data, page) {
  data.forEach((item, i) => {
    createArticle(item.title, item.preview, item.id, page)
  })
}

function createPaginationLinks (page, active, pageNumber) {
  const link = document.createElement('a')
  const linkNumber = document.createTextNode(page)

  if (active) link.className = 'active'
  link.id = 'id' + page

  link.addEventListener('click', function () {
    ajaxGet('/advertisements/' + page).then(data => {
      if (document.querySelector('.active')) document.querySelector('.active').classList.remove('active')
      document.querySelector('#pagination #id' + page).className = 'active'
      deleteAllArticles()
      createAllArticles(data, page)
      deleteAllPaginationLinks()
      createAllPaginationLinks(pageNumber, page)
    })
  })

  link.appendChild(linkNumber)
  document.querySelector('footer #pagination').appendChild(link)
}

function deleteAllPaginationLinks () {
  $('footer #pagination').empty()
}

function addSpaceInPagination () {
  const space = document.createElement('span')
  const spaceText = document.createTextNode('...')
  document.querySelector('footer #pagination').appendChild(space)
  space.appendChild(spaceText)
}

function addEdgeButton (target, number, symbol) {
  const link = document.createElement('a')
  const linkNumber = document.createTextNode(symbol)

  link.addEventListener('click', function () {
    ajaxGet('/advertisements/' + target).then(data => {
      if (document.querySelector('.active')) document.querySelector('.active').classList.remove('active')
      document.querySelector('#pagination #id' + target).className = 'active'
      deleteAllArticles()
      createAllArticles(data, target)
      deleteAllPaginationLinks()
      createAllPaginationLinks(number, target)
    })
  })

  link.appendChild(linkNumber)
  document.querySelector('footer #pagination').appendChild(link)
}

function createAllPaginationLinks (number, currentPage) {
  if (number < 50) {
    for (let i = 1; i <= number; i++) {
      createPaginationLinks(i, number, i === currentPage, number)
    }
  } else {
    addEdgeButton(currentPage !== 1 ? currentPage - 1 : currentPage, number, '«')
    createPaginationLinks(1, currentPage === 1, number)
    if (currentPage !== 1) {
      if (currentPage !== 2) {
        addSpaceInPagination()
        createPaginationLinks(currentPage - 1, false, number)
      }
      createPaginationLinks(currentPage, true, number)
    }
    if (currentPage <= number - 1) {
      if (currentPage <= number - 2) {
        createPaginationLinks(currentPage + 1, false, number)
        addSpaceInPagination()
      }
      createPaginationLinks(number, currentPage === number, number)
    }
    addEdgeButton(currentPage !== number ? currentPage + 1 : currentPage, number, '»')
  }
}

function createPagination (currentPage) {
  ajaxGet('./advertisements/number').then(number => createAllPaginationLinks(Math.ceil(number / articlesMaxOnPage), currentPage))
}

function deleteAllArticles () {
  $('#secondSection').empty()
}

function fillFullAd (ad, company) {
  $('#full_ad_title').html(ad[0].title)
  $('#full_ad_company').html(company[0].name)
  $('#description').html(ad[0].description)
  $('#wage').html('Wage : ' + (ad[0].wage !== null ? ad[0].wage + '€ annualy' : 'Unknown'))
  $('#place').html('Working place : ' + (ad[0].place !== null ? ad[0].place : 'Unknown'))
  $('#workingTime').html('Working Time : ' + (ad[0].workingTime !== null ? ad[0].workingTime + 'h per week' : 'Unknown'))
  $('param[name=id]').val(ad[0].id)
}

function clearFullAd () {
  $('#full_ad_title').empty()
  $('#full_ad_company').empty()
  $('#description').empty()
  $('#wage').empty()
  $('#place').empty()
  $('#workingTime').empty()
  $('param[name=id]').val('')
}

function getFormValuesWithoutAccount (values) {
  var fullName = (values[0].value + ' ' + values[1].value).trim()
  var email = values[2].value.trim()
  var phone = values[3].value.trim()
  var message = values[4].value.trim()
  var adID = $('param[name=id]').val()
  var data = { fullName: fullName, email: email, phone: phone, message: message, adID: adID }
  return data
}

function getFormValuesWithAccount (values) {
  var fullName = (values[0].value.trim())
  var email = values[1].value.trim()
  var phone = values[2].value.trim()
  var message = values[3].value.trim()
  var adID = $('param[name=id]').val()
  var userID = $('param[name=userID]').val()
  var data = { fullName: fullName, email: email, phone: phone, message: message, advertisement: adID, applicant: userID }
  return data
}

function clearForm () {
  document.querySelector('form').reset()
  document.querySelector('.information').style.visibility = 'hidden'
}

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

var ajaxPostNewApplication = function (values) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: './applications/new',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(values)
    })
      .fail(function (err) {
        console.log('Error')
        reject(err)
      })
      .done(function (data) {
        console.log('New application sent')
        resolve(data)
      })
  })
}
