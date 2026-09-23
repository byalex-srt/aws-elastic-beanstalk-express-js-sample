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
                echo 'Docker registry push will be configured with Jenkins credentials.'
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
