const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

console.log("API Base URL:", API_BASE_URL);

/**
 * A helper function to handle fetch responses.
 * @param {Response} response - The response from a fetch call.
 * @returns {Promise<any>} - The JSON response.
 * @throws {Error} - Throws an error if the response is not ok.
 */
const handleResponse = async (response) => {
  console.log("Handling response:", response);

  if (!response.ok) {
    console.log("Response not OK:", response.status);

    const errorData = await response.json().catch((err) => {
      console.log("Error parsing error JSON:", err);
      return { detail: "An unknown error occurred." };
    });

    console.log("Error response data:", errorData);

    throw new Error(errorData.detail || "Request failed.");
  }

  const data = await response.json().catch((err) => {
    console.log("Error parsing success JSON:", err);
    return null;
  });

  console.log("Response OK. Parsed data:", data);

  return data;
};

/**
 * Fetches all custom color definitions.
 * @returns {Promise<Array>} - A list of color objects.
 */
export const getColors = async () => {
  console.log("Fetching all colors...");

  const response = await fetch(`${API_BASE_URL}/colors`);
  console.log("Fetch response for getColors:", response);

  return handleResponse(response);
};

/**
 * Creates a new color definition.
 * @param {string} name - The name of the color.
 * @param {string} description - A description for the color.
 * @returns {Promise<Object>} - The newly created color object.
 */
export const createColor = async (name, description) => {
  console.log("Creating color:", { name, description });

  const response = await fetch(`${API_BASE_URL}/colors`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, description }),
  });

  console.log("Fetch response for createColor:", response);

  return handleResponse(response);
};

/**
 * Deletes a color definition.
 * @param {number} colorId - The ID of the color to delete.
 * @returns {Promise<void>}
 */
export const deleteColor = async (colorId) => {
  console.log("Deleting color with ID:", colorId);

  const response = await fetch(`${API_BASE_URL}/colors/${colorId}`, {
    method: "DELETE",
  });

  console.log("Delete response:", response);

  if (response.status !== 204) {
    console.log("Unexpected delete status:", response.status);
    await handleResponse(response); // Throws error
  } else {
    console.log("Color deleted successfully");
  }
};

/**
 * Uploads a training image for a specific color.
 * @param {number} colorId - The ID of the color.
 * @param {File} imageFile - The image file to upload.
 * @returns {Promise<Object>} - The new training image object.
 */
export const uploadTrainingImage = async (colorId, imageFile) => {
  console.log("Uploading training image:", {
    colorId,
    fileName: imageFile.name,
  });

  const formData = new FormData();
  formData.append("image", imageFile);

  const response = await fetch(`${API_BASE_URL}/colors/${colorId}/images`, {
    method: "POST",
    body: formData,
  });

  console.log("Response from uploadTrainingImage:", response);

  return handleResponse(response);
};

/**
 * Triggers the training process for a color.
 * @param {number} colorId - The ID of the color to train.
 * @returns {Promise<Object>} - A message indicating the process has started.
 */
export const triggerTraining = async (colorId) => {
  console.log("Triggering training for color:", colorId);

  const response = await fetch(`${API_BASE_URL}/train/${colorId}`, {
    method: "POST",
  });

  console.log("Training trigger response:", response);

  return handleResponse(response);
};

/**
 * Triggers the training process for a color with real-time progress updates.
 * @param {number} colorId - The ID of the color to train.
 * @param {Function} onProgress - Callback function(percentage, message, status)
 * @returns {Promise<Object>} - Final training result
 */
export const triggerTrainingWithProgress = async (colorId, onProgress) => {
  console.log("Triggering training with progress for color:", colorId);

  return new Promise((resolve, reject) => {
    const eventSource = new EventSource(`${API_BASE_URL}/train/${colorId}/stream`);

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("Training progress:", data);

        if (data.status === "complete") {
          eventSource.close();
          resolve({ message: "Training complete!", colorId });
        } else if (data.status === "error") {
          eventSource.close();
          reject(new Error(data.error || "Training failed"));
        } else {
          // Call progress callback
          if (onProgress) {
            onProgress(data.percentage, data.message, data.status);
          }
        }
      } catch (err) {
        console.error("Error parsing SSE data:", err);
      }
    };

    eventSource.onerror = (error) => {
      console.error("SSE connection error:", error);
      eventSource.close();
      reject(new Error("Connection to training server lost"));
    };
  });
};

