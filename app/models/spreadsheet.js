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
  * Base class for interacting with a sheet in a spreadsheet.
  * 
  * The name of a sheet in the active spreadsheet is required when constructing
  * the object. This object provides helper methods for interacting with a
  * Google Sheets object.
  * 
  * @param {String} name The sheet name.
  */
var SpreadsheetHelper = function(name) {
  /**
   * The active spreadsheet.
   * 
   * @type {Spreadsheet} A Google Spreadsheet object.
   */
  this.spreadsheet = this.getSpreadsheet();

  /**
   * The sheet with the given name.
   * 
   * @type {Sheet} A Google Sheet object.
   */
  this.sheet = this.getSheet(name);
};


/**
 * Returns a row-indexed 2D array containing the values in the given column.
 * Column numbers start at 1.
 * 
 * @param {Integer} colNum The column number.
 * @returns {Array[][]} The column values.
 */
SpreadsheetHelper.prototype.getCol = function(colNum) {
  return this.getColRange(colNum).getValues();
}


/**
 * Returns a Range object for the given column. Column numbers start at 1.
 * 
 * @param {Integer} colNum The column number.
 * @returns {Range} The column as a Google Range object.
 */
SpreadsheetHelper.prototype.getColRange = function(colNum) {
  return this.sheet.getRange(1, colNum, this.sheet.getMaxRows(), 1);
}


/**
 * Returns a row-indexed 2D array containing the values in the given row. Row
 * numbers start at 1.
 * 
 * @param {Integer} rowNum The row number.
 * @returns {Array[][]} The row values.
 */
SpreadsheetHelper.prototype.getRow = function(rowNum) {
  return this.getRowRange(rowNum).getValues();
}


/**
 * Returns a Range object for the given row. Row numbers start at 1.
 * 
 * @param {Integer} rowNum The row number.
 * @returns {Range} The row as a Google Range object.
 */
SpreadsheetHelper.prototype.getRowRange = function(rowNum) {
  return this.sheet.getRange(rowNum, 1, 1, this.sheet.getMaxColumns());
}


/**
 * Returns the sheet in the active spreadsheet with the given name.
 * 
 * @param {String} name The sheet name.
 * @returns {Sheet} A Google Sheet object.
 */
SpreadsheetHelper.prototype.getSheet = function(name) {
  return this.spreadsheet.getSheetByName(name);
}


/**
 * Returns a row-indexed 2D array containing the values of the sheet.
 * 
 * This method returns an array containing all of the columns in the sheet,
 * regardless of content, but only the first rows containing content; values
 * for empty rows at the end of the sheet are not returned.
 * 
 * @returns {Array[][]} The sheet values.
 */
SpreadsheetHelper.prototype.getSheetContents = function() {
  return this.sheet.getRange(1, 1, this.sheet.getLastRow(),
      this.sheet.getMaxColumns()).getValues();
}


/**
 * Returns the active spreadsheet.
 * 
 * @returns {Spreadsheet} A Google Spreadsheet object.
 */
SpreadsheetHelper.prototype.getSpreadsheet = function() {
  return SpreadsheetApp.getActive();
}


/**
 * Sets the value and optional note for the cell at the given row and column
 * position.
 * 
 * Row and column numbers start at 1. The note parameter is optional. If not
 * given, no note will be set.
 * 
 * @param {Integer} row The row number.
 * @param {Integer} col The column number.
 * @param {String} value The cell value.
 * @param {String} note The cell note. Optional.
 */
SpreadsheetHelper.prototype.setCell = function(row, col, value, note) {
  note = (typeof note === 'undefined') ? '' : note;
  this.sheet.getRange(row, col, 1, 1)
    .setValue(value)
    .setNote(note);
}