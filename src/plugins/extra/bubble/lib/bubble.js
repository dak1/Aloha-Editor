// Generated by CoffeeScript 1.3.3
(function() {

  define(['aloha', 'jquery', 'css!bubble/css/bubble.css'], function(Aloha, jQuery) {
    var Bubbler, MILLISECS, canvas, makeBubble;
    canvas = jQuery('body');
    MILLISECS = 2000;
    makeBubble = function(el, displayer, placement, force) {
      var $bubble, $el, offset;
      if (force == null) {
        force = false;
      }
      placement.vertical = placement.vertical || 'below';
      placement.horizontal = placement.horizontal || 'start';
      $el = jQuery(el);
      if (!$el.data('aloha-bubble-el')) {
        $el.data('aloha-bubble-el', jQuery('<div class="bubble"></div>'));
      }
      $bubble = $el.data('aloha-bubble-el');
      $bubble.contents().remove();
      $bubble.appendTo(canvas);
      displayer($el, $bubble);
      offset = $el.offset();
      offset.position = 'absolute';
      switch (placement.vertical) {
        case 'below':
          offset.top = offset.top + $el.outerHeight();
          break;
        case 'above':
          offset.top = offset.top - $bubble.outerHeight();
          break;
        default:
          console.error('Invalid vertical placement');
      }
      switch (placement.horizontal) {
        case 'start':
          break;
        case 'center':
          if ($el.outerWidth() > $bubble.outerWidth()) {
            offset.left = offset.left + ($el.outerWidth() - $bubble.outerWidth()) / 2;
          }
          break;
        default:
          console.error('Invalid horizontal placement');
      }
      $bubble.css(offset);
      $bubble.on('mouseenter.bubble', function() {});
      clearTimeout($el.data('aloha-bubble-closeTimer'));
      if ($el.data('aloha-bubble-hovered')) {
        return $bubble.on('mouseleave.bubble', function() {
          return jQuery(this).remove();
        });
      }
    };
    Bubbler = (function() {

      function Bubbler(displayer, $context, selector, placement) {
        var delayTimeout, that;
        this.displayer = displayer;
        this.placement = placement != null ? placement : {
          vertical: 'below',
          horizontal: 'start'
        };
        that = this;
        $context.delegate(selector, 'open.bubble', function(evt, force) {
          var $el;
          if (force == null) {
            force = false;
          }
          $el = jQuery(this);
          clearTimeout($el.data('aloha-bubble-openTimer'));
          makeBubble(this, that.displayer, that.placement);
          return $el.data('aloha-bubble-hovered', force);
        });
        $context.delegate(selector, 'close.bubble', function() {
          var $bubble, $el;
          $el = jQuery(this);
          $el.data('aloha-bubble-hovered', false);
          $bubble = $el.data('aloha-bubble-el');
          if ($bubble) {
            return $bubble.remove();
          }
        });
        delayTimeout = function(self, eventName, ms) {
          if (ms == null) {
            ms = MILLISECS;
          }
          return setTimeout(function() {
            return jQuery(self).trigger(eventName, true);
          }, ms);
        };
        $context.delegate(selector, 'mouseenter.bubble', function(evt) {
          var $el;
          $el = jQuery(this);
          $el.data('aloha-bubble-openTimer', delayTimeout(this, 'open.bubble'));
          return $el.one('mouseleave.bubble', function() {
            clearTimeout($el.data('aloha-bubble-openTimer'));
            if ($el.data('aloha-bubble-hovered')) {
              return $el.data('aloha-bubble-closeTimer', delayTimeout(this, 'close.bubble', MILLISECS / 2));
            }
          });
        });
        Aloha.bind('aloha-selection-changed', function(event, rangeObject) {
          var $orig, origEl;
          if (that.originalRange) {
            origEl = that.originalRange.getCommonAncestorContainer();
            if (origEl !== rangeObject.getCommonAncestorContainer()) {
              $orig = jQuery(origEl);
              $orig.data('aloha-bubble-el');
              $orig.trigger('close.bubble');
            }
          }
          return that.originalRange = rangeObject;
        });
      }

      Bubbler.prototype.setPlacement = function(vertical, horizontal) {
        if (vertical == null) {
          vertical = 'below';
        }
        if (horizontal == null) {
          horizontal = 'start';
        }
        this.placement.vertical = vertical;
        return this.placement.horizontal = horizontal;
      };

      return Bubbler;

    })();
    return Bubbler;
  });

}).call(this);
