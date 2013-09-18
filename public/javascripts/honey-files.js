var HoneyFiles = {

  fetch: {
    ajax: {},

    createCampaign: function(name, callback) {
      var self = this; 

      if (self.ajax.createCampaign) {
        self.ajax.createCampaign.abort();
      };

      self.ajax.createCampaign = $.ajax({
        url: "/api/campaigns/",
        type: "post",
        dataType: "json",
        data: {
          name: name
        },
        success: function(data) {
          if (callback && typeof callback === "function") {
            callback(data);
          };
        }
      });
    },
  
  },

  init: function() {
    var self = this; 

    $(document).on('click', 'a.create-new-campaign', function(e) {
      e.preventDefault();

      var box = self.render.popup('new-campaign', {}, {
        onAction: function() {
          var errors = 0;
          var name = $('input#campaign-name');

          if (name.val().length <= 0) {
            errors++;
            name.addClass('error');
          };

          if (errors <= 0) {
            $.limpClose();

            self.fetch.createCampaign(name.val(), function(data) {
              console.log(data);
            });
          };

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
