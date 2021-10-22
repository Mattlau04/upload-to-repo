// Yes this is an ugly way to do it but do i look
// like i know what i'm doing?
// function send_alert(tab, msg){
//   var s = document.createElement('script');
//   s.text = "alert('123');"
//   (document.head||document.documentElement).appendChild(s);
//   s.onload = function() {
//       s.remove();
//   };
// }

const regex_ext = /image\/(.*)/;
function extension_from_blob(blob){
  try {
    ext = (blob.type).match(regex_ext)[1]
    return ext
  } catch (TypeError) {
    console.log("Unsupported file type!")
    return null
  }
}

async function uploadToRepo(info,tab) {
  var response = await fetch(info.srcUrl);
  var content = await response.blob();

  var data  = new FormData();
  ext = extension_from_blob(content)
  if (ext === null) {return} // bc that means we couldn't find ext
  data.append("file", content, "desuwa." + ext)
  
  var upload_response = await fetch("https://jurando.xyz/repo/upload.php", {
    method: 'POST',
    body: data ,
    //redirect: 'follow',
  })
  //.then(response => response.text())
  //.then(data => console.log(data))

  if (upload_response.url == "https://jurando.xyz/repo/repo.php")
  {
    //alert("Upload successful!!")
    console.log("Upload successful!!")
  }
  else
  {
    console.log("Upload failed:")
    console.log(upload_response.text())
    console.log(upload_response)
    //alert("Upload failed (check console for details)")
  }
}

chrome.contextMenus.create({
  title: "Upload to Repo", 
  contexts:["image"], 
  id: "upload-button"
});
chrome.contextMenus.onClicked.addListener(uploadToRepo)