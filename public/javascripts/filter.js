(function( $ ) {
  var radioCheck = /radio|checkbox/i,
  keyBreaker = /[^\[\]]+/g,
    numberMatcher = /^[\-+]?[0-9]*\.?[0-9]+([eE][\-+]?[0-9]+)?$/;

    var isNumber = function( value ) {
      if ( typeof value == 'number' ) {
        return true;
      }

      if ( typeof value != 'string' ) {
        return false;
      }

      return value.match(numberMatcher);
    };

    $.fn.extend({
    /**
     * @parent dom
     * @download http://jmvcsite.heroku.com/pluginify?plugins[]=jquery/dom/form_params/form_params.js
     * @plugin jquery/dom/form_params
     * @test jquery/dom/form_params/qunit.html
     * 
     * Returns an object of name-value pairs that represents values in a form.  
     * It is able to nest values whose element's name has square brackets.
     * 
     * When convert is set to true strings that represent numbers and booleans will
     * be converted and empty string will not be added to the object. 
     * 
     * Example html:
     * @codestart html
     * &lt;form>
     *   &lt;input name="foo[bar]" value='2'/>
     *   &lt;input name="foo[ced]" value='4'/>
     * &lt;form/>
     * @codeend
     * Example code:
     * 
     *     $('form').formParams() //-> { foo:{bar:'2', ced: '4'} }
     * 
     * 
     * @demo jquery/dom/form_params/form_params.html
     * 
     * @param {Object} [params] If an object is passed, the form will be repopulated
     * with the values of the object based on the name of the inputs within
     * the form
     * @param {Boolean} [convert=false] True if strings that look like numbers 
     * and booleans should be converted and if empty string should not be added 
     * to the result. Defaults to false.
     * @return {Object} An object of name-value pairs.
*/
      formParams: function( params, convert ) {

        // Quick way to determine if something is a boolean
        if ( !! params === params ) {
          convert = params;
          params = null;
        }

        if ( params ) {
          return this.setParams( params );
        } else if ( this[0].nodeName.toLowerCase() == 'form' && this[0].elements ) {
          return jQuery(jQuery.makeArray(this[0].elements)).getParams(convert);
        }
        return jQuery("input[name], textarea[name], select[name]", this[0]).getParams(convert);
      },
      setParams: function( params ) {

        // Find all the inputs
        this.find("[name]").each(function() {

          var value = params[ $(this).attr("name") ],
          $this;

          // Don't do all this work if there's no value
          if ( value !== undefined ) {
            $this = $(this);

            // Nested these if statements for performance
            if ( $this.is(":radio") ) {
              if ( $this.val() == value ) {
                $this.attr("checked", true);
              }
            } else if ( $this.is(":checkbox") ) {
              // Convert single value to an array to reduce
              // complexity
              value = $.isArray( value ) ? value : [value];
              if ( $.inArray( $this.val(), value ) > -1) {
                $this.attr("checked", true);
              }
            } else {
              $this.val( value );
            }
          }
        });
      },
      getParams: function( convert ) {
        var data = {},
        current;

        convert = convert === undefined ? false : convert;

        this.each(function() {
          var el = this,
          type = el.type && el.type.toLowerCase();
          //if we are submit, ignore
          if ((type == 'submit') || !el.name ) {
            return;
          }

          var key = el.name,
          value = $.data(el, "value") || $.fn.val.call([el]),
          isRadioCheck = radioCheck.test(el.type),
          parts = key.match(keyBreaker),
          write = !isRadioCheck || !! el.checked,
          //make an array of values
          lastPart;

          if ( convert ) {
            if ( isNumber(value) ) {
              value = parseFloat(value);
            } else if ( value === 'true') {
              value = true;
            } else if ( value === 'false' ) {
              value = false;
            }
            if(value === '') {
              value = undefined;
            }
          }

          // go through and create nested objects
          current = data;
          for ( var i = 0; i < parts.length - 1; i++ ) {
            if (!current[parts[i]] ) {
              current[parts[i]] = {};
            }
            current = current[parts[i]];
          }
          lastPart = parts[parts.length - 1];

          //now we are on the last part, set the value
          if (current[lastPart]) {
            if (!$.isArray(current[lastPart]) ) {
              current[lastPart] = current[lastPart] === undefined ? [] : [current[lastPart]];
            }
            if ( write ) {
              current[lastPart].push(value);
            }
          } else if ( write || !current[lastPart] ) {

            current[lastPart] = write ? value : undefined;
          }

        });
        return data;
      }
    });

})(jQuery);


