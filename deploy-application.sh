#!/bin/bash
set -e
shopt -s nocasematch


HostToolsIp="172.16.22.103"
HostStageIp="172.16.22.102"
HostProdIp="172.16.22.101"
HostExtIp="172.16.23.104"

HostToolsNetPart="103"
HostStageNetPart="102"
HostProdNetPart="101"
HostExtNetPart="104"


## --------------- FUNCTION DECLARATIONS ---------------------

# Validates command dependency and echo installation instructions
function checkDependency {
    command=$1
    help=$2

    if [ "$(command -v ${command})" = "" ]; then
      echo "ERROR Missing ${command} Dependency";
      echo "Please install ${command} command: ${help}"
      exit 1;
    fi

}

## --------------- VALIDATE DEPENDENCIES ---------------------


# Check script dependencies and help users find installations
checkDependency "jq" "https://stedolan.github.io/jq/"
checkDependency "yarn" "https://yarnpkg.com"
checkDependency "composer" "https://getcomposer.org"
checkDependency "sshpass" "https://gist.github.com/arunoda/7790979"


## --------------- LOAD AND EXPORT MANIFEST VARIABLES ---------------------

printf "\nLOADING MANIFEST >>>\n"

    # Read manifest json and export to local environment variables
    if [ -f "manifest.json" ]; then
        manifest=$(cat manifest.json)

        for s in $(echo $manifest | jq -r 'to_entries|map("\(.key)=\(.value|tostring)")|.[]' ); do
            echo "     - loaded : ${s}"
            export ${s}
        done
    else
       echo "ERROR: No app manifest found"
       exit 1
    fi
    export LGS_DOCKER_IMAGE="${LGS_DOCKER_REGISTRY}:${LGS_APP_VER}"
    export LGS_LOGGER_IMAGE="${LGS_DOCKER_REGISTRY_LOGGER}:${LGS_LOGGER_VER}"

printf "\n<<< LOADING DONE\n"


## --------------- MAIN PROGRAM START ---------------------

