/*Only needed for the controls*/
var webview_phone = document.getElementById("webview_phone_1"),
  iframe = document.getElementById("webview_frame_1");

var webview_flag = false;

function webview_updateView(view) {
  if (view) {
    webview_phone.className = "webview_phone view_1";
  } else {
    webview_phone.className = "webview_phone view_3";
  }
}

function webview_updateIframe() {
  iframe.src = "https://lucetre.github.io/2048/";

  webview_phone.style.width = "400px";
  webview_phone.style.height = "550px";

  document.getElementById("webview_wrapper").style.perspective = "1000px";
}
webview_updateIframe();

document
  .getElementById("webview_wrapper")
  .addEventListener("click", function () {
    webview_updateView(webview_flag);
    webview_flag = !webview_flag;
  });
