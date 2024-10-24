import exifread
import mysql.connector
from mysql.connector import Error

# Connect to MySQL database
try:
    connection = mysql.connector.connect(
        host='localhost',
        database='your_database',
        user='your_username',
        password='your_password'
    )

    cursor = connection.cursor()

    # Open and read the photo file
    with open('path/to/photo.jpg', 'rb') as file:
        photo_data = file.read()
        tags = exifread.process_file(file)

        # Extract latitude and longitude from EXIF data
        latitude = tags.get('GPS GPSLatitude')
        longitude = tags.get('GPS GPSLongitude')

        # Insert data into the table
        insert_query = """
        INSERT INTO geotagged_photos (filename, upload_time, latitude, longitude, photo_data) 
        VALUES (%s, NOW(), %s, %s, %s)
        """
        cursor.execute(insert_query, (os.path.basename('path/to/photo.jpg'), latitude, longitude, photo_data))

    connection.commit()
except Error as e:
    print("Error while connecting to MySQL", e)
finally:
    if connection.is_connected():
        cursor.close()
        connection.close()
