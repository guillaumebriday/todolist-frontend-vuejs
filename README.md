# Todolist-frontend Application

[![Build Status](https://travis-ci.org/guillaumebriday/todolist-frontend-vuejs.svg?branch=master)](https://travis-ci.org/guillaumebriday/todolist-frontend-vuejs)
[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.me/guillaumebriday)

> Frontend for https://github.com/guillaumebriday/todolist-backend-laravel app, built for a serie of articles on my [blog](https://guillaumebriday.fr/).

The purpose of this repository is to consume API, provide by [a Laravel Application](https://github.com/guillaumebriday/todolist-backend-laravel), with the [Vue.js](https://vuejs.org) JavaScript front-end framework.

![Screenshot](https://raw.githubusercontent.com/guillaumebriday/todolist-frontend-vuejs/master/screenshot.png)

## Some of the tools used in this project

- [Vue.js](https://vuejs.org)
- [vue-router](https://router.vuejs.org/en/)
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
$ cd todolist-frontend
$ docker-compose run --rm node npm install
$ docker-compose run --service-ports --rm node npm run hot
```

## Useful commands
Building the app :
```bash
$ docker-compose run --rm node npm run dev

# Or

$ docker-compose run --rm node npm run watch

# Or

$ docker-compose run --rm node npm run production
```

Running ESLint :
```bash
$ docker-compose run --rm node npm run lint
```

Running tests :
```bash
$ docker-compose run --rm node npm run test
```

## Broadcasting & WebSockets

Before using WebSockets, you need to set the ```PUSHER_APP_KEY``` key in your .env file.

You could generate a key on [https://pusher.com/](https://pusher.com/).

## Deploy in production

You can serve your application with [nginx](https://nginx.org/) in production. The configuration is very simple because it's only static files.

You can deploy this application with Ansible and Capistrano.

Just create an ```hosts``` file like the following one :

```ini
[webservers]
example.com

[all:vars]
ansible_python_interpreter=/usr/bin/python3

[webservers:vars]
app_url=example.com
base_url=http://example.com
pusher_app_key=a1b2c3d4
```

Setup your variables in the ```playbook.yml``` and in the ```config/deploy.rb``` files.

And then run :

```bash
$ ansible-playbook -i hosts playbook.yml
```

Now with [Capistrano](http://capistranorb.com/) :

Before starting, change the configuration files with your informations, then run :

```bash
$ bundle install
$ cap production deploy
```

## More details

More details are available on my blog post : [https://guillaumebriday.fr/laravel-vuejs-faire-une-todo-list-partie-1-presentation-et-objectifs](https://guillaumebriday.fr/laravel-vuejs-faire-une-todo-list-partie-1-presentation-et-objectifs) (French).

## Contributing

Do not hesitate to contribute to the project by adapting or adding features ! Bug reports or pull requests are welcome.

## License

This project is released under the [MIT](http://opensource.org/licenses/MIT) license.
