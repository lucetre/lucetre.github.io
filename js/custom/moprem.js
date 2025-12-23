function share_main() {
	const video = document.getElementById("moprem_video");
	const start = document.getElementById("moprem_start");
	const crop = document.getElementById("moprem_capture");
    video.style.display = 'none';
    crop.disabled = true;
  
	var displayMediaOptions = {
		video: {
			cursor: "always",
		},
		audio: false,
	};

	start.onclick = function (e) {
		stopSharing();
		startSharing();
	};

	async function startSharing() {
		let capture = null;
		try {
			capture = await navigator.mediaDevices.getDisplayMedia(
				displayMediaOptions
			);

			capture
				.getVideoTracks()[0]
				.addEventListener("ended", () => stopSharing());

			video.srcObject = capture;
            video.style.display = 'flex';
            crop.disabled = false;
		} catch (error) {
			console.log(error);
		}
	}

	function stopSharing() {
		if (video.srcObject == null) return;
		let tracks = video.srcObject.getTracks();
		tracks.forEach((track) => track.stop());
		video.srcObject = null;
        video.style.display = 'none';
        crop.disabled = true;
	}
}

share_main();
