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


// O - Run server calls using the spreadsheet model
// X - Pass data onto the view/display


var Attendance = function() {};


Attendance.prototype.getHeader = function() {
  var content = '' +
      '<h1>Attendance</h1>' +
      '<div class="row">' +
        '<div class="input-field col s12 m5">' +
          '<input type="text" id="date" name="date" class="datepicker validate" required>' +
          '<label for="date">Meeting date</label>' +
        '</div>' +
        '<div class="col s12 m6 offset-m1">' +
          '<h6>Quarter</h6>' +
          '<div class="selector">' +
            '<label>' +
              '<input name="quarter" type="radio" value="1" required>' +
              '<span class="selector-label">1</span>' +
            '</label>' +
            '<label>' +
              '<input name="quarter" type="radio" value="2">' +
              '<span class="selector-label">2</span>' +
            '</label>' +
            '<label>' +
              '<input name="quarter" type="radio" value="3">' +
              '<span class="selector-label">3</span>' +
            '</label>' +
            '<label>' +
              '<input name="quarter" type="radio" value="4">' +
              '<span class="selector-label">4</span>' +
            '</label>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="row">' +
        '<div class="input-field col s12 m7">' +
          '<input type="text" id="name" name="name" class="validate" required>' +
          '<label for="name">Your name</label>' +
        '</div>' +
      '</div>';
  return content;
}


Attendance.prototype.getMain = function() {
  var members = [
    {firstName: 'Stephen', lastName: 'Bock'},
    {firstName: 'Corwyn', lastName: 'Evans-Klock'},
    {firstName: 'Joseph', lastName: 'May'},
    {firstName: 'Rebecca', lastName: 'Hernandez'},
    {firstName: 'Andrew', lastName: 'May'}
  ];

  var content = '' +
      '<div class="row">' +
        '<div class="col s12">' +
          '<div class="stackable attendance">';

  // Insert member cards
  for (var i = 0; i < members.length; i++) {
    var member = members[i];
    member.number = i;
    content += this.getCard_(member);
  }

  content += '' +
          '</div>' +
        '</div>' +
      '</div>';
  return content;
}


Attendance.prototype.getFooter = function() {
  var content = '' +
      '<button class="btn btn-large waves-effect waves-light" type="submit">' +
        'Submit' +
      '</button>';
  return content;
}


Attendance.prototype.getCard_ = function(member) {
  var inputName = 'attendance-' + member.number;
  var textareName = 'reason-' + member.number;
  var card = '' +
      '<div class="card">' +
        '<div class="card-content">' +
          '<div class="card-title">' +
            '<span>' + member.lastName + ', </span>' +
            '<span>' + member.firstName + '</span>' +
          '</div>' +
          '<div class="card-actions selector selector-large">' +
            '<label class="selector-green">' +
              '<input name="' + inputName + '" type="radio" value="p" required>' +
              '<span class="selector-label">P</span>' +
            '</label>' +
            '<label class="selector-red">' +
              '<input name="' + inputName + '" type="radio" value="a">' +
              '<span class="selector-label">A</span>' +
            '</label>' +
            '<label>' +
              '<input name="' + inputName + '" type="radio" value="e">' +
              '<span class="selector-label">E</span>' +
            '</label>' +
          '</div>' +
          '<div class="input-field">' +
            '<textarea name="' + textareName + '" id="' + textareName + '" rows="2" class="materialize-textarea validate" disabled></textarea>' +
            '<label for="' + textareName + '">Reason</label>' +
          '</div>' +
        '</div>' +
      '</div>';
  return card;
}