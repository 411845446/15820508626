export function getUrl(variable)
{
    var query = window.location.search.substring(1);
    console.log(query)
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        console.log(pair[1])
        if(pair[0] == variable){return pair[1];}
    }
    return(false);
}