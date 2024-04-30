**Sprint 6**

**Sprint Goal**

- Develop a dietary habits feature for users to track and manage their daily food intake, get personalised dietary advice, and ensure ease of use with robust data management and user interface interactions.

**Backlog items**
- As a patient with type 2 diabetes, I want to view my daily food intake for each meal category,
So that I can keep track of my diet and manage my blood sugar levels efficiently.
- As a patient, I want to be able to add food items to my breakfast, lunch, dinner, and snacks for any given day, so that I can maintain a log of my eating habits.
- As a patient, I want to edit the details of my food entries, so that I can correct any mistakes or update the log with new information.
- As a patient, I want to delete a food entry from my log, so that I can remove items that were added by mistake or are no longer relevant.
- As a patient, I want to receive dietary advice after logging a meal, so that I can make better food choices in the future.
- As a user, I want to navigate between different dates easily, so that I can view and manage my food entries across different days.


**Sprint Planning**
1.View Daily Food Intake:
    - Implement a calendar view component where users can select a date and see logged meals for that day.
    - Develop a data retrieval system that fetches and displays meals from the database based on the selected date.

2. Add Food Items:
    - Create form components for breakfast, lunch, dinner, and snacks that allow users to input and submit food items.
    - Set up API endpoints to handle the creation of food entries in the database.

3. Edit Food Entries:
    - Implement edit functionality on the existing meal display that allows users to modify their entries.
    - Utilize modal or inline editing components for a seamless user experience.

4. Delete Food Entries:
    - Integrate a delete option with a confirmation step to prevent accidental deletions.
    - Establish API endpoints to handle the deletion of food entries from the database.

5. Receive Dietary Advice:
    - Integrate the OpenAI API to provide real-time dietary advice based on user inputs.
    - Ensure the dietary advice is logged and associated with the relevant food entry for future reference.

6. Navigate Between Dates:
    - Enhance the calendar view to allow users to navigate and select different dates easily.
    - Ensure smooth transitions and accurate display of data when switching between dates.


**Sprint Review**
1.View Daily Food Intake:
    - A calendar view component was successfully implemented, enabling the selection of a date to view meals logged for that particular day.

2. Add Food Items:
    - Form components for breakfast, lunch, dinner, and snacks were created. These forms allow for the intuitive entry of various meal types.
    - API endpoints were established to facilitate the creation of food entries, which have been integrated with the frontend forms.

3. Edit Food Entries:
    - The meal display now includes edit functionality, where users can seamlessly update their entries.
    - Modal and inline editing components have been implemented, enhancing the user experience by providing quick access to editing without navigating away from the page.

4. Delete Food Entries:
    - A delete function, accompanied by a confirmation step to prevent accidental deletions, has been integrated into the interface.
    - Corresponding API endpoints for deleting food entries from the database are operational, reinforcing data integrity and user control over their logs.

5. Receive Dietary Advice:
    - Integration with the OpenAI API to deliver real-time, personalized dietary advice based on user-inputted meal information has been accomplished.
    - This dietary advice is now logged and tied to the relevant food entry for users to reference, allowing for an informative review of their eating choices.

6. Navigate Between Dates:
    - The calendar view has been enhanced, providing a more intuitive user experience when navigating between dates.
    - Transitions between different dates are smooth, and the accuracy of displayed data has been maintained throughout.



**Sprint Retrospective**
What went well
1. API Integration:
    - The integration with the OpenAI API to provide dietary advice was smooth, with few roadblocks, and provided valuable, actionable feedback for the users.

2. User Experience:
    - Significant progress was made in enhancing the user experience, particularly in navigating between dates and managing meal entries.

Challenges
1. Handling Ambiguity:
    - Training the OpenAI API to provide user inputs required a significant amount of time.
2. User Interface Adjustments:
    - Some minor issues with the user interface layout were noted, specifically when new food entries were added. Additional CSS tweaks were needed to maintain layout consistency.


**Next Sprint Plan**
- Develop prescription management system thats allows doctors to prescribe medications to doctor to patients






