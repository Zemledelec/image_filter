var ctx;
var plt;
var imgIsLoaded = false;
var pltIsLoaded = false;

function initPalette() {
    var pal = [];
    for (var i = 0; i < 255; i++) {
        pal[i] = [0, 0, 0, 255];
    }
    return pal;
};

function initCtx(id) {
    return document.getElementById(id).getContext("2d");
};

function main() {
    ctx = initCtx("mycanvas");
    plt = initPalette();
    document.getElementById("btnApply").disabled = true;
};

function loadImage() {
    var img = new Image();
    img.crossOrigin = '';
    img.onload = function () {
        ctx.canvas.width = img.width;
        ctx.canvas.height = img.height;
        ctx.drawImage(img, 0, 0, img.width, img.height);
        imgIsLoaded = true;
        document.getElementById("btnApply").disabled = !(imgIsLoaded && pltIsLoaded);
    };
    img.onerror = function () {
        alert("NetworkError: 404 Not Found - " + document.getElementById("imgUrl").value);
    };
    img.src = document.getElementById("imgUrl").value;
};

function applyPalette() {
    var pixels = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    for (var i = 0, n = pixels.data.length; i < n; i += 4) {
        var ri = pixels.data[i],
            gi = pixels.data[i + 1],
            bi = pixels.data[i + 2];
        if ((ri & gi & bi) == ri) {
            pixels.data[i] = plt[ri][0];
            pixels.data[i + 1] = plt[ri][1];
            pixels.data[i + 2] = plt[ri][2];
            //pixels.data[i+3] = plt[ri][3];
        };
    }
    ctx.putImageData(pixels, 0, 0);
};

function loadPalette() {
    $.get(document.getElementById("pltUrl").value, function (res) {
        var x = xmlToJson(res);
        var entry = x.IC_Legend_Document.Legend_Entries.ENTRY;
        for (var i = 0; i < entry.length; i++) {
            var ei = entry[i];
            var r = parseInt(ei.Color.Part_Red["#text"]);
            var g = parseInt(ei.Color.Part_Green["#text"]);
            var b = parseInt(ei.Color.Part_Blue["#text"]);
            var a = parseInt(ei.Color.Part_Density["#text"]);
            plt[parseInt(ei.Code["#text"])] = [r, g, b, a];
        }
        pltIsLoaded = true;
        document.getElementById("btnApply").disabled = !(imgIsLoaded && pltIsLoaded);
    });
};