FROM mediawiki:latest

RUN apt-get update && apt-get install -y \
    git \
    unzip \
    nano \
    && rm -rf /var/lib/apt/lists/*

RUN git clone https://github.com/StarCitizenTools/mediawiki-skins-Citizen.git /var/www/html/skins/Citizen

COPY --from=composer:latest /usr/bin/composer /usr/local/bin/composer
RUN cd /var/www/html/skins/Citizen && composer install --no-dev