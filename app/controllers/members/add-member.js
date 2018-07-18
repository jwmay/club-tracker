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


var AddMember = function() {};


AddMember.prototype.getHeader = function() {
  return '' +
    '<h1>Add Member</h1>';
}


AddMember.prototype.getMain = function() {
  return 'add member main';
}


AddMember.prototype.getFooter = function() {
  return '' +
    '<button id="submit" class="btn btn-large waves-effect waves-light" data-page="addMember">' +
      'Add member' +
    '</button>';
}