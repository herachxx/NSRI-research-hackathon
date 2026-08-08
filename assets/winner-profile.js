(function(){
  "use strict";
  var teams = Array.isArray(window.NSRI_TEAMS) ? window.NSRI_TEAMS : [];
  var params = new URLSearchParams(window.location.search);
  var slug = params.get("team") || "";
  var team = teams.find(function(item){ return item.slug === slug; });

  function escapeHtml(value){
    return String(value == null ? "" : value)
      .replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")
      .replace(/"/g,"&quot;").replace(/'/g,"&#039;");
  }

  function safeUrl(value){
    try{
      var raw = String(value || "");
      var match = raw.match(/https?:\/\/[^\s]+/i);
      var url = new URL(match ? match[0].replace(/[),.;]+$/,"") : raw);
      return /https?:/.test(url.protocol) ? url.href : "";
    }catch(error){ return ""; }
  }

  function videoMedia(value){
    try{
      var url = new URL(safeUrl(value));
      var youtube = "";
      if(url.hostname === "youtu.be") youtube = url.pathname.slice(1).split("/")[0];
      if(url.hostname.indexOf("youtube.com") !== -1) youtube = url.searchParams.get("v") || (url.pathname.startsWith("/embed/") ? url.pathname.split("/")[2] : "");
      if(youtube) return {type:"embed",url:"https://www.youtube-nocookie.com/embed/" + encodeURIComponent(youtube)};
      if(url.hostname.indexOf("loom.com") !== -1){
        var loomMatch = url.pathname.match(/\/(?:share|embed)\/([^/]+)/);
        if(loomMatch) return {type:"embed",url:"https://www.loom.com/embed/" + encodeURIComponent(loomMatch[1])};
      }
      if(url.hostname.indexOf("screencastify.com") !== -1){
        var screencastifyMatch = url.pathname.match(/\/watch\/([^/]+)/);
        if(screencastifyMatch) return {type:"link",url:url.href};
      }
    }catch(error){}
    return "";
  }

  var root = document.getElementById("profileRoot");
  if(!team){
    document.title = "Team not found | NSRI";
    root.innerHTML = '<section class="section"><div class="shell"><div class="profile-card"><p class="eyebrow">Profile unavailable</p><h1 class="editorial-title">We could not find that team.</h1><p>The link may be incomplete. Return to the winner gallery to choose a team.</p><a class="button button-dark" href="winners.html">View all teams</a></div></div></section>';
    return;
  }

  document.title = team.team + " | NSRI Hackathon 2026";
  var metaDescription = document.querySelector('meta[name="description"]');
  if(metaDescription) metaDescription.setAttribute("content",team.team + " — " + team.title + ". NSRI Summer Research Hackathon 2026.");

  var isPublished = Number.isInteger(team.rank) && team.rank >= 1 && team.rank <= 100;
  var published = teams.filter(function(item){
    return Number.isInteger(item.rank) && item.rank >= 1 && item.rank <= 100;
  }).sort(function(a,b){ return a.rank-b.rank; });
  var archiveOnly = teams.filter(function(item){
    return !Number.isInteger(item.rank) || item.rank < 1 || item.rank > 100;
  }).sort(function(a,b){ return a.team.localeCompare(b.team); });
  var ordered = isPublished ? published : archiveOnly;
  var currentIndex = ordered.findIndex(function(item){ return item.slug === team.slug; });
  var next = ordered[(currentIndex+1)%ordered.length];
  var members = team.members.reduce(function(list,item){
    return list.concat(String(item).split(/\s*(?:\||,)\s*/).filter(Boolean));
  },[]);
  var media = team.videoPublic === false ? null : videoMedia(team.video);
  var videoPlayer = media && media.type === "video" ?
    '<video class="profile-video" src="' + escapeHtml(media.url) + '" title="' + escapeHtml(team.team) + ' presentation" controls preload="metadata" playsinline></video>' :
    (media && media.type === "link" ? '<a class="profile-video profile-video-link" href="' + escapeHtml(media.url) + '" target="_blank" rel="noopener"><span aria-hidden="true">&#9654;</span><strong>Watch presentation</strong><small>Opens the public Screencastify recording</small></a>' :
    (media ? '<iframe class="profile-video" src="' + escapeHtml(media.url) + '" title="' + escapeHtml(team.team) + ' presentation" loading="eager" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>' : ''));
  var videoBlock = media ?
    '<div class="profile-card profile-video-card"><p class="eyebrow">Watch the research</p><h2>Presentation video</h2>' + videoPlayer + '</div>' : '';

  var rankLabel = isPublished ? "Rank #" + team.rank : "Research archive";
  root.innerHTML =
    '<section class="winner-masthead"><div class="shell">' +
      '<a class="crumb" href="winners.html">← 2026 winner gallery</a>' +
      '<div class="profile-badges"><span class="profile-badge' + (isPublished && team.rank<=3?' gold':'') + '">' + escapeHtml(rankLabel) + '</span><span class="profile-badge">' + escapeHtml(team.track) + '</span>' + (team.prize?'<span class="profile-badge gold">' + escapeHtml(team.prize) + ' award</span>':'') + '</div>' +
      '<h1>' + escapeHtml(team.team) + '</h1>' +
      '<p>' + escapeHtml(team.title) + '</p>' +
    '</div></section>' +
    '<section class="section"><div class="shell profile-layout"><div>' +
      '<div class="profile-card"><p class="eyebrow">The research</p><h2>Project overview</h2><p class="profile-summary">' + escapeHtml(team.summary || "Project summary coming soon.") + '</p></div>' +
      videoBlock +
    '</div><aside>' +
      '<div class="profile-card"><p class="eyebrow">The team</p><h2>Researchers</h2><ul class="member-list">' + members.map(function(name){ return '<li>' + escapeHtml(name) + '</li>'; }).join("") + '</ul></div>' +
      '<a class="next-profile" href="winner.html?team=' + encodeURIComponent(next.slug) + '"><div><span>Next team</span><strong>' + escapeHtml(next.team) + '</strong></div><b aria-hidden="true">→</b></a>' +
    '</aside></div></section>';

  var menuButton = document.getElementById("menuButton");
  var navLinks = document.getElementById("resultsLinks");
  if(menuButton && navLinks) menuButton.addEventListener("click",function(){
    var open=navLinks.classList.toggle("is-open");
    menuButton.setAttribute("aria-expanded",String(open));
  });
})();
