var map = L.map('map').setView([0.0, -40.0], 2);

L.tileLayer('http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery <a href="http://stamen.com">Stamen</a>'
    }).addTo(map);

var SparksLayer= L.CanvasLayer.extend({
  render: function() {
            var canvas = this.getCanvas();
            var ctx = canvas.getContext('2d');

            //starts particle system from sparks.js
            startSparks(canvas);
            //emitter.x -> xpos of emitter
            //emitter.y -> ypos of emitter
          }
});

var layer = new SparksLayer();
layer.addTo(map);


