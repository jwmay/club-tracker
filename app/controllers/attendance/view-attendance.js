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
 * Controller for the 'View Attendance' page.
 * 
 * Handles creating the layout for the page sections.
 */
var ViewAttendance = function() {
  this._db = new Database();
  this._pageTitle = 'View Attendance';
};


/**
 * Returns the HTML content for displaying the page header.
 * 
 * @returns {String} The page header.
 */
ViewAttendance.prototype.getHeader = function() {
  return '<h1>' + this._pageTitle + '</h1>';
}


/**
 * Returns the HTML content for displaying the main content.
 * 
 * @returns {String} The main content of the page.
 */
ViewAttendance.prototype.getMain = function() {
  var members = [],
      attendance = this.getAttendanceData_(),
      content = '';
  while (attendance.hasNext()) {
    var member = attendance.getNext(),
        fields = attendance.getFields();
    members.push({
      rosterId: member[0],
      lastName: member[1],
      firstName: member[2],
      status: member[3],
      rateTotal: member[4],
      rateQ1: member[5],
      rateQ2: member[6],
      rateQ3: member[7],
      rateQ4: member[8],
      attendance: member.slice(9),
      fields: fields.slice(9)
    });
  }
  if (members.length > 0) {
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
ViewAttendance.prototype.getFooter = function() {
  return '' +
    '<a class="btn-floating btn-large waves-effect waves-light" ' +
        'data-page="takeAttendance">' +
      '<i class="material-icons">add</i>' +
    '</a>';
}


/**
 * Returns the attendance data sorted by last name and filtered for active
 * members only.
 * 
 * @private
 * @returns {DataSet} The attendance data, filtered and sorted by last name.
 */
ViewAttendance.prototype.getAttendanceData_ = function() {
  var attendanceData = this._db.getDataBySection('attendance');
  return attendanceData
      .filterByField(3, 'active')
      .sortByField(1);
}


/**
 * Returns the HTML content for displaying a table row for the given member.
 * 
 * @private
 * @param {Object} member The member information.
 * @returns {String} The member card.
 */
ViewAttendance.prototype.getTableRow_ = function(member) {
  var card = '' +
    '<div class="table-row">' +
      '<div class="data data-main">' +
        member.lastName + ', ' + member.firstName +
      '</div>' +
      '<div class="data data-highlight highlight-' +
          getPercentColor(member.rateTotal) + '">' +
        '<span class="data-title">Total Attendance</span>' +
        '<span class="data-value">' + getPercentString(member.rateTotal) + '</span>' +
      '</div>' +
      '<div class="data">' +
        '<span class="data-title">Q1 Attendance</span>' +
        '<span class="data-value">' + getPercentString(member.rateQ1) + '</span>' +
      '</div>' +
      '<div class="data">' +
        '<span class="data-title">Q2 Attendance</span>' +
        '<span class="data-value">' + getPercentString(member.rateQ2) + '</span>' +
      '</div>' +
      '<div class="data">' +
        '<span class="data-title">Q3 Attendance</span>' +
        '<span class="data-value">' + getPercentString(member.rateQ3) + '</span>' +
      '</div>' +
      '<div class="data">' +
        '<span class="data-title">Q4 Attendance</span>' +
        '<span class="data-value">' + getPercentString(member.rateQ4) + '</span>' +
      '</div>';
  for (var i = 0; i < member.attendance.length; i++) {
    var mark = member.attendance[i],
        data,
        color;
    switch(mark) {
      case 'P':
        color = 'green';
        break;
      case 'A':
        color = 'red';
        break;
      case 'E':
        color = 'yellow';
        break;
    }
    card += '' +
        '<div class="data">' +
          '<span class="data-title">' +
            member.fields[i].slice(4).slice(0, -6) +
          '</span>' +
          '<span class="data-value data-dot data-' + color + '">' +
            mark +
          '</span>' +
        '</div>';
  }
  card += '</div>';
  return card;
}