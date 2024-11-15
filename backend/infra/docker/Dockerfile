FROM python:3.10-slim

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /code

COPY requirements/ /code/requirements/

RUN pip install --upgrade pip && pip install -r requirements/${DJANGO_ENV}.txt

COPY manage.py /code/
COPY . /code/

EXPOSE 8000

CMD ["gunicorn", "--bind", "0.0.0.0:8000", "src.core.wsgi:application"]
