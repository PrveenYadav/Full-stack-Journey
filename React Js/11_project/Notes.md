# What we are using in this project

- Evironment Variables
- appwrite : backend as a service
- 

About Environment Variable: we make it in root of the project by the name of .env and never push it on github or shift in production/github. and personal for ourself we make a .env.sample environment variable which we shift/push on production.
```javascript
//To Access the Environment variable in React App:
import.meta.env.VITE_APPWRITE_URL

// VITE_APPWRITE_URL => key
```

**Packages and Installation**
- React Redux and Toolkit : `npm install react-redux ` and `npm install @reduxjs/toolkit`
- React Router Dom : `npm install react-router-dom`
- Tailwind css : `npm install tailwindcss`
- Context api : It is inbuild in React

##### In one line: `npm install @reduxjs/toolkit react-redux react-router-dom appwrite @tinymce/tinymce-react html-react-parser react-hook-form`


# Concepts
* regexp : A regular expression, often shortened to regex or regexp, is a powerful sequence of characters that defines a search pattern. Think of it as a more advanced and flexible version of the "find" function you might use in a word processor. 
* Web Development: Used for form validation, URL routing, and content processing.
* Syntax of regexp: `^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$`
* how we use: 
```javascript
// after regexp we use .test(value)
// In our code: Login.jsx

<Input
    label="Email: "
    placeholder="Enter your email"
    type="email"
    {...register("email", {
        required: true,
        validate: {
            matchPattern: (value) =>
            /^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/.test(value) ||
            "Email address must be a valid address",
        }
    })}
/>
```