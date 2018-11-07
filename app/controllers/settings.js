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
 * Helper function to return the settings object.
 * 
 * @returns {Object} An object containing the settings as key-value pairs.
 */
function getSettings() {
  var viewSettings = new ViewSettings();
  return viewSettings.getSettings();
}


/**
 * Function to call client-side to save the settings.
 * 
 * @param {Object} settings The form values containing the user input.
 * @returns {DisplayObject[]} The app page to display.
 */
function saveSettings(settings) {
  var viewSettings = new ViewSettings();
  return viewSettings.saveSettings(settings);
}


/**
 * Controller for the 'Settings' page.
 * 
 * Handles creating the layout for the page sections.
 */
var ViewSettings = function() {
  this._db = new Database();
  this._storage = new PropertyStore();
  this._pageTitle = 'Settings';

  // Store the default settings
  this._default = {
    incrementer1: 60,
    incrementer2: 30,
  };
};


/**
 * Returns the HTML content for displaying the page header.
 * 
 * @returns {String} The page header.
 */
ViewSettings.prototype.getHeader = function() {
  return '<h1>' + this._pageTitle + '</h1>';
}


/**
 * Returns the HTML content for displaying the main content.
 * 
 * @returns {String} The main content of the page.
 */
ViewSettings.prototype.getMain = function() {
  var settings = this.getSettings();
  return '' +
    '<div class="settings">' +
      '<div class="setting-group">' +
        '<h5 class="setting-group-header">Financial</h5>' +
        '<div class="setting">' +
          '<div class="setting-label">' +
            'Fundraiser Incrementer 1' +
            '<span class="setting-detail">' +
              'This sets the value of the first incrementer in the Run' +
              'Fundraiser page.' +
            '</span>' +
          '</div>' +
          '<div class="setting-input">' +
            '<input type="number" id="incrementer1" name="incrementer1" ' +
                'class="validate" value="' + settings.incrementer1 + '" required>' +
          '</div>' +
        '</div>' +
        '<div class="setting">' +
          '<div class="setting-label">' +
            'Fundraiser Incrementer 2' +
            '<span class="setting-detail">' +
              'This sets the value of the second incrementer in the Run' +
              'Fundraiser page.' +
            '</span>' +
          '</div>' +
          '<div class="setting-input">' +
            '<input type="number" id="incrementer2" name="incrementer2" ' +
                'class="validate" value="' + settings.incrementer2 + '" required>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>';
}


/**
 * Returns the HTML content for displaying the page footer.
 * 
 * @returns {String} The page footer.
 */
ViewSettings.prototype.getFooter = function() {
  return '' +
    '<button id="submit" class="btn btn-large waves-effect waves-light" ' +
        'data-page="saveSettings" type="submit">' +
      'Save' +
    '</button>' +
    '<button id="cancel" class="btn btn-large btn-flat waves-effect waves-light" ' +
        'data-page="dashboard" type="button">' +
      'Cancel' +
    '</button>';
}


/**
 * Stores the given form values in the property store and returns an array of
 * DisplayObjects containing the components of the mesasge page to display.
 * 
 * @param {Object} settings The form values containing the user input.
 * @returns {DisplayObject[]} The app page to display.
 */
ViewSettings.prototype.saveSettings = function(settings) {
  this.setSettings_(settings);
  return getSuccessPage(this._pageTitle, 'Settings Updated', this.getSuccess_());
}


/**
 * Returns the settings from the PropertyStore as an object with each setting
 * stored as a key-value pair.
 * 
 * @returns {Object} An object containing the settings as key-value pairs.
 */
ViewSettings.prototype.getSettings = function() {
  var properties = this._storage.getProperty('SETTINGS', true);
  if (properties === null) return this._default;
  return properties;
}


/**
 * Stores the given settings in the Document PropertyStore.
 * 
 * Settings should be passed in as an object of key-value pairs with the key
 * representing the name of the setting.
 * 
 * @private
 * @param {Object} settings The settings object to store.
 */
ViewSettings.prototype.setSettings_ = function(settings) {
  var properties = this._storage.setProperty('SETTINGS', settings, true);
}


/**
 * Returns the HTML content for displaying the success message.
 * 
 * @private
 * @returns {String} The success message.
 */
ViewSettings.prototype.getSuccess_ = function() {
  return '' +
    '<div class="panels">' +
      '<div class="panel panel-2" data-page="dashboard">' +
        '<i class="fas fa-fw fa-3x fa-tachometer-alt"></i>' +
        '<h5>Dashboard</h5>' +
      '</div>' +
      '<div class="panel panel-2" data-page="settings">' +
        '<i class="fas fa-fw fa-3x fa-cog"></i>' +
        '<h5>Edit Settings</h5>' +
      '</div>' +
    '</div>';
}