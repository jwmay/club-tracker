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
 * @param {Object} shirts The form values containing the user input.
 * @returns {DisplayObject[]} The app page to display.
 */
 function saveShirts(shirts) {
  var fundraiser = new ManageShirts();
  return fundraiser.saveShirts(shirts);
}




/**
 * Controller for the 'Manage Shirts' page.
 * 
 * Handles creating the layout for the page sections and for processing the
 * user input by inserting the form data into the database spreadsheet.
 */
var ManageShirts = function() {
  this._db = new Database();
  this._form = new FormBuilder();
  this._pageTitle = 'Manage Shirts';
};


/**
 * Returns the HTML content for displaying the page header.
 * 
 * @returns {String} The page header.
 */
ManageShirts.prototype.getHeader = function() {
  return '<h1>' + this._pageTitle +'</h1>';
}


/**
 * Returns the HTML content for displaying the main content.
 * 
 * @returns {String} The main content of the page.
 */
ManageShirts.prototype.getMain = function() {
  var members = [],
      shirts = this.getShirts_(),
      content = '';
  while (shirts.hasNext()) {
    var shirt = shirts.getNext();
    members.push({
      rosterId: shirt[0],
      lastName: shirt[1],
      firstName: shirt[2],
      membershipFeePaid: shirt[8],
      shirtSize: shirt[13],
      shirtReceived: shirt[14]
    });
  }
  if (members.length > 0) {
    content = '<div class="table accounts">';
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
ManageShirts.prototype.getFooter = function() {
  return '' +
    '<button id="submit" class="btn btn-large waves-effect waves-light" ' +
        'data-page="manageShirts">' +
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
 * @param {Object} shirts The form values containing the user input.
 * @returns {DisplayObject[]} The app page to display.
 */
ManageShirts.prototype.saveShirts = function(shirts) {
  try {
    var data = {
      rosterIds: shirts.rosterIds,
      fields: [
        {
          fieldIndex: this._db.sections.financial.fields.shirtSize,
          data: shirts.shirtSizes
        },{
          fieldIndex: this._db.sections.financial.fields.shirtReceived,
          data: shirts.shirtsReceived
        }
      ]
    };
    this._db.setFieldData(data);
    return getSuccessPage(this._pageTitle, 'Shirt information saved',
      this.getSuccess_());
  } catch(error) {
    return getErrorPage(this._pageTitle, 'Error saving shirt information', error);
  }
}


/**
 * Returns the HTML content for displaying a card for the given member.
 * 
 * @private
 * @param {Object} member The member information.
 * @returns {String} The table row for the member.
 */
ManageShirts.prototype.getTableRow_ = function(member) {
  var shirtSizeSelector = {
    title: 'Shirt Size',
    name: 'shirtSize-' + member.rosterId,
    selected: member.shirtSize,
    labels: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
    values: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
    required: true
  };

  var shirtReceivedSelector = {
    title: 'Shirt Received',
    name: 'shirtReceived-' + member.rosterId,
    selected: member.shirtReceived,
    labels: ['yes', 'no'],
    values: ['yes', 'no'],
    required: true
  };
  
  return '' +
    '<div class="table-row">' +
      '<div class="data data-main">' +
        member.lastName + ', ' + member.firstName +
      '</div>' +
      '<div class="data">' +
        '<span class="input-field">' +
          this._form.insertSelector(shirtSizeSelector) +
        '</span>' +
      '</div>' +
      '<div class="data">' +
        '<span class="input-field">' +
          this._form.insertSelector(shirtReceivedSelector) +
        '</span>' +
      '</div>' +
      '<div class="data">' +
        '<span class="data-title">Membership Fee Paid</span>' +
        '<span class="data-value data-dot data-' + getYesNoColor(member.membershipFeePaid) + '">' +
          member.membershipFeePaid +
        '</span>' +
      '</div>' +
      '<input type="hidden" name="rosterId" value="' + member.rosterId + '">' +
    '</div>';
}


/**
 * Returns the shirt data sorted by last name and filtered for active members.
 * 
 * @private
 * @returns {DataSet} The shirt data, filtered and sorted by last name.
 */
ManageShirts.prototype.getShirts_ = function() {
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
ManageShirts.prototype.getSuccess_ = function() {
  return '' +
    '<div class="panels">' +
      '<div class="panel panel-2" data-page="viewAccounts">' +
        '<i class="fas fa-fw fa-3x fa-eye"></i>' +
        '<h5>View Accounts</h5>' +
      '</div>' +
      '<div class="panel panel-2" data-page="manageShirts">' +
        '<i class="fas fa-fw fa-3x fa-tshirt"></i>' +
        '<h5>Manage Shirts</h5>' +
      '</div>' +
    '</div>';
}