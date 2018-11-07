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
 * Function to call client-side to save the fundraiser form data.
 * 
 * @param {Object} accounts The form values containing the user input.
 * @returns {DisplayObject[]} The app page to display.
 */
 function saveFundraiser(accounts) {
  var fundraiser = new RunFundraiser();
  return fundraiser.saveFundraiser(accounts);
}




/**
 * Controller for the 'Run Fundraiser' page.
 * 
 * Handles creating the layout for the page sections and for processing the
 * user input by inserting the form data into the database spreadsheet.
 */
var RunFundraiser = function() {
  this._db = new Database();
  this._pageTitle = 'Run Fundraiser';
  this._settings = getSettings();
};


/**
 * Returns the HTML content for displaying the page header.
 * 
 * @returns {String} The page header.
 */
RunFundraiser.prototype.getHeader = function() {
  return '<h1>' + this._pageTitle +'</h1>';
}


/**
 * Returns the HTML content for displaying the main content.
 * 
 * @returns {String} The main content of the page.
 */
RunFundraiser.prototype.getMain = function() {
  var members = [],
      accounts = this.getAccounts_(),
      content = '';
  while (accounts.hasNext()) {
    var account = accounts.getNext();
    members.push({
      rosterId: account[0],
      lastName: account[1],
      firstName: account[2],
      fundraiserAmountCheckedOut: account[9],
      fundraiserAmountCheckedIn: account[10]
    });
  }
  if (members.length > 0) {
    content = '<div class="table fundraiser">';
    for (var i = 0; i < members.length; i++) {
      var account = members[i];
      content += this.getTableRow_(account);
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
RunFundraiser.prototype.getFooter = function() {
  return '' +
    '<button id="submit" class="btn btn-large waves-effect waves-light" ' +
        'data-page="runFundraiser">' +
      'Save' +
    '</button>' +
    '<button id="cancel" class="btn btn-large btn-flat waves-effect waves-light" ' +
        'data-page="viewAccounts" type="button">' +
      'Cancel' +
    '</button>';
}


/**
 * Inserts the given form values into the database and returns an array of
 * DisplayObjects containing the components of the message page to display.
 * 
 * @param {Object} accounts The form values containing the user input.
 * @returns {DisplayObject[]} The app page to display.
 */
RunFundraiser.prototype.saveFundraiser = function(accounts) {
  try {
    var data = {
      rosterIds: accounts.rosterIds,
      fields: [
        {
          fieldIndex: this._db.sections.financial.fields.fundraiserAmountCheckedOut,
          data: accounts.fundraiserAmountsCheckedOut
        },{
          fieldIndex: this._db.sections.financial.fields.fundraiserAmountCheckedIn,
          data: accounts.fundraiserAmountsCheckedIn
        }
      ]
    };
    this._db.setFieldData(data);
    return getSuccessPage(this._pageTitle, 'Fundraiser saved',
      this.getSuccess_());
  } catch(error) {
    return getErrorPage(this._pageTitle, 'Error saving fundraiser', error);
  }
}


/**
 * Returns the HTML content for displaying a card for the given member.
 * 
 * @private
 * @param {Object} account The account information.
 * @returns {String} The member account card.
 */
RunFundraiser.prototype.getTableRow_ = function(account) {
  var checkedOutName = 'checkedOut-' + account.rosterId,
      checkedInName = 'checkedIn-' + account.rosterId;
  return '' +
    '<div class="table-row">' +
      '<div class="data data-main">' +
        account.lastName + ', ' + account.firstName +
      '</div>' +
      '<div class="data">' +
        '<span class="data-title">Amount Checked Out</span>' +
        '<span>' +
          '<i class="fas fa-dollar-sign"></i>' +
          '<input type="number" name="' + checkedOutName + '" min="0" value="' +
              account.fundraiserAmountCheckedOut + '">' +
          '<div class="incrementer">' +
            '<span class="increment" data-amount="' + this._settings.incrementer1 +
                '">$' + this._settings.incrementer1 + '</span>' +
            '<span class="increment" data-amount="' + this._settings.incrementer2 +
                '">$' + this._settings.incrementer2 + '</span>' +
          '</div>' +
        '</span>' +
      '</div>' +
      '<div class="data">' +
        '<span class="data-title">Amount Checked In</span>' +
        '<span>' +
          '<i class="fas fa-dollar-sign"></i>' +
          '<input type="number" name="' + checkedInName + '" min="0" value="' +
              account.fundraiserAmountCheckedIn + '">' +
          '<div class="incrementer">' +
            '<span class="increment" data-amount="' + this._settings.incrementer1 +
                '">$' + this._settings.incrementer1 + '</span>' +
            '<span class="increment" data-amount="' + this._settings.incrementer2 +
                '">$' + this._settings.incrementer2 + '</span>' +
          '</div>' +
        '</span>' +
      '</div>' +
      '<input type="hidden" name="rosterId" value="' + account.rosterId + '">' +
    '</div>';
}


/**
 * Returns the account data sorted by last name and filtered for active members.
 * 
 * @private
 * @returns {DataSet} The account data, filtered and sorted by last name.
 */
RunFundraiser.prototype.getAccounts_ = function() {
  var accountData = this._db.getDataBySection('financial');
  return accountData
    .filterByField(3, 'active')
    .sortByField(1);
}


/**
 * Returns the HTML content for displaying the success message.
 * 
 * @private
 * @returns {String} The success message.
 */
RunFundraiser.prototype.getSuccess_ = function() {
  return '' +
    '<div class="panels">' +
      '<div class="panel panel-2" data-page="viewAccounts">' +
        '<i class="fas fa-fw fa-3x fa-eye"></i>' +
        '<h5>View Accounts</h5>' +
      '</div>' +
      '<div class="panel panel-2" data-page="runFundraiser">' +
        '<i class="fas fa-fw fa-3x fa-hand-holding-usd"></i>' +
        '<h5>Run Fundraiser</h5>' +
      '</div>' +
    '</div>';
}