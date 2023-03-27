# Создание дизайна для встраиваемого видеоплеера

## > Scope refinement (границы проекта)

1. Аккаунт пользователя с выбором настроек по умолчанию
2. Видеоплеер с нестандартным функционалом
3. Библиотека для хранения загруженных видео

Библиотека - пример взаимодейтсвия с видео, не участвует в дизайне

## > Функциональные требования
### Интерфейс:
1. Разработка системы управления профилем (выбор настроек)
2. Возможность загрузки и сохранения видео

### Плеер:
1. Реализация фильтров для дальтоников
2. Разработка фильтров при эпилепсии
- [x] 3. Создание детского фильтра для исключения нежелательного контента
4. Возможность повышения разрешения видео с использованием нейросетей
- [x] 5. Возможность колоризации изображения (из ЧБ в цветное)
6. Реализация сохранения настроек плеера
7. Внедрение Deep Downscaler для более быстрой загрузки видео
8. Опросник и тестовые изображения для него

## > Нефункциональные требования
1. Высокая доступность на разных системах
2. Простой и интуитивно понятный интерфейс
3. Минимальные задержки при использовании фильтров

## > Оценка нагрузки
*Что мы точно не можем рассчитать, но нужно учитывать*:
1. Сетевая нагрузка (в том числе плеера)
2. Хранилище (необходимо предварительно обработать видео)
3. Трафик (в день/секунду)
4. Количество одновременно подключенных пользователей

## > Затраты
Данные о затратах не известны, однако можно ориентироваться на цены MTS Cloud или Yandex Cloud.

## > Высокоуровневый дизайн
![image](https://user-images.githubusercontent.com/52196169/227632550-16419677-6dd8-4c93-8340-3869d99edf8e.png)

## TODO:
1. Дизайн самого плеера и функционала
2. Бизнес логика


```python3
import cv2
import numpy as np


def detect_epilepsy(image):
    # Convert the image to grayscale
    gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    
    # Calculate the average brightness of the image
    brightness = np.mean(gray_image)
    
    # If the brightness is higher than a threshold, the image may trigger seizures
    threshold = 127
    return brightness > threshold


def detect_flashing(image):
    # Convert the image to grayscale
    gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    
    # Calculate the difference between each frame and the next one
    diff_frames = cv2.absdiff(gray_image[1:], gray_image[:-1])
    
    # Calculate the standard deviation of the differences
    std_dev = np.std(diff_frames)
    
    # If the standard deviation is higher than a threshold, the image contains flashing effects
    threshold = 15
    return std_dev > threshold


def is_bright(image):
    # Convert the image to grayscale
    gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    
    # Calculate the average brightness of the image
    brightness = np.mean(gray_image)
    
    # If the brightness is higher than a threshold, the image is considered bright
    threshold = 200
    return brightness > threshold


def soften_with_softbox(image, softbox_size=50):
    # Apply a Gaussian blur with a softbox to the image to soften the lighting
    return cv2.GaussianBlur(image, (softbox_size, softbox_size), 0)


def detect_fast_movement(image1, image2):
    # Convert both images to grayscale
    gray_image1 = cv2.cvtColor(image1, cv2.COLOR_BGR2GRAY)
    gray_image2 = cv2.cvtColor(image2, cv2.COLOR_BGR2GRAY)
    
    # Calculate the absolute difference between the two images
    diff_image = cv2.absdiff(gray_image1, gray_image2)
    
    # Calculate the average brightness of the difference image
    brightness = np.mean(diff_image)
    
    # If the brightness is higher than a threshold, the images contain fast movement
    threshold = 50
    return brightness > threshold


def detect_image_issues(image):
    # Проверяем является ли изображение ярким
    is_bright_image = is_bright(image)

    # Проверяем на наличие мерцания на изображении
    flashing_detected = detect_flashing(image)

    # Проверяем на наличие быстрого перемещения на изображении
    fast_movement_detected = detect_fast_movement(image)

    # Проверяем на наличие эпилептических эффектов на изображении
    epilepsy_detected = detect_epilepsy(image)

    # Применяем смягчение софтбоксом к изображению
    softened_image = soften_with_softbox(image)

    # Возвращаем результаты всех проверок в виде словаря
    return {
        "is_bright": is_bright_image,
        "flashing_detected": flashing_detected,
        "fast_movement_detected": fast_movement_detected,
        "epilepsy_detected": epilepsy_detected,
        "softened_image": softened_image
    }
```
