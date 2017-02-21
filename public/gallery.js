// Javascript for the gallery page
var title = document.getElementById('gallery-title');
var form = document.getElementById('gallery-title-edit');

title.onclick = function(e) {
  e.preventDefault();
  form.style.display = 'block';
}
