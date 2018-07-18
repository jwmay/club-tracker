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


var DataSet = function(data) {
  this.data = data;
};


DataSet.prototype.hasNext = function() {
  if (this.data.length > 0) return true;
  return false;
};


DataSet.prototype.getNext = function() {
  return this.data.shift();
};


DataSet.prototype.sortByField = function(field, reverse) {
  reverse = (typeof reverse === 'undefined' ? false : reverse);
  if (this.hasNext()) {
    this.data.sort(function(a, b) {
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
    if (reverse === true) this.data.reverse();
  }
  return this;
}