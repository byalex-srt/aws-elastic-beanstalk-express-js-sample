pipeline {
    agent any

    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timestamps()
    }

    stages {
        stage('Install Dependencies') {
            agent {
                docker {
                    image 'node:16-slim'
                    reuseNode true
                }
            }
            steps {
                sh 'npm ci'
            }
        }

        stage('Unit Tests') {
            agent {
                docker {
                    image 'node:16-slim'
                    reuseNode true
                }
            }
            steps {
                sh 'npm test'
            }
        }

        stage('Security Scan') {
            agent {
                docker {
                    image 'node:16-slim'
                    reuseNode true
                }
            }
            steps {
                sh 'npm audit --audit-level=high'
            }
        }

        stage('Docker Build') {
            steps {
                sh 'docker build -t aws-express-app:${BUILD_NUMBER} .'
            }
        }

        stage('Docker Push') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-credentials',
                    usernameVariable: 'DOCKERHUB_USERNAME',
                    passwordVariable: 'DOCKERHUB_TOKEN'
                )]) {
                    sh '''
                        echo "$DOCKERHUB_TOKEN" | docker login -u "$DOCKERHUB_USERNAME" --password-stdin
                        docker tag aws-express-app:${BUILD_NUMBER} $DOCKERHUB_USERNAME/aws-express-app:${BUILD_NUMBER}
                        docker tag aws-express-app:${BUILD_NUMBER} $DOCKERHUB_USERNAME/aws-express-app:latest
                        docker push $DOCKERHUB_USERNAME/aws-express-app:${BUILD_NUMBER}
                        docker push $DOCKERHUB_USERNAME/aws-express-app:latest
                        docker logout
                    '''
                }
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'package*.json', fingerprint: true
        }

        success {
            echo 'Pipeline completed successfully.'
        }

        failure {
            echo 'Pipeline failed. Check the stage logs.'
        }
    }
}
