# PROJECT-CLASS-MANAGER

## OVERVIEW
Project-Class-Manager is a platform for teacher and students where teachers can create assignments and assign them to the students and teachers can post notes and anouncements for Students.Students can submit their assignments within deadlines and can get their submitted assignments.

## DETAILS
This project consists of 22 API'S in 5 parts:

### 1. User Registration:
In this part users register themselves and get login.After login they can update their profiles after authentication through token.

### 2. Teacher Assignment:
In this part if a user logged in as a teacher he/she can post assignments for students.Students can get the assignments details through get api after authentication.Teache can update any chenges in the assignment through put api after after getting authenticated and authorized.

### 3. Notes:
In this part teacher can post their notes for students through post api after getting authenticated and authorized.Students can access these notes through get api after getting authenticated.Teacher can update any changes in the notes through put api after getting authenticated and authorized.

### 4. Anouncements:
In this part teacher can post anouncements for students through post api after getting authenticated and authorized.Students can get these anouncements through get api after getting authenticated.Teacher can update any changes in the anouncements through put api after getting authenticated and authorized.

### 5. Student Assignment Submissions:
In this part students can submit their assignments through post api after getting authenticated and authorized.     Students can access their assignments through get api after getting authenticated and authorized.Teachers can access all students assignments through get api after getting authenticated and authorized.Students can update any changes in the assignments before deadline through put api after getting authenticated and authorized.
