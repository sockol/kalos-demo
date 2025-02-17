FROM golang:1.23.6
 
WORKDIR /api
COPY . .
RUN make build

CMD make run/live
