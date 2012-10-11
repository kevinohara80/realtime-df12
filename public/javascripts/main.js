Reveal.initialize({
  // Display controls in the bottom right corner
  controls: true,

  // Display a presentation progress bar
  progress: true,

  // Push each slide change to the browser history
  history: false,

  // Enable keyboard shortcuts for navigation
  keyboard: true,

  // Loop the presentation
  loop: false,

  // Number of milliseconds between automatically proceeding to the 
  // next slide, disabled when set to 0
  autoSlide: 0,

  // Enable slide navigation via mouse wheel
  mouseWheel: true,

  // Apply a 3D roll to links on hover
  rollingLinks: true,

  // UI style
  theme: 'neon', // default/neon/beige

  // Transition style
  transition: 'default' // default/cube/page/concave/linear(2d)
});

var content = $('#slidesection');
var socket = io.connect(window.location.hostname);

socket.on('connect', function () {
  console.log("Connected to Socket IO");
  content.append($('<section>')
    .append($('<h1 class="color-red">').text("Welcome")
    .append($('<h3 class="color-green">').text("Connected to Socket IO"))));
  Reveal.navigateNext();
});

socket.on('force', function(data) {
  console.log(JSON.parse(data));
  data = JSON.parse(data);     
  var from = $('<h1 class="color-'+data.sobject.Name+'">').text(data.sobject.Name);   
  var logo = $('<img>')
    .attr('src', 'http://www.hydraulicrepairestimator.com/Images/NoSoftware.png')
    .css('height', '90px')
    .css('margin-right', '10px');        
  var body = $('<h3 class="'+data.sobject.Name+'">').text(data.sobject.Name);
  content.append($('<section>')
    .append(from)
    .append(body));
  Reveal.navigateNext();       
});

socket.on('twilio', function(data) {
  console.log(JSON.parse(data));
  data = JSON.parse(data);     
  var from = $('<h1 class="color-blue">').text('# ' + data.From.substring(0,5) + '*******');
  var logo = $('<img>')
    .attr('src', 'http://status.twilio.com/images/logo.png')
    .css('height', '90px')
    .css('margin-right', '10px');        
  var body = $('<h3 class="red">').text(data.Body);
  content.append($('<section>')
    .append(from.prepend(logo))
    .append(body));
  Reveal.navigateNext();       
});

socket.on('twitter', function(data) {
  console.log(JSON.parse(data));
  data = JSON.parse(data);     
  var sn = $('<h1 class="color-blue">').text('@' + data.user.screen_name);
  var img = $('<img>')
    .attr('src', data.user.profile_image_url)
    .css('height', '90px')
    .css('margin-right', '10px');
  var txt = $('<h3 class="color-yellow">').text(data.text);
  content.append($('<section>')
    .append(sn.prepend(img))
    .append(txt)); 
  Reveal.navigateNext();       
}); 