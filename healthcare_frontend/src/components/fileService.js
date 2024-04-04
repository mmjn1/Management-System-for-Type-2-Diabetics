const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file); // 'file' is the name of the form field expected by the server

  try {
    const token = localStorage.getItem('token');

    const response = await fetch('http://localhost:8000/chat/upload/', {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Token ${token}`,
      },
    });

    if (!response.ok) {
      const errorResponse = await response.text();
      console.error('Error uploading file:', errorResponse);
      throw new Error('File upload failed');
    }

    const data = await response.json();
    return data.url; // Assuming your backend responds with the URL of the uploaded file
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error; // Rethrow the error so you can handle it in the component
  }
};

export { uploadFile };


