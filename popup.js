
$(function() {
 $('#search').change(function() {
    $('#bookmarks').empty();
    dumpBookmarks($('#search').val());
  });
});
// Traverse the bookmark tree, and print the folder and nodes.
function dumpBookmarks(query) {
  if (!query) {
    query = '';
  }
  $('#bookmarks').append('<form>');
  var bookmarkTreeNodes = chrome.bookmarks.getTree(function(bm) {
    var all = [];
    traverse(bm, all, query);
    for (var i = 0; i < all.length; i++) {
      var title = all[i].title ? all[i].title : all[i].url;
      var url = all[i].url;
      $('form').append('<input type="checkbox" value="' + url + '">')
        .append('<a href="' + url + '">' + title.substr(0, 50) + '</a><br>');
    }
  });
  $('form').append('<div class="old-buttons"></div>')
  $('.old-buttons').append('<a class="btn waves-effect waves-light light-green submit">Save recipes</a>');
  $('.old-buttons').append('<a class="btn waves-effect waves-light grey check">Check all</a><br>')
  $('.check').click(function(event) {
    if ($(this).text() == 'Check all') {
      $('input:checkbox').prop('checked', true);
      $(this).text('Uncheck all');
    } else {
      $('input:checkbox').prop('checked', false);
      $(this).text('Check all');
    }
    event.stopPropagation();
  });
  $('.submit').click(function(event) {
    var urls = [];
    var checked = $('input:checked');
    for (var i = 0; i < checked.length; i++) {
      urls.push(checked[i].value);
    }
    console.log(urls);
  });
}

function traverse(nodes, list, query) {
  for (var i = 0; i < nodes.length; i++) {
    if (nodes[i].children) {
      traverse(nodes[i].children, list, query);
    } else {
      var title = nodes[i].title;
      var url = nodes[i].url;
      if (title.indexOf(query) > -1 || url.indexOf(query) > -1) {
        list.push(nodes[i]);
      }
    }
  }
}


 document.addEventListener('DOMContentLoaded', function() {
  $('.bookmark').click(function(e) {
    chrome.tabs.query({
      active: true,               // Select active tabs
      lastFocusedWindow: true     // In the current window
    }, function(tabs) {
      var url = tabs[0].url;
      // var rUrl = 'http://recipe-manager.herokuapp.com/addRecipe';
      var rUrl = 'http://localhost:9000/addRecipe';

      $.ajax({
        type: 'POST',
        url: rUrl,
        data: {url: url}
      })
      .done(function(msg) {
        console.log(msg);
        var ingredients = msg.ingredients;
        for (var i = 0; i < ingredients.length; i++) {
          $('body').append('<div>' + ingredients[i] + '</div>');
        }
        var instructions = msg.instructions;
        for (var i = 0; i < instructions.length; i++) {
          $('body').append('<div>' + instructions[i] + '</div>');
        }
      });
    });
  });
  $('.old-bookmarks').click(function(e) {
    $('.existing').show();
    $('#bookmarks').empty();
    dumpBookmarks();
  });
 });


    chrome.tabs.getCurrent(function(tab) {
      console.log(tab);
    });
