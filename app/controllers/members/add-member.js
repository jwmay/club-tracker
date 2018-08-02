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
 * Function to call client-side to save the member data.
 * 
 * @param {Object} member The form values containing the user input.
 * @returns {DisplayObject[]} The app page to display.
 */
function saveMember(member) {
  var addMember = new AddMember();
  return addMember.saveMember(member);
}


 /**
 * Controller for the 'Add/Edit Member' page.
 * 
 * Handles creating the layout for the page sections and for processing the
 * user input by inserting the form data into the database spreadsheet.
 * 
 * @param {String=} mode The mode to display, add or edit. Default is add.
 * @param {Object=} args Optional args object for passing a roster id.
 */
var AddMember = function(mode, args) {
  this._db = new Database();
  this._form = new FormBuilder();
  this._mode = (typeof mode === 'undefined') ? 'add' : mode;
  this._rosterId = null;

  // Process args object
  if (typeof args !== 'undefined' && args !== null) {
    if (args.hasOwnProperty('rosterId')) this._rosterId = args.rosterId;
  }
};


/**
 * Returns the HTML content for displaying the page header.
 * 
 * @returns {String} The page header.
 */
AddMember.prototype.getHeader = function() {
  return '<h1>' + this.getPageTitle_() + '</h1>';
}


/**
 * Returns the HTML content for displaying the main content.
 * 
 * @returns {String} The main content of the page.
 */