printf "\nSTART DEPLOYMENT >>>\n"
   
    # Host server IP Configuration
    LGS_HOST_ENVIRONMENT=$1
    LGS_HOST_ENVIRONMENT_DOMAIN=""

    if [[ $LGS_HOST_ENVIRONMENT =~ ^stage|prod|tools|ext$ ]]; then

        LGS_HOST_ENVIRONMENT_DOMAIN=".${LGS_HOST_ENVIRONMENT}"

        if [[ $LGS_HOST_ENVIRONMENT = "stage" ]]; then
            LGS_HOST_IP=${HostStageIp}
            LGS_HOST_SUBNET_PART=${HostStageNetPart}
        fi

        if [[ $LGS_HOST_ENVIRONMENT = "tools" ]]; then
            LGS_HOST_IP=${HostToolsIp}
            LGS_HOST_SUBNET_PART=${HostToolsNetPart}
        fi

        if [[ $LGS_HOST_ENVIRONMENT =~ ^prod|ext$ ]]; then

            if [[ $LGS_HOST_ENVIRONMENT = "prod" ]]; then
                LGS_HOST_IP=${HostProdIp}
                LGS_HOST_SUBNET_PART=${HostProdNetPart}
            else
                LGS_HOST_IP=${HostExtIp}
                LGS_HOST_SUBNET_PART=${HostExtNetPart}
            fi

            printf "\n\n****  WARNING: Deploying on Production Server: ${LGS_HOST_IP}! ****"
            printf "\nContinue? (y/n) "
            read -n 1 dodeploy

            if [[ $dodeploy != "y" ]]; then
               pritnf "\nAborting Deployment."
               exit 0
            fi
            printf "\n"

            LGS_HOST_ENVIRONMENT_DOMAIN=""

        fi
    else
        printf "Invalid server specified: ${server}"
        exit 1
    fi


    LGS_HOST_SUBNET="172.${LGS_HOST_SUBNET_PART}.${LGS_APP_SUBNET_ID}.0"

    echo "Deploying ${LGS_APP_NAME} version ${LGS_APP_VER} on ${LGS_HOST_IP}"

    printf "\nGATHERING INFORMATION >>>\n"
        GitLab_user=$2
        if [ "${GitLab_user}" = "" ]; then
           echo "ERROR No GitLab user specified."
           exit 1
        fi
    
        echo "Enter GitLab password for ${GitLab_user} :"
        read -s GitLab_password
    
    
        echo "Enter password for lgdeployer@${LGS_HOST_IP} :"
        read -s host_password
    printf "<<< GATHERING INFORMATION\n"


    printf "\nCOMPILING ASSETS >>>\n"
        #sleep 1
        if [ -f composer.json ]; then
            echo "composer.json file detected... performing composer install:"
            composer install
        fi

        if [ -f package.json ]; then
            echo "package.json file detected... performing yarn run ${LGS_YARN_RUN_TASK}"
            yarn run ${LGS_YARN_RUN_TASK}
        fi
    printf "<<< DONE COMPILING ASSETS\n"


    printf "\nBUILDING IMAGE >>>\n"
        sleep 1
        docker login registry.gitlab.com -u ${GitLab_user} -p ${GitLab_password} && \
        docker build -t ${LGS_DOCKER_IMAGE} --pull .
    printf "<<< BUILD DONE\n"


    printf "\nPUSHING IMAGE TO GITLAB >>>\n"
        sleep 1
        docker push ${LGS_DOCKER_IMAGE}
    printf "<<< PUSH DONE\n"

    echo "BUILD FILEBEAT >>>"
    sleep 1
    if [ -f DockerfileFilebeat ]; then
        docker build -t ${LGS_LOGGER_IMAGE} -f DockerfileFilebeat .
        docker push ${LGS_LOGGER_IMAGE}
    else
       echo "No DockerfileFilebeat found, No Filebeat image to build."
    fi
    echo "<<< BUILD FILEBEAT DONE"

    printf "\nCONFIGURING REMOTE HOST >>>\n"
        #Create Application Directory on Host
        sshpass -p ${host_password} ssh lgdeployer@${LGS_HOST_IP} -t "mkdir -p ${LGS_HOST_BASE_DIR}/${LGS_HOST_APP_DIR}"

        #Autodetect presence of Vhost on host.  Create new if it doesn't exist
        sshpass -p ${host_password} ssh lgdeployer@${LGS_HOST_IP} -t "

            if [ ! -f '/etc/apache2/sites-available/${LGS_APP_SUBDOMAIN}${LGS_HOST_ENVIRONMENT_DOMAIN}.${LGS_APP_DOMAIN}.conf' ]; then
                echo 'No vhost file found... starting to creating a new vhost:'
                echo ${host_password} | sudo -S touch /etc/apache2/sites-available/${LGS_APP_SUBDOMAIN}${LGS_HOST_ENVIRONMENT_DOMAIN}.${LGS_APP_DOMAIN}.conf
                echo ${host_password} | sudo -S chown lgdeployer:lgdeployer /etc/apache2/sites-available/${LGS_APP_SUBDOMAIN}${LGS_HOST_ENVIRONMENT_DOMAIN}.${LGS_APP_DOMAIN}.conf
                echo $'
<VirtualHost *:80>\n\
    ProxyPreserveHost On \n\
    ServerName ${LGS_APP_SUBDOMAIN}${LGS_HOST_ENVIRONMENT_DOMAIN}.${LGS_APP_DOMAIN} \n\
    <Proxy *> \n\
        Allow from localhost \n\
    </Proxy> \n\
    <Location /> \n\
        ProxyPass http://localhost:${LGS_HTTP_PORT_APPLICATION}/ \n\
    </Location> \n\
