(function(){
  "use strict";

  var teams = Array.isArray(window.NSRI_TEAMS) ? window.NSRI_TEAMS : [];
  var additionalPrizeTeams = teams.filter(function(team){
    return Number.isInteger(team.rank) && team.rank >= 4 && team.rank <= 5;
  }).sort(function(a,b){ return a.rank-b.rank; });
  var ranks6to25 = teams.filter(function(team){
    return Number.isInteger(team.rank) && team.rank >= 6 && team.rank <= 25;
  }).sort(function(a,b){ return a.rank-b.rank; });

  function escapeHtml(value){
    return String(value == null ? "" : value)
      .replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")
      .replace(/"/g,"&quot;").replace(/'/g,"&#039;");
  }

  function profileUrl(team){ return "winner.html?team=" + encodeURIComponent(team.slug); }

  function additionalPrizeCard(team){
    return '<article class="podium-card secondary is-visible">' +
      '<div class="rank-disc" aria-label="Rank ' + team.rank + '">#' + team.rank + '</div>' +
      '<div class="podium-track">' + escapeHtml(team.track) + '</div>' +
      '<h3>' + escapeHtml(team.team) + '</h3>' +
      '<p class="project">' + escapeHtml(team.title) + '</p>' +
      '<div class="prize">Awarded<strong>' + escapeHtml(team.prize) + '</strong></div>' +
      '<a class="card-link" href="' + profileUrl(team) + '" aria-label="Open rank ' + team.rank + ': ' + escapeHtml(team.team) + ' winner profile"></a>' +
    '</article>';
  }

  function rankedCard(team){
    return '<article class="ranked-card is-visible">' +
      '<span class="ranked-number">#' + team.rank + '</span>' +
      '<span class="track-pill">' + escapeHtml(team.track) + '</span>' +
      '<h3>' + escapeHtml(team.team) + '</h3>' +
      '<p>' + escapeHtml(team.title) + '</p>' +
      '<a class="card-link" href="' + profileUrl(team) + '" aria-label="Open rank ' + team.rank + ': ' + escapeHtml(team.team) + '"></a>' +
    '</article>';
  }

  var additionalPrizeGrid = document.getElementById("additionalPrizeGrid");
  if(additionalPrizeGrid) additionalPrizeGrid.innerHTML = additionalPrizeTeams.map(additionalPrizeCard).join("");

  var rankedGrid = document.getElementById("rankedGrid");
  if(rankedGrid) rankedGrid.innerHTML = ranks6to25.map(rankedCard).join("");
})();
