(function ()
    var MINSIZE = 50;

    function addLink(elem) {
        elem.innerHTML += "<p>Read more at: <a href='" + window.location.href + "'>" + document.title + "</a></p>";
    }

    function onCopy () {
        var elem = document.createElement("div");
        
        elem.style.position = "fixed";
        elem.style.left = "-9999px";
        
        document.getElementsByTagName("body")[0].appendChild(elem);
        
        if (document.all) {
            sel = document.selection.createRange();
            elem.innerHTML = sel.htmlText;
            if (elem.innerHTML.length < MINSIZE)
                return;
            addLink(elem);
            range = document.body.createTextRange();
            range.moveToElementText(elem);
            range.select();
        } else {
            sel = window.getSelection();
            if (sel.getRangeAt) {
                var range = sel.getRangeAt(0);
            } else {
                var range = document.createRange ();
                range.setStart (sel.anchorNode, sel.anchorOffset);
                range.setEnd (sel.focusNode, sel.focusOffset);
            }
            elem.appendChild(range.cloneContents());
            if (elem.innerHTML.length < MINSIZE)
                return;
            addLink(elem);
            range = document.createRange();
            sel.removeAllRanges();  
            range.selectNodeContents(elem);
            sel.addRange(range);
        }
        
        
    }

    function checkCopy(ev){
        ev = ev || window.event;
        var kCode = ev.keyCode || ev.which; 
        if (ev.ctrlKey && kCode == 67) { // ctrl+c
            onCopy();
        }
    }

    function addEvent(el, ev, func){
        if (el.addEventListener) {
            el.addEventListener(ev, func, false);
        } else if (el.attachEvent) {
            el.attachEvent("on" + ev, func);
        }
    }

    //Function taken from http://perfectionkills.com/detecting-event-support-without-browser-sniffing/
    function isMouseEventSupported(eventName) {
        var el = document.createElement('div');
        eventName = 'on' + eventName;
        var isSupported = (eventName in el);
        if (!isSupported) {
            el.setAttribute(eventName, 'return;');
            isSupported = typeof el[eventName] == 'function';
        }
        el = null;
        return isSupported;
    }

    addEvent(window, "load", function(){
        if (isMouseEventSupported("copy")){
            addEvent(document.body, "copy", onCopy);
        }else{
            addEvent(document, "keydown", checkCopy);
        }
    });
})();
