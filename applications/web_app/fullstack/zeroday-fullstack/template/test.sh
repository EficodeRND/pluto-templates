# Runs tests. 

docker-compose --verbose --log-level debug --project-directory . -f compose/db-test.yml -f compose/test.yml run mocha
# Integration test
docker-compose --project-directory . -f compose/robot.yml -f compose/db-test.yml run robot