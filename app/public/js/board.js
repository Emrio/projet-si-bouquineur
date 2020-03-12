/* global $ XMLHttpRequest Image Base64 feather io */
(function () {
  function playRandomErrorSound () {
    const sounds = ['cestHonteux', 'quelleIndignite']
    const sound = sounds[Math.round(Math.random() * sounds.length)] || sounds[0]
    console.log(sound)
    const soundElement = document.getElementById(sound + 'Sound')
    soundElement.play()
  }
  function homeLoginError (message, isSystemError = false) {
    if (!isSystemError) {
      playRandomErrorSound()
    }
    $('#error-alert').text(message)
    $('#error-alert').fadeIn(300).delay(1500).fadeOut(400)
  }
  const socket = io(document.location.origin)
  socket.on('login', (rfid) => {
    console.log('requested login :', rfid)
    $.ajax({
      type: 'POST',
      url: `${document.location.origin}/api/auth/login`,
      data: { rfid },
      dataType: 'json',
      success: () => goto('/dashboard'),
      error: (err, res) => {
        switch (err.status) {
          case 400:
            homeLoginError('Erreur de validation des données')
            break
          case 404:
            homeLoginError("La carte RFID n'est pas associée à un compte")
            break
          case 500:
            homeLoginError('Erreur interne')
            break
          case 503:
            homeLoginError('Aucune carte RFID a été détecté')
            break
          default:
            homeLoginError('Erreur inconnue')
        }
        console.error(err, res)
      }
    })
  })

  function disconnect () {
    console.log('hi')
    $.ajax({
      type: 'POST',
      url: `${document.location.origin}/api/auth/logout`,
      success: () => goto('/home'),
      error: (err, res) => console.error(err, res)
    })
  }

  window.feather = window.feather || { replace: () => null } // internet less setup
  function parseScripts (elmt) {
    if (elmt.tagName === 'SCRIPT') {
      const script = document.createElement('script')
      script.text = elmt.text
      for (const attr of elmt.attributes) {
        script.setAttribute(attr.name, attr.value)
      }
      elmt.parentNode.replaceChild(script, elmt)
    } else {
      for (const node of elmt.childNodes) parseScripts(node)
    }
  }
  function goto (location) {
    document.getElementById('main').innerHTML = '<div class="justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 text-center"><img src="/assets/img/loader.gif" alt="Loading..." width="75"></div>'
    const r = new XMLHttpRequest()
    r.onreadystatechange = function () {
      if (this.readyState === 4) {
        const res = JSON.parse(this.responseText)
        if (res.code === 200) {
          document.title = res.data.title
          document.getElementById('main').innerHTML = Base64.decode(res.data.page)
          parseScripts(document.getElementById('main')) // run scripts
          feather.replace()
          customAnchor()
          document.getElementById('disconnect').onclick = disconnect
        } else if (res.code === 500) {
          document.getElementById('main').innerHTML = '<pre class="mt-5">Erreur 500: Erreur Interne du Serveur<br>Une erreur fatale est survenue. Veuillez en faire part immédiatement à l\'administrateur.</pre>'
        } else {
          document.getElementById('main').innerHTML = `<pre class="mt-5">Erreur ${res.code}</pre><pre>Une erreur innatendue est survenue. Veuillez en faire part à votre administrateur.</pre>`
        }
      }
    }
    r.open('GET', `${document.location.origin}/api/boards${location}`)
    r.send()
  }

  // custom anchor tags
  function customAnchor () {
    document.querySelectorAll('a').forEach(a => {
      if (a.classList.contains('external')) return
      a.onclick = function () {
        goto(a.pathname)
        return false
      }
    })
  }

  /* Loader image preloading */
  const images = []
  function preload () {
    for (const src of arguments) {
      const img = new Image()
      img.src = src
      images.push(img)
    }
  }

  preload('/assets/img/loader.gif')
  customAnchor()
  goto('/home')
  feather.replace()
})()
