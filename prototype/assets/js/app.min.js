$(document).ready(function() {
  $('.sidenav').sidenav();
  $('.datepicker').datepicker();
  $('select').formSelect();

  // Handle the attendance action button selections, which involves enabling a
  // textarea when the 'excused' absence type is selected, and disabling the
  // textarea when the 'present' or 'absent' type is selected
  var $attendance = $('input[name^="attendance-"]');
  $attendance.click(function() {
    var $selector = $(this).parents('.selector'),
        $checked = $selector.find(':checked'),
        $textarea = $selector.parent().find('textarea');
    // Textarea is only used for 'excused' absence type
    if ($checked.val() === 'e') {
      $textarea.prop({
        'disabled': false,
        'required': true
      });
    } else {
      $textarea.prop({
        'disabled': true,
        'required': false
      }).removeClass('valid invalid');
    }
  });

  // Toggle the loading display
  $('#fundraising').click(function() {
    $('html').scrollTop(0);
    $('body').toggleClass('app-loading');
    $('.app-loading-overlay').toggle();
  });

  // Incrementer controls
  $('.increment').click(function() {
    var $this = $(this),
        amount = parseInt($this.data('amount')),
        input = $this.parent('.incrementer').siblings('input'),
        inputValue = parseInt(input.val());
    input.val(inputValue + amount);
  });

  // Settings hover effect
  $('.setting').hover(function() {
    $(this).toggleClass('hovered');
  });

  // Settings click effect
  $('.setting').click(function() {
    $(this).find('input').focus();
  });
});


function drawCharts() {
  var data = new google.visualization.DataTable();
  data.addColumn('string', 'Topping');
  data.addColumn('number', 'Slices');
  data.addRows([
    ['Mushrooms', 3],
    ['Onions', 1],
    ['Olives', 1],
    ['Zucchini', 1],
    ['Pepperoni', 2]
  ]);
  var options = {
    'title': 'How Much Pizza I Ate Last Night'
  };
  var pieChart = new google.visualization.PieChart(document.getElementById('chart_div1'));
  pieChart.draw(data, options);
  var barChart = new google.visualization.BarChart(document.getElementById('chart_div2'));
  barChart.draw(data, options);
  var barChart = new google.visualization.BarChart(document.getElementById('chart_div3'));
  barChart.draw(data, options);
}