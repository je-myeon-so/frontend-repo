sudo docker ps -a -q --filter "name=app" | grep -q . && docker stop app && docker rm app | true

sudo docker rmi kkolbuyw/jemyeonso-frontend:latest

sudo docker pull kkolbuyw/jemyeonso-frontend:latest

docker run -d -p 8080:8080 --name app kkolbuyw/jemyeonso-frontend:latest

docker rmi -f $(docker images -f "dangling=true" -q) || true
