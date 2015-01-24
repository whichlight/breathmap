var canvas;
var context;
var proton;
var renderer;
var emitter;
var mouseObj;
var attractionForce;

//All of the settings are in the createProton function, with the initializers
//the initializers can be reset too


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
  emitter.rate = new Proton.Rate(new Proton.Span(1, 40), 0.01);
  emitter.addInitialize(new Proton.Mass(1));
  emitter.addInitialize(new Proton.ImageTarget(image));
  emitter.addInitialize(new Proton.Position(new Proton.PointZone(mouseObj.x, mouseObj.y)));
  emitter.addInitialize(new Proton.Life(0.1, 0.5));
  emitter.addInitialize(new Proton.V(new Proton.Span(0.2, 0.5), new Proton.Span(0, 360), 'polar'));
  emitter.addBehaviour(new Proton.Color('#FF0000', '#FF9B00'));
//  attractionForce = new Proton.Attraction(mouseObj, 10, 200);
//  emitter.addBehaviour(attractionForce);
  // emitter.addBehaviour(new Proton.Scale(Proton.getSpan(0.1, 0.2), Proton.getSpan(0.2, 0.5)));
  emitter.addBehaviour(new Proton.Alpha(1,1));
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


