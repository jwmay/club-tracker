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
 * 
 * @param {Object=} args Optional args object for passing filters.
 */
var ViewMembers = function(args) {
  this._db = new Database();
  this._form = new FormBuilder();
  this._pageTitle = 'View Members';
  this._filters = null;

  // Process args object
  if (typeof args !== 'undefined' && args !== null) {
    if (args.hasOwnProperty('filters')) this._filters = args.filters;
  }
};


/**
 * Returns the HTML content for displaying the page header.
 * 
 * @returns {String} The page header.
 */
ViewMembers.prototype.getHeader = function() {
  // Construct the objects for displaying select elements
  var memberStatusSelect = {
    title: 'Member Status',
    name: 'memberStatusFilter',
    selected: (this._filters !== null) ? this._filters.memberStatusFilter : '',
    labels: ['all', 'good', 'probation', 'dismissal'],
    values: ['all', 'good', 'probation', 'dismissal'],
    classes: ['filter-select'],
    required: false,
    defaultValue: 'all'
  };

  var membershipStatusSelect = {
    title: 'Membership Status',
    name: 'membershipStatusFilter',
    selected: (this._filters !== null) ? this._filters.membershipStatusFilter : '',
    labels: ['active', 'all', 'dismissed', 'graduated', 'resigned'],
    values: ['active', 'all', 'dismissed', 'graduated', 'resigned'],
    classes: ['filter-select'],
    required: false,
    defaultValue: 'active'
  };

  var content = '' +
      '<h1>' + this._pageTitle + '</h1>' +
      '<div class="filter-bar">' +
        '<h5>Filters</h5>' +
        '<div class="row">' +
          '<div class="input-field col s12 m3">' +
            this._form.insertSelect(memberStatusSelect) +
          '</div>' +
          '<div class="input-field col s12 m3">' +
            this._form.insertSelect(membershipStatusSelect) +
          '</div>' +
          '<div class="filter-buttons col s12 m3">' +
            '<a class="btn wave-effect waves-light" id="applyFilter" ' +
                'data-page="viewMembers">Apply</a>' +
          '</div>' +
        '</div>' +
      '</div>';
  return content;
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
  if (memberInfo.hasNext()) {
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
        totalAttendanceRate: member[8],
        accountBalance: member[9],
        communityServiceHours: member[10],
      });
    }
    content += '<div class="table">';
    for (var i = 0; i < members.length; i++) {
      var member = members[i];
      content += this.getTableRow_(member);
    }
    content += '</div>';
  } else {
  content += '<div class="no-results">No results found.</div>';
  }
  return content;
}


/**
 * Returns the HTML content for displaying the page footer.
 * 
 * @returns {String} The page footer.
 */
ViewMembers.prototype.getFooter = function() {
  return '' +
    '<a class="btn-floating btn-large waves-effect waves-light" ' +
        'data-page="addMember">' +
      '<i class="material-icons">add</i>' +
    '</a>';
}


/**
 * Returns the member information data sorted by last name with any given
 * filters applied.
 * 
 * @private
 * @returns {DataSet} The member information, filtered and sorted by last name.
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
    this._db.sections.attendance.fields.totalAttendanceRate,
    this._db.sections.financial.fields.accountBalance,
    this._db.sections.communityService.fields.totalHours,
  ];
  var memberInfo = this._db.getSelectedFields(fields);
  
  // Apply filters
  if (this._filters !== null) {
    memberInfo.filterByField(3, this._filters.memberStatusFilter);
    memberInfo.filterByField(4, this._filters.membershipStatusFilter);
  } else {
    // Set default filter on membership status to active
    memberInfo.filterByField(4, 'active');
  }
  
  // Sort by last name and return the object instance
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
  var genderIcon = (member.gender === 'M') ? 'male' : 'female',
      attendance = (member.totalAttendanceRate !== '') ? getPercentString(member.totalAttendanceRate) : 'NA',
      memberStatus = {};
  switch(member.memberStatus) {
    case 'good':
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
      '<div class="data">' +
        '<span class="data-title">Account Balance</span>' +
        '<span class="data-value">$' + member.accountBalance + '</span>' +
      '</div>' +
      '<div class="data">' +
        '<span class="data-title">Community Service Hours</span>' +
        '<span class="data-value">' + member.communityServiceHours + '</span>' +
      '</div>' +
      '<div class="table-action-button waves-effect waves-light" ' +
          'id="editMember" data-rosterid="' + member.rosterId + '">' +
        '<i class="fas fa-pen fa-2x"></i>' +
      '</div>' +
    '</div>';
  return card;
}