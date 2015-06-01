(function() {
  var script = document.createElement('script');
  script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js';
  document.body.appendChild(script);
  script.onload = function() {
    $('blob').data('quit', true);
    var sizes = $('body :visible').map(function() {
      return $(this).outerHeight() * $(this).outerWidth() || undefined;
    });
    if (!sizes.length) {
      return;
    }
    sizes.sort(function(a, b) {
      return a - b;
    });

    var minsize = sizes[Math.floor(sizes.length * 0.1)],
        maxsize = sizes[Math.floor(sizes.length * 0.2)],
        size = Math.random() * (maxsize - minsize) + minsize + 1,
        mouse = null,
        blobx = $(window).width() / 2,
        bloby = $(window).height() / 2;
    var blob = $('<blob>').appendTo('body').css({
      background: 'green',
      border: '4px solid darkgreen',
      borderRadius: '100%',
      display: 'block',
      position: 'fixed',
      zIndex: 2147483647
    });

    function resize() {
      var radius = Math.sqrt(size / Math.PI);
      blob.css({
        width: radius * 2,
        height: radius * 2,
        marginLeft: -radius,
        marginTop: -radius
      });
    }
    function move() {
      if (mouse != null) {
        var dx = mouse.x - blobx,
            dy = mouse.y - bloby,
            d = Math.sqrt(dx * dx + dy * dy);
        if (d > 1) {
          var blobv = Math.min(100 / Math.log(size), d / 10);
          blobx += dx * blobv / d;
          bloby += dy * blobv / d;
        }
      }
      blob.css({
        left: blobx,
        top: bloby
      });
    }

    resize();
    $(window).mousemove(function(evt) {
      mouse = {
        x: evt.clientX,
        y: evt.clientY
      };
    });

    var timer = setInterval(function() {
      if ($(blob).data('quit')) {
        clearInterval(timer);
        blob.remove();
        return;
      }
      move();
      blob.css('z-index', -2147483647).height();
      var elt = $(document.elementFromPoint(blobx, bloby)),
          eltsize = elt.outerHeight() * elt.outerWidth();
      if (eltsize < size) {
        size += Math.sqrt(eltsize);
        elt.remove();
        resize();
      }
      blob.css('z-index', 2147483647);
    }, 50);
  };
})();
