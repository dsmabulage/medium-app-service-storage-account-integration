const { DefaultAzureCredential } = require('@azure/identity');
const {
  BlobServiceClient,
  ContainerSASPermissions,
  generateBlobSASQueryParameters,
  SASProtocol,
  BlockBlobClient,
} = require('@azure/storage-blob');
const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');

const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

const STORAGE_ACCOUNT_NAME = 'mediuamtestst';
const BLOB_CONTAINER_NAME = 'test';

async function createContainerSas() {
  const TEN_MINUTES = 10 * 60 * 1000;
  const NOW = new Date();

  const TEN_MINUTES_BEFORE_NOW = new Date(NOW.valueOf() - TEN_MINUTES);
  const TEN_MINUTES_AFTER_NOW = new Date(NOW.valueOf() + TEN_MINUTES);

  const blobServiceClient = new BlobServiceClient(
    `https://${STORAGE_ACCOUNT_NAME}.blob.core.windows.net`,
    new DefaultAzureCredential()
  );

  const userDelegationKey = await blobServiceClient.getUserDelegationKey(
    TEN_MINUTES_BEFORE_NOW,
    TEN_MINUTES_AFTER_NOW
  );

  const sasToken = generateBlobSASQueryParameters(
    {
      containerName: BLOB_CONTAINER_NAME,
      permissions: ContainerSASPermissions.parse('racwd'), // Read, Add, Create, Write, Delete
      protocol: SASProtocol.HttpsAndHttp,
      startsOn: TEN_MINUTES_BEFORE_NOW,
      expiresOn: TEN_MINUTES_AFTER_NOW,
    },
    userDelegationKey,
    STORAGE_ACCOUNT_NAME
  ).toString();

  return sasToken;
}

const generateBlobUploadUrl = async (blobName) => {
  const sasToken = await createContainerSas();
  return `https://${STORAGE_ACCOUNT_NAME}.blob.core.windows.net/${BLOB_CONTAINER_NAME}/${blobName}?${sasToken}`;
};

app.get('/api/sas', async (req, res) => {
  try {
    const sasToken = await createContainerSas();
    return res.json({ sasToken });
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
});

app.get('/api/upload-url', async (req, res) => {
  try {
    const blobName = req.query.blobName;

    if (!blobName) {
      return res.status(400).send('Blob name is required');
    }

    const blobUploadUrl = await generateBlobUploadUrl(blobName);
    return res.json({ blobUploadUrl });
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
});

app.post('/api/upload', async (req, res) => {
  try {
    const { url } = req.body;

    if (!url || !req.files) {
      return res.status(400).send('Url and file are required');
    }

    const blobService = new BlockBlobClient(url);

    const { file } = req.files;

    await blobService.uploadData(file.data);

    return res.status(200).send('File uploaded successfully');
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Server is running on port 3000');
});
