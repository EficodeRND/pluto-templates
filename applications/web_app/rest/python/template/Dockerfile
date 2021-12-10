FROM python:3.9

ENV VIRTUAL_ENV=/opt/venv
RUN python3 -m venv $VIRTUAL_ENV
ENV PATH="$VIRTUAL_ENV/bin:$PATH"

# Install dependencies:
COPY requirements.txt .
RUN pip install --upgrade pip
RUN pip install  --no-cache-dir -r requirements.txt

# Run the application:
COPY . .
CMD ["invoke", "-c", "prod_tasks", "prodserver"]
