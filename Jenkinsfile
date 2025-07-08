pipeline {
    agent any

    environment {
        COMPOSE_FILE = 'docker-compose.yml'
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out the code from Git...'
                git credentialsId: 'zied', url: 'https://github.com/ZIED443/activecontact.git'
            }
        }

        stage('Build') {
            steps {
                echo 'Building Docker images using docker-compose...'
                dockerCompose(buildFile: 'docker-compose.yml', upOptions: '', forceBuild: true)
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploying containers using docker-compose...'
                dockerCompose(buildFile: 'docker-compose.yml', upOptions: '-d', forceBuild: false)
            }
        }
    }

    post {
        success {
            echo 'Deployment successful'
        }
        failure {
            echo 'Deployment failed'
        }
    }
}
