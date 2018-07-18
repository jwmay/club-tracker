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


var Database = function() {
  var sheets = Configuration.getSheets();
  
  this.fields = sheets.members.fields;
  this.spreadsheet = new Spreadsheet(sheets.members.sheetName);
  this.dataRange = this.getDataRange();
  this.data = this.getData();
};


Database.prototype.getData = function() {
  return this.getDataRange().getValues();
}


Database.prototype.getDataRange = function() {
  return this.spreadsheet.sheet.getDataRange();
}


Database.prototype.getRoster = function() {
  var fields = [
    this.fields.lastName,
    this.fields.firstName,
    this.fields.membershipStatus
  ];
  var rosterFields = this.getSelectedFields(fields);
  var roster = new DataSet(rosterFields);
  return roster.sortByField(0);
}


Database.prototype.getSelectedFields = function(fields) {
  var selectedFields = [];
  for (var i = 0; i < this.data.length; i++) {
    var row = this.data[i];
    var selectedRow = [];
    for (var j = 0; j < row.length; j++) {
      var colNum = (j + 1);
      if (fields.indexOf(colNum) > -1) {
        selectedRow.push(row[j]);
      }
    }
    selectedFields.push(selectedRow);
  }
  return selectedFields;
}


// Database.prototype.NAME = function() {}
// Database.prototype.NAME = function() {}
// Database.prototype.NAME = function() {}