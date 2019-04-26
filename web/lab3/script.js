function createQuoteHTML() {

  var canvas = document.createElement("canvas");
  canvas.width = "600";
  canvas.height = "400";
  document.body.appendChild(canvas);
  drawingImage(canvas);

  var saveLink = document.createElement("a");
  saveLink.hidden = true;

  var saveButton = document.createElement("button");
  saveButton.textContent = "Сохранить коллаж";
  saveButton.style.margin = "2%"
  saveButton.style.padding = "1%";
  saveButton.style.display = "flex";
  saveButton.onclick = function() {
    saveLink.href = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    saveLink.download = "Collage.png";
    saveLink.click();
  }
  document.body.appendChild(saveButton);
}

function drawingImage(canvas) {

  var context = canvas.getContext("2d");


  var collections = [762960, 1538121, 162468, 357786, 1346770, 1075856, 162232];
  var f = 0;
  var num = 0, index;
  var arr = new Array();

  for (var i = 0; i < 4; i++) {
    var img = new Image();
    img.crossOrigin = "Anonymous"; //не передаются учетные данные

    while (num == 0) {
    num = collections[Math.floor(Math.random() * collections.length)];
    }

    index = collections.indexOf(num);
    collections[index] = 0;
    img.src = "https://source.unsplash.com/collection/"+ num + "/300x200";
    num = 0;

    img.onload = (function(img) {
      return function() {
        arr.push(img);
        f = f + 1;

        if (f == 4) {
          for (var k = 0; k < 4; k++) {
            var y = 0, x = (k % 2)*300;
            if (k == 1 || k == 2) {
              y = 200;
            }
            context.drawImage(arr[k], x, y);
          }
          drawingText(canvas);
        }
      }
    })(img);
  }
}

var quote;

function parseQuote(response) {
  quote = response.quoteText;
  canvas = createQuoteHTML();
}

function getQuote() {
  var request = document.createElement("script");
  request.src = "https://api.forismatic.com/api/1.0/?method=getQuote&format=jsonp&lang=ru&jsonp=parseQuote";
  request.async = true;
  document.body.appendChild(request);
}

getQuote();



function drawingText(canvas) {

  var context = canvas.getContext("2d");
  context.fillStyle = "rgba(0, 0, 0, 0.4)";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.font = "30px Arial";
  context.fillStyle = "white";


  var separator = ' ';
  var text = quote.split(separator);
  var ourQuotes = "";
  var citate = [];

  for (var i = 0; i < text.length; i++) {
    var quotes = ourQuotes + text[i] + " ";
    if (context.measureText(quotes).width > 560) {
      citate.push(ourQuotes);
      ourQuotes = text[i] + " ";
    } else {
      ourQuotes = quotes;
    }

  }
  citate.push(ourQuotes);


  for (var i = 0; i < citate.length; i++) {
  var x = (600 - context.measureText(citate[i]).width) / 2 ;
  var y = ((400 - 30*citate.length - 10*(citate.length - 1)) / 2) + (i+1)*30 + (i-1)*10;
  context.fillText(citate[i], x, y);
  }

}
