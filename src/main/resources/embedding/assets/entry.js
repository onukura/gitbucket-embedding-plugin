$(function(){
    const patternElement1 = '[\\w!\\?\\+\\-_~=;\\.,\\*&@#\\$\\%\\(\\)\'\\[\\]]+';
    const patternElement2 = '[\\w!\\?\\+\\-_~=;\\.,\\*&@\\$\\%\\(\\)\'\\[\\]]+';
    const matchPattern = new RegExp(
        '^'+
        location.origin +
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
            "<pre class='embedded-snippet prettyprint linenums:" + lineStartNum + "' style='padding-left:15px; margin-bottom:0;'>",
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

    function convertLinks(){
        const elements = $('.markdown-body p a');
        let element;
        let url;
        let mat;
        for(let i = 0; i< elements.length; ++i ) {
            element = elements[i];
            url = element.innerText;
            mat = url.match(matchPattern);
            if(mat !== null){
                // let urlPrefix = mat[1];
                // let owner = mat[2];
                let repo = mat[3];
                let commit = mat[4];
                let filepath = mat[5];
                let startLine = Number(mat[6]);
                let endLine = startLine;
                if(typeof mat[7] !== "undefined"){
                    endLine = Number(mat[7]);
                }
                let commitUrl = getCommitUrl(url, filepath);
                try{
                    let content = getContent(url);
                    let linesAll = content.split("\n");
                    let lines = linesAll.slice(startLine-1, endLine).join("\n");
                    let snippetElement = generateSnippetElement(repo, filepath, commit, startLine, endLine, lines, url, commitUrl);
                    element.insertAdjacentHTML('afterend', snippetElement);
                    element.remove();
                }catch(e){}
            }
        }
        prettyPrint();
    }
    convertLinks();
})
