const fs = require("fs");
const generatePage = require("./src/page-template");
const inquirer = require("inquirer");

//for testing purposes
// const mockData = {
//   name: "Victor",
//   github: "vmcguire",
//   confirmAbout: true,
//   about: "Hello I'm Victor",
//   projects: [
//     {
//       name: "Victor's Project",
//       description: "Cool",
//       languages: [],
//       link: "link",
//       feature: false,
//       confirmAddProject: true,
//     },
//     {
//       name: "project 2",
//       description: "descript 2",
//       languages: [],
//       link: "link 2",
//       feature: false,
//       confirmAddProject: false,
//     },
//   ],
// };

const promptUser = () => {
  return inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: "What is your name?",
      validate: (nameInput) => {
        if (nameInput) {
          return true;
        } else {
          console.log("Please enter your name!");
          return false;
        }
      },
    },
    {
      type: "input",
      name: "github",
      message: "Enter your GitHub Username",
    },
    {
      type: "confirm",
      name: "confirmAbout",
      message:
        'Would you like to enter some information about yourself for an "About" section?',
      default: true,
    },
    {
      type: "input",
      name: "about",
      message: "Provide some information about yourself:",
      when: ({ confirmAbout }) => {
        if (confirmAbout) {
          return true;
        } else {
          return false;
        }
      },
    },
  ]);
};

const promptProject = (portfolioData) => {
  if (!portfolioData.projects) {
    portfolioData.projects = [];
  }

  console.log(`
=================
Add a New Project
=================
`);
  return inquirer
    .prompt([
      {
        type: "input",
        name: "name",
        message: "What is the name of your project?",
      },
      {
        type: "input",
        name: "description",
        message: "Provide a description of the project (Required)",
      },
      {
        type: "checkbox",
        name: "languages",
        message: "What did you build this project with? (Check all that apply)",
        choices: [
          "JavaScript",
          "HTML",
          "CSS",
          "ES6",
          "jQuery",
          "Bootstrap",
          "Node",
        ],
      },
      {
        type: "input",
        name: "link",
        message: "Enter the GitHub link to your project. (Required)",
      },
      {
        type: "confirm",
        name: "feature",
        message: "Would you like to feature this project?",
        default: false,
      },
      {
        type: "confirm",
        name: "confirmAddProject",
        message: "Would you like to enter another project?",
        default: false,
      },
    ])
    .then((projectData) => {
      portfolioData.projects.push(projectData);
      if (projectData.confirmAddProject) {
        return promptProject(portfolioData);
      } else {
        return portfolioData;
      }
    });
};

//for testing purposes
// const pageHTML = generatePage(mockData);

promptUser()
  .then(promptProject)
  .then((portfolioData) => {
    // const pageHTML = generatePage(mockData);
    const pageHTML = generatePage(portfolioData);
    fs.writeFile("./index.html", pageHTML, (err) => {
      if (err) throw new Error(err);
      console.log(
        "Page created! Check out index.html in this directory to see it!"
      );
    });
  });

// const fs = require("fs");

// const generatePage = require("./src/page-template.js");

// const pageHTML = generatePage(name, github);

// const profileDataArgs = process.argv.slice(2, process.argv.length);

// const [name, github] = profileDataArgs;

// fs.writeFile("index.html", generatePage(name, github), (err) => {
//   if (err) throw err;

//   console.log("Portfolio complete! Check out index.html to see the output!");
// });
