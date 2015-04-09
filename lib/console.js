var loadJS = function (url, loaded) {
  var scr = document.createElement('script');
  scr.type = 'text/javascript';
  scr.src = url;
  if (window.navigator.userAgent.indexOf('MSIE') > -1) {
    scr.onload = scr.onreadystatechange = function () {
      if (this.readyState === "loaded" || this.readyState === "complete") {
        if (loaded) { loaded(); }
      }
      scr.onload = scr.onreadystatechange = null;
    };
  } else {
    scr.onload = loaded;
  }
  document.getElementsByTagName('head')[0].appendChild(scr);
},
  baseurl = 'http://JonathanTech.github.io/console-bookmarklet/lib';

loadJS(baseurl + '/js/jquery-2.0.0.min.js', function () {
  $('head').append('<link href="' + baseurl +
                   '/jquery-ui/css/console/jquery-ui-1.10.2.custom.min.css"' +
                   'type="text/css" rel="stylesheet">');
  $('head').append('<link rel="stylesheet" href="' + baseurl + '/console.css" type="text/css" />');
  loadJS(baseurl + '/jquery-ui/js/jquery-ui-1.10.2.custom.min.js', function () {
    loadJS(baseurl + '/jquery-ui/js/jquery.ui.touch-punch.min.js', function () {
      function appendElement(message, styleClass) {
        var codeElement = $(document.createElement('code'));
        if (styleClass) {
          codeElement.addClass(styleClass);
        }
        codeElement.text(message);
        $('#debug pre').append(codeElement);
      }

      function pipeConsole() {
        if (typeof console !== 'undefined' && typeof console.log !== 'undefined') {
          console.oerror = console.error;
          console.owarn = console.warn;
          console.oinfo = console.info;
          console.odebug = console.debug;
          console.olog = console.log;
          
          console.error = function () {
            var message = Array.prototype.slice.apply(arguments).join(' ');
            message = message + " JSON: ";
            for(var x = 0; x<arguments.length;x++){
            try{  
              message = message + "["+x+"]" +  JSON.stringify(arguments[x]);
            }catch(err){}}
            console.oerror(message);
            appendElement(message, 'error');
          };
          console.warn = function () {
            var message = Array.prototype.slice.apply(arguments).join(' ');
            message = message + " JSON: ";
            for(var x = 0; x<arguments.length;x++){
            try{  
              message = message + "["+x+"]" +  JSON.stringify(arguments[x]);
            }catch(err){}}
            console.owarn(message);
            appendElement(message, 'warn');
          };
          console.info = function () {
            var message = Array.prototype.slice.apply(arguments).join(' ');
            message = message + " JSON: ";
            for(var x = 0; x<arguments.length;x++){
            try{  
              message = message + "["+x+"]" +  JSON.stringify(arguments[x]);
            }catch(err){}}
            console.oinfo(message);
            appendElement(message, 'info');
          };
          console.debug = function () {
            var message = Array.prototype.slice.apply(arguments).join(' ');
            message = message + " JSON: ";
            for(var x = 0; x<arguments.length;x++){
            try{  
              message = message + "["+x+"]" +  JSON.stringify(arguments[x]);
            }catch(err){}}
            console.odebug(message);
            appendElement(message, 'debug');
          };
          console.log = function () {
            var message = Array.prototype.slice.apply(arguments).join(' ');
            message = message + " JSON: ";
            for(var x = 0; x<arguments.length;x++){
            try{  
              message = message + "["+x+"]" +  JSON.stringify(arguments[x]);
            }catch(err){}}
            console.olog(message);
            appendElement(message, 'log');
          };
        }
      }

      var dialogElement = $(document.createElement('div')),
        preElement = $(document.createElement('pre')),
        d;
      dialogElement.attr('id', 'debug');
      dialogElement.attr('title', 'Console output');
      dialogElement.append(preElement);
      $('body').append(dialogElement);
     
      d = $('#debug').dialog({
        modal: false,
        autoOpen: false,
        height: 200,
        width: '400px',
        position: "left bottom",
        'open': function () { $('.ui-widget-overlay')
            .wrap('<div id="debug-wrapper" class="debug"></div>');
          }
      });
      d.parent('.ui-dialog').wrap('<div id="debug-wrapper" class="debug"></div>');
      d.dialog('open');

      pipeConsole();
    });
  });
});

(function(){function xhrAsLimitedObject(xhr){
return {
status:xhr.status,
responseURL:xhr.responseURL,
responseText:xhr.responseText 
};
};
function proxifyOnReadyStateChange(xhr) {
    var realOnReadyStateChange = xhr.onreadystatechange;
    if ( realOnReadyStateChange ) {
        xhr.onreadystatechange = function() {
            console.log(xhrAsLimitedObject(xhr));
            realOnReadyStateChange();
        };
    }
}

function addXMLRequestCallback(){
    var oldSend,oldOpen;

        // store the native send()
        oldSend = XMLHttpRequest.prototype.send;
		oldOpen = XMLHttpRequest.prototype.open;
		 XMLHttpRequest.prototype.open = function(){
		 console.log("XHR.open()", arguments);
		 oldOpen.apply(this, arguments);
		 }
        // override the native send()
        XMLHttpRequest.prototype.send = function(){
            // process the callback queue
            // the xhr instance is passed into each callback but seems pretty useless
            // you can't tell what its destination is or call abort() without an error
            // so only really good for logging that a request has happened
            // I could be wrong, I hope so...
            // EDIT: I suppose you could override the onreadystatechange handler though
			var COMPLETED_READY_STATE = 4;
			if(arguments.length > 0 ){
				console.log("requested", arguments[0].length);
			} else{
				console.log("requested");
			}
			if( this.addEventListener ) {
				//var self = this;
				this.addEventListener("readystatechange", function() {
					if( this.readyState === COMPLETED_READY_STATE ) {
						console.log(xhrAsLimitedObject(this));
					}
				}, false);
			}
			else {
				proxifyOnReadyStateChange(this);
			}
            
            // call the native send()
            oldSend.apply(this, arguments);
        }
    }
addXMLRequestCallback();})();
