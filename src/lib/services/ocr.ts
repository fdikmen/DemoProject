import { Env } from '@env';
import axios from 'axios';

import { convertImageToBase64 } from '../image-utils';

export const performOCR = async (imageUri: string) => {
  const base64Image = await convertImageToBase64(imageUri);

  const requestBody = {
    requests: [
      {
        image: { content: base64Image },
        features: [{ type: 'TEXT_DETECTION' }],
      },
    ],
  };

  const response = await axios.post(
    `${Env.GOOGLE_VISION_API_URL}?key=${Env.GOOGLE_VISION_API_KEY}`,
    requestBody
  );
  return response.data.responses[0]?.fullTextAnnotation?.text || '';
};