/**
 * Analyzes an image using the new trained models.
 * @param {File} imageFile - The image to analyze.
 * @returns {Promise<Object>} - The analysis result.
 */
export const analyzeImage = async (imageFile) => {
  console.log("Analyzing image:", imageFile.name);

  const formData = new FormData();
  formData.append("images", imageFile);

  const response = await fetch(`${API_BASE_URL}/analyze`, {
    method: "POST",
    body: formData,
  });

  console.log("Analyze image response:", response);

  return handleResponse(response);
};

/**
 * Analyzes 1-5 images using the new trained models.
 * @param {File[]} imageFiles - Array of 1-5 image files to analyze.
 * @returns {Promise<Object>} - The aggregated analysis result.
 */
export const analyzeImages = async (imageFiles) => {
  console.log("Analyzing images:", imageFiles.map(f => f.name));

  if (!Array.isArray(imageFiles) || imageFiles.length === 0) {
    throw new Error("Please provide at least one image file.");
  }

  if (imageFiles.length > 5) {
    throw new Error("Maximum 5 images allowed.");
  }

  const formData = new FormData();
  imageFiles.forEach((file) => formData.append("images", file));

  const response = await fetch(`${API_BASE_URL}/analyze`, {
    method: "POST",
    body: formData,
  });

  console.log("Analyze images response:", response);

  return handleResponse(response);
};

/**
 * Analyzes images using the legacy (predefined) system.
 * @param {File[]} imageFiles - An array of image files.
 * @returns {Promise<Array>} - An array of analysis results.
 */
export const analyzeImageLegacy = async (imageFiles) => {
  console.log(
    "Analyzing images (legacy):",
    imageFiles.map((f) => f.name)
  );

  const formData = new FormData();
  imageFiles.forEach((file) => formData.append("images", file));

  const response = await fetch(`${API_BASE_URL}/analyze-legacy`, {
    method: "POST",
    body: formData,
  });

  console.log("Legacy analyze response:", response);

  return handleResponse(response);
};

/**
 * A helper function to orchestrate the new training workflow.
 * 1. Creates a color.
 * 2. Uploads all images for it.
 * 3. Triggers the training process.
 * @param {string} colorName - The name for the new color.
 * @param {File[]} imageFiles - The training images.
 * @returns {Promise<void>}
 */
export const createColorAndTrain = async (colorName, imageFiles, onProgress) => {
  console.log("Starting createColorAndTrain:", { colorName, imageFiles });

  // 1. Create the color definition
  const newColor = await createColor(colorName, "Trained via wizard");
  console.log("New color created:", newColor);

  // 2. Upload all images in parallel
  console.log("Uploading training images...");
  await Promise.all(
    imageFiles.map((file) => {
      console.log("Uploading file:", file.name);
      return uploadTrainingImage(newColor.id, file);
    })
  );
  console.log("All images uploaded.");

  // 3. Trigger the training process with progress
  console.log("Triggering training for new color:", newColor.id);
  await triggerTrainingWithProgress(newColor.id, onProgress);

  console.log("Training process triggered successfully.");
};

/**
 * Fetches all training images for a specific color.
 * @param {number} colorId - The ID of the color.
 * @returns {Promise<Array>} - A list of training image objects.
 */
export const getTrainingImagesForColor = async (colorId) => {
  console.log("Fetching training images for color:", colorId);

  const response = await fetch(`${API_BASE_URL}/colors/${colorId}/images`);

  console.log("Get training images response:", response);

  return handleResponse(response);
};

/**
 * Clears all cached analysis results
 * @returns {Promise<Object>} - Success message
 */
export const clearCache = async () => {
  console.log("Clearing analysis cache...");

  const response = await fetch(`${API_BASE_URL}/clear-cache`, {
    method: "POST",
  });

  return handleResponse(response);
};

/**
 * Gets cache statistics
 * @returns {Promise<Object>} - Cache stats
 */
export const getCacheStats = async () => {
  const response = await fetch(`${API_BASE_URL}/cache/stats`);
  return handleResponse(response);
};
