function getSignedRequest(filekey) {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", `/sign-s3-download?file-key=${filekey}`);
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        const signedUrl = JSON.parse(xhr.responseText);
        window.location.assign(signedUrl);
      } else {
        alert("Could not get signed download URL.");
      }
    }
  };
  xhr.send();
}

(() => {
  document.querySelector(".download button").onclick = () => {
    const filekey = document.querySelector(".download button").textContent;
    if (!filekey) {
      return alert("Null filekey.");
    }
    getSignedRequest(filekey);
  };
})();
