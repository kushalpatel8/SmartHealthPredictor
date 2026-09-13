import cv2
import numpy as np

def resize_image(image, size=(224, 224)):
    if image is None:
        return None
    return cv2.resize(image, size, interpolation=cv2.INTER_AREA)

def normalize_image(image):
    if image is None:
        return None
    return image.astype(np.float32) / 255.0

