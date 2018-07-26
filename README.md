# Sugoi Custom Proofs

## Deployment Actions
The following steps are performed by the `deploy-application.sh` script:
1. Dependency check for required executables: jq, sshpass, composer, yarn.  
   Displays URL reference to missing dependencies.
1. Loads the manifest.json file as environment variables to be consumed by the script.
1. Gathers information as to which server the deployment will use as a host [stage|prod]
1. Gathers GitLab user password
1. Gathers server host deployment user password
1. Autodetect `package.json` file and execution of Yarn task
1. Autodetect `composer.json` file and execution of composer install
1. Docker login, build and push image to configured registry with configured version tag
1. Remote host configuration:
    1. Creates application directory
    1. Detects if vhost is present, creates a new one if not
    1. Enables the site and reloads apache2 service
1. Deploys application on remote host:    
    1. Copies `docker-compose.yml` to application directory
    1. Exports environment variables required by `docker-compose.yml`
    1. Docker logina and pull required images@versions
    1. Autodetects if site vhost is in maintenance and activates maintenance on site if not already done. Publishes site to http://[stage|prod]1.louisgarneau.com for testing.
    1. Executes `docker-compose up -d` from within the application directory
    1. Waits for container to start and outputs validation from syslog (will show errors if something didin't load properly)
1. Displays link for testing and waits for user to confirm that site is ok.
1. Once confirmation is given, site is taken out of maintenance mode and published live.