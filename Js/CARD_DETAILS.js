let date = localStorage.getItem('date');
let time = localStorage.getItem('time');
let duration = localStorage.getItem('duration');
let total = localStorage.getItem('total');

document.getElementById('table-date').textContent = date;
document.getElementById('table-time').textContent = time;
document.getElementById('table-duration').textContent = duration;
document.getElementById('table-total').textContent = total;

const toCamelCase = (string) => {
    const words = string.split(' ');
    for (let i = 0; i < words.length; i++) {
      if (i === 0) {
        words[i] = words[i].toUpperCase();
      } else {
        words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
      }
    }
  
    return words.join(' ');
  };



// get category data from local storage
let guestCategories = ['sl-adult', 'sl-child', 'foreigner-adult', 'foreigner-child','infant']; 
for (let i = 0; i < guestCategories.length; i++) {
  let categoryData = localStorage.getItem('category-' + guestCategories[i]);
  if (categoryData) {
    let tableCategory = document.getElementById('table-' + guestCategories[i] + '-category');
    let tableCategoryTotal = document.getElementById('table-' + guestCategories[i]);
    let [countAndCategory, totalForCategory] = categoryData.split(' | ');


    let count = parseInt(countAndCategory.split(' ')[0]);


    if (count === 0) {
      tableCategory.parentNode.style.display = 'none';
    } else {
      tableCategory.parentNode.style.display = 'table-row';
      tableCategory.textContent = toCamelCase(countAndCategory.replace('-', ' '));
      tableCategoryTotal.textContent = totalForCategory;
    }
  }
}

// Set the text of the button
document.getElementById('complete-payment').textContent = 'Pay ' + total;

$(document).ready(function() {


    $('#complete-payment').removeAttr('href').addClass('disabled');

    // Form validation
    $('#cc_number, #cc-name, #cc-exp, #cc-csc').on('change keyup', function() {
        var ccNumberRegex = /^(\d{4}-){3}\d{4}$/; // 16 digits with a dash after every 4 digits
        var ccNameRegex = /^[a-zA-Z\s]+$/; // Only letters and spaces
        var ccExpRegex = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/; // MM/YY
        var ccCscRegex = /^[0-9]{3}$/; // 3 digits

        // Validate
        var ccNumberValid = ccNumberRegex.test($('#cc_number').val());
        var ccNameValid = ccNameRegex.test($('#cc-name').val());
        var ccCscValid = ccCscRegex.test($('#cc-csc').val());
    

        // Validate expiry date
        var ccExpValid = false;
        var ccExpMatch = $('#cc-exp').val().match(ccExpRegex);
        if (ccExpMatch) {
            var ccExpYear = parseInt(ccExpMatch[2], 10) + 2000; 
            var ccExpMonth = parseInt(ccExpMatch[1], 10);
            var currentDate = new Date();
            var currentYear = currentDate.getFullYear();
            var currentMonth = currentDate.getMonth() + 1; 
            ccExpValid = ccExpYear > currentYear || (ccExpYear === currentYear && ccExpMonth >= currentMonth);
        }

        //  error messages
        $('#cc_number').next('.error').text(ccNumberValid ? '' : 'Invalid card number. Must contain 16 digits');
        $('#cc-name').next('.error').text(ccNameValid ? '' : 'Invalid name.');
        $('#cc-exp').next('.error').text(ccExpValid ? '' : 'Invalid or past expiry date.');
        $('#cc-csc').next('.error').text(ccCscValid ? '' : 'Invalid security code.');


        if (ccNumberValid && ccNameValid && ccExpValid && ccCscValid) {
            $('#complete-payment').attr('href', 'SUMMARY.html').removeClass('disabled');
        } else {
            $('#complete-payment').removeAttr('href').addClass('disabled');
        }
        
    });


    $('#cc-exp').on('keyup', function() {
        var input = $(this).val();
        if (input.length === 2 && !input.includes('/')) {
            $(this).val(input + '/');
        }
    });

    $('#cc_number').on('keyup', function() {
        var input = $(this).val();
        input = input.replace(/\W/gi, '').replace(/(.{4})/g, '$1-');
        if (input.endsWith('-') || input.length > 19) {
            input = input.substr(0, input.length - 1);
        }
        $(this).val(input);
    });
    
    $('#complete-payment').on('click', function(e) {
        if ($(this).prop('disabled')) {
            e.preventDefault();
        }
    });
    
});
