// https://devcenter.heroku.com/articles/s3-upload-node
function uploadFile(file, signedRequest, url) {
  const xhr = new XMLHttpRequest();
  xhr.open("PUT", signedRequest);
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
      } else {
        alert("Could not upload file.");
      }
    }
  };
  xhr.send(file);
}

function getSignedRequest(file) {
  const xhr = new XMLHttpRequest();
  xhr.open(
    "GET",
    `/sign-s3-upload?file-name=${file.name}&file-type=${file.type}`
  );
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        document.getElementById("success").textContent =
          "Download at the link: /download/" + response.fileKey;
        uploadFile(file, response.signedRequest, response.url);
      } else {
        alert("Could not get signed URL.");
      }
    }
  };
  xhr.send();
}

// When the document loads, listen for file-input changes
// When the file input is updated, get a signed request from aws, then send it off
(() => {
  document.getElementById("file-input").onchange = () => {
    const files = document.getElementById("file-input").files;
    const file = files[0];
    if (file == null) {
      return alert("No file selected.");
    }
    getSignedRequest(file);
  };
})();