// "hello world".score("axl") //=> 0.0
// "hello world".score("ow") //=> 0.6
// "hello world".score("hello world") //=> 1.0

var sort_by;
(function() {
  // utility functions
  var default_cmp = function(a, b) {
    if (a == b) return 0;
    return a < b ? -1 : 1;
  },
  getCmpFunc = function(primer, reverse) {
    var cmp = default_cmp;
    if (primer) {
      cmp = function(a, b) {
        return default_cmp(primer(a), primer(b));
      };
    }
    if (reverse) {
      return function(a, b) {
        return -1 * cmp(a, b);
      };
    }
    return cmp;
  };

  // actual implementation
  sort_by = function() {
    var fields = [],
    n_fields = arguments.length,
    field, name, reverse, cmp;

    // preprocess sorting options
    for (var i = 0; i < n_fields; i++) {
      field = arguments[i];
      if (typeof field === 'string') {
        name = field;
        cmp = default_cmp;
      }
      else {
        name = field.name;
        cmp = getCmpFunc(field.primer, field.reverse);
      }
      fields.push({
        name: name,
        cmp: cmp
      });
    }

    return function(A, B) {
      var a, b, name, cmp, result;
      for (var i = 0, l = n_fields; i < l; i++) {
        result = 0;
        field = fields[i];
        name = field.name;
        cmp = field.cmp;

        result = cmp(A[name], B[name]);
        if (result !== 0) break;
      }
      return result;
    }
  }
}());


String.prototype.score = function(abbreviation, offset) {
  offset = offset || 0;

  if(abbreviation.length == 0) {
    return 0.9
  };

  if (abbreviation.length > this.length) {
    return 0.0
  };

  for (var i = abbreviation.length; i > 0; i--) {

    var sub_abbreviation = abbreviation.substring(0,i);

    var index = this.indexOf(sub_abbreviation);

    if (index < 0) {
      continue;
    };

    if (index + abbreviation.length > this.length + offset) {
      continue;
    };

    var next_string = this.substring(index+sub_abbreviation.length);
    var next_abbreviation = null;

    if (i >= abbreviation.length) {
      next_abbreviation = '';
    } else {
      next_abbreviation = abbreviation.substring(i);
    };

    var remaining_score = next_string.score(next_abbreviation,offset+index);

    if (remaining_score > 0) {
      var score = this.length-next_string.length;

      if (index != 0) {
        var j = 0;

        var c = this.charCodeAt(index-1);

        if (c==32 || c == 9) {

          for(var j=(index-2); j >= 0; j--) {
            c = this.charCodeAt(j);
            score -= ((c == 32 || c == 9) ? 1 : 0.15);
          };

        } else {
          score -= index;
        };

      };

      score += remaining_score * next_string.length;
      score /= this.length;
      return score;
    };
  };

  return 0.0;
};

(function($) {

  $.fn.filterItems = function(options) {


    $(this).each(function(item) {

    
      $(this).bind('keyup', function(e) {
        var search = $(this).val();
        var by = $(this).parents(options.container).find(options.by);

        if (!search || (search === "")) { $(options.parent).show(); };

        if (search.length >= (options.delay || 1)) {
          by.each(function() {
            var score = 0.0;
            var filter = $(this).text().trim();
            if (filter.match(search)) score = 1;

            if (score >= 0.5) {
             $(this).parents(options.parent).show();
            } else {
             $(this).parents(options.parent).hide();
            };

          });
        } else {
          $(options.parent).show()
        }


      });

      $(this).keypress(function(event) {
        if (event.keyCode == 13) {
          return false;
        }
      });

    });

    return this;
  };

})(jQuery);
