$(document).ready(function(){
    $('.sidenav').sidenav();
    $('select').formSelect();
    var instance = M.FormSelect.getInstance(elem);
    instance.getSelectedValues();
});