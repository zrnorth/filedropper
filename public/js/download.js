function getSignedRequest(filekey) {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", `/sign-s3-download?file-key=${filekey}`);
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        console.log(response);
      } else {
        alert("Could not get signed download URL.");
      }
    }
  };
  xhr.send();
}

(() => {
  document.getElementById("download-button").onclick = () => {
    const filekey = document.getElementById("download-button").textContent;
    if (!filekey) {
      return alert("Null filekey.");
    }
    getSignedRequest(filekey);
  };
})();
