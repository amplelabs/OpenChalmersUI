# ChalmersBot UI

Chalmersbot-ui is the front-end to Chalmers-bot.

If you are a developer looking to make a contribution to the front-end of the Chalmers bot, this is the right repository to start with. The following instructions will help you to setup and deploy the Chalmers chatbot UI "localy".

## Getting Started 

To clone the project from github. From your terminal, clone the chalmersbot-ui repository from github to your local machine and change directories into the folder:

```
git clone https://github.com/amplelabs/OpenChalmersUI.git 
cd open-chamlers/OpenChalmersUI
```

### Dev Tooling Installation

Chalmers' UI is developed with Node.js using Vue.js front end framework. It is recommanded to use `nvm` to manage your Node.js version.

1. Install nvm

For `*nix` environment, follow instructions here: [https://github.com/nvm-sh/nvm](https://github.com/nvm-sh/nvm)

For `Windows`, follow instructions here: [https://github.com/coreybutler/nvm-windows](https://github.com/coreybutler/nvm-windows)

It is recommanded to use the latest [LTS](https://nodejs.org/en/about/releases/) version of Node.js

2. Install dependence

Project dependence is capatured in `package.json` and `package-lock.json`, and can be installed with `npm` (part of nvm/Node.js installation)

```
$ npm install
```

### Chamlers Backend Information

Before you start the UI, modify / confirm the parameters that matches your AWS Lex configuration in `src/config/config.dev.json`.  For limited time, you can access Ample Labs dev environment to test you UI.

The following parameters are required (consult official AWS Lex Development guild for details)
- Cognito Pool ID: from your AWS Cognito Identity Pool console. If you use the cloudformation template above, it will be Lex Web UI, sample code from the left panel.
- Bot Name: from your AWS Lex console after build / publish stage
- Bot Alias: from your AWS Lex console after build / publish stage

### Run

You can run the chatbot locally, with hot-reloading, on the address http://localhost:8080 by typing:
```bash
$ npm start
```

### Test Build

To build the UI for deployment, e.g. to Firebase, you can use the following:

```
$ npm run build-dev
```

This will package up the project and ready for deployment later. The package (or artifact) will be in the `/dist` folder.

If you the command results in warnings or errors regaring `http://eslint.org/docs/rules/no-console`, edit `.eslintrc.js` https://github.com/amplelabs/chalmersbot-ui/blob/42f4887c92a1e8cc8a245904580139ad9ebec365/.eslintrc.js#L36-L38 from:

```
// allow debugger during development                                                                                         
"no-console": process.env.NODE_ENV === "production" ? "error" : "off",
```

to

```
// allow debugger during development
"no-console": "off",
```

and then re-run `npm run build-dev`
