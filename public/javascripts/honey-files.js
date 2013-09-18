var HoneyFiles = {

  init: function() {
    var self = this; 

    $(document).on('click', 'a.create-new-campaign', function(e) {
      e.preventDefault();

      var box = self.render.popup('new-campaign', {
        title: "Revoke Firewall Access Lease",
        message: "Are you sure you want to revoke this firewall access lease?. All communications to this port for the supplied source with be terminated.",
        button: {
          title: "Yes, Revoke It.",
          type: "warning"
        },
        icon: "remove"
      }, {
        onAction: function() {
          $.limpClose();
        }
      });

      box.open();
    });
  },

  render: {

    popupOptions: {
      cache: false,
      adjustmentSize: 0,
      loading: true,
      alwaysCenter: true,
      shadow: "0 0px 10px rgba(0,0,0,0.1)",
      round: 0,
      animation: "pop",
      distance: 10,
      overlayClick: true,
      enableEscapeButton: true,
      dataType: 'html',
      centerOnResize: true,
      closeButton: true,
      style: {
        '-webkit-outline': 0,
        color: '#000',
        position: 'fixed',
        border: 'none',
        outline: 0,
        zIndex: 1000001,
        opacity: 0,
        // overflow: 'auto',
        background: 'transparent'
      },
      inside: {
        background: 'transparent',
        padding: '0',
        display: 'block',
        border: 'none',
        overflow: 'visible'
      },
      overlay: {
        background: '#000',
        opacity: 0.2
      },
      onOpen: function() {
        $('body').addClass('stop-scroll');
        $('body').bind('touchmove', function(e){e.preventDefault()});
      },
      afterOpen: function() {
      },
      afterClose: function() {
      },
      afterDestroy: function() {
        $('body').removeClass('stop-scroll');
        $('body').unbind('touchmove');
      },
      onTemplate: function(template, data, limp) {

        console.log(template);
        try {
          var $html = HoneyFiles.render.puts(template, data);
          if ($html.length > 0) { return $html; }
          return false;
        } catch(e) {
          return false;
        }

      }
    },

    popup: function(template, data, args) {
      var self = this;

      if (args && args.hasOwnProperty('width')) {
        if (args.width) {
          self.popupOptions.style.width = args.width;
        };
      };


      var options = $.extend({}, self.popupOptions, args);
      options.template = template;
      options.templateData = data;

      var box = $.limp(options);

      return box;
    },

    puts: function(name, data) {
      var self = this;

      if (Handlebars.templates.hasOwnProperty(name)) {
        var $html = $(Handlebars.templates[""+name+""](data));
      } else {
        throw "Missing template " + name;
      }
      return $html;
    }
  },

};

jQuery(document).ready(function($) {
  HoneyFiles.init();
});
