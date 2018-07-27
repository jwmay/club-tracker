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
 * Function to call client-side to save the attendance form data.
 * 
 * @param {Object} attendance The form values containing the user input.
 * @returns {DisplayObject[]} The app page to display.
 */
 function saveAttendance(attendance) {
  var takeAttendance = new TakeAttendance();
  return takeAttendance.saveAttendance(attendance);
}




/**
 * Controller for the 'Take Attendance' page.
 * 
 * Handles creating the layout for the page sections and for processing the
 * user input by inserting the form data into the database spreadsheet.
 */
var TakeAttendance = function() {
  this._db = new Database();
  this._pageTitle = 'Take Attendance';
};


/**
 * Returns the HTML content for displaying the page header.
 * 
 * @returns {String} The page header.
 */
TakeAttendance.prototype.getHeader = function() {
  return '' +
    '<h1>' + this._pageTitle +'</h1>' +
    '<div class="row">' +
      '<div class="input-field col s12 m5">' +
        '<input type="text" id="date" name="date" ' +
            'class="datepicker validate" required>' +
        '<label for="date">Meeting date</label>' +
      '</div>' +
      '<div class="col s12 m6 offset-m1">' +
        '<h6>Quarter</h6>' +
        '<div class="selector">' +
          '<label>' +
            '<input name="quarter" type="radio" value="1" required>' +
            '<span class="selector-label">1</span>' +
          '</label>' +
          '<label>' +
            '<input name="quarter" type="radio" value="2">' +
            '<span class="selector-label">2</span>' +
          '</label>' +
          '<label>' +
            '<input name="quarter" type="radio" value="3">' +
            '<span class="selector-label">3</span>' +
          '</label>' +
          '<label>' +
            '<input name="quarter" type="radio" value="4">' +
            '<span class="selector-label">4</span>' +
          '</label>' +
        '</div>' +
      '</div>' +
    '</div>' +
    '<div class="row">' +
      '<div class="input-field col s12 m7">' +
        '<input type="text" id="name" name="name" class="validate" required>' +
        '<label for="name">Your name</label>' +
      '</div>' +
    '</div>';
}


/**
 * Returns the HTML content for displaying the main content.
 * 
 * @returns {String} The main content of the page.
 */
TakeAttendance.prototype.getMain = function() {
  var members = [],
      roster = this.getRoster_(),
      content = '';
  while (roster.hasNext()) {
    var member = roster.getNext();
    // Only display active members
    if (member[3] === 'active') {
      members.push({
        rosterId: member[0],
        lastName: member[1],
        firstName: member[2]
      });
    }
  }
  content = '' +
    '<div class="row">' +
      '<div class="col s12">' +
        '<div class="stackable attendance">';
  // Insert individual member cards
  for (var i = 0; i < members.length; i++) {
    var member = members[i];
    content += this.getCard_(member);
  }
  content += '' +
        '</div>' +
      '</div>' +
    '</div>';
  return content;
}


/**
 * Returns the HTML content for displaying the page footer.
 * 
 * @returns {String} The page footer.
 */
TakeAttendance.prototype.getFooter = function() {
  return '' +
    '<button id="submit" class="btn btn-large waves-effect waves-light" ' +
        'data-page="takeAttendance">' +
      'Submit' +
    '</button>';
}


/**
 * Inserts the given form values into the database and returns an array of
 * DisplayObjects containing the components of the message page to display.
 * 
 * @param {Object} attendance The form values containing the user input.
 * @returns {DisplayObject[]} The app page to display.
 */
TakeAttendance.prototype.saveAttendance = function(attendance) {
  try {
    var index = this._db.setFieldHeader('attendance', ('Att-' + attendance.date),
        attendance.name, ('Q' + attendance.quarter));
    var data = {
      rosterIds: attendance.rosterIds,
      fields: [{
        fieldIndex: index,
        data: attendance.marks,
        notes: attendance.reasons
      }]
    }
    this._db.setFieldData(data);
    return getSuccessPage(this._pageTitle, 'Attendance saved',
      this.getSuccess_());
  } catch(error) {
    return getErrorPage(this._pageTitle, 'Error saving attendance', error);
  }
}


/**
 * Returns the HTML content for displaying a card for the given member.
 * 
 * @private
 * @param {Object} member The member information.
 * @returns {String} The member card.
 */
TakeAttendance.prototype.getCard_ = function(member) {
  var marksName = 'attendance-' + member.rosterId;
  var reasonName = 'reason-' + member.rosterId;
  return '' +
    '<div class="card">' +
      '<div class="card-content">' +
        '<div class="card-title">' +
          '<span>' + member.lastName + ', </span>' +
          '<span>' + member.firstName + '</span>' +
        '</div>' +
        '<div class="card-actions selector selector-large">' +
          '<label class="selector-green">' +
            '<input name="' + marksName + '" type="radio" value="P" required>' +
            '<span class="selector-label">P</span>' +
          '</label>' +
          '<label class="selector-red">' +
            '<input name="' + marksName + '" type="radio" value="A">' +
            '<span class="selector-label">A</span>' +
          '</label>' +
          '<label>' +
            '<input name="' + marksName + '" type="radio" value="E">' +
            '<span class="selector-label">E</span>' +
          '</label>' +
        '</div>' +
        '<div class="input-field">' +
          '<input type="text" name="' + reasonName + '" id="' + reasonName + '" rows="2" class="materialize-textarea validate" disabled></textarea>' +
          '<label for="' + reasonName + '">Reason</label>' +
        '</div>' +
      '</div>' +
      '<input type="hidden" name="rosterId" value="' + member.rosterId + '">' +
    '</div>';
}


/**
 * Returns the roster data sorted by last name.
 * 
 * @private
 * @returns {Array[][]} 
 */
TakeAttendance.prototype.getRoster_ = function() {
  var fields = [
    this._db.sections.roster.fields.rosterId,
    this._db.sections.roster.fields.lastName,
    this._db.sections.roster.fields.firstName,
    this._db.sections.memberInformation.fields.membershipStatus
  ];
  var roster = this._db.getSelectedFields(fields);
  return roster.sortByField(1);
}


/**
 * Returns the HTML content for displaying the success message.
 * 
 * @private
 * @returns {String} The success message.
 */
TakeAttendance.prototype.getSuccess_ = function() {
  return '' +
    '<div class="panels">' +
      '<div class="panel panel-2" id="viewAttendance">' +
        '<i class="fas fa-fw fa-3x fa-eye"></i>' +
        '<h5>View Attendance</h5>' +
      '</div>' +
      '<div class="panel panel-2" id="takeAttendance">' +
        '<i class="fas fa-fw fa-3x fa-plus-circle"></i>' +
        '<h5>Take Attendance</h5>' +
      '</div>' +
    '</div>';
}