namespace :docker do
  desc 'Copying the docker-compose file'
  task :compose do
    on roles(:app) do
      within release_path do
        execute :cp, fetch(:docker_compose), 'docker-compose.yml'
      end
    end
  end

  desc 'Copying the .env file'
  task :env do
    on roles(:app) do
      within release_path do
        execute :cp, fetch(:env), '.env'
      end
    end
  end

  desc 'Starting nginx'
  task :nginx do
    on roles(:app) do
      within fetch(:deploy_to) do
        execute "docker-compose", :up, "-d"
      end
    end
  end
end
