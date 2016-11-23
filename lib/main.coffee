Vue.use AsyncComputed

articles = [
  {
    title: "Ascacou, a game both in browser & electron"
    type: "arcticle"
    contentUrl: "articles/ascacou-a-game-both-in-browser-electron.html"
  }, {
    title: "How to work asynchronously with Ruby as in javascript"
    type: "question of the month"
    contentUrl: "articles/placeholder.html"
  }, {
    title: "This article is about the meaning of life"
    type: "question of the month"
    contentUrl: "articles/placeholder.html"
  },{
    title: "On Clipboard access for developers"
    type: "question of the month"
    contentUrl: "articles/placeholder.html"
  }]

@clipcopy = (text) =>
  textArea = document.createElement("textarea")
  textArea.style.position = 'fixed'
  textArea.style.top = 0
  textArea.style.left = 0
  textArea.style.width = '2em'
  textArea.style.height = '2em'
  textArea.style.padding = 0
  textArea.style.border = 'none'
  textArea.style.outline = 'none'
  textArea.style.boxShadow = 'none'
  textArea.style.background = 'transparent'
  textArea.value = text
  document.body.appendChild(textArea)
  textArea.select()
  try
    document.execCommand('copy')
  catch
    console.log _error
  document.body.removeChild(textArea)

Vue.component 'articleResume',
  props: ['article', 'exp']
  template: """
    <article :id="slugify(article.title)" @click='if (!exp) expand()'>
      <span class='collapse' @click.stop='collapse()' :class='{visible: exp}'><i class='fa fa-compress'></i></span>
      <h2>{{article.title}}</h2>

      <div class='article-content' v-html="content" :class='{expanded: exp}'></div>
    </article>
    """
  asyncComputed:
    content:
      get: () ->
        Vue.http.get(@article.contentUrl).then (response) -> response.body
      default: "..."
  methods:
    expand: () ->
      @exp = true # fixme: should use a computed variable instead (or setter and getter)
      setTimeout(() =>
        window.location = '#' + @slugify(@article.title)
      , 200)
    collapse: () ->
      @exp = false
      window.location = '#'
    slugify: (text) ->
      text.toLowerCase().replace(/[^\w ]+/g,'').replace(/\ +/g,'-')
    clipcopy: window.clipcopy


@app = new Vue
  el: "#app"
  data:
    articles: articles
  methods:
    clipcopy: window.clipcopy

###
  this function is used in footer for email clipcopy event.
###
@addclicked = (event) ->
  event.stopPropagation()
  event.preventDefault()
  document.querySelector('.email>span').classList.add 'copied'
  setTimeout () ->
    document.querySelector('.email>span').classList.remove 'copied'
  , 2000
