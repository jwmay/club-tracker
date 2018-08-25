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
 * Controller for the 'View Community Service' page.
 * 
 * Handles creating the layout for the page sections.
 */
var ViewCommunityService = function() {
  this._db = new Database();
  this._pageTitle = 'View Community Service';
};


/**
 * Returns the HTML content for displaying the page header.
 * 
 * @returns {String} The page header.
 */
ViewCommunityService.prototype.getHeader = function() {
  return '<h1>' + this._pageTitle + '</h1>';
}


/**
 * Returns the HTML content for displaying the main content.
 * 
 * @returns {String} The main content of the page.
 */
ViewCommunityService.prototype.getMain = function() {
  var members = [],
      service = this.getCommunityServiceData_(),
      content = '';
  while (service.hasNext()) {
    var member = service.getNext(),
        fields = service.getFields();
    members.push({
      rosterId: member[0],
      lastName: member[1],
      firstName: member[2],
      status: member[3],
      totalHours: member[4],
      q1Hours: member[5],
      q2Hours: member[6],
      q3Hours: member[7],
      q4Hours: member[8]
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
ViewCommunityService.prototype.getFooter = function() {
  return '';
}


/**
 * Returns the community service data sorted by last name and filtered for
 * active members only.
 * 
 * @private
 * @returns {DataSet} The community service data, filtered and sorted.
 */
ViewCommunityService.prototype.getCommunityServiceData_ = function() {
  var communityServiceData = this._db.getDataBySection('communityService');
  return communityServiceData
    .filterByField(3, 'active')
    .sortByField(1);
}


/**
 * Returns the HTML content for displaying a table row for the given member.
 * 
 * @private
 * @param {Object} member The member information.
 * @returns {String} The member table row.
 */
ViewCommunityService.prototype.getTableRow_ = function(member) {
  return '' +
    '<div class="table-row">' +
      '<div class="data data-main">' +
        member.lastName + ', ' + member.firstName +
      '</div>' +
      '<div class="data data-highlight highlight-' +
          getHoursColor(member.totalHours) + '">' +
        '<span class="data-title">Total Hours</span>' +
        '<span class="data-value">' + member.totalHours + '</span>' +
      '</div>' +
      '<div class="data">' +
        '<span class="data-title">Q1 Hours</span>' +
        '<span class="data-value">' + member.q1Hours + '</span>' +
      '</div>' +
      '<div class="data">' +
        '<span class="data-title">Q2 Hours</span>' +
        '<span class="data-value">' + member.q2Hours + '</span>' +
      '</div>' +
      '<div class="data">' +
        '<span class="data-title">Q3 Hours</span>' +
        '<span class="data-value">' + member.q3Hours + '</span>' +
      '</div>' +
      '<div class="data">' +
        '<span class="data-title">Q4 Hours</span>' +
        '<span class="data-value">' + member.q4Hours + '</span>' +
      '</div>' +
    '</div>';
}