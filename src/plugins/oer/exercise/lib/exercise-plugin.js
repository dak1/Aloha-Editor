// Generated by CoffeeScript 1.5.0
(function() {

  define(['aloha', 'aloha/plugin', 'jquery', 'aloha/ephemera', 'ui/ui', 'ui/button', '../../semanticblock/lib/semanticblock-plugin'], function(Aloha, Plugin, jQuery, Ephemera, UI, Button, semanticBlock) {
    var SOLUTION_TEMPLATE, TEMPLATE;
    TEMPLATE = '<div class="exercise">\n    <div class="title-container dropdown">\n        <a class="type" data-toggle="dropdown">Exercise</a>\n        <ul class="dropdown-menu">\n            <li><a href="">Exercise</a></li>\n            <li><a href="">Homework</a></li>\n            <li><a href="">Problem</a></li>\n            <li><a href="">Question</a></li>\n            <li><a href="">Task</a></li>\n        </ul>\n        <span class="title" semantic-editable placeholder="Add a title (optional)"></span>\n    </div>\n    <div class="body" semantic-editable placeholder="Type the text of your exercise here."></div>\n    <div class="solution-placeholder">Click to add an Answer/Solution</div>\n    <div class="solution-controlls" style="display: none">\n        <a href="">[SHOW SOLUTION]</a>\n    </div>\n</div>';
    SOLUTION_TEMPLATE = '<div class="solution">\n    <div class="title-container dropdown">\n        <a class="type" data-toggle="dropdown">Solution</a>\n        <ul class="dropdown-menu">\n            <li><a href="">Solution</a></li>\n            <li><a href="">Answer</a></li>\n        </ul>\n    </div>\n    <div class="body" semantic-editable placeholder="Type your solution here."></div>\n    <div class="solution-controlls">\n        <a href="">[HIDE SOLUTION]</a>\n    </div>\n</div> ';
    return Plugin.create('exercise', {
      init: function() {
        semanticBlock.enableDragToAdd('Exercise', '[semantic-drag-source=exercise]', TEMPLATE);
        semanticBlock.registerEvent('click', '.exercise .solution-placeholder', function() {
          $(this).hide();
          return semanticBlock.appendElement($(SOLUTION_TEMPLATE), $(this).parent());
        });
        semanticBlock.registerEvent('click', '.exercise .semantic-delete', function() {
          return $(this).parents('.semantic-container').first().siblings('.solution-placeholder').removeAttr('style');
        });
        semanticBlock.registerEvent('click', '.exercise .solution-controlls a', function(e) {
          var container, controlls;
          e.preventDefault();
          controlls = $(this).parent();
          if (controlls.parent().is('.solution')) {
            container = controlls.parents('.semantic-container').first();
            return container.slideUp('slow', function() {
              return container.siblings('.solution-controlls').show();
            });
          } else {
            controlls.hide();
            return controlls.siblings('.semantic-container').slideDown('slow');
          }
        });
        return UI.adopt('insertExercise', Button, {
          click: function(a, b, c) {
            return semanticBlock.insertAtCursor(TEMPLATE);
          }
        });
      }
    });
  });

}).call(this);
