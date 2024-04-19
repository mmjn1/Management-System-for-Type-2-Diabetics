import React, { Fragment, useEffect, useRef, useState } from "react";
import "../assets/chat/Chat.css";
import { useDispatch, useSelector } from "react-redux";
import { webSocketService } from "../WebSocketConnection/Websocket";
import { fetchPatient } from "../features/patient/fetchPatients";
import { FaSearchPlus } from 'react-icons/fa';


import moment from "moment";
import Base64Media from "./Base64Media";

const DoctorChat = () => {
  const fileInputRef = useRef(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [shouldLoadChat, setShouldLoadChat] = useState(false);
  const patients = useSelector((state) => state.PatientSlice.data);
  const tempId = Date.now(); // Using the current timestamp as a simple unique identifier
  const [userName, setUserName] = useState("Abdullah Rafi");
  const [newMessage, setNewMessage] = useState("");
  const messages = useSelector((state) => state.chat.messages);
  const dispatch = useDispatch();
  const [userId, setUserID] = useState(localStorage.getItem("id"));
  const [otherUserId, setOtherUserId] = useState("");
  const [otherUserData, setOtherUserData] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [currentImageBase64, setCurrentImageBase64] = useState("");
  const [zoomLevel, setZoomLevel] = useState(1);


  useEffect(() => {
    const filterDoctors = () => {
      if (searchTerm.trim() === "") {
        setFilteredPatients(patients);
        return;
      }

      const lowercasedSearch = searchTerm.toLowerCase();
      setFilteredPatients(
        patients.filter(
          (patient) =>
            patient.first_name.toLowerCase().includes(lowercasedSearch) ||
            patient.last_name.toLowerCase().includes(lowercasedSearch) ||
            patient.email.toLowerCase().includes(lowercasedSearch),
        ),
      );
    };

    filterDoctors();
  }, [searchTerm, patients]);

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
  // Dependency array now includes 'messages'
  useEffect(() => {
    dispatch(fetchPatient());
  }, []);

  useEffect(() => {
    if (!shouldLoadChat) return;
    webSocketService.connect(userId, otherUserId);

    return () => {
      webSocketService.disconnect();
    };
  }, [userId, otherUserId, dispatch, shouldLoadChat]);

  const sendMessage = () => {
    if (selectedFile) {
      sendFile();
    } else {
      const messageData = {
        message: newMessage,
        sender_id: userId,
        recipient_id: otherUserId,
        tempId,
      };
      webSocketService.sendMessage(messageData);
      setNewMessage("");
    }
  };

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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFileName(file ? file.name : ""); // Update file name+
    setSelectedFile(file);
  };
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

  const openImageModal = (imageSrc) => {
    setCurrentImageBase64(imageSrc);
    setIsImageModalOpen(true);
  };

  return (
    <div className="content d-flex flex-column flex-column-fluid chat-container">
      {isImageModalOpen && (
        <div className="image-modal" onClick={() => setIsImageModalOpen(false)} style={{
          position: 'fixed',
          top: '2%',
          left: '2%',
          right: '2%',
          bottom: '2%',
          backgroundColor: 'transparent',
          padding: '0',
          boxSizing: 'border-box',
          zIndex: '1000',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'scroll',
        }}>
          <div style={{
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <img
              src={currentImageBase64}
              alt="Enlarged"
              style={{
                transform: `scale(${zoomLevel})`,
                transformOrigin: 'center center',
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
              }}
            />
            <div style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              display: 'flex',
              flexDirection: 'column',
            }}>

            </div>
          </div>
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
                      placeholder="Search Patients..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  <div className="mt-7 scroll scroll-pull scroll-user">
                    {filteredPatients.map((patient) => (
                      <div
                        className="d-flex align-items-center justify-content-between mb-5"
                        key={patient.id}
                      >
                        <div className="d-flex align-items-center justify-content-between mb-5">
                          <div className="d-flex align-items-center">
                            <div className="symbol symbol-circle symbol-50 mr-3"></div>
                            <div className="d-flex flex-column">
                              <a
                                id="select-doctor"
                                onClick={() => setOtherUserData(patient)}
                                className="text-dark-75 text-hover-primary font-weight-bold font-size-h4-xl text-capitalize"
                              >
                                {patient.first_name} {patient.last_name}
                              </a>
                              <span className="text-muted font-weight-bolder font-size-h6-sm">
                                Diagnosis Date:{" "}
                                {moment(patient.date_of_diagnosis).format(
                                  "YYYY-MM-DD",
                                )}
                              </span>
                              <span className="text-muted font-weight-bolder font-size-h6-sm">
                                Diabetes Type: {patient.type_of_diabetes}
                              </span>
                              <span className="text-muted font-weight-bolder font-size-h6-sm">
                                Email:
                                <a href={`mailto:${patient.email}`}>
                                  {patient.email}
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
                      {shouldLoadChat ? userName : "Select Patient to chat"}
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
                                      {msg.attachment && /\.(jpg|jpeg|png|gif)$/.test(msg.attachment) && (
                                        <a href={msg.attachment} download={msg.attachment.split('/').pop()}>
                                          <button className="btn btn-primary btn-sm">Download Image</button>
                                        </a>
                                      )}
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
                                          <Base64Media base64Data={msg.attachment} onImageClick={() => openImageModal(msg.attachment)} />
                                          <a
                                            href={msg.attachment}
                                            download="downloadedImage.jpg"
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
                            Please select a patient to start chatting
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
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                  />
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

export default DoctorChat;

