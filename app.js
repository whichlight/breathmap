
var map = new L.Map('map', {
  zoomControl: false,
  center: [50.35499, 6.9646],
  zoom: 2
});

var global_data = 0;

function iterationL(data, em){
    console.log(map.getPixelOrigin())
    var lastx = 0;
    setInterval(function(){
        var o = map.latLngToLayerPoint(new L.LatLng(data.rows[global_data].y, data.rows[global_data].x));
        if (lastx != o.x){
            em.x = o.x- canvas.width/2;
            em.y = o.y- canvas.height/2;
            lastx = o.x
        }
        global_data++;
        if(global_data==data.rows.length){
            global_data=0;
        }
    }, 5)
}

var sql = cartodb.SQL({ user: 'andrew' });

cartodb.createLayer(map, 'http://team.cartodb.com/api/v2/viz/f8123be4-a409-11e4-86d6-0e018d66dc29/viz.json')
  .done(function(layer) {
    var SparksLayer= L.CanvasLayer.extend({
      options: {zIndex: 1},
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

    var status = 0;
    navigator.webkitGetUserMedia({audio:true, video:false}, function(stream){
        audioContext = new webkitAudioContext();
        analyser = audioContext.createAnalyser();
        microphone = audioContext.createMediaStreamSource(stream);
        javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);

        analyser.smoothingTimeConstant = 0.3;
        analyser.fftSize = 1024;

        microphone.connect(analyser);
        analyser.connect(javascriptNode);
        javascriptNode.connect(audioContext.destination);

        javascriptNode.onaudioprocess = function() {
            var array =  new Uint8Array(analyser.frequencyBinCount);
            analyser.getByteFrequencyData(array);
            var values = 0;

            var length = array.length;
            for (var i = 0; i < length; i++) {
                values += array[i];
            }

            var average = values / length;
            if(status == 0){
                if (average > 40){
                    console.log('noise!')
                    status=1;

                }
            } else {
                if (average <= 40){
                    status=0;
                }
            }
        }

    }, function (){console.warn("Error getting audio stream from getUserMedia")});


    sql.execute("select cartodb_id, ST_X(the_geom) x, ST_Y(the_geom) y from ansible_location_master ORDER BY last_seen ASC").done(function(data) {
        iterationL(data,emitter.p);
    });


})
.addTo(map);