</VirtualHost>' > /etc/apache2/sites-available/${LGS_APP_SUBDOMAIN}${LGS_HOST_ENVIRONMENT_DOMAIN}.${LGS_APP_DOMAIN}.conf;

               echo ${host_password} | sudo -S chown root:root /etc/apache2/sites-available/${LGS_APP_SUBDOMAIN}${LGS_HOST_ENVIRONMENT_DOMAIN}.${LGS_APP_DOMAIN}.conf
               echo ${host_password} | sudo -S chmod 644 /etc/apache2/sites-available/${LGS_APP_SUBDOMAIN}${LGS_HOST_ENVIRONMENT_DOMAIN}.${LGS_APP_DOMAIN}.conf
               echo ${host_password} | sudo -S a2ensite ${LGS_APP_SUBDOMAIN}${LGS_HOST_ENVIRONMENT_DOMAIN}.${LGS_APP_DOMAIN}.conf
               echo ${host_password} | sudo -S service apache2 reload
            fi
        "
    printf "<<< DONE CONFIGURING REMOTE HOST\n"

    printf "\nCOPY DOCKER-COMPOSE TO SERVER >>>\n"
        sleep 1
        sshpass -p ${host_password} scp docker-compose.yml lgdeployer@${LGS_HOST_IP}:/${LGS_HOST_BASE_DIR}/${LGS_HOST_APP_DIR}/docker-compose.yml
        sshpass -p ${host_password} ssh lgdeployer@${LGS_HOST_IP} -t "export LGS_HOST_BASE_DIR=${LGS_HOST_BASE_DIR} &&
                                                                      export LGS_HOST_APP_DIR=${LGS_HOST_APP_DIR} &&
                                                                      ls -la ${LGS_HOST_BASE_DIR}/${LGS_HOST_APP_DIR}/docker-compose.yml"
    printf "<<< COPY DONE\n"


    printf "\nDEPLOY APPLICATION ON SERVER - SITE WILL BE PUT INTO MAINTENANCE >>>\n"
        sleep 1
        sshpass -p ${host_password} ssh lgdeployer@${LGS_HOST_IP} -t  "echo 'EXPORT ENV VARS ON HOST [ADD AS REQUIRED BY docker-compose.yml] >>>'
                                                                       export LGS_HOST_APP_DIR=${LGS_HOST_APP_DIR}
                                                                       export LGS_DOCKER_IMAGE=${LGS_DOCKER_IMAGE}
                                                                       export LGS_LOGGER_IMAGE=${LGS_LOGGER_IMAGE}
                                                                       export LGS_CONTAINER_NAME=${LGS_CONTAINER_NAME}
                                                                       export LGS_HOST_SUBNET=${LGS_HOST_SUBNET}
                                                                       export LGS_ENV=${LGS_HOST_ENVIRONMENT}
                                                                       echo '<<<DONE ENV VAR EXPORT'
                                                                       echo 'PULL DOCKER IMAGE FROM GITLAB [ADD AS REQUIRED FOR SERVICES IN docker-compose.yml] >>>'
                                                                       docker login registry.gitlab.com -u ${GitLab_user} -p ${GitLab_password}
                                                                       docker pull ${LGS_DOCKER_IMAGE}
                                                                       docker pull ${LGS_LOGGER_IMAGE}
                                                                       printf '<<< DONE PULL\n'

                                                                       if [ ! -f /etc/apache2/sites-available/${LGS_APP_SUBDOMAIN}${LGS_HOST_ENVIRONMENT_DOMAIN}.${LGS_APP_DOMAIN}.conf.bak ]; then
                                                                            echo ${host_password} | sudo -S sed -i.bak s/localhost:${LGS_HTTP_PORT_MAINTENANCE}/localhost:${LGS_HTTP_PORT_APPLICATION}/g /etc/apache2/sites-available/${LGS_HOST_ENVIRONMENT}1.${LGS_APP_DOMAIN}.conf
                                                                            echo ${host_password} | sudo -S sed -i.bak s/localhost:${LGS_HTTP_PORT_APPLICATION}/localhost:${LGS_HTTP_PORT_MAINTENANCE}/g /etc/apache2/sites-available/${LGS_APP_SUBDOMAIN}${LGS_HOST_ENVIRONMENT_DOMAIN}.${LGS_APP_DOMAIN}.conf
                                                                            echo ${host_password} | sudo -S service apache2 reload
                                                                       else
                                                                            echo 'Site already appears to be in maintenance, no vhost change required'
                                                                       fi

                                                                       cd ${LGS_HOST_BASE_DIR}/${LGS_HOST_APP_DIR}
                                                                       docker-compose up -d --force-recreate
                                                                       printf '\nWAITING FOR CONTAINER TO START >>>\n'
                                                                       sleep 3
                                                                       docker ps | grep ${LGS_CONTAINER_NAME}_app_1
                                                                       printf '\n<<< DONE WAIT'
                                                                       printf '\n\nVERIFY CONTAINER SYSLOG >>>'
                                                                       sleep 1
                                                                       docker exec -it ${LGS_CONTAINER_NAME}_app_1 tail /var/log/syslog
                                                                       docker exec -it ${LGS_CONTAINER_NAME}_app_1 tail /var/log/syslog | grep ERROR
                                                                       printf '<<< VERIFY DONE\n'
                                                                       sleep 1"


    printf "\nVERIFICATION AND MAINTENANCE REMOVAL >>>\n"

        printf "\nSite is now deployed and ready for test on http://${LGS_HOST_ENVIRONMENT}1.${LGS_APP_DOMAIN} "
        printf "\nEnter (y) to publish the site live, (n) to exit and keep site in maintenance:"
        read -n 1 publishsite

        if [ ${publishsite} = 'y' ]; then
            sshpass -p ${host_password} ssh lgdeployer@${LGS_HOST_IP} -t "
                echo ${host_password} | sudo -S rm -f /etc/apache2/sites-available/${LGS_APP_SUBDOMAIN}${LGS_HOST_ENVIRONMENT_DOMAIN}.${LGS_APP_DOMAIN}.conf
                echo ${host_password} | sudo -S rm -f /etc/apache2/sites-available/${LGS_HOST_ENVIRONMENT}.${LGS_APP_DOMAIN}1.conf
                echo ${host_password} | sudo -S mv /etc/apache2/sites-available/${LGS_APP_SUBDOMAIN}${LGS_HOST_ENVIRONMENT_DOMAIN}.${LGS_APP_DOMAIN}.conf.bak /etc/apache2/sites-available/${LGS_APP_SUBDOMAIN}${LGS_HOST_ENVIRONMENT_DOMAIN}.${LGS_APP_DOMAIN}.conf
                echo ${host_password} | sudo -S mv /etc/apache2/sites-available/${LGS_HOST_ENVIRONMENT}1.${LGS_APP_DOMAIN}.conf.bak /etc/apache2/sites-available/${LGS_HOST_ENVIRONMENT}1.${LGS_APP_DOMAIN}.conf
                echo ${host_password} | sudo -S service apache2 reload
            "
            printf "\nSITE HAS BEEN PUBLISHED\n"
            printf "\n<<< DONE VERIFICATION AND MAINTENANCE REMOVAL\n"

        else
            printf "\n\n******* IMPORTANT *******\n\nSITE PUBLISH CANCELLED...SITE MAINTENANCE MODE REMAINS ACTIVE.\nCorrect any issues and run this script again.\n"
        fi

    printf "\n<<< DEPLOY DONE\n"
echo "---------------------------------------------------------------------------------------------------------"
echo "Finished: ${LGS_APP_NAME}:${LGS_APP_VER} on ${LGS_HOST_IP}"
exit 0