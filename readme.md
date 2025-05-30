This is my personal blog project. I am building it from scratch, and the knowledge I gathered from watching Hitesh's backend series.

Here I will be specifying the entire steps I am following.

1. Create a folder with any name you want.
2. Set up node js environment using the command-
            npm i node

Now you will see a package.json file is created.
3. Now, you write the initialization command that adds more info to your package.json file
            npm init

As you write this command, a number of entries will be asked, fill them accordingly.

4. Create a readme.md file, where you can add any information related to your project like I am.
   -md extension stands for markdown language.

Metadata- data giving information about some other data.

-package.json file is a json file that lies in the root directory of the project and contains human-readable metadata about the project. 
As you initialized your project, like the name of the project, the version, author etc.

Difference between Dev dependency and Dependency in package.json file
-Dev dependencies help during development of code not when it is in production. Eg- nodemon or prettier.
-Dependencies needed while writing code and also later in production. like any package i install-cors, multer.

We will use two basic dev dependencies which are included in all projects-
         1.nodemon
         2.prettier
      
-we can install them as-
         npm i -D nodemon 
         npm i -D prettier

-D here signifies that both these are being installed as dev dependencies.

External modules are used in 2 ways-
   1. require (which doesn't require any changes )
   2. import statements (refer below article)
   -we can add "type"
:"module" in our package.json file.

link for more info: https://herreranacho.medium.com/using-import-instead-of-require-in-node-js-1957ff5ed720



