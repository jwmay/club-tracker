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
  * Base class for interacting with the database.
  * 
  * The 'database' is a sheet in a Google Sheets spreadsheet that is borken up
  * into sections based on the first row of the database sheet. Records are
  * stored as rows in the sheet and columns represent fields. The second row of
  * the sheet defines the field names, the third row provides space for storing
  * field metadata and records begin on the fourth row. The layout of the sheet
  * is stored in the Configuration object. This class provides methods for
  * reading and writing values to the sections of the sheet.
  */
var Database = function() {
  /**
   * A SpreadsheetHelper object for interacting with the database sheet in the
   * spreadsheet document.
   * 
   * @type {SpreadsheetHelper} A SpreadsheetHelper object for interacting with
   *    the database sheet.
   */
  this.spreadsheet = new SpreadsheetHelper(Configuration.databaseSheetName);

  /**
   * A JSON-object containing the database section names and metadata.
   * 
   * @type {JSON} The database section names and metadata.
   */
  this.sections = this.getSections();

  /**
   * A row-indexed 2D array containing the database records.
   * 
   * @type {Array[][]} The database records.
   */
  this.data = this.getData();
};


/**
 * Returns a row-indexed 2D array containing the database records.
 * 
 * The section and field names and field metadata is removed from the returned
 * array along with any empty rows, as determined by the value of the first
 * entry in a row.
 * 
 * @returns {Array[][]} The database records.
 */
Database.prototype.getData = function() {
  var contents = this.spreadsheet.getSheetContents();
  contents = contents.slice(Configuration.layout.dataStart - 1);
  return contents.filter(function(element) {
    if (element[0] !== '') return true;
    return false;
  });
}


/**
 * Returns an array containing the field names in the database sheet.
 * 
 * @returns {Array} The field names.
 */
Database.prototype.getFieldNames = function() {
  return this.spreadsheet.getRow(Configuration.layout.fields)[0];
}


/**
 * Returns the column number of the first empty column in the given section,
 * or 0 if there is no empty column in the section.
 * 
 * @param {String} section The section name.
 * @returns {Integer} The column number, or 0 if there is no empty column.
 */
Database.prototype.getNextFieldIndex = function(section) {
  var sectionData = this.sections[section],
      numFields = Object.keys(sectionData.fields).length,
      nextIndex = (sectionData.start + numFields);
  // Return 0 if there is no new field for the current section
  nextIndex = (nextIndex <= sectionData.range) ? nextIndex : 0;
  return nextIndex;
}


/**
 * Returns the row index for the database record with the given roster id.
 * 
 * @param {String} id The roster id number.
 * @returns {Integer} The row index.
 */
Database.prototype.getRowById = function(id) {
  return (this.data.getRowIndexOf2D(id) + Configuration.layout.dataStart);
}


/**
 * Returns an object containing the database section names and metadata.
 * 
 * The keys of the returned object represent the names of the sections. Each
 * section key contains a metadata object with the following keys:
 *  - sectionName.start  -->  the column index where the section starts
 *  - sectionName.range  -->  the number of columns in the section
 *  - sectionName.fields -->  an object containing the sections field names and
 *                            their corresponding column index
 * 
 * @returns {Object} The database section names and metadata.
 */
Database.prototype.getSections = function() {
  // Get the section and field header rows from the spreadsheet
  var sectionData = {},
      sections = this.spreadsheet.getRow(Configuration.layout.sections)[0],
      fields = this.getFieldNames();
  
  // Create the section objects
  var colNum = 1;
  var currentSection = '';
  for (var i = 0; i < sections.length; i++) {
    var field = fields[i],
        section = sections[i];
    
    // The start of a new section
    if (section !== '') {
      currentSection = section.toCamelCase();
      sectionData[currentSection] = {
        start: colNum,
        range: 1,
        fields: {},
      };
    // Working within the current section
    } else {
      sectionData[currentSection].range += 1;
    }

    // Add the field, if not empty
    if (field !== '') {
      sectionData[currentSection].fields[field.toCamelCase()] = colNum;
    }
    colNum += 1;
  }
  return sectionData;
}


/**
 * Returns a DataSet object containing data for the specified fields.
 * 
 * @param {Array} fields The field names.
 * @returns {DataSet} The data for the selected fields.
 */
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
  return new DataSet(selectedFields);
}


/**
 * Inserts the given data entries into the database sheet only for the records
 * whose roster id is given.
 * 
 * The entries object has two required properties:
 *   (1) rosterIds  =>  an array containing the roster ids of the records to
 *                      update
 *   (2) fields     =>  an array of field objects containing the column index
 *                      of the field (fieldIndex), the data array (data), and
 *                      an optional notes array (notes)
 * 
 * @param {Object} entries The entry data to insert into the database.
 */
Database.prototype.insertData = function(entries) {
  // Ensure that roster ids are integers; needed for comparison
  entries.rosterIds = entries.rosterIds.map(function(x) {
    return parseInt(x, 10);
  });
  // Loop over the rows of data
  for (var i = 0; i < this.data.length; i++) {
    var row = this.data[i];
    var dataIndex = entries.rosterIds.indexOf(row[0]);
    // Loop over columns only if current row matches a roster id in the data
    if (dataIndex > -1) {
      for (var j = 0; j < row.length; j++) {
        var currentColNum = (j + 1);
        var field = entries.fields.find(function(obj) {
          return obj.fieldIndex === currentColNum;
        });
        if (field) {
          var rowIndex = this.getRowById(entries.rosterIds[dataIndex]),
              colIndex = currentColNum,
              value = field.data[dataIndex],
              note = field.notes[dataIndex];
          this.spreadsheet.setCell(rowIndex, colIndex, value, note);
        }
      }
    }
  }
}


/**
 * Inserts a new field into the given section and returns the column index of
 * the new field.
 * 
 * This method does not insert a new column into the database sheet, but rather
 * sets the field title and metadata for the next available (empty) column in
 * the given section. The title and subtitle will be visible in the spreadsheet
 * and the titleMeta will be inserted as a note for the cell containing the
 * field name.
 * 
 * @param {String} section The section name.
 * @param {String} title The field name.
 * @param {String} titleMeta The field name note, hidden in the spreadsheet.
 * @param {String} subtitle The field metadata, visible in the spreadsheet.
 * @returns {Integer} The column index of the inserted field.
 */
Database.prototype.insertField = function(section, title, titleMeta, subtitle) {
  var index = this.getNextFieldIndex(section);
  this.spreadsheet.setCell(Configuration.layout.fields, index, title, titleMeta);
  if (subtitle) {
    this.spreadsheet.setCell(Configuration.layout.fieldMeta, index, subtitle);
  }
  return index;
}