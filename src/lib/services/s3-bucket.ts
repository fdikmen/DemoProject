import {
  DeleteObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Env } from '@env';
import { Buffer } from 'buffer';

if (typeof global.Buffer === 'undefined') {
  global.Buffer = Buffer;
}

const s3 = new S3Client({
  region: Env.REGION,
  credentials: {
    accessKeyId: Env.S3_ACCESS_KEY_ID,
    secretAccessKey: Env.S3_SECRET_ACCESS_KEY,
  },
});

interface UploadParams {
  data: string;
  email?: string;
  fileName?: string;
  contentType?: string;
}

export const uploadToS3 = async ({
  data,
  email,
  fileName,
  contentType,
}: UploadParams) => {
  try {
    const finalFileName = fileName || `${Date.now()}.jpg`;
    const finalContentType = contentType || 'image/jpeg';

    // Base64 verisini Buffer'a çevir
    let buffer;
    if (data.startsWith('data:')) {
      // Base64 data URL ise
      const base64Data = data.split(',')[1];
      buffer = Buffer.from(base64Data, 'base64');
    } else {
      // Düz string ise (JSON durumunda)
      buffer = Buffer.from(data);
    }

    const key = `images/${email}/${finalFileName}`;

    const params = {
      Bucket: Env.BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: finalContentType,
    };

    const command = new PutObjectCommand(params);
    await s3.send(command);

    console.log(`File uploaded successfully to S3: ${finalFileName}`);
    return `https://${Env.BUCKET_NAME}.s3.${Env.REGION}.amazonaws.com/${key}`;
  } catch (error) {
    console.error('Error uploading to S3:', error);
    throw error;
  }
};

// S3'ten resimleri alacak örnek fonksiyon

export const getS3Images = async (email: string) => {
  try {
    const params = {
      Bucket: Env.BUCKET_NAME,
      Prefix: `images/${email}/`,
    };

    console.log('Searching in path:', `images/${email}/`); // Debug log

    const command = new ListObjectsV2Command(params);
    const data = await s3.send(command);

    console.log('Raw S3 response:', data); // Debug log
    console.log('Contents:', data.Contents); // Debug log

    if (data.Contents) {
      const images = data.Contents.filter((item) => {
        console.log('Processing item:', item.Key); // Debug log
        return !item.Key?.endsWith('main.json');
      }).map((item, index) => {
        const imageUrl = `https://${Env.BUCKET_NAME}.s3.${Env.REGION}.amazonaws.com/${item.Key}`;
        console.log('Generated URL:', imageUrl); // Debug log
        return {
          id: index + 1,
          key: item.Key,
          image: imageUrl,
          text: item.Key?.slice(item.Key.lastIndexOf('/') + 1),
        };
      });

      console.log('Final images array:', images); // Debug log
      return images;
    } else {
      console.log('No images found in S3 bucket.');
      return [];
    }
  } catch (error) {
    console.error('Error fetching images from S3:', error);
    throw error;
  }
};

// S3'ten dosya silme fonksiyonu
export const deleteFromS3 = async (key: string) => {
  try {
    const params = {
      Bucket: Env.BUCKET_NAME, // Bucket adı
      Key: key, // Silinecek dosyanın key değeri
    };

    const command = new DeleteObjectCommand(params);
    await s3.send(command);
    console.log(`File deleted successfully from S3: ${key}`);
  } catch (error) {
    console.error('Error deleting from S3:', error);
    throw error;
  }
};

// Yeni fonksiyon: S3'ten JSON dosyasını okuma
export const getJsonFromS3 = async (email: string) => {
  try {
    const params = {
      Bucket: Env.BUCKET_NAME,
      Key: `images/${email}/main.json`,
    };

    const command = new GetObjectCommand(params);

    try {
      const response = await s3.send(command);
      const str = await response.Body?.transformToString();
      const data = str ? JSON.parse(str) : null;

      // Veri yapısının doğru olduğundan emin ol
      if (data && Array.isArray(data.images)) {
        return data;
      }

      // Eğer veri yapısı yanlışsa veya null ise yeni bir yapı oluştur
      return { images: [] };
    } catch (error: any) {
      // Eğer dosya yoksa boş bir yapı döndür
      if (error.name === 'NoSuchKey') {
        return { images: [] };
      }
      throw error;
    }
  } catch (error) {
    console.error('Error reading JSON from S3:', error);
    return { images: [] };
  }
};

export const uploadToS3MainJson = async ({
  email,
  newImageData,
}: {
  email: string;
  newImageData: {
    imageUrl: string;
    imageName: string;
    ocrText: string;
    summary: string;
    timestamp: string;
  };
}) => {
  // Mevcut JSON verisini oku
  const currentData = await getJsonFromS3(email);

  // Yeni veriyi ekle
  currentData.images.push(newImageData);

  // Güncellenmiş veriyi kaydet
  return await uploadToS3({
    data: JSON.stringify(currentData),
    email: email,
    fileName: 'main.json',
    contentType: 'application/json',
  });
};
