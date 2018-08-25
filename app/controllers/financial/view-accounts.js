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
 * Controller for the 'View Accounts' page.
 * 
 * Handles creating the layout for the page sections.
 */
var ViewAccounts = function() {
  this._db = new Database();
  this._pageTitle = 'View Accounts';
};


/**
 * Returns the HTML content for displaying the page header.
 * 
 * @returns {String} The page header.
 */
ViewAccounts.prototype.getHeader = function() {
  return '<h1>' + this._pageTitle + '</h1>';
}


/**
 * Returns the HTML content for displaying the main content.
 * 
 * @returns {String} The main content of the page.
 */
ViewAccounts.prototype.getMain = function() {
  var members = [],
      accounts = this.getAccountData_(),
      content = '';
  while (accounts.hasNext()) {
    var member = accounts.getNext(),
        fields = accounts.getFields();
    members.push({
      rosterId: member[0],
      lastName: member[1],
      firstName: member[2],
      status: member[3],
      balance: member[4],
      amountDue: member[5],
      amountPaid: member[6],
      membershipFee: member[7],
      membershipFeePaid: member[8],
      fundraiserCheckedOut: member[9],
      fundraiserCheckedIn: member[10],
      finesCharged: member[11],
      finesPaid: member[12]
    });
  }
  if (members.length > 0) {
    content += '<div class="table accounts">';
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
ViewAccounts.prototype.getFooter = function() {
  return '';
}


/**
 * Returns the account data sorted by last name and filtered for active
 * members only.
 * 
 * @private
 * @returns {DataSet} The account data, filtered and sorted by last name.
 */
ViewAccounts.prototype.getAccountData_ = function() {
  var accountData = this._db.getDataBySection('financial');
  return accountData
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
ViewAccounts.prototype.getTableRow_ = function(member) {
  return '' +
    '<div class="table-row">' +
      '<div class="data data-main">' +
        '<a id="editAccount" data-rosterid="' + member.rosterId + '" class="link">' +
          member.lastName + ', ' + member.firstName +
        '</a>' +
      '</div>' +
      '<div class="data data-highlight highlight-' +
          getDollarColor(member.balance) + '">' +
        '<span class="data-title">Account Balance</span>' +
        '<span class="data-value">' + getDollarString(member.balance) + '</span>' +
      '</div>' +
      '<div class="data">' +
        '<span class="data-title">Amount Due</span>' +
        '<span class="data-value">' + getDollarString(member.amountDue) + '</span>' +
      '</div>' +
      '<div class="data">' +
        '<span class="data-title">Amount Paid</span>' +
        '<span class="data-value">' + getDollarString(member.amountPaid) + '</span>' +
      '</div>' +
      '<div class="data">' +
        '<span class="data-title">Membership Fee</span>' +
        '<span class="data-value">' + getDollarString(member.membershipFee) + '</span>' +
      '</div>' +
      '<div class="data">' +
        '<span class="data-title">Membership Fee Paid</span>' +
        '<span class="data-value data-dot data-' + getYesNoColor(member.membershipFeePaid) + '">' +
          member.membershipFeePaid +
        '</span>' +
      '</div>' +
      '<div class="data">' +
        '<span class="data-title">Fundraiser Amount Checked Out</span>' +
        '<span class="data-value">' + getDollarString(member.fundraiserCheckedOut) + '</span>' +
      '</div>' +
      '<div class="data">' +
        '<span class="data-title">Fundraiser Amount Checked In</span>' +
        '<span class="data-value">' + getDollarString(member.fundraiserCheckedIn) + '</span>' +
      '</div>' +
      '<div class="data">' +
        '<span class="data-title">Fines Charged</span>' +
        '<span class="data-value">' + getDollarString(member.finesCharged) + '</span>' +
      '</div>' +
      '<div class="data">' +
        '<span class="data-title">Fines Paid</span>' +
        '<span class="data-value">' + getDollarString(member.finesPaid) + '</span>' +
      '</div>' +
    '</div>';
}