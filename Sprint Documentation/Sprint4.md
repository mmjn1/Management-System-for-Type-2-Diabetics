**Sprint 4**

**Sprint Goal**

- Develop a chat system that provides users with an interactive platform where messages are exchanged without delay.

**Backlog items**

- As a patient, I want to easily initiate a chat with my doctor so that I can quickly communicate any health concerns or questions.
- As a doctor, I want to view a list of my patients with active conversations so that i can efficiently manage my communication.
- As a doctor, I want to access previous chat histories with patients so that I can provide context-aware responses.
- As a user (patient or doctor), I want to be able to securely send and receive attachments during chat conversations so that I can share important images, and other files easily with my doctor or patient.

**Sprint Planning**

1. Implement Real-time Messaging:

- Develop websocket connections for real-time communication
- Ensure messages are sent and received with minimal latency

2. User Interface for Initiating Chat (patient):

- Create a user-friendly interface for patients to start a chat with their doctor
- Implement a search or select feature for patients to find and select their doctor.

3. User Interface for Initiating Chat (doctor):

- Design and implement a dashboard where doctors can see a list of active conversations.
- Add search bar where doctors can search for their patients.
- Create a user-friendly interface for doctors to start a chat with their patients

4. Access to chat histories

- Develop a system for storing and retrieving past chat conversations.
- Provide a user interface for doctors to access these histories easily

5. File Attachments

- Implement functionality to allow users (patients and doctors) to securely send and receive attachments such as images and documents during chat conversations.
- Ensure that the file transfer is secure and integrates seamlessly with the existing chat system.
- Develop UI components for attaching, previewing, and downloading files within the chat interface.

**Sprint Review**

**Achievements:**

- Real-time Messaging: Successfully implemented WebSocket connections, achieving real-time communication between patients and doctors. The system now supports instant message exchange with minimal latency, enhancing the user experience.
- User Interface for Chat Initiation: Developed a user-friendly interface allowing patients to easily start conversations with their doctors. The new search and select feature streamline the process of finding and selecting healthcare providers.
- Doctor's Dashboard: Introduced a dashboard for doctors, displaying a list of active conversations. This dashboard includes sorting and filtering capabilities, making it easier for doctors to manage their conversations.
- Chat Histories: Established a robust system for storing and retrieving chat histories. Doctors can now access past conversations through a well-designed interface, improving the continuity of patient care.
- Secure File Attachment feature: Implemented a feature allowing users to securely send and receive attachments during chat conversations. This feature supports various file types, including images and documents, and has been integrated into the chat interface.

**Sprint Retrospective**

What went well:

- Efficient Real-Time Communication: The implementation of WebSocket connections was successful, providing real-time messaging capabilities that met our goal of minimal message delay. This core functionality has significantly enhanced the interactive experience for users.
- Effective UI Design: The new interfaces for initiating chats and the doctor's dashboard were well-received. The ability to easily start conversations and manage ongoing discussions has streamlined communication for both patients and doctors.
- Reliable Chat History Access: The development of a system for storing and retrieving chat histories has been effective. Doctors appreciate the ability to access previous conversations, which aids in providing context-aware responses and improves the quality of patient care.
- Secure File Attachment Feature: Successfully implemented the functionality for securely sending and receiving attachments during chat conversations.

Challenges:

- WebSocket Connection Complexity: Implementing WebSocket connections proved to be more challenging than anticipated. I faced difficulties in establishing stable connections, which required additional debugging.
- Learning Curve with Django Channels: Integrating Django Channels for handling WebSocket communications involved a steep learning curve. I spent a lot of time in learning Django Channels to effectively use it for real-time messaging.
- Handling Connection Stability: Ensuring that the WebSocket connections were stable and could handle reconnections and network interruptions was a challenge. This required implementing robust error handling.

**Next Sprint Plan:**

- Implement the flexible records feature that allows doctors to collect additional information