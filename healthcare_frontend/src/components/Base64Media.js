import React, { useState } from "react";

/**
 * Renders media (image/video) from Base64-encoded data. Detects media type (image/video) 
 * from the Base64 string and displays it accordingly. Images are clickable, triggering 
 * the `onImageClick` callback with the Base64 string. Unsupported video formats or 
 * incorrect Base64 data log errors.
 *
 * Props:
 *  - base64Data: String of Base64-encoded media with data URI scheme.
 *  - onImageClick: Callback for image clicks, receiving the Base64 string.
 *
 * Only MP4 and MOV video formats are supported. Media is displayed with a max width 
 * of 50% of its container, height adjusted to maintain aspect ratio.
 */


function Base64Media({ base64Data, onImageClick }) {
  const [mediaType, setMediaType] = useState(null);

  // Function to determine the media type when component loads
  React.useEffect(() => {
    if (!base64Data) return;
    if (base64Data.startsWith("data:image")) {
      setMediaType("image");
    } else if (base64Data.startsWith("data:video")) {
      const videoType = base64Data.split(";")[0].split("/")[1];
      if (["mp4", "mov"].includes(videoType)) {
        setMediaType("video");
      } else {
        console.error("Unsupported video format");
      }
    } else {
      console.error("Invalid Base64 data format");
    }
  }, [base64Data]);

  return (
    <div>
      {mediaType === "image" && (
        <img
          style={{ maxWidth: "50%", height: "auto" }}
          src={base64Data}
          alt="Base64 Content"
          onClick={() => onImageClick && onImageClick(base64Data)}
          // style={{ cursor: "pointer" }}
        />
      )}
      {mediaType === "video" && (
        <video controls style={{ maxWidth: "50%", height: "auto" }}>
          <source src={base64Data} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
    </div>
  );
}

export default Base64Media;