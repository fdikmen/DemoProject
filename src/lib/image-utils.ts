export const convertImageToBase64 = async (
  imageUri: string
): Promise<string> => {
  const response = await fetch(imageUri);
  const blob = await response.blob();
  const reader = new FileReader();
  return new Promise((resolve) => {
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(blob);
  });
};
