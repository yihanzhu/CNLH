#!/bin/bash

# Azure details
LOCATION="eastus" # Replace with your location
RESOURCE_GROUP="cnlh_group" # Replace with your resource group name

# Azure Container Registry details
ACR_NAME="cnlhapp"

# Azure Kubernetes Service details
CLUSTER_NAME="cnlhAKSCluster"

# List of your Docker images
IMAGES=("cnlh-backend:latest" "cnlh-master-frontend:latest" "cnlh-slave-frontend-1:latest") # Replace with your image names and tags



# Create Azure Container Registry
az group create --name $RESOURCE_GROUP --location $LOCATION
az acr create --resource-group $RESOURCE_GROUP --name $ACR_NAME --sku Basic

# Login to Azure Container Registry
az acr login --name $ACR_NAME

# Build Docker images
docker-compose build

# Loop through images, tag and push them to ACR
for IMAGE in "${IMAGES[@]}"
do
  # Tag the image
  docker tag $IMAGE $ACR_NAME.azurecr.io/$IMAGE
  
  # Push the image to ACR
  docker push $ACR_NAME.azurecr.io/$IMAGE
done

echo "All images have been pushed to ACR."

# Create Azure Kubernetes Service
az aks create --resource-group $RESOURCE_GROUP --name $CLUSTER_NAME --node-count 2 --enable-addons monitoring --generate-ssh-keys

# Connect to Azure Kubernetes Service
az aks get-credentials --resource-group $RESOURCE_GROUP --name $CLUSTER_NAME

az aks update -n $CLUSTER_NAME -g $RESOURCE_GROUP --attach-acr $ACR_NAME

