var RD = window.RD || {};
RD.wrapCanvasText = function(t, canvas, maxW, maxH) {

    if (typeof maxH === "undefined") {
        maxH = 0;
    }

    // var words = t.text.split(" ");
    var words = t.split(" ");
    var formatted = '';

    // clear newlines
    // var sansBreaks = t.text.replace(/(\r\n|\n|\r)/gm, "");
    var sansBreaks = t.replace(/(\r\n|\n|\r)/gm, "");
    // calc line height
    var lineHeight = new fabric.Text(sansBreaks, {
        fontFamily: t.fontFamily,
        fontSize: 25 //t.fontSize
    }).height;

    // adjust for vertical offset
    var maxHAdjusted = maxH > 0 ? maxH - lineHeight : 0;
    var context = canvas.getContext("2d");


    context.font = t.fontSize + "px " + t.fontFamily;
    var currentLine = "";
    var breakLineCount = 0;

    for (var n = 0; n < words.length; n++) {

        var isNewLine = currentLine == "";
        var testOverlap = currentLine + ' ' + words[n];

        // are we over width?
        var w = context.measureText(testOverlap).width;

        if (w < maxW) { // if not, keep adding words
            currentLine += words[n] + ' ';
            formatted += words[n] += ' ';
        } else {

            // if this hits, we got a word that need to be hypenated
            if (isNewLine) {
                var wordOverlap = "";

                // test word length until its over maxW
                for (var i = 0; i < words[n].length; ++i) {

                    wordOverlap += words[n].charAt(i);
                    var withHypeh = wordOverlap + "-";

                    if (context.measureText(withHypeh).width >= maxW) {
                        // add hyphen when splitting a word
                        withHypeh = wordOverlap.substr(0, wordOverlap.length - 2) + "-";
                        // update current word with remainder
                        words[n] = words[n].substr(wordOverlap.length - 1, words[n].length);
                        formatted += withHypeh; // add hypenated word
                        break;
                    }
                }
            }
            n--; // restart cycle
            formatted += '\n';
            breakLineCount++;
            currentLine = "";
        }
        if (maxHAdjusted > 0 && (breakLineCount * lineHeight) > maxHAdjusted) {
            // add ... at the end indicating text was cutoff
            formatted = formatted.substr(0, formatted.length - 3) + "...\n";
            break;
        }
    }
    // get rid of empy newline at the end
    formatted = formatted.substr(0, formatted.length - 1);
    return formatted;
}
RD.writeMessage = function () {
    var canvas = new fabric.Canvas('canvas', {
        backgroundColor: '#fff'
    });
    var $text = $('#text');
    var $image = $('#image');
    $text.on('keyup', function (evt) {
        var $value = $(this).val();
        var imgSrc = RD.drawImage(canvas, $value);
        $image.attr('src', imgSrc);
    });
}
RD.drawImage = function (canvas, text) {
    canvas.clear();
    canvas.renderAll();
    canvas.backgroundColor = '#fff';
    var _text = RD.wrapCanvasText(text, canvas, 250, 305);
    var txt = new fabric.Text(_text, {
        left: 100,
        top: 100,
        fontSize: 30,
        fontFamily: 'delicious_500',
        backgroundColor: 'transparent',
        fill: '#f00',
        padding: 10,
        scaleX: 0.9,
        scaleY: 0.9
    });
    canvas.add(txt);
    canvas.centerObject(txt);
    txt.setCoords();
    return canvas.toDataURL();
}

RD.init = function () {
    RD.writeMessage();
}
$(document).ready(RD.init);