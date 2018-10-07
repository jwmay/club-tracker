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
 * Function to call client-side to retrieve and display the dashboard charts.
 * 
 * @returns {Object} The chart data.
 */
function getCharts() {
  var dashboard = new Dashboard();
  return dashboard.getCharts();
}




/**
 * Controller for the 'Dashboard' page.
 */
var Dashboard = function() {
  this._db = new Database();
  this._pageTitle = 'Dashboard';
  this._counts = this.getCounts_();
};


/**
 * Returns the HTML content for displaying the page header.
 * 
 * @returns {String} The page header.
 */
Dashboard.prototype.getHeader = function() {
  return '<h1>' + this._pageTitle + '</h1>';
}


/**
 * Returns the HTML content for displaying the main content.
 * 
 * @returns {String} The main content of the page.
 */
Dashboard.prototype.getMain = function() {
  return '' +
    // Member Information
      '<div class="tile-wrapper">' +
        '<div class="tile tile-full-width">' +
          '<h5 class="tile-title">Member Information</h5>' +
          '<div class="tile-section">' +
            '<div class="tile-chart" id="chart_gender">' +
              getChartPreloader() +
            '</div>' +
            '<div class="tile-chart" id="chart_grade">' +
              getChartPreloader() +
            '</div>' +
          '</div>' +
          '<div class="tile-section">' +
            '<div class="tile-table">' +
              '<div class="tile-table-row">' +
                '<i class="fas fa-fw fa-2x fa-female"></i>' +
                '<span class="tile-table-row-title">Females</span>' +
                '<span>' + this._counts.members.females + '</span>' +
              '</div>' +
              '<div class="tile-table-row">' +
                '<i class="fas fa-fw fa-2x fa-male"></i>' +
                '<span class="tile-table-row-title">Males</span>' +
                '<span>' + this._counts.members.males + '</span>' +
              '</div>' +
              '<div class="tile-table-divider"></div>' +
              '<div class="tile-table-row">' +
                '<i class="fas fa-fw fa-2x fa-user-graduate"></i>' +
                '<span class="tile-table-row-title">Sophomores</span>' +
                '<span>' + this._counts.members.sophomores + '</span>' +
              '</div>' +
              '<div class="tile-table-row">' +
                '<i class="fas fa-fw fa-2x fa-user-graduate"></i>' +
                '<span class="tile-table-row-title">Juniors</span>' +
                '<span>' + this._counts.members.juniors + '</span>' +
              '</div>' +
              '<div class="tile-table-row">' +
                '<i class="fas fa-fw fa-2x fa-user-graduate"></i>' +
                '<span class="tile-table-row-title">Seniors</span>' +
                '<span>' + this._counts.members.seniors + '</span>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +

    // Community Service Hours
      '<div class="tile-wrapper">' +
        '<div class="tile">' +
          '<h5 class="tile-title">Community Service Hours</h5>' +
          '<div class="tile-section">' +
            '<div class="tile-chart" id="chart_hours">' +
              getChartPreloader() +
            '</div>' +
          '</div>' +
          '<div class="tile-section">' +
            '<div class="tile-table">' +
              '<div class="tile-table-row">' +
                '<i class="fas fa-fw fa-2x fa-people-carry"></i>' +
                '<span class="tile-table-row-title">Q1 Hours</span>' +
                '<span>' + this._counts.service.q1total + '</span>' +
              '</div>' +
              '<div class="tile-table-row">' +
                '<i class="fas fa-fw fa-2x fa-people-carry"></i>' +
                '<span class="tile-table-row-title">Q2 Hours</span>' +
                '<span>' + this._counts.service.q2total + '</span>' +
              '</div>' +
              '<div class="tile-table-row">' +
                '<i class="fas fa-fw fa-2x fa-people-carry"></i>' +
                '<span class="tile-table-row-title">Q3 Hours</span>' +
                '<span>' + this._counts.service.q3total + '</span>' +
              '</div>' +
              '<div class="tile-table-row">' +
                '<i class="fas fa-fw fa-2x fa-people-carry"></i>' +
                '<span class="tile-table-row-title">Q4 Hours</span>' +
                '<span>' + this._counts.service.q4total + '</span>' +
              '</div>' +
              '<div class="tile-table-divider"></div>' +
              '<div class="tile-table-row">' +
                '<i class="fas fa-fw fa-2x fa-users"></i>' +
                '<span class="tile-table-row-title">Total Hours</span>' +
                '<span>' + this._counts.service.total + '</span>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +

      // Member Fees
        '<div class="tile">' +
          '<h5 class="tile-title">Member Fees</h5>' +
          '<div class="tile-section">' +
            '<div class="tile-chart" id="chart_fees">' +
              getChartPreloader() +
            '</div>' +
          '</div>' +
          '<div class="tile-section">' +
            '<div class="tile-table">' +
              '<div class="tile-table-row">' +
                '<i class="fas fa-fw fa-2x fa-dollar-sign"></i>' +
                '<span class="tile-table-row-title">Fees Paid</span>' +
                '<span>' + Math.round(this._counts.financial.paidFees / this._counts.members.total * 100) + '%</span>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +

    // Fundraising
      '<div class="tile-wrapper">' +
        '<div class="tile tile-full-width">' +
          '<h5 class="tile-title">Fundraising</h5>' +
          '<div class="tile-section">' +
            '<div class="tile-chart" id="chart_fundraising">' +
              getChartPreloader() +
            '</div>' +
          '</div>' +
          '<div class="tile-section">' +
            '<div class="tile-table">' +
              '<div class="tile-table-row">' +
                '<i class="fas fa-fw fa-2x fa-money-bill-wave"></i>' +
                '<span class="tile-table-row-title">Amount Out</span>' +
                '<span>$' + this._counts.financial.checkedOut + '</span>' +
              '</div>' +
              '<div class="tile-table-row">' +
                '<i class="fas fa-fw fa-2x fa-money-bill-wave"></i>' +
                '<span class="tile-table-row-title">Amount In</span>' +
                '<span>$' + this._counts.financial.checkedIn + '</span>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +

    // Shirts
      '<div class="tile-wrapper">' +
        '<div class="tile tile-full-width">' +
          '<h5 class="tile-title">Shirts</h5>' +
          '<div class="tile-section">' +
            '<div class="tile-chart" id="chart_shirts">' +
              getChartPreloader() +
            '</div>' +
          '</div>' +
          '<div class="tile-section">' +
            '<div class="tile-table">' +
              '<div class="tile-table-row">' +
                '<i class="fas fa-fw fa-2x fa-tshirt"></i>' +
                '<span class="tile-table-row-title">S</span>' +
                '<span>' + this._counts.shirts.small + '</span>' +
              '</div>' +
              '<div class="tile-table-row">' +
                '<i class="fas fa-fw fa-2x fa-tshirt"></i>' +
                '<span class="tile-table-row-title">M</span>' +
                '<span>' + this._counts.shirts.medium + '</span>' +
              '</div>' +
              '<div class="tile-table-row">' +
                '<i class="fas fa-fw fa-2x fa-tshirt"></i>' +
                '<span class="tile-table-row-title">L</span>' +
                '<span>' + this._counts.shirts.large + '</span>' +
              '</div>' +
              '<div class="tile-table-row">' +
                '<i class="fas fa-fw fa-2x fa-tshirt"></i>' +
                '<span class="tile-table-row-title">XL</span>' +
                '<span>' + this._counts.shirts.xlarge + '</span>' +
              '</div>' +
              '<div class="tile-table-row">' +
                '<i class="fas fa-fw fa-2x fa-tshirt"></i>' +  
                '<span class="tile-table-row-title">XXL</span>' +
                '<span>' + this._counts.shirts.xxlarge + '</span>' +
              '</div>' +
              '<div class="tile-table-row">' +
                '<i class="fas fa-fw fa-2x fa-tshirt"></i>' +
                '<span class="tile-table-row-title">XXXL</span>' +
                '<span>' + this._counts.shirts.xxxlarge + '</span>' +
              '</div>' +
              '<div class="tile-table-divider"></div>' +
              '<div class="tile-table-row">' +
                '<i class="fas fa-fw fa-2x fa-percent"></i>' +
                '<span class="tile-table-row-title">Percent Received</span>' +
                '<span>' + Math.round(this._counts.shirts.received / this._counts.members.total * 100) + '%</span>' +
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
Dashboard.prototype.getFooter = function() {
  return '&copy; 2018 Joseph W. May';
}


/**
 * Returns an object containing the data needed to construct dashboard charts
 * using the Google Charts API.
 * 
 * @returns {Object} The chart data.
 */
Dashboard.prototype.getCharts = function() {
  return {
    fees: {
      title: 'Member Fees',
      data: [
        ['Paid', 'Number of Members'],
        ['Yes', this._counts.financial.paidFees],
        ['No', this._counts.financial.unpaidFees]
      ],
      target: 'chart_fees',
      type: 'pieChart'
    },
  
    fundraiser: {
      title: 'Fundraiser Amounts',
      data: [
        ['Status', 'Amount'],
        ['Out', this._counts.financial.checkedOut],
        ['In', this._counts.financial.checkedIn]
      ],
      legend: { position: 'none' },
      target: 'chart_fundraising',
      type: 'barChart'
    },

    gender: {
      title: 'Members by Gender',
      data: [
        ['Gender', 'Number of Members'],
        ['Female', this._counts.members.females],
        ['Male', this._counts.members.males]
      ],
      target: 'chart_gender',
      type: 'pieChart'
    },

    grade: {
      title: 'Members by Grade',
      data: [
        ['Grade', 'Number of Members'],
        ['Sophomore', this._counts.members.sophomores],
        ['Junior', this._counts.members.juniors],
        ['Senior', this._counts.members.seniors]
      ],
      target: 'chart_grade',
      type: 'pieChart'
    },

    service: {
      title: 'Service Hours',
      data: [
        ['Quarter', 'Hours'],
        ['Q1', this._counts.service.q1total],
        ['Q2', this._counts.service.q2total],
        ['Q3', this._counts.service.q3total],
        ['Q4', this._counts.service.q4total],
      ],
      legend: { position: 'none' },
      target: 'chart_hours',
      type: 'barChart'
    },

    shirts: {
      title: 'Shirt Sizes',
      data: [
        ['Size', 'Number of Shirts'],
        ['S', this._counts.shirts.small],
        ['M', this._counts.shirts.medium],
        ['L', this._counts.shirts.large],
        ['XL', this._counts.shirts.xlarge],
        ['XXL', this._counts.shirts.xxlarge],
        ['XXXL', this._counts.shirts.xxxlarge]
      ],
      target: 'chart_shirts',
      type: 'pieChart'
    }
  };
}


/**
 * Returns an object containing the counts for various fields.
 * 
 * @private
 * @returns {Object} The field counts.
 */
Dashboard.prototype.getCounts_ = function() {
  var memberInformation = this._db.getDataBySection('memberInformation')
      .filterByField(4, 'active');
  var service = this._db.getDataBySection('communityService')
      .filterByField(3, 'active');
  var financial = this._db.getDataBySection('financial')
      .filterByField(3, 'active');
  return {
    financial: {
      paidFees: financial.countByField(8, 'yes'),
      unpaidFees: financial.countByField(8, 'no'),
      checkedOut: financial.sumByField(9),
      checkedIn: financial.sumByField(10),
    },
    members: {
      males: memberInformation.countByField(7, 'M'),
      females: memberInformation.countByField(7, 'F'),
      sophomores: memberInformation.countByField(6, 10),
      juniors: memberInformation.countByField(6, 11),
      seniors: memberInformation.countByField(6, 12),
      total: (memberInformation.countByField(7, 'M') + memberInformation.countByField(7, 'F')),
    },
    service: {
      total: service.sumByField(4),
      q1total: service.sumByField(5),
      q2total: service.sumByField(6),
      q3total: service.sumByField(7),
      q4total: service.sumByField(8),
    },
    shirts: {
      small: financial.countByField(13, 'S'),
      medium: financial.countByField(13, 'M'),
      large: financial.countByField(13, 'L'),
      xlarge: financial.countByField(13, 'XL'),
      xxlarge: financial.countByField(13, 'XXL'),
      xxxlarge: financial.countByField(13, 'XXXL'),
      received: financial.countByField(14, 'yes'),
    },
  }
}