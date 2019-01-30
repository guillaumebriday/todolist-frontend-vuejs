# Todolist-frontend Application

[![Build Status](https://travis-ci.org/guillaumebriday/todolist-frontend-vuejs.svg?branch=master)](https://travis-ci.org/guillaumebriday/todolist-frontend-vuejs)
[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.me/guillaumebriday)
[![Netlify Status](https://api.netlify.com/api/v1/badges/68286221-cb5f-4960-834f-0ae250395090/deploy-status)](https://app.netlify.com/sites/todolist-frontend-vuejs/deploys)

> Frontend for https://github.com/guillaumebriday/todolist-backend-laravel app, built for a serie of articles on my [blog](https://guillaumebriday.fr/).

The purpose of this repository is to consume API, provide by [a Laravel Application](https://github.com/guillaumebriday/todolist-backend-laravel), with the [Vue.js](https://vuejs.org) JavaScript front-end framework.

![Screenshot](https://raw.githubusercontent.com/guillaumebriday/todolist-frontend-vuejs/master/screenshot.png)

## Some of the tools used in this project

- [Vue.js](https://vuejs.org)
- [vue-router with Lazy Loading Routes](https://router.vuejs.org/en/)
- [vue-test-utils](https://github.com/vuejs/vue-test-utils)
- [vuex](https://github.com/vuejs/vuex)
- [axios](https://github.com/axios/axios)
- [moment.js](https://github.com/moment/moment/)
- [Laravel Echo](https://github.com/laravel/echo)
- [Webpack](https://webpack.js.org/)
- [webpack-dev-server](https://github.com/webpack/webpack-dev-server)
- [Tailwind CSS](https://github.com/tailwindcss/tailwindcss)

## Installation

Development environment requirements :
- [Docker](https://www.docker.com)
- [Docker Compose](https://docs.docker.com/compose/install/)

Setting up your development environment on your local machine :
```
$ git clone https://github.com/guillaumebriday/todolist-frontend-vuejs.git
$ cd todolist-frontend-vuejs
$ docker-compose run --rm node yarn
$ docker-compose run --service-ports --rm node yarn hot
```

## Useful commands
Building the app :
```bash
$ docker-compose run --rm node yarn dev

# Or

$ docker-compose run --rm node yarn watch

# Or

$ docker-compose run --rm node yarn production
```

Running ESLint :
```bash
$ docker-compose run --rm node yarn lint
```

Running tests :
```bash
$ docker-compose run --rm node yarn test
```

## Broadcasting & WebSockets

Before using WebSockets, you need to set the ```PUSHER_APP_KEY``` key in your .env file.

You could generate a key on [https://pusher.com/](https://pusher.com/).

## Deploy in production

This application is hosted on [Netlify](https://www.netlify.com/) and available on [https://todolist.guillaumebriday.xyz/](https://todolist.guillaumebriday.xyz/).

## More details

More details are available on my blog post : [https://guillaumebriday.fr/laravel-vuejs-faire-une-todo-list-partie-1-presentation-et-objectifs](https://guillaumebriday.fr/laravel-vuejs-faire-une-todo-list-partie-1-presentation-et-objectifs) (French).

## Contributing

Do not hesitate to contribute to the project by adapting or adding features ! Bug reports or pull requests are welcome.

## License

This project is released under the [MIT](http://opensource.org/licenses/MIT) license.
