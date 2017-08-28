/** Write text on console */
function writeOnConsole(text, color) {
    // make #ccc default color
    (!color) && (color = "#ccc");

    var d = $('#console');
    // writing a line to console
    d.html(d.html()+`<pre style="color: ${color}">${text}</pre>`);
    // scrolling console to end
    d.scrollTop(d.prop("scrollHeight"));
}

/** Clear everything from console */
function clearConsole(){
    $('#console').html("");
}