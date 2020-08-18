$(function(){

    function generateSnippetElement(repo, filename, commit, lineStartNum, lineEndNum, content, url, commitUrl){
        return [
            "<style>.prettyprint ol{word-wrap:normal;} .prettyprint ol.linenums > li {list-style-type:decimal;}</style>",
            "<div class='panel panel-default'>",
            "<div class='panel-heading' style='font-size:12px; padding:5px; padding-left:15px;'>",
            "<span><b><a href="+ url + ">" + repo + "/" + filename + "</a></b></span>",
            "<br>",
            "<span style='color: gray'>Lines " + lineStartNum + " to " + lineEndNum + " in </span>",
            "<span style='font-size:11px;'><a href=" + commitUrl + ">" + commit + "</a></span>",
            "</div>",
            "<div class='panel-body' style='padding:0; background-color:white;'>",
            "<pre class='prettyprint linenums:" + lineStartNum + "' style='padding-left:15px; margin-bottom:0;'>",
            content,
            "</pre>",
            "</div>",
            "</div>"
            ].join("");
    };

    function fixUrl(url){
        return url.replace("/blob/", "/raw/");
    };

    function getCommitUrl(url, filename){
        url = url.replace("/blob/", "/commit/")
        reg = new RegExp('/' + filename + '#L\\d+(-L\\d+)?$')
        return url.replace(reg, "")
    };

    function getContent(url){
        var xmlHttp;
        xmlHttp = new XMLHttpRequest();
        xmlHttp.open("GET", fixUrl(url), false);
        xmlHttp.send(null);
        if(xmlHttp.responseURL.includes(location.host + "/signin?redirect")){
            throw new Error("XMLHttpRequest error")
        }
        if(xmlHttp.status != 200){
            throw new Error("XMLHttpRequest error")
        }
        return xmlHttp.responseText
    };

    function convertLinks(){
        var matchPattern = new RegExp('https?://' + location.host + '(/[\\w-\\.]+)?/([\\w-\\.]+)/([\\w-\\.]+)/blob/([\\w-\\.]+)/([\\w-\\.]+)#L([0-9]+)(-L[0-9]+)?$');
        var elements = $('.markdown-body p a');
        var element;
        var url;
        var mat;
        for(let i = 0; i< elements.length; ++i ) {
            element = elements[i];
            url = element.innerText;
            mat = url.match(matchPattern);
            if(mat !== null){
                let urlPrefix = mat[1];
                let owner = mat[2];
                let repo = mat[3];
                let commit = mat[4];
                let filename = mat[5];
                let startLine = Number(mat[6]);
                let endLine = startLine;
                if(typeof mat[7] !== "undefined"){
                    endLine = Number(mat[7].replace("-L", ""));
                };
                let commitUrl = getCommitUrl(url, filename)
                try{
                    let content = getContent(url);
                    let linesAll = content.split("\n");
                    let lines = linesAll.slice(startLine-1, endLine).join("\n");
                    let snippetElement = generateSnippetElement(repo, filename, commit, startLine, endLine, lines, url, commitUrl);
                    element.insertAdjacentHTML('afterend', snippetElement);
                    element.remove();
                }catch(e){}
            }
        }
        prettyPrint();
    };
    convertLinks();
})
