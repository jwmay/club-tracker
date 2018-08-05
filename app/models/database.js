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
  this.sections = this.getSectionMetadata_();

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
 * Returns a DataSet object containing data and field names for the roster
 * section, membership status, and the specified section.
 * 
 * @param {String} section The section name.
 * @returns {DataSet} The data and field names for the given section.
 */
Database.prototype.getDataBySection = function(section) {
  var fields = this.getFieldNames(),
      fieldNames = [],
      data = [];
  for (var i = 0; i < this.data.length; i++) {
    var row = this.data[i],
        dataRow = [],
        rosterStart = (this.sections.roster.start - 1);
    
    // Add roster data
    for (var j = rosterStart; j < this.sections.roster.range; j++) {
      if (i === 0) fieldNames.push(fields[j]);
      dataRow.push(row[j]);
    }
    
    // Add membership status
    var status = (this.sections.memberInformation.fields.membershipStatus - 1);
    if (i === 0) fieldNames.push(fields[status]);
    dataRow.push(row[status]);
    
    // Add section data
    var col = (this.sections[section].start - 1),
        range = (col + this.sections[section].range);
    for (col; col < range; col++) {
      if (fields[col] !== '') {
        if (i === 0) fieldNames.push(fields[col]);
        dataRow.push(row[col]);
      }
    }
    data.push(dataRow);
  }
  return new DataSet(data, fieldNames);
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
 * Returns the row number of the first empty row.
 * 
 * @returns {Integer} The row number.
 */
Database.prototype.getNextRecordIndex = function() {
  return (this.data.length + Configuration.layout.dataStart);
}


/**
 * Returns the roster id for the next empty record.
 * 
 * @returns {Integer} The roster id of the next empty record.
 */
Database.prototype.getNextRosterId = function() {
  var lastRosterId = this.data.slice(-1)[0][0];
  return (lastRosterId + 1);
}


/**
 * Returns an array containing the data for the record with the given roster id.
 * 
 * @param {String} id The id of the record to return.
 * @param {Array=} fields The field names. (optional)
 * @returns {Array} The record data.
 */
Database.prototype.getRecordById = function(id, fields) {
  var rowIndex = (this.getRowById(id) - Configuration.layout.dataStart);
  if (typeof fields !== 'undefined') {
    var selected = this.getSelectedFields(fields);
    return selected.getData()[rowIndex];
  } else {
    return this.data[rowIndex];
  }
}


/**
 * Returns the row index in the spreadsheet for the database record with the
 * given roster id.
 * 
 * @param {Integer|String} id The roster id number.
 * @returns {Integer} The row index.
 */
Database.prototype.getRowById = function(id) {
  id = (typeof id === 'string') ? parseInt(id, 10) : id;
  return (this.data.getRowIndexOf2D(id) + Configuration.layout.dataStart);
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
 * Returns true if the field is in the section, otherwise, returns false.
 * 
 * @param {String} section The section to search.
 * @param {String} field The field to search.
 * @returns {Boolean} True if found, otherwise, False.
 */
Database.prototype.hasField = function(section, field) {
  var section = this.sections[section];
  return section.fields.hasOwnProperty(field);
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
Database.prototype.setFieldData = function(entries) {
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
              note = (field.hasOwnProperty('notes') ? field.notes[dataIndex] : '');
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
Database.prototype.setFieldHeader = function(section, title, titleMeta, subtitle) {
  var index = this.getNextFieldIndex(section);
  this.spreadsheet.setCell(Configuration.layout.fields, index, title, titleMeta);
  if (subtitle) {
    this.spreadsheet.setCell(Configuration.layout.fieldMeta, index, subtitle);
  }
  return index;
}


/**
 * Inserts the given record into the database and returns the row index of the
 * new record.
 * 
 * This method does not insert a new row into the sheet, but rather sets the
 * fields for the next available (empty) row in the database sheet.
 * 
 * @param {Object} record The record data.
 * @returns {Integer} The row index of the inserted record.
 */
Database.prototype.setRecord = function(record) {
  var index = this.getNextRecordIndex();
  record.rosterId = this.getNextRosterId();
  this.writeRecord_(index, record);
  return index;
}


/**
 * Updates the given record in the database and returns the row index of the
 * record.
 * 
 * @param {Object} record The record data.
 * @returns {Integer} The row index of the updated record.
 */
Database.prototype.updateRecord = function(record) {
  var index = this.getRowById(record.rosterId);
  this.writeRecord_(index, record);
  return index;
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
 * @private
 * @returns {Object} The database section names and metadata.
 */
Database.prototype.getSectionMetadata_ = function() {
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
 * Writes the given record to the row in the database with the given index.
 * 
 * @todo Perhaps this can be simplified: just need to find the value of the
 *       field in an object of objects (JSON)...what method does that?
 * 
 * @param {Integer} index The row index of the record.
 * @param {Object} record The record data.
 */
Database.prototype.writeRecord_ = function(index, record) {
  var section;
  for (var field in record) {
    if (this.hasField('memberInformation', field)) {
      section = this.sections.memberInformation;
    } else if (this.hasField('financial', field)) {
      section = this.sections.financial;
    } else {
      section = this.sections.roster;
    }
    this.spreadsheet.setCell(index, section.fields[field], record[field]);
  }
}