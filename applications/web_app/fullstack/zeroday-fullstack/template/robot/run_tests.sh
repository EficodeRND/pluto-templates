#!/bin/sh

# In real world we'd clear the database between runs since not all our tests clean up after themselves properly

# echo Resetting database
# wget --spider -q -T 90 $RESET_DB_URL

echo "Executing tests"
pabot --processes 3 --outputdir /results/robot --xunit xunit.xml /robot/tests/

if [ $? -eq 0 ]
then
  echo "Tests successful, skipping rerun"
  exit 0
fi

for COUNT in 1 2 3
do
  echo "Some tests failed, starting $COUNT. rerun"
  
  #echo "Resetting database"
  # wget --spider -q -T 90 $RESET_DB_URL

  if [ $? -ne 0 ]
  then
    echo "Error resetting database before rerun"
    exit 1
  fi

  echo "Executing failed tests"
  pabot --processes 3 --rerunfailed /results/robot/output.xml --outputdir /results/robot --output rerun.xml --xunit xunit-rerun.xml /robot/tests/

  echo "Merging results"
  rebot --outputdir /results/robot --output output.xml --merge /results/robot/output.xml /results/robot/rerun.xml
  rebot --outputdir /results/robot --output xunit.xml --merge /results/robot/xunit.xml /results/robot/xunit-rerun.xml

  if [ $? -eq 0 ]
  then
    echo "All tests passed"
    exit 0
  fi
done
exit 1
