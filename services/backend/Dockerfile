FROM python:3.8-buster

# set working directory
WORKDIR /app

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# install system dependencies
RUN apt-get update \
    && apt-get -y install sqlite3 libsqlite3-dev \
    && apt-get clean

# create database
RUN mkdir /db
RUN touch /db/scores.db

# add and install requirements
COPY ./requirements.txt .
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# add app
COPY . .

ENTRYPOINT [ "python" ]
CMD [ "app.py" ]
