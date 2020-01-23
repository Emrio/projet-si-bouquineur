/* global XMLHttpRequest Image Base64 feather */
(function () {
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
