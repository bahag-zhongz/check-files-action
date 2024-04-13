const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs');

async function checkFileExists(filePath){
  return fs.promises.access(filePath)
  .then(() => {
    core.info(`File ${filePath} exists`);
    return true;
  })
  .catch(() => {
    core.setFailed(`File ${filePath} is mandatory`);
    return false;
  });
}

//Create a function that checks if the file starts with a markdown header

async function checkFileStartsWithHeader(filePath){
  return fs.promises.readFile(filePath, "utf8")
  .then(fileContent => {
    // Replace empty lines at the beginning of the file
    fileContent = fileContent.replace(/^\s*\n/, '');

    if(fileContent.startsWith('#')) {
      core.info(`File ${filePath} starts with a header`);
      return true;
    } else {
      core.setFailed(`File ${filePath} does not starts with a header`);
      return false;
    }
  });
}

(
  async() => {
    try{
      checkFileExists("LICENSE");
      checkFileExists("README.md");
      checkFileStartsWithHeader("README.md");
    } catch (error){
      core.setFailed(error.message);
    }
  }
)();
