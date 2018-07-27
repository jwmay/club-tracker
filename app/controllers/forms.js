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
  * The FormBuilder object provides a set of helper functions for
  * constructing form elements.
  */
var FormBuilder = function() {};


/**
 * Returns an HTML-formatted string of selector elements.
 * 
 * The inputs object should have  the following keys:
 *  - inputs.title      (string)  the selector title
 *  - inputs.name       (string)  the selector name
 *  - inputs.selected   (string)  the selected value
 *  - inputs.labels     (array)   the labels for each input
 *  - inputs.values     (array)   the values for each input
 *  - inputs.required   (boolean) true if input is to be required
 * 
 * @param {Object} inputs The selector input data.
 * @returns {String} The HTML-formatted string of input elements.
 */
FormBuilder.prototype.insertSelector = function(inputs) {
  // labels and values arrays must have same length
  if (inputs.labels.length !== inputs.values.length) {
    throw 'Insert selector error: labels and values not same length';
  }
  
  // Construct and return the selector
  var selector = '' +
      '<div class="selector">' +
        '<h6 class="selector-title">' + inputs.title + '</h6>';
  for (var i = 0; i < inputs.labels.length; i++) {
    var required = (inputs.required === true && i === 0) ? ' required' : '',
        checked = (inputs.selected.toString() === inputs.values[i].toString()) ? ' checked' : '';
    selector += '<label>' +
        '<input name="' + inputs.name + '" type="radio" ' +
            'value="' + inputs.values[i] + '"' + required + checked + '>' +
        '<span class="selector-label">' +
          inputs.labels[i] +
        '</span>' +
      '</label>';
  }
  selector += '</div>';
  return selector;
}


/**
 * Returns an HTML-formatted string select element with the given options.
 * 
 * The inputs object should have  the following keys:
 *  - inputs.title         (string)   the select title
 *  - inputs.name          (string)   the select name
 *  - inputs.selected      (string)   the selected value
 *  - inputs.labels        (array)    the labels for each option
 *  - inputs.values        (array)    the values for each option
 *  - inputs.required      (boolean)  true if select is to be required
 *  - inputs.defaultValue  (string)   the default value is none is selected
 * 
 * @param {Object} inputs The select input data.
 * @returns {String} The HTML-formatted string select element.
 */
FormBuilder.prototype.insertSelect = function(inputs) {
  // labels and values arrays must have same length
  if (inputs.labels.length !== inputs.values.length) {
    throw 'Insert select error: labels and values not same length';
  }
  
  // Set the default selected option if none is specified
  if (inputs.hasOwnProperty('selected') === false || inputs.selected === '') {
    inputs.selected = inputs.defaultValue;
  }

  // Construct and return the select
  var required = (inputs.required === true) ? ' required' : '';
  var select = '' +
      '<select id="' + inputs.name + '" name="' + inputs.name + '"' +
          required + '>';
  for (var i = 0; i < inputs.labels.length; i++) {
    var selected = (inputs.selected.toString() === inputs.values[i].toString()) ? ' selected' : '';
    select += '' +
        '<option value="' + inputs.values[i] + '"' + selected + '>' + inputs.labels[i] + '</option>';
  }
  select += '</select>' +
      '<label>' + inputs.title + '</label>';
  return select;
}