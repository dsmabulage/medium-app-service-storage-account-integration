# Generating User-Delegation SAS Tokens for Azure Storage Accounts with Managed Identity (App Service): A Keyless Approach to Enhanced Security

This repository demonstrates how to integrate an **Azure Storage Account** with a **Node.js application** using **Managed Identity**. The application provides APIs to generate **SAS tokens**, create **pre-signed upload URLs**, and upload files to an **Azure Blob Storage container**.

## 🚀 Features
- **Managed Identity Authentication** (No storage account keys required)
- **Generate SAS Token** (`GET /api/sas`)
- **Generate Blob Upload URL** (`GET /api/upload-url?blobName=sample.txt`)
- **Upload File to Azure Blob Storage** (`POST /api/upload`)
- **Secure & Scalable**

## 📌 Prerequisites
- Node.js (Latest LTS version recommended)
- Azure Subscription
- Azure Storage Account with a Blob Container
- App Service with Managed Identity enabled

## 🛠 Installation & Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/dsmabulage/medium-app-service-storage-account-integration
   cd azure-storage-nodejs
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your variables:
   - **STORAGE_ACCOUNT_NAME**: Your Azure Storage Account name
   - **BLOB_CONTAINER_NAME**: The name of your blob container

4. Start the server:
   ```bash
   node server.js
   ```

## 📢 API Endpoints
### **1. Generate SAS Token**
```http
GET /api/sas
```
**Response:**
```json
{
  "sasToken": "<sas_token>"
}
```

### **2. Get Upload URL**
```http
GET /api/upload-url?blobName=sample.txt
```
**Response:**
```json
{
  "blobUploadUrl": "https://<storage_account>.blob.core.windows.net/<container>/<blobName>?<sas_token>"
}
```

### **3. Upload File to Blob Storage**
```http
POST /api/upload
```
**Request Body (multipart/form-data):**
```json
{
  "url": "<upload_url>",
  "file": <file>
}
```
**Response:**
```json
{
  "message": "File uploaded successfully"
}
```

## 📖 More Details
For a step-by-step guide, visit the full article on Medium:
👉 [Azure Storage with Node.js & Managed Identity](https://medium.com/@dileepa.mabulage/generating-user-delegation-sas-tokens-for-azure-storage-accounts-with-managed-identity-app-46170c94b8e2)
