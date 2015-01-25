
var map = new L.Map('map', {
  zoomControl: false,
  center: [50.35499, 6.9646],
  zoom: 2
});

var global_data = 0;
var status = 0;

var rendered = 0;
var average = 0;

cartodb.createLayer(map, 'http://team.cartodb.com/api/v2/viz/f8123be4-a409-11e4-86d6-0e018d66dc29/viz.json')
  .done(function(layer) {
    var SparksLayer= L.CanvasLayer.extend({
      options: {zIndex: 1},
      render: function() {
                var canvas = this.getCanvas();
                var ctx = canvas.getContext('2d');

                //starts particle system from sparks.js
                if(rendered == 0){
                  rendered = 1;
                  startSparks(canvas);
                }
                //emitter.x -> xpos of emitter
                //emitter.y -> ypos of emitter
              }
    });

    var layer = new SparksLayer();
    layer.addTo(map);

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

            average = values / length;

            var thresh = 60;

            if(status==1){
                console.log('noise!')
            }

            if(status == 0){
                if (average >thresh){
                    status=1;
                    emitter.rate.numPan.a = 20;
                    emitter.rate.numPan.b = 40;
                     emitter.initializes[4].rPan.b = 1;
                     moveForward();
                    // emitter.initializes[3].lifePan.b = 3
                }
            } else {
                if (average <= thresh){
                    status=0;
                    emitter.rate.numPan.a = 1;
                    emitter.rate.numPan.b = 10;
                     emitter.initializes[4].rPan.b = 0.2;
                    // emitter.initializes[3].lifePan.b = 1;
                }
            }
        }

    }, function (){console.warn("Error getting audio stream from getUserMedia")});



})
.addTo(map);

$("#team").click(function(){
    var inst = $("#teampop").remodal();
    inst.open();
       $('.remodal-close').click(function(){pause=false})
        pause = true;
});


$("#about").click(function(){
    var inst = $("#aboutpop").remodal();
    inst.open();
        $('.remodal-close').click(function(){pause=false})
        pause = true;
});
