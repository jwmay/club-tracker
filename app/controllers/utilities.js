/**
 * Copyright 2018 Joseph W. May. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


/**
 * Returns an HTML-formatted preloader.
 * 
 * @returns {String} The preloader.
 */
function getChartPreloader() {
  return '' +
    '<div class="preloader-wrapper big active">' +
      '<div class="spinner-layer spinner-blue-only">' +
        '<div class="circle-clipper left">' +
          '<div class="circle"></div>' +
        '</div>' +
        '<div class="gap-patch">' +
          '<div class="circle"></div>' +
        '</div>' +
        '<div class="circle-clipper right">' +
          '<div class="circle"></div>' +
        '</div>' +
      '</div>' +
    '</div>';
}


/**
 * Returns the given date as a formatted string 'Mon D, YYYY'.
 * 
 * @param {Date} date The date to format.
 * @returns {String} The date as a formatted string.
 */
function getDateString(date) {
  return (date.getMonthName() + ' ' + date.getDate() + ', ' + date.getFullYear());
}


/**
 * Returns the color name for the given dollar amount.
 * 
 * @param {Number} amount The dollar amount.
 * @returns {String} The color name corresponding to the given dollar amount.
 */
function getDollarColor(amount) {
  if (amount === 0) return 'green';
  if (amount > 0) return 'yellow';
}


/**
 * Returns the given amount as a formatted string '$AMT'.
 * 
 * @param {Number} amount The dollar amount.
 * @returns {String} The dollar amount as a formatted string.
 */
function getDollarString(amount) {
  return ('$' + amount);
}


/**
 * Returns the color name for the given hours.
 * 
 * @param {Number} hours The hours.
 * @returns {String} The color name corresponding to the given hours.
 */
function getHoursColor(hours) {
  var colors = [
    [40, 'green'],
    [30, 'yellow'],
    [0, 'red']
  ];
  var color = colors.find(function(colorInfo) {
    return (hours >= colorInfo[0]);
  });
  return color[1];
}


/**
 * Returns the color name for the given percnet.
 * 
 * @param {Number} percent The percent.
 * @returns {String} The color name corresponding to the given percent.
 */
function getPercentColor(percent) {
  var colors = [
    [0.9, 'green'],
    [0.8, 'yellow'],
    [0.0, 'red']
  ];
  var color = colors.find(function(colorInfo) {
    return (percent >= colorInfo[0]);
  });
  return color[1];
}


/**
 * Returns the given percent formatted as a string the % appended.
 * 
 * @param {Number} percent The percent to convert.
 * @returns {String} The formatted percent with % symbol appended.
 */
function getPercentString(percent) {
  return (Math.round(percent * 100) + '%');
}


/**
 * Returns an HTML-formatted string of table rows containing the data in the
 * given array.
 * 
 * @param {Array} data The data to format as table rows.
 * @returns {String} The data as an HTML-formatted string of table rows.
 */
function getRowsFromData(data) {
  var rows = '';
  for (var i = 0; i < data.length; i++) {
    var row = '' +
      '<div class="tile-table-row">' +
        data[i] +
      '</div>';
    rows += row;
  }
  return rows;
}


/**
 * Returns the color name for the given yes or no value.
 * 
 * @param {String} value The input value as yes or no.
 * @returns {String} The color name corresponding to the given value.
 */
function getYesNoColor(value) {
  if (value === 'yes') return 'green';
  if (value === 'no') return 'red';
}


/**
 * Logs the given message into the Google Apps Script logger.
 * 
 * @param {String} message The log message.
 */
function log(message) {
  Logger.log(message);
}


/**
 * Returns the string in camel case with spaces removed.
 * 
 * @returns {String} The string in camel case.
 */
String.prototype.toCamelCase = function() {
  return this.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function(match, index) {
    if (+match === 0) return "";
    return index == 0 ? match.toLowerCase() : match.toUpperCase();
  });
};


/**
 * Returns the row index in a 2D array of the given search value.
 * 
 * @param {Array} element The value to search.
 * @returns {Integer} The row index, or -1 if the element is not found.
 */
Array.prototype.getRowIndexOf2D = function(element) {
  for (var i = 0; i < this.length; i++) {
    var index = this[i].indexOf(element);
    if (index > -1) {
      return i;
    }
  }
};


/**
 * Returns the value of the first element in the array that satisfies the
 * provided testing function. Otherwise undefined is returned. 
 *
 * This is a polyfill to implement the Array.find method, which is not available
 * in Google Apps Script.
 * 
 * Taken from: https://tc39.github.io/ecma262/#sec-array.prototype.find
 * 
 * @returns {Object|undefined} A value in the array if an element pases the
 *    test; otherwise, undefined.
 */
if (!Array.prototype.find) {
  Object.defineProperty(Array.prototype, 'find', {
    value: function(predicate) {
     // 1. Let O be ? ToObject(this value).
      if (this == null) {
        throw new TypeError('"this" is null or not defined');
      }

      var o = Object(this);

      // 2. Let len be ? ToLength(? Get(O, "length")).
      var len = o.length >>> 0;

      // 3. If IsCallable(predicate) is false, throw a TypeError exception.
      if (typeof predicate !== 'function') {
        throw new TypeError('predicate must be a function');
      }

      // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
      var thisArg = arguments[1];

      // 5. Let k be 0.
      var k = 0;

      // 6. Repeat, while k < len
      while (k < len) {
        // a. Let Pk be ! ToString(k).
        // b. Let kValue be ? Get(O, Pk).
        // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
        // d. If testResult is true, return kValue.
        var kValue = o[k];
        if (predicate.call(thisArg, kValue, k, o)) {
          return kValue;
        }
        // e. Increase k by 1.
        k++;
      }

      // 7. Return undefined.
      return undefined;
    },
    configurable: true,
    writable: true
  });
}


/**
 * Returns a three-digit string representation of the month.
 * 
 * @returns {String} The 3-character name of the month.
 */
Date.prototype.getMonthName = function() {
  var month = this.getMonth(),
      months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec'
      ];
  return months[month];
}