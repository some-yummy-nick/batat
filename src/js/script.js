$(document).ready(function () {
  $('.js-phone-mask').mask('8 000 000 00 00')
})
;(function () {
  const orderInputs = document.querySelectorAll('.js-order-input')
  const orderSelect = document.getElementById('js-order-select')

  orderInputs.forEach(item => {
    item.addEventListener('change', function () {
      orderSelect.value = this.value
    })
  })
})()
;(function () {
  const content = document.querySelectorAll('.menu__content')
  var x, i, j, l, ll, selElmnt, a, span, b, c, newSpan
  /* Look for any elements with the class "custom-select": */
  x = document.getElementsByClassName('custom-select')
  l = x.length
  for (i = 0; i < l; i++) {
    selElmnt = x[i].getElementsByTagName('select')[0]
    ll = selElmnt.length
    /* For each element, create a new DIV that will act as the selected item: */
    a = document.createElement('DIV')
    a.setAttribute('class', 'select-selected')
    span = document.createElement('SPAN')
    a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML
    a.appendChild(span)
    x[i].appendChild(a)
    /* For each element, create a new DIV that will contain the option list: */
    b = document.createElement('DIV')
    b.setAttribute('class', 'select-items select-hide')
    for (j = 1; j < ll; j++) {
      /* For each option in the original select element,
      create a new DIV that will act as an option item: */
      c = document.createElement('DIV')

      newSpan = document.createElement('SPAN')
      newSpan.innerHTML = selElmnt.options[j].innerHTML
      newSpan.setAttribute('data-value', selElmnt.options[j].value)
      c.appendChild(newSpan)
      if (
        c.querySelector('span').getAttribute('data-value') == selElmnt.value
      ) {
        c.classList.add('same-as-selected')
      }
      c.addEventListener('click', function (e) {
        /* When an item is clicked, update the original select box,
        and the selected item: */
        var y, i, k, s, h, sl, yl, currentSpan
        s = this.parentNode.parentNode.getElementsByTagName('select')[0]
        sl = s.length
        h = this.parentNode.previousSibling
        currentSpan = this.querySelector('span')

        for (i = 0; i < sl; i++) {
          if (s.options[i].innerHTML == currentSpan.innerHTML) {
            s.selectedIndex = i
            const value = s.options[i].value
            const currentContent = document.getElementById(`${value}-content`)
            if (currentContent) {
              content.forEach(item => {
                item.style.display = 'none'
              })
              currentContent.style.display = 'block'
            }
            document.getElementById('js-order-select').value = value
            document.querySelector(`input[value="${value}"]`).checked = true
            h.innerHTML = this.innerHTML
            y = this.parentNode.getElementsByClassName('same-as-selected')
            yl = y.length
            for (k = 0; k < yl; k++) {
              y[k].removeAttribute('class')
            }
            this.setAttribute('class', 'same-as-selected')
            break
          }
        }
        h.click()
      })
      b.appendChild(c)
    }
    x[i].appendChild(b)

    a.addEventListener('click', function (e) {
      /* When the select box is clicked, close any other select boxes,
      and open/close the current select box: */
      e.stopPropagation()
      closeAllSelect(this)
      this.nextSibling.classList.toggle('select-hide')
      this.classList.toggle('select-arrow-active')
    })
  }

  function closeAllSelect(elmnt) {
    /* A function that will close all select boxes in the document,
    except the current select box: */
    var x,
      y,
      i,
      xl,
      yl,
      arrNo = []
    x = document.getElementsByClassName('select-items')
    y = document.getElementsByClassName('select-selected')
    xl = x.length
    yl = y.length
    for (i = 0; i < yl; i++) {
      if (elmnt == y[i]) {
        arrNo.push(i)
      } else {
        y[i].classList.remove('select-arrow-active')
      }
    }
    for (i = 0; i < xl; i++) {
      if (arrNo.indexOf(i)) {
        x[i].classList.add('select-hide')
      }
    }
  }

  /* If the user clicks anywhere outside the select box,
  then close all select boxes: */
  document.addEventListener('click', closeAllSelect)
})()
;(function () {
  var isMobile = window.matchMedia('(max-width: 767px)')

  var app = {
    initialize: function () {
      this.setUpListeners()
    },

    setUpListeners: function () {
      $('.js-form').on('submit', app.submitForm)
    },

    submitForm: function (e) {
      e.preventDefault()

      var form = $(this),
        submitBtn = form.find('button[type="submit"]')

      var str = form.serialize()
      var temp = str.split('&')
      if (!isMobile.matches) {
        temp.shift()
        temp[0] = temp[0].replace('type', 'menu')
      } else {
        temp.splice(1, 1)
      }
      str = temp.join('&')
      // против повторного нажатия
      submitBtn.attr({disabled: 'disabled'})

      $.ajax({
        type: 'POST',
        url: 'send-contact.php',
        data: str,
      })
        .done(function () {
          MicroModal.show('js-modal-thanks')
        })
        .always(function () {
          submitBtn.removeAttr('disabled')
          form[0].reset()
        })
    },
  }

  app.initialize()
})()
