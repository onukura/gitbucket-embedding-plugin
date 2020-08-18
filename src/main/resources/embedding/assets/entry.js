$(function(){

    function generateSnippetElement(repo, filename, commit, lineStartNum, lineEndNum, content, url, commitUrl){
        return [
            "<style>.prettyprint ol{word-wrap: normal;} .prettyprint ol.linenums > li { list-style-type: decimal; }</style>",
            "<div class='panel panel-default'>",
            "<div class='panel-heading'>",
            "<span><b><a href="+ url + ">" + repo + "/" + filename + "</a></b></span>",
            "<br>",
            "<span style='color: gray'>Lines " + lineStartNum + " to " + lineEndNum + " in </span>",
            "<span><a href=" + commitUrl + ">" + commit + "</a></span>",
            "</div>",
            "<div class='panel-body' style='padding:0; background-color:white;'>",
            "<pre class='prettyprint linenums:" + lineStartNum + "' style='padding-left: 25px;'>",
            content,
            "</pre>",
            "</div>",
            "</div>"
            ].join("");
    };

    function fixUrl(url){
        return url.replace("/blob/", "/raw/");
    };

    function getCommitUrl(x){
        let url = x[0]
        url = url.replace("/blob/", "/commit/")
        reg = new RegExp('/' + x[4] + '#L\\d+(-L\\d+)?$')
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
        var matchPattern = new RegExp('https?://' + location.host + '/(\\w+)/(\\w+)/blob/(\\w+)/([\\w\\.]+)#L([0-9]+)(-L[0-9]+)?$');
        var elements = $('.markdown-body p a');
        var element;
        var url;
        var mat;
        for(let i = 0; i< elements.length; ++i ) {
            element = elements[i];
            url = element.innerText;
            mat = url.match(matchPattern);
            if(mat !== null){
                let owner = mat[1];
                let repo = mat[2];
                let commit = mat[3];
                let filename = mat[4];
                let startLine = Number(mat[5]);
                let endLine = startLine;
                if(typeof mat[6] !== "undefined"){
                    endLine = Number(mat[6].replace("-L", ""));
                };
                let commitUrl = getCommitUrl(mat)
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