AddMember.prototype.getMain = function() {
  var edit = (this._mode === 'edit') ? true : false;

  // Get the current record, if edit mode
  if(edit === true) {
    var fields = [
      this._db.sections.roster.fields.rosterId,
      this._db.sections.roster.fields.lastName,
      this._db.sections.roster.fields.firstName,
      this._db.sections.memberInformation.fields.membershipStatus,
      this._db.sections.memberInformation.fields.yearJoined,
      this._db.sections.memberInformation.fields.grade,
      this._db.sections.memberInformation.fields.gender,
      this._db.sections.memberInformation.fields.birthdate,
      this._db.sections.memberInformation.fields.studentNumber,
    ];
    var record = this._db.getRecordById(this._rosterId, fields);
  }

  // Construct the member object, or leave keys blank if add mode
  var member = {
    rosterId: (edit ? record[0] : ''),
    lastName: (edit ? record[1] : ''),
    firstName: (edit ? record[2] : ''),
    membershipStatus: (edit ? record[3] : ''),
    yearJoined: (edit ? record[4] : ''),
    grade: (edit ? record[5] : ''),
    gender: (edit ? record[6] : ''),
    birthdate: (edit ? getDateString(record[7]) : ''),
    studentNumber: (edit ? record[8] : '')
  }

  // Construct the objects for displaying selector and select elements
  var gradeSelector = {
    title: 'Grade',
    name: 'grade',
    selected: member.grade,
    labels: ['9', '10', '11', '12'],
    values: ['9', '10', '11', '12'],
    required: true
  };

  var genderSelector = {
    title: 'Gender',
    name: 'gender',
    selected: member.gender,
    labels: ['F', 'M'],
    values: ['F', 'M'],
    required: true
  };

  var yearSelect = {
    title: 'Year Joined',
    name: 'year',
    selected: member.yearJoined,
    labels: ['2014', '2015', '2016', '2017', '2018', '2019', '2020'],
    values: ['2014', '2015', '2016', '2017', '2018', '2019', '2020'],
    required: true,
    defaultValue: '2018'
  };

  var statusSelect = {
    title: 'Membership Status',
    name: 'status',
    selected: member.membershipStatus,
    labels: ['active', 'dismissed', 'graduated', 'resigned'],
    values: ['active', 'dismissed', 'graduated', 'resigned'],
    required: true,
    defaultValue: 'active'
  };

  var content = '' +
      '<div class="row">' +
        '<div class="col s12 m10 l8">' +
          '<div class="card">' +
              '<div class="card-content">' +
              '<div class="row">' +
                '<div class="input-field col s12 m6">' +
                  '<input type="text" id="firstName" name="firstName" ' +
                      'class="validate" value="' + member.firstName + '" required>' +
                  '<label for="firstName">First Name</label>' +
                '</div>' +
                '<div class="input-field col s12 m6">' +
                  '<input type="text" id="lastName" name="lastName" class="validate" ' +
                      'value="' + member.lastName + '" required>' +
                  '<label for="lastName">Last Name</label>' +
                '</div>' +
                '<div class="input-field col s12 m6">' +
                  '<input type="number" id="studentNumber" name="studentNumber" ' +
                      'class="validate" min="0" value="' + member.studentNumber + '" required>' +
                  '<label for="studentNumber">Student Number</label>' +
                '</div>' +
                '<div class="input-field col s12 m6">' +
                  '<input type="text" id="birthdate" name="birthdate" class="datepicker" ' +
                      'value="' + member.birthdate + '">' +
                  '<label for="studentNumber">Birthdate</label>' +
                '</div>' +
                '<div class="input-field col s12 m6">' +
                  this._form.insertSelector(gradeSelector) +
                '</div>' +
                '<div class="input-field col s12 m6">' +
                  this._form.insertSelector(genderSelector) +
                '</div>' +
                '<div class="input-field col s4 m2">' +
                  this._form.insertSelect(yearSelect) +
                '</div>' +
                '<div class="input-field col s9 m4 offset-m4">' +
                  this._form.insertSelect(statusSelect) +
                '</div>' +
                '<input type="hidden" id="rosterId" value="' + member.rosterId + '">' +
              '</div>' +
            '</div>' +
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
AddMember.prototype.getFooter = function() {
  var buttonLabelMode = (this._mode === 'add') ? 'Add' : 'Update';
  return '' +
    '<button id="submit" class="btn btn-large waves-effect waves-light" ' +
        'data-page="addMember" type="submit">' +
      buttonLabelMode + '  Member' +
    '</button>' +
    '<button id="cancel" class="btn btn-large btn-flat waves-effect waves-light" ' +
        'data-page="viewMembers" type="button">' +
      'Cancel' +
    '</button>';
}


/**
 * Inserts the given form values into the database and returns an array of
 * DisplayObjects containing the components of the message page to display.
 * 
 * @param {Object} member The form values containing the user input.
 * @returns {DisplayObject[]} The app page to display.
 */
AddMember.prototype.saveMember = function(member) {
  try {
    if (member.rosterId === '') {
      this._db.setRecord(member);
      return getSuccessPage(this.getPageTitle_(), 'Member added',
          this.getSuccess_());
    } else {
      this._mode = 'edit';
      this._db.updateRecord(member);
      return getSuccessPage(this.getPageTitle_(), 'Member updated',
          this.getSuccess_());
    }
  } catch(error) {
    return getErrorPage(this.getPageTitle_(), 'Error saving member', error);
  }
};


/**
 * Returns the page title based on the mode. Default mode is 'Add Member'.
 * 
 * @private
 * @returns {String} The page title.
 */
AddMember.prototype.getPageTitle_ = function() {
  switch(this._mode) {
    case 'add':
      return 'Add Member';
    case 'edit':
      return 'Edit Member';
    default:
      return 'Add Member';
  }
}


/**
 * Returns the HTML content for displaying the success message.
 * 
 * @private
 * @returns {String} The success message.
 */
AddMember.prototype.getSuccess_ = function() {
  return '' +
    '<div class="panels">' +
      '<div class="panel panel-2" data-page="viewMembers">' +
        '<i class="fas fa-fw fa-3x fa-eye"></i>' +
        '<h5>View Members</h5>' +
      '</div>' +
      '<div class="panel panel-2" data-page="addMember">' +
        '<i class="fas fa-fw fa-3x fa-plus-circle"></i>' +
        '<h5>Add Member</h5>' +
      '</div>' +
    '</div>';
}