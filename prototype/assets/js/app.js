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
});