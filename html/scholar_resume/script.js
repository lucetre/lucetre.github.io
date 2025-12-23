/*Only needed for the controls*/
var scholar_resume_phone = document.getElementById("scholar_resume_phone_1"),
  iframe = document.getElementById("scholar_resume_frame_1");

var srview_flag = false;

function srview_updateView(view) {
  if (view) {
    scholar_resume_phone.className = "scholar_resume_phone view_1";
  } else {
    scholar_resume_phone.className = "scholar_resume_phone view_3";
  }
}

function srview_updateIframe() {
  iframe.src = "https://www.resume.games/";

  scholar_resume_phone.style.width = "300px";
  scholar_resume_phone.style.height = "600px";

  document.getElementById("scholar_resume_wrapper").style.perspective = ("1000px");
}
srview_updateIframe();

document.getElementById("scholar_resume_wrapper").addEventListener("click", function() {
  srview_updateView(srview_flag);
  srview_flag = !srview_flag;
});