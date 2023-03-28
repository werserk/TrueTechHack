import cv2
import numpy as np


def detect_epilepsy(image):
    gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    brightness = np.mean(gray_image)
    threshold = 90
    return brightness > threshold


def detect_flashing(image):
    gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    diff_frames = cv2.absdiff(gray_image[1:], gray_image[:-1])
    std_dev = np.std(diff_frames)
    threshold = 15
    return std_dev > threshold


def is_bright(image):
    gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    brightness = np.mean(gray_image)
    threshold = 200
    return brightness > threshold


def detect_fast_movement(image1, image2):
    gray_image1 = cv2.cvtColor(image1, cv2.COLOR_BGR2GRAY)
    gray_image2 = cv2.cvtColor(image2, cv2.COLOR_BGR2GRAY)
    diff_image = cv2.absdiff(gray_image1, gray_image2)
    brightness = np.mean(diff_image)
    threshold = 30
    return brightness > threshold
