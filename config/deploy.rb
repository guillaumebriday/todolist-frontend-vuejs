# config valid for current version and patch releases of Capistrano
lock "~> 3.10.1"

server '192.168.50.4',
      user: 'vagrant',
      roles: %w{app db web}

set :application, "todolist-frontend"
set :repo_url, "git@github.com:guillaumebriday/todolist-frontend-vuejs.git"
set :branch, :master
set :deploy_to, '/var/www/todolist-frontend'
set :docker_compose, "#{fetch(:deploy_to)}/docker-compose.yml"
set :env, "#{fetch(:deploy_to)}/.env"
