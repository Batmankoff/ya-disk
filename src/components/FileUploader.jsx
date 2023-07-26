import React, { useState } from 'react';

function FileUploader() {
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFileChange = (event) => {
    if (event.target.files.length > 100) {
      alert('You can only upload a maximum of 100 files');
      return;
    }
    setSelectedFiles(event.target.files);
  };

  const uploadFiles = async () => {
    const token = 'DISK_TOKEN';
    for (let file of selectedFiles) {
      const getUrlRes = await fetch(
        `https://cloud-api.yandex.net/v1/disk/resources/upload?path=disk%3A%2F${file.name}`,
        {
          method: 'GET',
          headers: {
            Authorization: `OAuth ${token}`,
          },
        }
      );
      const uploadUrl = await getUrlRes.json();

      const uploadRes = await fetch(uploadUrl.href, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });
      if (!uploadRes.ok) {
        console.error(`Upload failed for file ${file.name}`);
      }
    }
  };

  return (
    <div>
      <input type='file' multiple onChange={handleFileChange} />
      <button onClick={uploadFiles}>Upload</button>
    </div>
  );
}

export default FileUploader;
