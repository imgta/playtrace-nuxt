# To use this boilerplate as a starter for new project

1. duplicate this project locally by right clicking and copying the entire folder
2. delete package-lock.json, node_modules, hidden .nuxt, and hidden .git folder if it exists
    - In Finder, press Command + Shift + . (dot) to toggle the display of hidden files.
3. rename the folder (eg: myproject-nuxt)
4. go to github desktop > add > add existing repo > create repo instead > click through all of it > at this point the project should be set up > publish repository
    - be sure to select the correct organization
    - if you don't have an organization yet, follow the `How to create new company` steps below
5. make a dev branch in Github Desktop, then click `Open in Visual Studio Code`
6. type in ncu then ncu -u
    - to update modules
7. npm install
8. git secret reveal
    - https://git-secret.io/ to see how to add more users or install it globally if you haven't
9. npx simple-git-hooks
    - this needs to be run on new project but also every time you edit the pre-commit in package.json as well
10. npm run dev
    - once you test that it works, commit in github desktop, then push, then pull request to main and merge

Visual examples of tailwind classes: https://rogden.github.io/tailwind-config-viewer/

# To update this boilerplate

1. look at .node-version and update that if needed
2. delete package-lock.json, node_modules, and .nuxt if it exists
3. ncu -u
4. npm i
5. git secret reveal 
    - if this doesn't work because you're on a new computer, you need to import the private and public key for gpg
        - install gpg globally
        - gpg --import /path/to/your/private-key-file.asc
        - gpg --import /path/to/your/public-key-file.asc

        - if you didn't move over the keys, you'll need to reinstall git secret
            - git secret init
            - git secret tell jeffreytung7@gmail.com
            - git secret add .env
            - git secret add .env.prod
            - git secret add test.http
            - git secret hide
6. npm run dev 
    - to test everything works and fix stuff

# How to create new company

1. create a new gmail account for the company, select 'business' when asked

2. Create a new organization called your company (eg toolsofficial) on github and linked to my personal github

3. create a new personal github called your company domain (eg toolsofficialcom) used for creating supabase account
    - go to https://github.com/orgs/your-organization/people and add as a member of the org

# Misc notes

- i use https://github.com/antfu/eslint-config to both format and lint code, and it's set to run on pre-commit and save
    - these are the files that i custom set for it to work (aside from this just follow the readme from antfu):
        - package.json
        - .vscode/settings.json
        - .eslintrc
