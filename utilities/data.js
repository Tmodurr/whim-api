
export const cleanGeminiResponse = (text) => {
  if (typeof text !== 'string') {
      throw new Error('Input must be a string.');
  }

  // Regular expression to match the ```json and ``` markers
  const markersRegex = /```json|```/g;

  // Remove the markers while keeping the content between them
  const cleanedText = text.replace(markersRegex, '').trim();

  try {
      // Validate if the result is parsable JSON
      const json = JSON.parse(cleanedText);
      return json;
  } catch (error) {
      throw new Error('The resulting string is not valid JSON.');
  }
}