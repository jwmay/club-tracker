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
      '<div class="tile-wrapper">' +
        '<div class="tile tile-full-width">' +
          '<h5 class="tile-title">Member Information</h5>' +
          '<div class="tile-section">' +
            '<div class="tile-chart tile-chart-small" id="chart_gender">' +
              getChartPreloader() +
            '</div>' +
            '<div class="tile-chart tile-chart-small" id="chart_grade">' +
              getChartPreloader() +
            '</div>' +
          '</div>' +
          '<div class="tile-section">' +
            '<div class="tile-table">' +
              '<div class="tile-table-row">' +
                '<i class="fas fa-fw fa-2x fa-female"></i>' +
                '<span class="tile-table-row-title">Females</span>' +
                '<span>' + this._counts.females + '</span>' +
              '</div>' +
              '<div class="tile-table-row">' +
                '<i class="fas fa-fw fa-2x fa-male"></i>' +
                '<span class="tile-table-row-title">Males</span>' +
                '<span>' + this._counts.males + '</span>' +
              '</div>' +
              '<div class="tile-table-divider"></div>' +
              '<div class="tile-table-row">' +
                '<i class="fas fa-fw fa-2x fa-user-graduate"></i>' +
                '<span class="tile-table-row-title">Sophomores</span>' +
                '<span>' + this._counts.sophomores + '</span>' +
              '</div>' +
              '<div class="tile-table-row">' +
                '<i class="fas fa-fw fa-2x fa-user-graduate"></i>' +
                '<span class="tile-table-row-title">Juniors</span>' +
                '<span>' + this._counts.juniors + '</span>' +
              '</div>' +
              '<div class="tile-table-row">' +
                '<i class="fas fa-fw fa-2x fa-user-graduate"></i>' +
                '<span class="tile-table-row-title">Seniors</span>' +
                '<span>' + this._counts.seniors + '</span>' +
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
  return '&copy; 2018 Mojave High School';
}


/**
 * Returns an object containing the data needed to construct dashboard charts
 * using the Google Charts API.
 * 
 * @returns {Object} The chart data.
 */
Dashboard.prototype.getCharts = function() {
  return {
    gender: {
      title: 'Members by Gender',
      data: [
        ['Gender', 'Number of Members'],
        ['Female', this._counts.females],
        ['Male', this._counts.males]
      ],
      target: 'chart_gender',
      type: 'pieChart'
    },

    grade: {
      title: 'Members by Grade',
      data: [
        ['Grade', 'Number of Members'],
        ['Sophomore', this._counts.sophomores],
        ['Junior', this._counts.juniors],
        ['Senior', this._counts.seniors]
      ],
      target: 'chart_grade',
      type: 'pieChart'
    },
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
  return {
    males: memberInformation.countByField(7, 'M'),
    females: memberInformation.countByField(7, 'F'),
    sophomores: memberInformation.countByField(6, 10),
    juniors: memberInformation.countByField(6, 11),
    seniors: memberInformation.countByField(6, 12),
  }
}