export const deleteImage = async (publicId: string): Promise<void> => {
  if (!publicId) {
    return;
  }

  const body = new URLSearchParams({ publicid: publicId }).toString();

  const response = await fetch('/deleteImage', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body
  });

  if (!response.ok) {
    const message = await response.text().catch(() => 'Image deletion failed');
    throw new Error(message);
  }
};
