FROM python:3.8-buster

# set working directory
WORKDIR /app

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# create database
RUN mkdir /db
RUN touch /db/scores.db

# add and install requirements
COPY ./requirements.txt .
RUN pip install -r requirements.txt

# add app to workdir
COPY . .

ENTRYPOINT [ "python", "app.py" ]
