namespace :node do
  desc 'Install npm dependencies'
  task :install do
    on roles(:app) do
      within release_path do
        execute :docker, :run, "--rm", "-v", "$(pwd):/app", "-w", "/app", :node, :npm, :install
      end
    end
  end

  desc 'Building application'
  task :build do
    on roles(:app) do
      within release_path do
        execute :docker, :run, "--rm", "-v", "$(pwd):/app", "-w", "/app", :node, :npm, :run, :production
      end
    end
  end
end
