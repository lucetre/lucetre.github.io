/*Only needed for the controls*/
var webview_phone_ascii_art = document.getElementById("webview_phone_ascii_art");
// var webview_flag_ascii_art = false;

// function webview_updateView_ascii_art(view) {
//   if (view) {
//     webview_phone_ascii_art.className = "webview_phone view_1";
//   } else {
//     webview_phone_ascii_art.className = "webview_phone view_3";
//   }
// }

function webview_updateIframe_ascii_art() {
  webview_phone_ascii_art.style.width = "100%";
  webview_phone_ascii_art.style.height = "1000px";

  document.getElementById("webview_wrapper_ascii_art").style.perspective = "1000px";
}
webview_updateIframe_ascii_art();

// document
//   .getElementById("webview_wrapper_ascii_art")
//   .addEventListener("click", function () {
//     webview_updateView_ascii_art(webview_flag_ascii_art);
//     webview_flag_ascii_art = !webview_flag_ascii_art;
//   });
