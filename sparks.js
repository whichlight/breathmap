var canvas;
var context;
var proton;
var renderer;
var emitter;
var mouseObj;
var attractionForce;

//All of the settings are in the createProton function, with the initializers
//the initializers can be reset too
var global_rows;
var lastx = 0;
var pause = false;
function moveForward() {
    if(pause == false){
      var o = map.latLngToLayerPoint(new L.LatLng(global_rows.rows[global_data].y, global_rows.rows[global_data].x));
      if (lastx != o.x){
          emitter.p.x = o.x- canvas.width/2;
          emitter.p.y = o.y- canvas.height/2;
          lastx = o.x;
      }
      global_data++;
      if(global_data==global_rows.rows.length){
          global_data=0;
      }
      var f = 60 - Math.floor(Math.min(average, 30));
      if (f < 40){
        setTimeout(moveForward, f);
      }
    }
    if (global_rows.rows[global_data].is_stop == true){
      if(document.getElementById(global_rows.rows[global_data].name)){
        var inst = $("[data-remodal-id="+global_rows.rows[global_data].name+"]").remodal();
        inst.open();
        $('.remodal-cancel').click(function(){pause=false})
        $('.remodal-close').click(function(){pause=false})
        pause = true;
      }
    }
}
function iterationL(data){
    global_rows = data;
    setTimeout(moveForward, 25);
}

function startSparks(_canvas) {
//  canvas = document.getElementById("testCanvas");
  canvas = _canvas;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  loadImage();
  mouseObj = {
    x : canvas.width / 2,
    y : canvas.height / 2
  };

  var sql = cartodb.SQL({ user: 'andrew' });

  sql.execute("select cartodb_id, ST_X(the_geom) x, ST_Y(the_geom) y, is_stop, name from breath_trajectoryx ORDER BY cartodb_id ASC").done(function(data) {
      iterationL(data);
  });

}


function loadImage() {
  var image = new Image()
    image.onload = function(e) {
      createProton(e.target);
      tick();
  //    canvas.addEventListener('mousedown', mouseDownHandler, false);
  //    canvas.addEventListener('mousemove', mouseDownHandler, false);
    }
  image.src = 'image/particle.png';
}

function createProton(image) {
  proton = new Proton;
  emitter = new Proton.Emitter();
  emitter.rate = new Proton.Rate(new Proton.Span(1, 20), 0.01);
  emitter.addInitialize(new Proton.Mass(1));
  emitter.addInitialize(new Proton.ImageTarget(image));
  emitter.addInitialize(new Proton.Position(new Proton.PointZone(mouseObj.x, mouseObj.y)));
  emitter.addInitialize(new Proton.Life(0.1, 1));
   emitter.addInitialize(new Proton.V(new Proton.Span(0, 0.2), new Proton.Span(0, 360), 'polar'));
  emitter.addBehaviour(new Proton.Color('#FFFFFF', '#FF9B00'));
//  attractionForce = new Proton.Attraction(mouseObj, 10, 200);
//  emitter.addBehaviour(attractionForce);
  velocity = new Proton.V(new Proton.Span(0, 0.2), new Proton.Span(0, 360), 'polar');
//  emitter.addBehaviour(velocity);
   emitter.addBehaviour(new Proton.Scale(Proton.getSpan(0.1, 0.2), Proton.getSpan(0.2, 0.3)));
  emitter.addBehaviour(new Proton.Alpha(0.5,1));
  emitter.emit();
  proton.addEmitter(emitter);

  renderer = new Proton.Renderer('canvas', proton, canvas);
  renderer.blendFunc("SRC_ALPHA", "ONE");
  renderer.start();
}

function mouseDownHandler(e) {
    emitter.p.x = e.clientX - canvas.width/2;
    emitter.p.y = e.clientY - canvas.height/2;
    console.log(e);

//  attractionForce.reset(mouseObj, 0, 200);
//
 // setTimeout(function() {
 //   attractionForce.reset(mouseObj, 10, 200);
//  }, 500);
}

function tick() {
  requestAnimationFrame(tick);
  if (proton)
    proton.update();
}


