/// Copyright 2018 Joseph W. May. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


function getHtml(filename) {
  var template = HtmlService.createTemplateFromFile(filename);
  return template.evaluate()
      .setTitle('NHS Tracker')
      .setFaviconUrl('http://www.iconj.com/ico/x/u/xu8sd50zpv.ico')
      .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}


function getApp() {
  var builder = new AppBuilder();
}



var AppBuilder = function() {};


AppBuilder.prototype.getHeader = function() {};


AppBuilder.prototype.getMain = function() {};


AppBuilder.prototype.getFooter = function() {};