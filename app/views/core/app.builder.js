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
  * Returns an HtmlOutput object for the given filename.
  * 
  * Serves the main html content for displaying the web app.
  * 
  * @param {String} filename The name of the html file to display.
  * @returns {HtmlOutput} The html content for displaying the web app.
  */
function getHtml(filename) {
  var template = HtmlService.createTemplateFromFile(filename);
  return template.evaluate()
    .setTitle('NHS Tracker')
    .setFaviconUrl('http://www.iconj.com/ico/x/u/xu8sd50zpv.ico')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}


/**
 * Returns an array containing the DisplayObjects for the page.
 * 
 * @param {String} page The name of the page to display.
 * @param {Object=} args An optional object for passing controller options.
 * @returns {DisplayObject[]} An array containing the sections of the page.
 */
function getAppPage(page, args) {
  var controller;
  switch(page) {
    case 'addMember':
      controller = new AddMember();
      break;
    case 'dashboard':
      controller = new Dashboard();
      break;
    case 'editAccount':
      controller = new EditAccount(args);
      break;
    case 'editMember':
      controller = new AddMember('edit', args);
      break;
    case 'takeAttendance':
      controller = new TakeAttendance();
      break;
    case 'viewAccounts':
      controller = new ViewAccounts();
      break;
    case 'viewAttendance':
      controller = new ViewAttendance();
      break;
    case 'viewMembers':
      controller = new ViewMembers(args);
      break;
    default:
      controller = new Dashboard();
  }
  var builder = new AppBuilder(controller);
  return builder.buildApp();
}


/**
 * Returns an array containing the DisplayObjects for the success page.
 * 
 * @param {String} pageTitle The title of the page, shown in the header.
 * @param {String} messageTitle The title of the message, shown in main.
 * @param {String} messageContent The content of the message, shown in main.
 * @returns {DisplayObject[]} An array containing the sections of the success
 *    page to display.
 */
function getSuccessPage(pageTitle, messageTitle, messageContent) {
  var controller = new Message('success', pageTitle, messageTitle,
          messageContent),
      builder = new AppBuilder(controller);
  return builder.buildApp();
}


/**
 * Returns an array containing the DisplayObjects for the error page.
 * 
 * @param {String} pageTitle The title of the page, shown in the header.
 * @param {String} messageTitle The title of the message, shown in main.
 * @param {Object} error The error object for the thrown exception.
 * @returns {DisplayObject[]} An array containing the sections of the error
 *    page to display.
 */
function getErrorPage(pageTitle, messageTitle, error) {
  var messageContent = '' +
      '<strong>Error name:</strong> ' + error.name + '<br>' +
      '<strong>Message:</strong> ' + error.message
  var controller = new Message('error', pageTitle, messageTitle, messageContent);
  var builder = new AppBuilder(controller);
  return builder.buildApp();
}




/**
 * Base class for building page views to display.
 * 
 * @param {Object} controller A controller object for the page to build.
 */
var AppBuilder = function(controller) {
  this._controller = controller;
};


/**
 * Returns an array containing the DisplayObjects for the header, main, and
 * footer sections of the page.
 * 
 * @returns {DisplayObject[]} An array containing the sections of the page
 *    to display.
 */
AppBuilder.prototype.buildApp = function() {
  return [
    this.getHeader_(),
    this.getMain_(),
    this.getFooter_()
  ];
}


/**
 * Returns the DisplayObject containing the header section of the controller.
 * 
 * @private
 * @returns {DisplayObject} The header.
 */
AppBuilder.prototype.getHeader_ = function() {
  return getDisplayObject('header', this._controller.getHeader(), 'header');
}


/**
 * Returns the DisplayObject containing the main section of the controller.
 * 
 * @private
 * @returns {DisplayObject} The main section.
 */
AppBuilder.prototype.getMain_ = function() {
  return getDisplayObject('main', this._controller.getMain(), 'main');
}


/**
 * Returns the DisplayObject containing the footer section of the controller.
 * 
 * @private
 * @returns {DisplayObject} The footer.
 */
AppBuilder.prototype.getFooter_ = function() {
  return getDisplayObject('footer', this._controller.getFooter(), 'footer');
}