/*Only needed for the controls*/
var glnk_dev_phone = document.getElementById("glnk_dev_phone_1"),
  iframe = document.getElementById("glnk_dev_frame_1");

var srview_flag = false;

function srview_updateView(view) {
  if (view) {
    glnk_dev_phone.className = "glnk_dev_phone view_1";
  } else {
    glnk_dev_phone.className = "glnk_dev_phone view_3";
  }
}

function srview_updateIframe() {
  iframe.src = "https://glnk.dev/register";

  glnk_dev_phone.style.width = "350px";
  glnk_dev_phone.style.height = "600px";

  document.getElementById("glnk_dev_wrapper").style.perspective = "1000px";
}
srview_updateIframe();

document
  .getElementById("glnk_dev_wrapper")
  .addEventListener("click", function () {
    srview_updateView(srview_flag);
    srview_flag = !srview_flag;
  });
