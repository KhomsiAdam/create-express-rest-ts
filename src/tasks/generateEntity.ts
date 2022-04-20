/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable no-console */
import * as fs from 'fs';
import inquirer from 'inquirer';

const CURR_DIR = process.cwd();
const CHOICES = fs.readdirSync(`${__dirname}/templates`);

// Create folder based on template picked and name provided
const createEntityFolder = (templatePath: string, newProjectPath: string) => {
  const filesToCreate = fs.readdirSync(templatePath);

  filesToCreate.forEach((file) => {
    const origFilePath = `${templatePath}/${file}`;
    const stats = fs.statSync(origFilePath);

    if (stats.isFile()) {
      const contents = fs.readFileSync(origFilePath, 'utf8');
      const writePath = `${newProjectPath}/${file}`;
      fs.writeFileSync(writePath, contents, 'utf8');
    } else if (stats.isDirectory()) {
      fs.mkdirSync(`${newProjectPath}/${file}`);
      createEntityFolder(`${templatePath}/${file}`, `${newProjectPath}/${file}`);
    }
  });
};

// Replace placeholders from template depending on name provided
const replaceEntityFiles = (newEntityPath: string, entityName: string) => {
  const filesToModify = fs.readdirSync(newEntityPath);

  filesToModify.forEach((file) => {
    const newFilePath = `${newEntityPath}/${file}`;
    const stats = fs.statSync(newFilePath);

    if (stats.isFile()) {
      const writePath = `${newEntityPath}/${file}`;

      fs.readFile(writePath, 'utf8', (readError, data) => {
        if (readError) {
          return console.log(readError);
        }
        const result = data
          .replace(/{{lowercaseName}}/g, entityName.toLowerCase())
          .replace(/{{uppercaseName}}/g, entityName.toUpperCase())
          .replace(/{{capitalizedName}}/g, entityName.toUpperCase().charAt(0) + entityName.toLowerCase().slice(1));
        fs.writeFile(writePath, result, 'utf8', (writeError) => {
          if (writeError) {
            return console.log(writeError);
          }
        });
      });
    }
    // } else if (stats.isDirectory()) {
    //   fs.mkdirSync(`${newEntityPath}/${file}`);
    //   // replaceEntityFiles(`${newEntityPath}/${file}`, `${newEntityPath}/${entityName}`);
    // }
  });
};

const QUESTIONS = [
  {
    name: 'entity-choice',
    type: 'list',
    message: 'What entity template would you like to generate?',
    choices: CHOICES,
  },
  {
    name: 'entity-name',
    type: 'input',
    message: 'Entity name:',
    validate(input: any) {
      if (/^([A-Za-z\-\\_\d])+$/.test(input)) return true;
      return 'Entity name may only include letters, numbers, underscores and hashes.';
    },
  },
];

inquirer
  .prompt(QUESTIONS)
  .then((answers) => {
    const entityChoice = answers['entity-choice'];
    const entityName = answers['entity-name'];
    const templatePath = `${__dirname}/templates/${entityChoice}`;
    console.log(templatePath);
    const entitiesPath = `${CURR_DIR}/src/entities/${entityName.toLowerCase()}`;
    fs.mkdirSync(`${entitiesPath}`);
    console.log(entitiesPath);
    createEntityFolder(templatePath, entitiesPath);
    replaceEntityFiles(entitiesPath, entityName.toLowerCase());
    return true;
  })
  .catch((error) => {
    console.log(error);
  });
