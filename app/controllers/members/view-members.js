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
 * Controller for the 'View Members' page.
 * 
 * Handles creating the layout for the page sections and for processing the
 * user input by inserting the form data into the database spreadsheet.
 */
var ViewMembers = function() {
  this._db = new Database();
  this._pageTitle = 'View Members';
};


/**
 * Returns the HTML content for displaying the page header.
 * 
 * @returns {String} The page header.
 */
ViewMembers.prototype.getHeader = function() {
  return '<h1>' + this._pageTitle + '</h1>';
}


/**
 * Returns the HTML content for displaying the main content.
 * 
 * @returns {String} The main content of the page.
 */
ViewMembers.prototype.getMain = function() {
  var members = [],
      memberInfo = this.getMemberInformation_(),
      content = '';
  while (memberInfo.hasNext()) {
    var member = memberInfo.getNext();
    members.push({
      rosterId: member[0],
      lastName: member[1],
      firstName: member[2],
      memberStatus: member[3],
      membershipStatus: member[4],
      yearJoined: member[5],
      grade: member[6],
      gender: member[7],
      totalAttendanceRate: member[8]
    });
  }
  content += '<div class="table">';
  for (var i = 0; i < members.length; i++) {
    var member = members[i];
    content += this.getTableRow_(member);
  }
  content += '</div>';
  return content;
}


/**
 * Returns the HTML content for displaying the page footer.
 * 
 * @returns {String} The page footer.
 */
ViewMembers.prototype.getFooter = function() {
  return '' +
    '<a class="btn-floating btn-large waves-effect waves-light" id="addMember">' +
      '<i class="material-icons">add</i>' +
    '</a>';
}


/**
 * Returns the member information data sorted by last name.
 * 
 * @private
 * @returns {Array[][]} 
 */
ViewMembers.prototype.getMemberInformation_ = function() {
  var fields = [
    this._db.sections.roster.fields.rosterId,
    this._db.sections.roster.fields.lastName,
    this._db.sections.roster.fields.firstName,
    this._db.sections.memberInformation.fields.memberStatus,
    this._db.sections.memberInformation.fields.membershipStatus,
    this._db.sections.memberInformation.fields.yearJoined,
    this._db.sections.memberInformation.fields.grade,
    this._db.sections.memberInformation.fields.gender,
    this._db.sections.attendance.fields.totalAttendanceRate
  ];
  var memberInfo = this._db.getSelectedFields(fields);
  return memberInfo.sortByField(1);
}


/**
 * Returns the HTML content for displaying a table row for the given member.
 * 
 * @private
 * @param {Object} member The member information.
 * @returns {String} The member card.
 */
ViewMembers.prototype.getTableRow_ = function(member) {
  var genderIcon = (member.gender === 'M') ? 'male' : 'female';
  var attendance = (member.totalAttendanceRate !== '') ? (member.totalAttendanceRate*100 + '%') : 'NA';
  var memberStatus = {};
  switch(member.memberStatus) {
    case 'good standing':
      memberStatus = {
        color: 'green',
        icon: 'smile'
      };
      break;
    case 'probation':
      memberStatus = {
        color: 'yellow',
        icon: 'meh'
      };
      break;
    case 'dismissal':
      memberStatus = {
        color: 'red',
        icon: 'frown'
      };
      break;
  }
  var card = '' +
    '<div class="table-row">' +
      '<div class="data data-icon">' +
        '<i class="fas fa-fw fa-2x fa-' + genderIcon + '"></i>' +
      '</div>' +
      '<div class="data data-main">' +
        member.lastName + ', ' + member.firstName +
        '<div class="data-tags">' +
          '<div class="chip chip-' + memberStatus.color + '">' +
            '<i class="fas fa-' + memberStatus.icon + '"></i>' +
          '</div>' +
          '<div class="chip chip-dark">' + member.membershipStatus + '</div>' +
          '<div class="chip chip-blue">' + member.yearJoined + '</div>' +
        '</div>' +
      '</div>' +
      '<div class="data">' +
        '<span class="data-title">Grade</span>' +
        '<span class="data-value">' + member.grade + '</span>' +
      '</div>' +
      '<div class="data">' +
        '<span class="data-title">Attendance</span>' +
        '<span class="data-value">' + attendance + '</span>' +
      '</div>' +
      '<div class="table-action-button waves-effect waves-light" ' +
          'id="editMember" data-rosterid="' + member.rosterId + '">' +
        '<i class="fas fa-pen fa-2x"></i>' +
      '</div>' +
    '</div>';
  return card;
}