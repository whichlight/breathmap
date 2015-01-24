
var map = new L.Map('map', {
  zoomControl: false,
  center: [50.35499, 6.9646],
  // center: [42.67, -1.23],
  zoom: 2
});

var global_data = 0;

var getSlippyTileLayerPoints = function (lat_deg, lng_deg, zoom) {
    var x = (Math.floor((lng_deg + 180) / 360 * Math.pow(2, zoom)));
    var y = (Math.floor((1 - Math.log(Math.tan(lat_deg * Math.PI / 180) + 1 / Math.cos(lat_deg * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom)));

    var layerPoint = {
        x: x,
        y: y
    };

    return layerPoint;
};
function iterationL(data, em){
    console.log(map.getPixelOrigin())
    var lastx = 0;
    setInterval(function(){
        var d = data.rows[global_data];
        // console.log(map.project([d.y, d.x]).divideBy(256).floor())
        var o = map.latLngToLayerPoint(new L.LatLng(d.y, d.x));
        // var o = map.project([d.y, d.x]).divideBy(256).floor()
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

        sql.execute("select cartodb_id, ST_X(the_geom) x, ST_Y(the_geom) y from ansible_location_master ORDER BY last_seen ASC").done(function(data) {
            iterationL(data,emitter.p);
        });
  // Do further things here
  })
  .addTo(map);


