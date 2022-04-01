# Initial Screening Assessment #

## Task ##

There exists a resource called `Class` that contains the following properties:

```
 name
 startDate
 students
```

Each `Class` can have zero or more `Students` enrolled in it with the following properties:

```
 name
 age
```

Create REST API endpoints that carry out the following operations:

* Create a class
* Get all classes
* Get a class
* Delete a class
* Add a student to a class
* Delete a student from a class

You can choose to write your code either in JavaScript / TypeScript.

Feel free to use any external libraries that you feel might be useful but we recommend starting out simple first and then continue building on it once you have all the minimum requirements completed. The data does not necessarily need to be stored permanently and can be in memory only. We are evaluating how you approach a problem, how you structure your code and if you provide additional information to the reader where necessary. Adding commits as you progress with the solution is also recommended.

## Requirements ##

These are the minimum requirements that your application needs to meet:

* Return the number of students in each class when retrieving all classes.
* The students should be sorted by name in ascending order.
* Do not delete a class if it still has students enrolled in it.

## Prerequisites ##

* Have `node v14` or later installed locally on your system.
* Have `npm` installed locally on your system.

## Before you get started ##

* You can either create a private fork in bitbucket and clone that repository to get started, or you can import this repository directly into your [github](https://docs.github.com/en/get-started/importing-your-projects-to-github/importing-source-code-to-github/importing-a-repository-with-github-importer) account.
* Create a new branch off of `develop` to start you work in and once you are finished with the task you can create a Pull Request back into the `develop` branch.

## How do I get set up? ##

* Run the following commands in the base directory of the application
* To install the package dependencies:  
  `npm install`
* To run the node app:  
  `npm run start`

## Testing Guidelines ##

* It's not required by you to write any tests to complete the assessment but it is encouraged.

## Submitting your work ##

* Create a Pull Request and add a description to the Pull Request detailing why you went with the following approach and what the pros and cons are with the submitted implementation.
* Finally, grant access to the private/public repo to this email: `aabraham@greenlightiot.com` to make sure we can evaluate your submission.
