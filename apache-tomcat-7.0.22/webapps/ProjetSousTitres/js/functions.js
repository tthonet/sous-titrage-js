/**
 * Created by fhector on 16/12/14.
 */
function escapeHTMLEncode(str) {
    var div = document.createElement('div');
    var text = document.createTextNode(str);
    div.appendChild(text);
    return div.innerHTML;
}
