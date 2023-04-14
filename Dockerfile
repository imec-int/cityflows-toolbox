FROM debian:stretch
RUN apt-get update -y && apt-get install -y nano wget curl gettext-base
RUN curl -sL https://deb.nodesource.com/setup_16.x | bash - && apt-get install -y nodejs

RUN wget https://github.com/mikefarah/yq/releases/download/v4.2.0/yq_linux_amd64.tar.gz -O - | tar xz && mv yq_linux_amd64 /usr/bin/yq



WORKDIR /app
ENV NODE_OPTIONS=--max-old-space-size=2048
ENV DISABLE_ESLINT_PLUGIN=true

#COPY mount/app /

CMD npm i --legacy-peer-deps && npm start
