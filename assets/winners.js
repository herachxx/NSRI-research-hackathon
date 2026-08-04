(function(){
  "use strict";

  var teams = Array.isArray(window.NSRI_TEAMS) ? window.NSRI_TEAMS : [];
  var ranked = teams.filter(function(team){ return Number.isInteger(team.rank); }).sort(function(a,b){ return a.rank-b.rank; });
  var finalists = teams.filter(function(team){ return !Number.isInteger(team.rank); }).sort(function(a,b){ return a.team.localeCompare(b.team); });

  function escapeHtml(value){
    return String(value == null ? "" : value)
      .replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")
      .replace(/"/g,"&quot;").replace(/'/g,"&#039;");
  }

  function profileUrl(team){ return "winner.html?team=" + encodeURIComponent(team.slug); }

  function firstUrl(value){
    var match = String(value || "").match(/https?:\/\/[^\s]+/i);
    return match ? match[0].replace(/[),.;]+$/,"") : "";
  }

  function videoEmbed(value){
    var source = firstUrl(value);
    if(!source) return null;
    try{
      var url = new URL(source);
      var host = url.hostname.toLowerCase();
      var youtube = "";
      if(host === "youtu.be") youtube = url.pathname.split("/").filter(Boolean)[0] || "";
      if(host.indexOf("youtube.com") !== -1) youtube = url.searchParams.get("v") || (url.pathname.indexOf("/embed/") === 0 ? url.pathname.split("/")[2] : "");
      if(youtube) return {type:"embed",url:"https://www.youtube-nocookie.com/embed/"+encodeURIComponent(youtube)};
      if(host.indexOf("loom.com") !== -1){
        var loomMatch = url.pathname.match(/\/(?:share|embed)\/([^/]+)/);
        if(loomMatch) return {type:"embed",url:"https://www.loom.com/embed/"+encodeURIComponent(loomMatch[1])};
      }
      if(host.indexOf("screencastify.com") !== -1 && url.pathname.indexOf("/watch/") === 0){
        return {type:"link",url:url.href};
      }
      return null;
    }catch(error){ return null; }
  }

  function videoCard(team){
    var media = videoEmbed(team.video);
    if(!media) return "";
    var visual = media.type === "video" ?
      '<video src="' + escapeHtml(media.url) + '" title="' + escapeHtml(team.team) + ' presentation video" controls preload="metadata" playsinline></video>' :
      (media.type === "link" ? '<a class="video-watch" href="' + escapeHtml(media.url) + '" target="_blank" rel="noopener"><span aria-hidden="true">&#9654;</span>Watch public recording</a>' :
      '<iframe src="' + escapeHtml(media.url) + '" title="' + escapeHtml(team.team) + ' presentation video" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>');
    var placement = Number.isInteger(team.rank) ? "Rank #"+team.rank : "Top 100 Finalist · unranked";
    return '<article class="video-card"><div class="video-frame">' + visual + '</div><div class="video-card-copy"><span class="video-label">' + escapeHtml(placement) + '</span><h3>' + escapeHtml(team.team) + '</h3><p>' + escapeHtml(team.title) + '</p><a class="video-profile-link" href="' + profileUrl(team) + '">View team profile <span aria-hidden="true">&rarr;</span></a></div></article>';
  }

  function podiumCard(team){
    var className = team.rank === 1 ? "podium-card first reveal" : "podium-card reveal";
    return '<article class="' + className + '">' +
      '<div class="rank-disc" aria-label="Rank ' + team.rank + '">#' + team.rank + '</div>' +
      '<div class="podium-track">' + escapeHtml(team.track) + '</div>' +
      '<h3>' + escapeHtml(team.team) + '</h3>' +
      '<p class="project">' + escapeHtml(team.title) + '</p>' +
      '<div class="prize">Awarded<strong>' + escapeHtml(team.prize || "Top 3") + '</strong></div>' +
      '<a class="card-link" href="' + profileUrl(team) + '" aria-label="Open ' + escapeHtml(team.team) + ' winner profile"></a>' +
    '</article>';
  }

  function rankedCard(team){
    return '<article class="ranked-card reveal">' +
      '<span class="ranked-number">#' + team.rank + '</span>' +
      '<span class="track-pill">' + escapeHtml(team.track) + '</span>' +
      '<h3>' + escapeHtml(team.team) + '</h3>' +
      '<p>' + escapeHtml(team.title) + '</p>' +
      '<a class="card-link" href="' + profileUrl(team) + '" aria-label="Open rank ' + team.rank + ': ' + escapeHtml(team.team) + '"></a>' +
    '</article>';
  }

  function finalistCard(team){
    return '<article class="finalist-card reveal" data-track="' + escapeHtml(team.track) + '" data-search="' + escapeHtml((team.team+" "+team.title+" "+team.track).toLowerCase()) + '">' +
      '<div class="dot" aria-hidden="true"></div>' +
      '<h3>' + escapeHtml(team.team) + '</h3>' +
      '<p>' + escapeHtml(team.title) + '</p>' +
      '<a class="card-link" href="' + profileUrl(team) + '" aria-label="Open finalist profile for ' + escapeHtml(team.team) + '"></a>' +
    '</article>';
  }

  var podium = document.getElementById("podium");
  if(podium){
    var top = ranked.slice(0,3);
    var displayOrder = [top[1],top[0],top[2]].filter(Boolean);
    podium.innerHTML = displayOrder.map(podiumCard).join("");
  }

  var rankedGrid = document.getElementById("rankedGrid");
  if(rankedGrid) rankedGrid.innerHTML = ranked.slice(3).map(rankedCard).join("");

  var videoRail = document.getElementById("videoRail");
  if(videoRail){
    var videoTeams = teams.filter(function(team){ return team.videoPublic !== false && videoEmbed(team.video); }).sort(function(a,b){ return (a.rank || 999)-(b.rank || 999) || a.team.localeCompare(b.team); });
    videoRail.innerHTML = videoTeams.map(videoCard).join("");
    var previousVideo = document.getElementById("videoPrevious");
    var nextVideo = document.getElementById("videoNext");
    function moveVideoRail(direction){
      videoRail.scrollBy({left:direction * Math.max(320,videoRail.clientWidth*.82),behavior:"smooth"});
    }
    if(previousVideo) previousVideo.addEventListener("click",function(){ moveVideoRail(-1); });
    if(nextVideo) nextVideo.addEventListener("click",function(){ moveVideoRail(1); });
  }

  var finalistGrid = document.getElementById("finalistGrid");
  if(finalistGrid) finalistGrid.innerHTML = finalists.map(finalistCard).join("");

  document.querySelectorAll("[data-ranked-count]").forEach(function(node){ node.textContent = ranked.length; });
  document.querySelectorAll("[data-finalist-count]").forEach(function(node){ node.textContent = finalists.length; });
  document.querySelectorAll("[data-total-count]").forEach(function(node){ node.textContent = teams.length; });

  var filterRow = document.getElementById("trackFilters");
  var searchInput = document.getElementById("teamSearch");
  var activeTrack = "All";
  var tracks = Array.from(new Set(finalists.map(function(team){ return team.track; }))).sort();

  function shortTrack(track){
    if(track.indexOf("AI,") === 0) return "AI & Data";
    if(track.indexOf("Social") === 0) return "Social Sciences";
    if(track.indexOf("Physical") === 0) return "Physical Sciences";
    if(track.indexOf("Environmental") === 0) return "Environmental";
    if(track.indexOf("Health") === 0) return "Health";
    if(track.indexOf("Engineering") === 0) return "Engineering";
    return track;
  }

  function updateGallery(){
    if(!finalistGrid) return;
    var query = searchInput ? searchInput.value.trim().toLowerCase() : "";
    var visible = 0;
    finalistGrid.querySelectorAll(".finalist-card").forEach(function(card){
      var trackMatch = activeTrack === "All" || card.dataset.track === activeTrack;
      var searchMatch = !query || card.dataset.search.indexOf(query) !== -1;
      card.hidden = !(trackMatch && searchMatch);
      if(!card.hidden) visible++;
    });
    var empty = document.getElementById("galleryEmpty");
    if(empty) empty.hidden = visible !== 0;
  }

  if(filterRow){
    var labels = ["All"].concat(tracks);
    filterRow.innerHTML = labels.map(function(track,index){
      return '<button class="filter-button' + (index===0?' is-active':'') + '" type="button" data-track-filter="' + escapeHtml(track) + '">' + escapeHtml(shortTrack(track)) + '</button>';
    }).join("");
    filterRow.addEventListener("click",function(event){
      var button = event.target.closest("[data-track-filter]");
      if(!button) return;
      activeTrack = button.dataset.trackFilter;
      filterRow.querySelectorAll("button").forEach(function(item){ item.classList.toggle("is-active",item===button); });
      updateGallery();
    });
  }
  if(searchInput) searchInput.addEventListener("input",updateGallery);

  var menuButton = document.getElementById("menuButton");
  var navLinks = document.getElementById("resultsLinks");
  if(menuButton && navLinks){
    menuButton.addEventListener("click",function(){
      var open = navLinks.classList.toggle("is-open");
      menuButton.setAttribute("aria-expanded",String(open));
    });
  }

  var observer = "IntersectionObserver" in window ? new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){ entry.target.classList.add("is-visible"); observer.unobserve(entry.target); }
    });
  },{threshold:.08}) : null;
  document.querySelectorAll(".reveal").forEach(function(node){
    if(observer) observer.observe(node); else node.classList.add("is-visible");
  });
})();
