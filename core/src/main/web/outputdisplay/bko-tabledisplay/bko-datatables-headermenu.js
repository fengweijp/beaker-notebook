/*
 *  Copyright 2014 TWO SIGMA OPEN SOURCE, LLC
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

(function (window, document, undefined) {

var factory = function ($, DataTable) {
"use strict";

var HeaderMenu = function(dt, options) {

  this.s = {
    dt: new DataTable.Api(dt)
  };

  this.c = options;

  this.dom = {
    container:  null,
    menu:       null
  };

  this._constructor();
};

HeaderMenu.prototype = {

  _constructor: function ()
  {
    var that = this;
    var dt = this.s.dt;
    var dtSettings = dt.settings()[0];
    var headerLayout = dtSettings.aoHeader;

    this._appendMenuContainer();
    this._buildMenuData(headerLayout);

    $(document.body).bind('mousedown', function(e) {
      var $container = that.dom.container;
      var targetClass = $(e.target).attr('class');
      var toggleClass = 'bko-menu';

      if ($container[0] != e.target && !$.contains($container[0], e.target) && targetClass != toggleClass) {
        that._hide();
      }
    });

    dt.on('destroy', function () {
      //$(document.body).unbind('mousedown', function() {});
      //that.destroy();
    });
  },

  _appendMenuContainer: function()
  {
    var node = this.s.dt.table().container();
    var $container = $("<div/>", { 'class': 'bko-header-menu' });

    $(node).before($container);
    this.dom.container = $container;
  },

  /**
   * @param layout {object} should be Array with header layout in it
   */
  _buildMenuData: function(layout)
  {
    if (!$.isArray(layout)) {
      return;
    }

    var cells = layout[0];
    var cols = this.c;

    for (var i = 0, ien = cells.length; i < ien ; i++) {
      var cell = cells[i];

      if (cols && cols[i] !== undefined) {
        this._buildCellMenu(cell, cols[i]);
      }
    }
  },

  /**
   * @param col {object} current column header configuration
   * @param oCell {object} layout cell object
   */
  _buildCellMenu: function (oCell, col)
  {
    var that = this;
    var menu = col.header && col.header.menu;
    var cell = oCell.cell;
    var $el = $("<span/>", { 'class': 'bko-menu' });

    if (cell && menu && $.isArray(menu.items)) {
      $el.data('menu', menu.items)
        .bind('click', function(e) {
          if (that.dom.menu) {
            that._hide();
          } else {
            that._show($(this));
          }

          e.preventDefault();
          e.stopPropagation();
        });

      $(cell).append($el);
    }
  },

  _hide: function()
  {
    if (this.dom.menu) {
      this.dom.menu.remove();
      this.dom.menu = null;
    }
  },

  _show: function(el)
  {
    var that = this;
    var menuItems = el.data('menu');
    var colIdx = el.parent().data('columnIndex');

    if ($.isArray(menuItems)) {
      var $menu = $("<ul/>", { 'class': 'dropdown-menu' });
      var node = this.dom.container;
      node.data('columnIndex', colIdx);

      that._buildMenuItems(menuItems, $menu);

      $menu.offset({
          top: el.height() + 2,
          left: el.offset().left - 51
        })
        .css('display', 'block')
        .appendTo(node);
      that.dom.menu = $menu;
    }
  },

  /**
   * @param oItems {object}
   * @param container {node} should be <ul> dropdown-menu container
   */
  _buildMenuItems: function (oItems, container)
  {
    var that = this;
    if (!$.isArray(oItems)) {
      return;
    }

    for (var i = 0, ien = oItems.length; i < ien; i++) {
      var oItem = oItems[i];

      var subitems = (typeof oItem.items == 'function') ? oItem.items(that.dom.container) : oItem.items;
      var hasSubitems = $.isArray(subitems) && subitems.length;

      var $li = $('<li/>', {'class': hasSubitems ? 'dropdown-submenu' : ''});
      var $item = $('<a/>')
        .attr('href', '#')
        .attr('tabindex', '-1')
        .attr('id', 'dt-select-all')
        .text(oItem.title)
        .data('action', oItem.action || '')
        .bind('click', function(e) {
          that._handleItemClick($(this));
          e.preventDefault();
          e.stopPropagation();
        });

      $li.append($item);

      if (typeof oItem.isChecked == 'function' && oItem.isChecked(that.dom.container)) {
        var $glyph = $('<i/>', {'class': 'glyphicon glyphicon-ok'});
        $li.append($glyph);
      }

      if (hasSubitems) {
        var $subContainer = $('<ul/>', { 'class': 'dropdown-menu' });
        $subContainer.appendTo($li);
        this._buildMenuItems(subitems, $subContainer);
      }

      $li.appendTo(container);
    }
  },

  _handleItemClick: function(el)
  {
    var action = el.data('action');

    if (action && action !== '' && typeof action == 'function') {
      action(el);
    }

    this._hide();
  }
};

$.fn.dataTable.HeaderMenu = HeaderMenu;
$.fn.DataTable.HeaderMenu = HeaderMenu;


// Attach a listener to the document which listens for DataTables initialisation
// events so we can automatically initialise
$(document).on( 'init.dt.dtr', function (e, settings, json) {
  if ( e.namespace !== 'dt' ) {
    return;
  }

  var init = settings.oInit.columns;
  var defaults = DataTable.defaults.columns;

  if (init || defaults) {
    var opts = $.extend({}, init, defaults);

    if (init !== false) {
      new HeaderMenu(settings, opts);
    }
  }
});

return HeaderMenu;
}; //factory

if (  jQuery && !jQuery.fn.dataTable.HeaderMenu ) {
  // simply initialise as normal, stopping multiple evaluation
  factory( jQuery, jQuery.fn.dataTable );
}

})(window, document);