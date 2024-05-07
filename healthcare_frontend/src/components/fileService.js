/**
 * Asynchronously uploads a file to the server and returns the URL of the uploaded file.
 * 
 * This function takes a single file object as an argument, creates a FormData object, and appends
 * the file to it under the key 'file', which is the field name expected by the server. It retrieves
 * the user's authentication token from local storage and uses it to set the Authorization header
 * for the POST request to the server's file upload endpoint.
 * 
 * If the server responds with a non-OK HTTP status, the function logs and throws an error with the
 * response text. If the upload is successful, it parses the JSON response to extract and return the
 * URL of the uploaded file.
 * 
 * @param {File} file - The file to be uploaded.
 * @returns {Promise<string>} A promise that resolves to the URL of the uploaded file.
 * @throws {Error} Throws an error if the file upload fails or if the server response is not OK.
 */
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


