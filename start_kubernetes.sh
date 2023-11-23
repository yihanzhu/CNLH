#!/bin/bash

kubectl delete all --all

kubectl apply -f kubernetes/backend-deployment.yaml
kubectl apply -f kubernetes/backend-service.yaml
kubectl apply -f kubernetes/frontend-master-deployment.yaml
kubectl apply -f kubernetes/frontend-master-service.yaml
# kubectl apply -f kubernetes/frontend-slave-1-deployment.yaml
# kubectl apply -f kubernetes/frontend-slave-1-service.yaml

kubectl get deployments
kubectl get services
kubectl get pods
