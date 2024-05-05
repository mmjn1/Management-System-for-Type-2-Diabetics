import React, { Fragment, useEffect, useState, useRef } from "react";
import "../../src/assets/chat/Chat.css";
import { useDispatch, useSelector } from "react-redux";
import { webSocketService } from "../WebSocketConnection/Websocket";
import { fetchDoctor } from "../features/doctor/FetchDoctor";
import Base64Media from "./Base64Media";

/**
 * ChatComponent is for rendering the chat interface and handling user input for sending messages.
 * It allows users to search for doctors, view chat messages, and send new messages.
 *
 *
 * ChatComponent relies on external Redux actions and state, such as 'fetchDoctor' for retrieving doctor data
 * and a chat slice for handling chat messages. It also interacts with a WebSocket service to manage real-time
 * chat.
 *
 *
 */

const ChatComponent = () => {
  const fileInputRef = useRef(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState("");

  const [shouldLoadChat, setShouldLoadChat] = useState(false);
  const doctors = useSelector((state) => state.DoctorSlice.data);
  const tempId = Date.now(); // Using the current timestamp as a simple unique identifier
  const [userName, setUserName] = useState("Mukhtar");
  const [newMessage, setNewMessage] = useState("");
  const messages = useSelector((state) => state.chat.messages);
  const dispatch = useDispatch();
  const [userId, setUserID] = useState(localStorage.getItem("id"));
  const [otherUserId, setOtherUserId] = useState("");
  const [otherUserData, setOtherUserData] = useState("");
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [currentImageBase64, setCurrentImageBase64] = useState("");
  const [errorMessage, setErrorMessage] = useState('');


  /**
   * Effect hook to filter doctors based on the search term.
   * 
   * This hook triggers whenever the `searchTerm` or the `doctors` list changes.
   * It filters the doctors by checking if their first name, last name, or email
   * includes the search term, ignoring case differences. If the search term is empty,
   * it resets the list to include all doctors.
   */
  useEffect(() => {
    const filterDoctors = () => {
      if (searchTerm.trim() === "") {
        setFilteredDoctors(doctors); // Reset to original data
        return;
      }

      const lowercasedSearch = searchTerm.toLowerCase();
      setFilteredDoctors(
        doctors.filter(
          (doctor) =>
            doctor.first_name.toLowerCase().includes(lowercasedSearch) ||
            doctor.last_name.toLowerCase().includes(lowercasedSearch) ||
            doctor.email.toLowerCase().includes(lowercasedSearch),
        ),
      );
    };

    filterDoctors();
  }, [searchTerm, doctors]);

  useEffect(() => {
    const scrollContainer = document.querySelector(".custom-scroll");
    if (scrollContainer) {
      setTimeout(() => {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }, 100); // Adjusted to 100ms for quicker response, but can be set based on your needs
    }
  }, [messages]);


  useEffect(() => {
    if (otherUserData) {
      setUserName(otherUserData.first_name + " " + otherUserData.last_name);
      setOtherUserId(otherUserData.id);
      setShouldLoadChat(true);
    }
  }, [otherUserData]);


  useEffect(() => {
    dispatch(fetchDoctor());
  }, []);


   /**
   * Establishes or terminates a WebSocket connection based on the chat readiness.
   * 
   * This effect hook initiates a WebSocket connection when the chat is ready to be loaded
   * (i.e., `shouldLoadChat` is true). It uses the `userId` and `otherUserId` to establish
   * the connection, allowing real-time communication. If the component unmounts or the
   * dependencies change, it ensures the WebSocket connection is properly closed to prevent
   * memory leaks and unnecessary data transfer.
   * 
   * Dependencies:
   * - userId: The ID of the current user.
   * - otherUserId: The ID of the user with whom the current user is chatting.
   * - dispatch: Redux dispatch function, included to re-establish connection on redux state changes.
   * - shouldLoadChat: A flag to determine if the WebSocket connection should be established.
   */
  useEffect(() => {
    if (!shouldLoadChat) return;
    webSocketService.connect(userId, otherUserId);

    return () => {
      webSocketService.disconnect();
    };
  }, [userId, otherUserId, dispatch, shouldLoadChat]);


  // const sendMessage = () => {
  //   if (selectedFile) {
  //     sendFile();
  //   } else {
  //     const messageData = {
  //       message: newMessage,
  //       sender_id: userId,
  //       recipient_id: otherUserId,
  //       tempId,
  //     };
  //     webSocketService.sendMessage(messageData);
  //     setNewMessage("");
  //   }
  // };

  /**
 * Sends a message or a file to the recipient.
 * 
 * This function checks if there is a file selected for sending. If there is,
 * it calls the `sendFile` function to handle the file sending process. If no
 * file is selected, it constructs a message object containing the message text,
 * sender's ID, recipient's ID, and a temporary unique identifier. This message
 * object is then sent using the WebSocket service. After sending the message,
 * the input field is cleared by resetting `newMessage`.
 * 
 * Its used when the user wants to send a text message without any attachment.
 */
  const sendMessage = () => {
    if (!newMessage.trim() && !selectedFile) {
      setErrorMessage("Please enter a message or attach a file before sending.");
      return;
    }
    setErrorMessage(""); // Clear any existing error messages

    if (selectedFile) {
      // Assume sendFile handles file sending
      sendFile();
    } else {
      const messageData = {
        message: newMessage.trim(),
        sender_id: userId,
        recipient_id: otherUserId,
      };
      webSocketService.sendMessage(messageData);
      setNewMessage("");
    }
  };

  /**
 * Handles the process of sending a file over a WebSocket connection.
 * 
 * This function initiates a file read operation using FileReader. Once the file is read,
 * it constructs a message object containing the file data encoded in Base64 along with
 * metadata such as sender and recipient IDs, and a temporary unique identifier. This message
 * object is then sent through the WebSocket service. After sending the file, it resets the
 * file selection state.
 *
*/
  const sendFile = () => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const fileData = event.target.result; // Base64-encoded file content
      const messageData = {
        message: newMessage, // Send an empty message if only a file is being sent
        sender_id: userId,
        recipient_id: otherUserId,
        tempId,
        attachment: fileData,
        attachment_name: selectedFile.name,
      };
      webSocketService.sendMessage(messageData);
    };
    reader.readAsDataURL(selectedFile);
    setSelectedFileName("");
    setSelectedFile(null); // Clear the file input
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFileName(file ? file.name : ""); // Update file name+
    setSelectedFile(file);
  };

  /**
* Handles changes to the message input field.
* 
* This function is triggered whenever the user types into the message input field.
* It performs two main tasks:
* 
* 1. Updates the `newMessage` state with the current value of the input field, ensuring
*    that the component's state is synchronized with the user's input.
* 
* 2. Manages the visibility and content of the `errorMessage` state based on whether
*    the input field is empty. If the input field is empty (or contains only whitespace),
*    an error message is set, prompting the user to enter a message or attach a file before sending.
*    If there is text in the input field, any existing error message is cleared.
* 
* @param {Object} e - The event object from the input field, which contains the current input value.
*/
  const handleMessageChange = (e) => {
    const messageText = e.target.value;
    setNewMessage(messageText);

    // Automatically clear the error message when the user starts typing
    if (!messageText.trim()) {
      setErrorMessage("Please enter a message or attach a file before sending.");
    } else {
      setErrorMessage(""); // Clear the error message if the user types something
    }
  };


  /**
 * Formats a given time in milliseconds into a human-readable string.
 * 
 * This function takes an input time in milliseconds, converts it into hours, minutes,
 * and seconds, and then constructs a string that represents this duration in a
 * human-friendly format. Hours and minutes are only included in the output if they
 * are greater than zero, but seconds are always included.
 * 
 * @param {number} inputTime - The time in milliseconds to be formatted.
 * @returns {string} A string representing the formatted time, e.g., "1 hour, 15 minutes, 30 seconds".
 */
  function formatTime(inputTime) {
    const inputDate = new Date(inputTime);
    const seconds = inputDate.getSeconds();
    const minutes = inputDate.getMinutes();
    const hours = inputDate.getHours();

    let formattedTime = [];

    if (hours > 0) {
      formattedTime.push(hours + " hour" + (hours > 1 ? "s" : ""));
    }

    if (minutes > 0) {
      formattedTime.push(minutes + " minute" + (minutes > 1 ? "s" : ""));
    }

    // Seconds are always included as per the requirement
    formattedTime.push(seconds + " second" + (seconds > 1 ? "s" : ""));

    return formattedTime.join(", ");
  }

  /**
   * Opens an image modal with the provided image source.
   * 
   * This function sets the current image to be displayed in a modal by updating the
   * `currentImageBase64` state with the provided `imageSrc`. It also sets the state
   * `isImageModalOpen` to true to make the modal visible.
   * 
   * @param {string} imageSrc - The base64 encoded source of the image to display.
   */
  const openImageModal = (imageSrc) => {
    setCurrentImageBase64(imageSrc);
    setIsImageModalOpen(true);
  };


  return (
    <div className="content d-flex flex-column flex-column-fluid chat-container">
      {isImageModalOpen && (
        <div className="image-modal" onClick={() => setIsImageModalOpen(false)} style={{
          position: 'fixed',
          top: '1%',
          left: '1%',
          right: '1%',
          bottom: '1%',
          backgroundColor: 'transparent',
          padding: '0',
          boxSizing: 'border-box',
          zIndex: '1000',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <img src={currentImageBase64} alt="Enlarged" style={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
            margin: 'auto'

          }} />
        </div>
      )}
      <div className="d-flex flex-column-fluid">
        <div className="container">
          <div className="d-flex flex-row">
            <div className="flex-grow-0 flex-shrink-0 w-100 w-md-auto">
              <div className="card card-custom">
                <div className="card-body" style={{ maxWidth: '2000px', margin: '0 auto' }}>
                  <div className="input-group input-group-solid">
                    <div className="input-group-prepend">
                      <span className="input-group-text">
                        <span className="svg-icon svg-icon-lg">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            xmlnsXlink="http://www.w3.org/1999/xlink"
                            width="24px"
                            height="24px"
                            viewBox="0 0 24 24"
                            version="1.1"
                          >
                            <g
                              stroke="none"
                              strokeWidth={1}
                              fill="none"
                              fillRule="evenodd"
                            >
                              <rect x={0} y={0} width={24} height={24} />
                              <path
                                d="M14.2928932,16.7071068 C13.9023689,16.3165825 13.9023689,15.6834175 14.2928932,15.2928932 C14.6834175,14.9023689 15.3165825,14.9023689 15.7071068,15.2928932 L19.7071068,19.2928932 C20.0976311,19.6834175 20.0976311,20.3165825 19.7071068,20.7071068 C19.3165825,21.0976311 18.6834175,21.0976311 18.2928932,20.7071068 L14.2928932,16.7071068 Z"
                                fill="#000000"
                                fillRule="nonzero"
                                opacity="0.3"
                              />
                              <path
                                d="M11,16 C13.7614237,16 16,13.7614237 16,11 C16,8.23857625 13.7614237,6 11,6 C8.23857625,6 6,8.23857625 6,11 C6,13.7614237 8.23857625,16 11,16 Z M11,18 C7.13400675,18 4,14.8659932 4,11 C4,7.13400675 7.13400675,4 11,4 C14.8659932,4 18,7.13400675 18,11 C18,14.8659932 14.8659932,18 11,18 Z"
                                fill="#000000"
                                fillRule="nonzero"
                              />
                            </g>
                          </svg>
                        </span>
                      </span>
                    </div>
                    <input
                      type="text"
                      className="form-control py-4 h-auto"
                      placeholder="Email"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  <div className="mt-7 scroll scroll-pull scroll-user">
                    {filteredDoctors.map((doctor) => (
                      <div
                        className="d-flex align-items-center justify-content-between mb-5"
                        key={doctor.id}
                      >
                        <div className="d-flex align-items-center justify-content-between mb-5">
                          <div className="d-flex align-items-center">
                            <div className="symbol symbol-circle symbol-50 mr-3"></div>
                            <div className="d-flex flex-column">
                              <a
                                id="select-doctor"
                                onClick={() => setOtherUserData(doctor)}
                                className="text-dark-75 text-hover-primary font-weight-bold font-size-h4-xl text-capitalize"
                              >
                                Dr. {doctor.first_name} {doctor.last_name}
                              </a>

                              <span className="text-muted font-weight-bolder font-size-h6-sm">
                                Speciality: {doctor.speciality}
                              </span>
                              <span className="text-muted font-weight-bolder font-size-h6-sm">
                                Email:
                                <a href={`mailto:${doctor.email}`}>
                                  {doctor.email}
                                </a>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-grow-1 ms-md-3" id="kt_chat_content">
              <div className="card card-custom">
                <div className="card-header align-items-center px-4 py-3">
                  <div className="text-left flex-grow-1"></div>
                  <div className="text-center flex-grow-1">
                    <div className="text-dark-75 font-weight-bold font-size-h5 text-capitalize">
                      {shouldLoadChat ? userName : "Select Doctor to chat"}
                    </div>
                    <div></div>
                  </div>
                  <div className="text-right flex-grow-1"></div>
                </div>

                <div className="card-body">
                  <div
                    className="scroll scroll-pull scroll custom-scroll"
                    data-mobile-height={350}
                  >
                    {/*begin::Messages*/}
                    {shouldLoadChat ? (
                      <div className="messages">
                        {messages.length > 0 ? (
                          messages.map((msg, index) => (
                            <Fragment key={index}>
                              {msg.sender_id == userId ? (
                                <div className="d-flex flex-column mb-5 align-items-end">
                                  <div className="d-flex align-items-center">
                                    <div>
                                      <a
                                        href="#"
                                        className="text-dark-75 text-hover-primary font-weight-bold font-size-h6"
                                      >
                                        You
                                      </a>{" "}
                                      <span className="text-muted font-size-sm">
                                        {formatTime(msg.formatted_timestamp)}
                                      </span>
                                    </div>
                                    <div className="symbol symbol-circle symbol-40 ml-3"></div>
                                  </div>
                                  {msg.message === "" ? (
                                    ""
                                  ) : (
                                    <div className="mt-2 rounded p-5 bg-light-primary text-dark-50 font-weight-bold font-size-lg text-right max-w-400px">
                                      {msg.message}
                                    </div>
                                  )}
                                  <div className="row">
                                    <div className="col-12 text-right">
                                      <Base64Media
                                        base64Data={msg.attachment} onImageClick={() => openImageModal(msg.attachment)}
                                      />
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div className="d-flex flex-column mb-5 align-items-start">
                                  <div className="d-flex align-items-center">
                                    <div className="symbol symbol-circle symbol-40 mr-3"></div>
                                    <div>
                                      <a
                                        href="#"
                                        className="text-dark-75 text-hover-primary font-weight-bold font-size-h6"
                                      >
                                        {msg.sender_full_name}
                                      </a>{" "}
                                      <span className="text-muted font-size-sm">
                                        {formatTime(msg.formatted_timestamp)}
                                      </span>
                                    </div>
                                  </div>
                                  {msg.message === "" ? (
                                    ""
                                  ) : (
                                    <div className="mt-2 rounded p-5 bg-light-success text-dark-50 font-weight-bold font-size-lg text-right max-w-400px">
                                      {msg.message}
                                    </div>
                                  )}
                                  <div className="row mt-2">
                                    <div className="col-12 text-left">
                                      {msg.attachment && (
                                        <div>
                                          <Base64Media base64Data={msg.attachment} />
                                          <a
                                            href={`${msg.attachment}`} // Assuming this is a valid base64 data URL
                                            download="downloadedImage.jpg" // You can set a default name or use the original file name if you have it
                                            className="btn btn-primary btn-sm"
                                          >
                                            Download File
                                          </a>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </Fragment>
                          ))
                        ) : (
                          <div className="messages">
                            <div className="d-flex flex-column mb-5 align-items-end">
                              <div className="d-flex align-items-center">
                                <div>
                                  <a
                                    href="#"
                                    className="text-dark-75 text-hover-primary font-weight-bold font-size-h6"
                                  >
                                    System 🤖:
                                  </a>{" "}
                                  <span className="text-muted font-size-sm"></span>
                                </div>
                                <div className="symbol symbol-circle symbol-40 ml-3"></div>
                              </div>
                              <div className="mt-2 rounded p-5 bg-light-primary text-dark-50 font-weight-bold font-size-lg text-right max-w-400px">
                                Start a conversation! 👋
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="messages">
                        <div className="d-flex flex-column mb-5 align-items-end">
                          <div className="d-flex align-items-center">
                            <div>
                              <a
                                href="#"
                                className="text-dark-75 text-hover-primary font-weight-bold font-size-h6"
                              >
                                System 🤖:
                              </a>{" "}
                              <span className="text-muted font-size-sm"></span>
                            </div>
                            <div className="symbol symbol-circle symbol-40 ml-3"></div>
                          </div>
                          <div className="mt-2 rounded p-5 bg-light-primary text-dark-50 font-weight-bold font-size-lg text-right max-w-400px">
                            Please select a doctor to start chatting
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/*begin::Footer*/}
                <div className="card-footer align-items-center">
                  {/*begin::Compose*/}
                  <textarea
                    disabled={!shouldLoadChat}
                    value={newMessage}
                    className="form-control border-0 p-0"
                    rows={2}
                    placeholder="Type a message"
                    defaultValue={""}
                    onChange={handleMessageChange}
                    onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                  />
                  {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}

                  <div className="d-flex align-items-center justify-content-between mt-5">
                    <div className="mr-3">
                      <input
                        disabled={!shouldLoadChat}
                        type="file"
                        className="mr-2"
                        style={{ display: "none" }}
                        ref={fileInputRef}
                        onChange={(e) => handleFileChange(e)}
                        accept="image/*, video/mp4"
                      />
                      <button
                        disabled={!shouldLoadChat || selectedFileName}
                        className="btn btn-sm btn-primary"
                        onClick={() => fileInputRef.current.click()}
                      >
                        Attach File
                      </button>
                      {selectedFileName && (
                        <span className="ml-2"> {selectedFileName} </span> // Display file name
                      )}
                    </div>
                    <div>
                      <button
                        disabled={!shouldLoadChat}
                        onClick={sendMessage}
                        type="button"
                        className="btn btn-primary btn-md text-uppercase font-weight-bold chat-send py-2 px-6"
                      >
                        Send
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatComponent;
