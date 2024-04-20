# Launch School JS175 Coursework

## Networked Applications with JavaScript

These are my assignment and practice problem solutions for JS175.

### Requirements

- `node`
- `npm`

### Setup

Clone repository and run `npm install` to install dependencies.

### Execution

> [!NOTE]
> Only run one server at a time, they all listen on the same port.

To start any of the web servers, either:

Use `npm run <script-name>` to use one of the `scripts` from `package.json`. See
the sections below or look in `package.json` for the script names.

OR

run the `app.js` file with `node`.

```shell
node <**/app.js>
```

### Sections

#### Lesson 2: Application Logic

##### `02_simple_echo_server/`

`npm run simple-echo-server`

- `app.js`

A webpage echoing the HTTP request in its response message body.

##### `03_dice_rolling_app/`

`npm run dice-rolling-app`

- `app.js`
- `die.js`

A webpage performing a series of random die rolls using the URL query parameters
to set the number of die sides (`sides`) and the number of rolls (`rolls`).

#### Projects

##### `loan_calculator`

`npm run loan_calculator`

- `app.js`
- `loan_calc.js`

A webpage calculating a monthly loan payment using `POST` and `GET` methods to
specify the loan amount (`amount`) and loan duration in years (`duration`).

##### `express-hello-world`

`npm run hello-world`

A "Hello-World" webpage using Express.js in a few different languages.
