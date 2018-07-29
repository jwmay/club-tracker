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
 * Provides methods for working with row-indexed 2D arrays.
 * 
 * @param {Array[][]} data The data.
 * @param {Array=} fieldNames The field names. Default is null.
 */
var DataSet = function(data, fieldNames) {
  this._data = data;
  this._fields = (typeof fieldNames === 'undefined') ? null : fieldNames;
};


/**
 * Returns the data represented by the DataSet object.
 * 
 * @returns {Array[][]} The data.
 */
DataSet.prototype.getData = function() {
  return this._data;
}


/**
 * Returns the field names represented by the DataSet object.
 * 
 * @returns {Array} The field names.
 */
DataSet.prototype.getFields = function() {
  return this._fields;
}


/**
 * Returns the next row in the dataset.
 * 
 * @returns {Array} The next row.
 */
DataSet.prototype.getNext = function() {
  return this._data.shift();
};


/**
 * Determines whether calling getNext() will return an item.
 * 
 * @returns {Boolean} True if getNext() will return an item; false if not.
 */
DataSet.prototype.hasNext = function() {
  if (this._data.length > 0) return true;
  return false;
};


/**
 * Filters the data by the given field and value.
 * 
 * If the given value is 'all', no filtering will be done.
 * 
 * @param {Integer} field The field index to filter.
 * @param {String} value The field value to filter.
 * @returns {This} The DataSet instance for chaining.
 */
DataSet.prototype.filterByField = function(field, value) {
  if (value !== 'all') {
    var filteredData = this._data.filter(function(row) {
      return (row[field] === value);
    });
    this._data = filteredData;
  }
  return this;
}


/**
 * Sorts the data by the given field. Data can be reversed if the flag is set
 * to true.
 * 
 * @param {Integer} field The field index to sort.
 * @param {Boolean} reverse Reverse data if true.
 * @returns {This} The DataSet instance for chaining.
 */
DataSet.prototype.sortByField = function(field, reverse) {
  reverse = (typeof reverse === 'undefined' ? false : reverse);
  this._data.sort(function(a, b) {
    if (a[field] === b[field]) {
      if (field + 1 <= a.length) {
        if (a[field+1] === b[field+1]) {
          return 0;
        } else {
          return (a[field+1] < b[field+1]) ? -1 : 1;
        }
      } else {
        return 0;
      }
    } else {
      return (a[field] < b[field]) ? -1 : 1;
    }
  });
  if (reverse === true) this._data.reverse();
  return this;
}