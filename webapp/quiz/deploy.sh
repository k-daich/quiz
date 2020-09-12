#! /bin/bash

TOMCAT_HOME="/cygdrive/c/work/tools/tomcat-9.0.37"
SRC_HOME="/cygdrive/c/work/tools/apache_front/docs/quiz/webapp/quiz"
DEPLOY_PATH="${TOMCAT_HOME}/webapps/quiz"

echo "!!! start deploy !!!"

cd ${SRC_HOME}
${TOMCAT_HOME}/bin/shutdown.sh
mvn clean package -Dmaven.test.skip=true
rm -r ${DEPLOY_PATH}
mkdir ${DEPLOY_PATH}
cp -i ${SRC_HOME}/target/quiz-0.0.1-SNAPSHOT.war ${DEPLOY_PATH}
jar -xvf ${DEPLOY_PATH}/quiz-0.0.1-SNAPSHOT.war
${TOMCAT_HOME}/bin/startup.sh

echo "!!! finish deploy !!!"

