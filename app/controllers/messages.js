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


var Message = function(type, pageTitle, messageTitle, messageContent) {
  this._type = type;
  this._pageTitle = pageTitle;
  this._messageTitle = messageTitle;
  this._messageContent = messageContent;
};


Message.prototype.getHeader = function() {
  return '<h1>' + this._pageTitle + '</h1>';
}


Message.prototype.getMain = function() {
  return '' +
    '<div class="row">' +
      '<div class="message message-' + this._type + '">' +
        '<div class="card">' +
          '<div class="card-title">' +
            this._messageTitle +
          '</div>' +
          '<div class="card-content">' +
            this._messageContent +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>';
}


Message.prototype.getFooter = function() {
  return '';
}