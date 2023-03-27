import cv2
import numpy as np
from PIL import Image


def split_video(video_path, batch_size: int = 1):
    # Open the video file
    video = cv2.VideoCapture(video_path)

    # Get the total number of frames
    num_frames = int(video.get(cv2.CAP_PROP_FRAME_COUNT))

    # Calculate the number of batches
    num_batches = int(np.ceil(num_frames / batch_size))

    # Loop through each batch and yield frames
    for i in range(num_batches):
        # Initialize the batch
        batch = []

        # Loop through frames in the batch
        for j in range(batch_size):
            # Read the frame
            ret, frame = video.read()

            # Check if the frame was successfully read
            if ret:
                # Convert to RGB
                image_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                # Convert the NumPy array to a PIL Image
                image_pil = Image.fromarray(image_rgb)
                # Add the frame to the batch
                batch.append(image_pil)
            else:
                break

        # Yield the batch
        if batch_size == 1:
            yield batch[0]
        else:
            yield batch

    # Release the video object
    video.release()
