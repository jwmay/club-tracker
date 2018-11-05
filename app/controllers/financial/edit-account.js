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
 * @param {Object} account The form values containing the user input.
 * @returns {DisplayObject[]} The app page to display.
 */
function saveAccount(account) {
  var editAccount = new EditAccount();
  return editAccount.saveAccount(account);
}


 /**
 * Controller for the 'Edit Account' page.
 * 
 * Handles creating the layout for the page sections and for processing the
 * user input by inserting the form data into the database spreadsheet.
 * 
 * @param {Object} args For passing a roster id.
 */
var EditAccount = function(args) {
  this._db = new Database();
  this._form = new FormBuilder();
  this._pageTitle = 'Edit Account';
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
EditAccount.prototype.getHeader = function() {
  return '<h1>' + this._pageTitle + '</h1>';
}


/**
 * Returns the HTML content for displaying the main content.
 * 
 * @returns {String} The main content of the page.
 */
EditAccount.prototype.getMain = function() {
  // Get the current record
  var fields = [
    this._db.sections.roster.fields.rosterId,
    this._db.sections.roster.fields.lastName,
    this._db.sections.roster.fields.firstName,
    this._db.sections.financial.fields.membershipFeePaid,
    this._db.sections.financial.fields.fundraiserAmountCheckedOut,
    this._db.sections.financial.fields.fundraiserAmountCheckedIn,
    this._db.sections.financial.fields.finesCharged,
    this._db.sections.financial.fields.finesPaid
  ];
  var record = this._db.getRecordById(this._rosterId, fields);

  // Construct the member object, or leave keys blank if add mode
  var member = {
    rosterId: record[0],
    lastName: record[1],
    firstName: record[2],
    membershipFeePaid: record[3],
    fundraiserAmountCheckedOut: record[4],
    fundraiserAmountCheckedIn: record[5],
    finesCharged: record[6],
    finesPaid: record[7]
  }

  // Construct the objects for displaying selector and select elements
  var membershipFeePaidSelect = {
    title: 'Membership Fee Paid',
    name: 'membershipFeePaid',
    selected: member.membershipFeePaid,
    labels: ['yes', 'no'],
    values: ['yes', 'no'],
    required: true,
    defaultValue: 'no'
  };

  return '' +
    '<div class="row account">' +
      '<div class="col s12 m10 l8">' +
        '<div class="card">' +
            '<div class="card-content">' +
            '<div class="row">' +
              '<div class="col s12">' +
                '<h5>' + member.firstName + ' ' + member.lastName + '</h5>' +
              '</div>' +
              '<div class="input-field col s12 m6">' +
                '<i class="fas fa-dollar-sign"></i>' +
                '<input type="number" id="fundraiserAmountCheckedOut" name="fundraiserAmountCheckedOut" ' +
                    'class="validate" min="0" value="' + member.fundraiserAmountCheckedOut + '" required>' +
                '<label for="fundraiserAmountCheckedOut">Fundraiser Amount Checked Out</label>' +
              '</div>' +
              '<div class="input-field col s12 m6">' +
                '<i class="fas fa-dollar-sign"></i>' +
                '<input type="number" id="fundraiserAmountCheckedIn" name="fundraiserAmountCheckedIn" ' +
                    'class="validate" min="0" value="' + member.fundraiserAmountCheckedIn + '" required>' +
                '<label for="fundraiserAmountCheckedIn">Fundraiser Amount Checked In</label>' +
              '</div>' +
              '<div class="input-field col s12 m6">' +
                '<i class="fas fa-dollar-sign"></i>' +
                '<input type="number" id="finesCharged" name="finesCharged" ' +
                    'class="validate" min="0" value="' + member.finesCharged + '" required>' +
                '<label for="finesCharged">Fines Charged</label>' +
              '</div>' +
              '<div class="input-field col s12 m6">' +
                '<i class="fas fa-dollar-sign"></i>' +
                '<input type="number" id="finesPaid" name="finesPaid" ' +
                    'class="validate" min="0" value="' + member.finesPaid + '" required>' +
                '<label for="finesPaid">Fines Paid</label>' +
              '</div>' +
              '<div class="input-field col s12 m6">' +
                this._form.insertSelect(membershipFeePaidSelect) +
              '</div>' +
              '<input type="hidden" id="rosterId" value="' + member.rosterId + '">' +
            '</div>' +
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
EditAccount.prototype.getFooter = function() {
  return '' +
    '<button id="submit" class="btn btn-large waves-effect waves-light" ' +
        'data-page="editAccount" type="submit">' +
      'Update Account' +
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
 * @param {Object} account The form values containing the user input.
 * @returns {DisplayObject[]} The app page to display.
 */
EditAccount.prototype.saveAccount = function(account) {
  try {
    this._db.updateRecord(account);
    return getSuccessPage(this._pageTitle, 'Account updated',
        this.getSuccess_());
  } catch(error) {
    return getErrorPage(this._pageTitle, 'Error saving account', error);
  }
};


/**
 * Returns the HTML content for displaying the success message.
 * 
 * @private
 * @returns {String} The success message.
 */
EditAccount.prototype.getSuccess_ = function() {
  return '' +
    '<div class="panels">' +
      '<div class="panel panel-full" data-page="viewAccounts">' +
        '<i class="fas fa-fw fa-3x fa-eye"></i>' +
        '<h5>View Accounts</h5>' +
      '</div>' +
    '</div>';
}