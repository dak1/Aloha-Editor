// Generated by CoffeeScript 1.3.3
(function() {

  define(['aloha', 'jquery', './link', './figure', './title-figcaption'], function(Aloha, jQuery, linkConfig, figureConfig, figcaptionConfig) {
    var Bootstrap_Popover_show, Helper, bindHelper, findMarkup, helpers, monkeyPatch, selectionChangeHandler;
    if (true) {
      Bootstrap_Popover_show = function() {
        var $tip, actualHeight, actualWidth, inside, placement, pos, tp;
        if (this.hasContent() && this.enabled) {
          $tip = this.tip();
          this.setContent();
          if (this.options.animation) {
            $tip.addClass("fade");
          }
          placement = (typeof this.options.placement === "function" ? this.options.placement.call(this, $tip[0], this.$element[0]) : this.options.placement);
          inside = /in/.test(placement);
          $tip.css({
            top: 0,
            left: 0,
            display: "block"
          }).appendTo((inside ? this.$element : document.body));
          pos = this.getPosition(inside);
          actualWidth = $tip[0].offsetWidth;
          actualHeight = $tip[0].offsetHeight;
          switch ((inside ? placement.split(" ")[1] : placement)) {
            case "bottom":
              tp = {
                top: pos.top + pos.height,
                left: pos.left + pos.width / 2 - actualWidth / 2
              };
              break;
            case "top":
              tp = {
                top: pos.top - actualHeight,
                left: pos.left + pos.width / 2 - actualWidth / 2
              };
              break;
            case "left":
              tp = {
                top: pos.top + pos.height / 2 - actualHeight / 2,
                left: pos.left - actualWidth
              };
              break;
            case "right":
              tp = {
                top: pos.top + pos.height / 2 - actualHeight / 2,
                left: pos.left + pos.width
              };
          }
          return $tip.css(tp).addClass(placement).addClass("in");
        }
      };
      monkeyPatch = function() {
        var proto;
        console && console.warn('Monkey patching Bootstrap popovers so the buttons in them are clickable');
        proto = jQuery('<div></div>').popover({}).data('popover').constructor.prototype;
        return proto.show = Bootstrap_Popover_show;
      };
      monkeyPatch();
    }
    helpers = [];
    Helper = (function() {

      function Helper(cfg) {
        jQuery.extend(this, cfg);
      }

      Helper.prototype.start = function(editable) {
        var $el, MILLISECS, delayTimeout, makePopover, that;
        that = this;
        $el = jQuery(editable.obj);
        MILLISECS = 1200;
        delayTimeout = function($self, eventName, ms, hovered) {
          if (ms == null) {
            ms = MILLISECS;
          }
          return setTimeout(function() {
            if (hovered != null) {
              $self.data('aloha-bubble-hovered', hovered);
            }
            return $self.popover(eventName);
          }, ms);
        };
        makePopover = function($node, placement) {
          $node.popover({
            placement: placement || 'bottom',
            trigger: 'manual',
            content: function() {
              return that.populator.bind(jQuery(this))();
            }
          });
          $node.on('shown', this.selector, function(evt) {
            var $n;
            $n = jQuery(this);
            return clearTimeout($n.data('aloha-bubble-openTimer'));
          });
          return $node.on('hidden', this.selector, function() {
            var $n;
            $n = jQuery(this);
            return $n.data('aloha-bubble-hovered', false);
          });
        };
        makePopover($el.find(this.selector), this.placement);
        that = this;
        return $el.on('mouseenter.bubble', this.selector, function() {
          var $node;
          $node = jQuery(this);
          if (!$node.data('popover')) {
            makePopover($node, that.placement);
          }
          if (!that.noHover) {
            $node.data('aloha-bubble-openTimer', delayTimeout($node, 'show', MILLISECS, true, afterShow));
            return $node.one('mouseleave.bubble', function() {
              var $tip;
              clearTimeout($node.data('aloha-bubble-openTimer'));
              if ($node.data('aloha-bubble-hovered')) {
                $tip = $node.data('popover').$tip;
                if ($tip) {
                  $tip.on('mouseenter', function() {
                    return clearTimeout($node.data('aloha-bubble-closeTimer'));
                  });
                  $tip.on('mouseleave', function() {
                    return $node.data('aloha-bubble-closeTimer', delayTimeout($node, 'hide', MILLISECS / 2, false, afterHide));
                  });
                }
                return $node.data('aloha-bubble-closeTimer', delayTimeout($node, 'hide', MILLISECS / 2, false, afterHide));
              }
            });
          }
        });
      };

      Helper.prototype.stop = function(editable) {
        var $nodes;
        jQuery(editable.obj).undelegate(this.selector, '.bubble');
        $nodes = jQuery(editable.obj).find(this.selector);
        $nodes.data('aloha-bubble-el', null);
        $nodes.data('aloha-bubble-openTimer', 0);
        $nodes.data('aloha-bubble-closeTimer', 0);
        $nodes.data('aloha-bubble-hovered', false);
        return $nodes.popover('destroy');
      };

      return Helper;

    })();
    findMarkup = function(range, filter) {
      if (range == null) {
        range = Aloha.Selection.getRangeObject();
      }
      if (Aloha.activeEditable) {
        return range.findMarkup(filter, Aloha.activeEditable.obj);
      } else {
        return null;
      }
    };
    selectionChangeHandler = function(rangeObject, filter) {
      var enteredLinkScope, foundMarkup;
      enteredLinkScope = false;
      if (Aloha.activeEditable != null) {
        foundMarkup = findMarkup(rangeObject, filter);
        enteredLinkScope = foundMarkup;
      }
      return enteredLinkScope;
    };
    bindHelper = function(cfg) {
      var enteredLinkScope, helper, insideScope;
      helper = new Helper(cfg);
      insideScope = false;
      enteredLinkScope = false;
      Aloha.bind('aloha-editable-activated', function(event, data) {
        return helper.start(data.editable);
      });
      Aloha.bind('aloha-editable-deactivated', function(event, data) {
        setTimeout(function() {
          return helper.stop(data.editable);
        }, 100);
        insideScope = false;
        return enteredLinkScope = false;
      });
      return Aloha.bind('aloha-selection-changed', function(event, rangeObject) {
        var $el, nodes;
        $el = jQuery(rangeObject.getCommonAncestorContainer());
        nodes = jQuery(Aloha.activeEditable.obj).find(helper.selector);
        if ($el[0]) {
          nodes = nodes.not($el);
          if (helper.blur && $el.data('popover')) {
            helper.blur.bind(nodes)($el.data('popover').$tip);
          }
          nodes.popover('hide');
          afterHide(nodes);
        }
        if (Aloha.activeEditable) {
          enteredLinkScope = selectionChangeHandler(rangeObject, helper.filter);
          if (insideScope !== enteredLinkScope) {
            insideScope = enteredLinkScope;
            $el = jQuery(rangeObject.getCommonAncestorContainer());
            if (enteredLinkScope) {
              $el.data('aloha-bubble-hovered', false);
              if (!$el.data('popover')) {
                $el.popover({
                  placement: helper.placement || 'bottom',
                  trigger: 'manual',
                  content: function() {
                    return helper.populator.bind($el)($el);
                  }
                });
              }
              $el.popover('show');
              afterShow($el);
              $el.off('.bubble');
              if (helper.focus) {
                return helper.focus.bind($el[0])($el.data('popover').$tip);
              }
            }
          }
        }
      });
    };
    bindHelper(linkConfig);
    bindHelper(figureConfig);
    bindHelper(figcaptionConfig);
    return {
      register: function(cfg) {
        return bindHelper(new Helper(cfg));
      }
    };
  });

}).call(this);
