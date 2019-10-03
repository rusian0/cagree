FROM docker:stable-dind

# install command.
RUN apk update
RUN \
	apk -Uuv add make gcc groff less \
		musl-dev libffi-dev openssl-dev \
		python2-dev py-pip curl && \
	rm /var/cache/apk/*

# install aws-cli
ARG awscli_version="1.16.168"
RUN pip install awscli==${awscli_version}

# install sam
RUN pip install --upgrade aws-sam-cli

# set workspace
RUN mkdir /root/api

WORKDIR /root/api