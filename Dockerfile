FROM registry.gitlab.com/garneau-dev/docker/apache-php-ssl:7.1

RUN echo '<VirtualHost *:443>\n\
                  ServerName localhost\n\
                  DocumentRoot /var/www/html\n\
                  CustomLog /var/log/apache2/access.log combined\n\
                  ErrorLog /var/log/apache2/error.log\n\
                  <Directory /var/www/html>\n\
                      AllowOverride All\n\
                      Require all granted\n\
                  </Directory>\n\
                  SSLEngine on\n\
                  SSLProtocol all -SSLv2\n\
                  SSLCipherSuite HIGH:MEDIUM:!aNULL:!MD5\n\
                  SSLCertificateFile /certs/star_sugoi_com.crt\n\
                  SSLCertificateKeyFile /certs/star_sugoi_com.key\n\
                  SSLCertificateChainFile /certs/gd_bundle-g2-g1.crt\n\
            </VirtualHost>' > /etc/apache2/sites-available/default-ssl.conf

ADD logrotate /etc/logrotate.d/application
ADD ./application/html /var/www/html
ADD ./application/src /var/www/src
