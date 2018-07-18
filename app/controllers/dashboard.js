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


var Dashboard = function() {};


Dashboard.prototype.getHeader = function() {
  return '' +
    '<h1>Dashboard</h1>';
}


Dashboard.prototype.getMain = function() {
  return 'Dashboard Main';
}


Dashboard.prototype.getFooter = function() {
  return 'Dashboard Footer';
}