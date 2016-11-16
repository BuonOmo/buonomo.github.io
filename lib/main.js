(function() {
  var app, articles;

  articles = [
    {
      title: "Ascacou, a game in browser and electron",
      description: "Ascacou is a two player game, created by my uncle Marc Buonomo.\nI’ve made an online and an electron version of this game, which you\ncan find on <a href=\"https://github.com/BuonOmo/ascacou\">github</a>.\nSoon it will be an online game, using Ruby on Rails or Nodejs.",
      template: "asc.html",
      type: "arcticle"
    }, {
      title: "Does Ruby on Rails work asynchronously as Node.js?",
      description: "Yesterday I was wondering about which one to choose between Ruby on Rails\nor Express framework. Ruby is way prettier and thus more attractive.\nHowever, is it as efficient as javascript which is made to work\nasynchronously?",
      type: "question of the month"
    }
  ];

  Vue.component('articleResume', {
    props: ['article'],
    template: "<article>\n  <h2><a :href=\"article.template\">{{article.title}}</a></h2>\n  <p v-html=\"article.description\"></p>\n</article>"
  });

  app = new Vue({
    el: "#app",
    data: {
      articles: articles
    }
  });

}).call(this);