# Image Object Detection API

## Install
1. Install `yarn` and `nodejs`.
2. Build the project with `yarn install`.
3. Run the project with `yarn dev` - this will start a local dev server.

## Endpoints
* **GET** `http://localhost:3000/images`
  - Query Parameters:
    - `objects` (optional): A comma-separated list of objects to search for in the images.

  - **Example Response:**
    ```json
    [
        {
            "_id": "658f4b5edb89d2d58565ffff",
            "imgData": "https://t4.ftcdn.net/jpg/00/97/58/97/360_F_97589769_t45CqXyzjz0KXwoBZT9PRaWGHRk5hQqQ.jpg",
            "label": "cat",
            "objects": [
                "kitty",
                "cat",
                "feline",
                "domestic",
                "animal",
                "pet"
            ],
            "__v": 0
        }
    ]
    ```

* **GET** `http://localhost:3000/images/:id`
  - Parameters:
    - `id` (MongoDB ObjectID): The unique identifier of the image you want to fetch.

  - **Example Response:**
    ```json
    {
        "_id": "658f4b5edb89d2d58565ffff",
        "imgData": "https://t4.ftcdn.net/jpg/00/97/58/97/360_F_97589769_t45CqXyzjz0KXwoBZT9PRaWGHRk5hQqQ.jpg",
        "label": "cat",
        "objects": [
            "kitty",
            "cat",
            "feline",
            "domestic",
            "animal",
            "pet"
        ],
        "__v": 0
    }
    ```
* **POST** `http://localhost:3000/images`
  - **Request Body:**
    ```json
    {
        "imgUrl": "{{imageUrl}}",
        "label": "fox",
        "enableObjectDetection": true,
        "dryRun": true
    }
    ```

  - **Example Response:**
    ```json
    {
        "imgUrl": "https://maymont.org/wp-content/uploads/2020/04/banner-red-fox.jpg",
        "label": "fox",
        "objects": [
            "red fox",
            "fox",
            "canine"
        ]
    }
    ```

  - **Fields:**
    - `imgUrl`: Can be a remote image URL or local path to an image.
    - `label`: The label or description for the image.
    - `enableObjectDetection`: Set to true to use Imagga for object detection.
    - `dryRun`: Set to true for a dry run.

##### Postman collection available in the resources folder.


## Technologies Used
* NodeJS
* ExpressJS
* MongoDB
* Mongoose
* Imagga API
* TypeScript

## Author

**Marcus Lorenzana**
