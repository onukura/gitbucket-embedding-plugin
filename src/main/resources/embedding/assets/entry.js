$(function(){
    const patternElement1 = '[\\w!\\?\\+\\-_~=;\\.,\\*&@#\\$\\%\\(\\)\'\\[\\]]+';
    const patternElement2 = '[/\\w!\\?\\+\\-_~=;\\.,\\*&@\\$\\%\\(\\)\'\\[\\]]+';
    const matchPattern = new RegExp(
        '^'+
        '(' + location.origin + ')?' +
        '(/' + patternElement1 + ')?' +
        '/(' + patternElement1 + ')' +
        '/(' + patternElement1 + ')' +
        '/blob' +
        '/(' + patternElement1 + ')' +
        '/(' + patternElement2 + ')#L([\\d]+)-?L?([\\d]+)?$');

    function generateSnippetElement(repo, filename, commit, lineStartNum, lineEndNum, content, url, commitUrl){
        return [
            "<style>",
            ".prettyprint ol {word-wrap:normal;} ",
            ".prettyprint ol.linenums > li {list-style-type:decimal; background-color: white;} ",
            ".embedded-snippet {background-color: white;}",
            "</style>",
            "<div class='panel panel-default'>",
            "<div class='panel-heading' style='font-size:12px; padding: 5px 5px 5px 15px;'>",
            "<span><b><a href="+ url + ">" + repo + "/" + filename + "</a></b></span><br>",
            "<span style='color: gray'>Lines " + lineStartNum + " to " + lineEndNum + " in </span>",
            "<span style='font-size:11px;'><a href=" + commitUrl + ">" + commit + "</a></span>",
            "</div>",
            "<div class='panel-body' style='padding:0; background-color:white;'>",
            "<pre class='embedded-snippet prettyprint linenums:" + lineStartNum + "' data-filename='" + filename + "' style='padding-left:15px; margin-bottom:0;'>",
            content,
            "</pre>",
            "</div>",
            "</div>"
            ].join("");
    }

    function fixUrl(url){
        return url.replace("/blob/", "/raw/");
    }

    function getCommitUrl(url, filepath){
        url = url.replace("/blob/", "/commit/");
        let reg = new RegExp('/' + filepath + '#L\\d+(-L\\d+)?$');
        return url.replace(reg, "");
    }

    function getContent(url){
        let xmlHttp;
        xmlHttp = new XMLHttpRequest();
        xmlHttp.open("GET", fixUrl(url), false);
        xmlHttp.send(null);
        if(xmlHttp.responseURL.includes(location.host + "/signin?redirect")){
            throw new Error("XMLHttpRequest error");
        }
        if(xmlHttp.status !== 200){
            throw new Error("XMLHttpRequest error");
        }
        return xmlHttp.responseText;
    }

    function escapeHtml(text) {
        return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    }

    function convertLinks(){
        const elements = $('.markdown-body p');
        let element;
        let url;
        let mat;
        for(let i = 0; i< elements.length; ++i ) {
            element = elements[i];
            url = element.innerText;
            mat = url.match(matchPattern);
            if(mat !== null){
                // let origin = mat[1];
                // let urlPrefix = mat[2];
                // let owner = mat[3];
                let repo = mat[4];
                let commit = mat[5];
                let filepath = mat[6];
                let startLine = Number(mat[7]);
                let endLine = startLine;
                if(typeof mat[8] !== "undefined"){
                    endLine = Number(mat[8]);
                }
                let commitUrl = getCommitUrl(url, filepath);
                try{
                    filepath = decodeURIComponent(filepath);
                    filepath = escapeHtml(filepath);
                    let content = getContent(url);
                    let linesAll = content.split(/\n|\r\n?/);
                    let lines = linesAll.slice(startLine-1, endLine).join("\n");
                    lines = escapeHtml(lines);
                    let snippetElement = generateSnippetElement(repo, filepath, commit, startLine, endLine, lines, url, commitUrl);
                    element.insertAdjacentHTML('afterend', snippetElement);
                    element.remove();
                }catch(e){}
            }
        }
    }

    // Initial processing
    convertLinks();
    prettyPrint();

    setTimeout(function(){ // Delayed execution
        // Create a hook for prettyPrint function to support preview
        const original = prettyPrint;
        prettyPrint = function(){
            convertLinks();
            return original.apply(this, arguments);
        }
    });
})
