# Drag and Drop

A simple app for learning typescript with MVC/OOP

## Setups

Create package.json

```bash
npm init --yes
```

Add the following packages

```bash
yarn add --dev webpack webpack-cli webpack-dev-server typescript ts-loader
```

Create & edit tsconfig.json

```bash
tsc --init
```

- [tsconfig.json]("./tsconfig.json")

Create & edit webpack.config.js + webpack.config.prod.js

- [webpack.config.js]("./webpack.config.js")
- [webpack.config.prod.js]("./webpack.config.prod.js")

Add eslint + prettier

```bash
yarn add --dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin prettier eslint-config-prettier eslint-plugin-prettier
```

Configure `.eslintrc.json` and `.prettierrc.js`

- [Typescript + ESLint + Prettier](https://github.com/toypiano/cheatsheets/blob/master/docs/vscode.md)

## Undefined 'This'

When defining a class, you need to bind 'this' inside a callback (99% of the time when you're using `this` inside a function, it's going to be passed to other function).

- Error message

```bash
Uncaught TypeError: Cannot read property 'type' of undefined
```

- Stack trace

```ts
private assignAndRenderProjects(projects: Project[]) {
    this.assignedProjects = projects.filter(
      (project) =>
        project.status ===
        (this.type === 'active' // error
          ? ProjectStatus.Active
          : ProjectStatus.Completed),
    );

    this.renderProjects();
  }
```

```ts
// this points to state
state.addListener(this.assignAndRenderProjects);
```

You need to bind the callback with 'this' of enclosing scope

```ts
@autobind
  private assignAndRenderProjects(projects: Project[]) {
```
