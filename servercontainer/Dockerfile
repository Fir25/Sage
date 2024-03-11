FROM ubuntu:20.04

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update \
    && apt-get install -y locales \
    && locale-gen fr_CA.UTF-8 \
    && apt install -y curl \
    && apt install -y unixodbc-dev \
    && apt-get install -y libmysqlclient-dev \
    && apt-get install -y pkg-config \
    && apt-get install -y libpq-dev gcc \
    && apt-get install -y python3-pip \
    && curl https://packages.microsoft.com/keys/microsoft.asc | apt-key add - \
    && curl https://packages.microsoft.com/config/ubuntu/20.04/prod.list > /etc/apt/sources.list.d/mssql-release.list \
    && apt-get update \
    && ACCEPT_EULA=Y apt-get install -y msodbcsql17 \
    && sed -i 's/SECLEVEL=2/SECLEVEL=0/g' /etc/ssl/openssl.cnf


RUN apt-get install -y tzdata \
    && ln -fs /usr/share/zoneinfo/Africa/Tunis /etc/localtime \
    && dpkg-reconfigure --frontend noninteractive tzdata

WORKDIR /servercontainer

COPY requirements.txt requirements.txt

RUN pip3 install -r requirements.txt

COPY . .
