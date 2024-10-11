FROM ubuntu:latest

# Set the working directory
WORKDIR /app

# Install Python
RUN apt-get update
RUN apt-get install -y python3 python3-pip
RUN apt-get install -y python3-venv

# Copy the current directory contents into the container at /app
COPY . .

# Create Virtual Environment
RUN python3 -m venv env

#Set the environment variable to use the virtual environment
ENV PATH="/app/env/bin:$PATH"

# Install Dependencies
RUN pip3 install -r requirements.txt
RUN playwright install-deps
RUN playwright install


# Expose PORT 5000
EXPOSE 5000

# Run the application
CMD ["python3", "app.py"]