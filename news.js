const API_KEY_NT = 'FwLzNfy2zMccC5ApnWI1jbUfKos1SA1n';
let section, articles;
const sections = ['business', 'technology', 'politics', 'world'];

const loading =
  $(`<div id="loading" class="loading d-flex justify-content-center w-100 mt-5">
<i class="fa-solid fa-spinner fa-spin"><span class="visually-hidden"</span></i>
</div>`);

sections.forEach((section) => {
  if ($(`.top-section[data-section="${section}"]`).length) {
    articles = $(`.top-section[data-section="${section}"] article`);
    renderTopArtcilesSections(section, articles, true);
  }
});


function renderTopArtcilesSections(section, articles, isMain) {
  let ny = `https://api.nytimes.com/svc/topstories/v2/${section}.json?api-key=${API_KEY_NT}`;

  $.ajax({
    url: ny,
    method: 'GET',
  })
    .then(function (resp) {
      let results = resp.results;

      // filter results not to show 'promo'
      results = results.filter((results) => {
        return results.item_type.includes('Article');
      });

      if (resp.status === 'OK') {
        if (isMain) {
          const featuredArticle = results[0];
          updateArticleContent(featuredArticle, $(articles[0]));
          for (let i = 1; i < 3; i++) {
            let article = results[i];
            updateArticleContent(article, $(articles[i]));
          }
        } else {
          for (let i = 3; i < articles.length + 3; i++) {
            let article = results[i];
            updateArticleContent(article, $(articles[i - 3]));
          }
        }

        function updateArticleContent(article, $articleElement) {
          let largeThumnail = article.multimedia[0];
          let thumbnail = article.multimedia[1];
          let category = article.section;
          let title = article.title;
          let articleURL = article.url;
          let abstract = article.abstract;
          let byline = article.byline;
          let publishedDate = moment(article.published_date).format('LL');

          $articleElement.find('.thumbnail').append(`
        <img src="${
          $articleElement.hasClass('featured')
            ? largeThumnail.url
            : thumbnail.url
        }" alt="${
            $articleElement.hasClass('featured')
              ? largeThumnail.caption
              : thumbnail.caption
          }"/>
      `);
          $articleElement.find('.badge').text(`${category}`);
          $articleElement.find('.article-title')
            .append(`<a class="stretched-link" href="${articleURL}" target="_blank"><h3>
      ${title}</h3></a>`);
          $articleElement
            .find('.article-abstract')
            .append(`<p>${abstract}</p>`);
          $articleElement.find('.by-line').append(`<span>${byline}</span>`);
          $articleElement
            .find('.last-updated')
            .append(`<span>Published on</span> ${publishedDate}`);
        }
      } else {
        showError($articleElement);
      }
    })
    .catch((err) => {
      showError($articleElement);
    });
}





