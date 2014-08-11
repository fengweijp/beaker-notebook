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

(function() {
  'use strict';
  var retfunc = function() {
    var plotLine = function(data){
      this.data = data;
    };
    plotLine.prototype.format = function(){

    };
    plotLine.prototype.init = function(){

    };
    plotLine.prototype.render = function(scope){
      var svg = scope.svg;

    };
    plotLine.prototype.getRange = function(){

    };
    return plotLine;
  };
  beaker.bkoFactory('plotLine', [retfunc]);
})();